import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import Label from '../UI/Label';
import OKButton from '../UI/OKButton';
import ProgressBar from './ProgressBar';
import urlSucces from '../../assets/sons/apprentissage/reward-sound.mp3';
import urlEchec from '../../assets/sons/apprentissage/error-sound.mp3';
import useSpeak from '../../hooks/useSpeak';
import LabelImage from '../UI/LabelImage';

import Instruction from '../Instruction';

const ExerciseTypeB = ({ content, onDone }) => {
  const [contentExercise, setContentExercise] = useState([]);
  const [isFinished, setIsFinished] = useState([{ isFinished: false }]);
  const [tabResponses, setTabResponses] = useState([]);
  const [attempt, setAttempt] = useState(0);
  const [isLocked, setisLocked] = useState(false);
  const location = useLocation();

  const { speak } = useSpeak();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter' && !isLocked) {
        setisLocked(true);
        handleClickOKButton();
        setTimeout(() => {
          setisLocked(false);
        }, 2000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLocked, contentExercise]);

  const shuffle = (array) => {
    array.sort(() => Math.random() - 0.5);
    return array;
  };

  const generateContentExercise = useCallback(
    (currentResponse) => {
      if (!content?.contenus || !currentResponse) return [];
      const hasSoundGroups = content.contenus.some(
        (item) => item.sound_group !== undefined && item.sound_group !== null
      );

      let selectedItems = [];

      // Toujours inclure la bonne réponse
      const currentItem = content.contenus.find(
        (item) => item.element === currentResponse.element
      );

      if (currentItem) {
        selectedItems.push(currentItem);
      }

      if (hasSoundGroups) {
        const uniqueGroups = new Set();
        content.contenus.forEach((item) => {
          if (item.sound_group !== currentResponse.sound_group) {
            uniqueGroups.add(item.sound_group);
          }
        });

        // Ajoute un item de chaque sound_group
        Array.from(uniqueGroups).forEach((group) => {
          if (
            location.pathname.endsWith('/alphabet') ||
            selectedItems.length < 9
          ) {
            const itemsInGroup = content.contenus.filter(
              (item) => item.sound_group === group
            );
            if (itemsInGroup.length > 0) {
              const randomItem =
                itemsInGroup[Math.floor(Math.random() * itemsInGroup.length)];
              selectedItems.push(randomItem);
            }
          }
        });
      } else {
        // Pas de sound group, inclus la bonne réponse
        const otherItems = content.contenus.filter(
          (item) => item.element !== currentResponse.element
        );

        // Ne pas limiter pour '/alphabet', sinon limiter à 8 éléments supplémentaires
        const maxAdditionalItems = location.pathname.endsWith('/alphabet')
          ? otherItems.length
          : Math.min(8, otherItems.length);

        const randomItems = shuffle([...otherItems]).slice(
          0,
          maxAdditionalItems
        );
        selectedItems = [...selectedItems, ...randomItems];
      }

      // Ne pas mélanger pour '/alphabet', mais les présenter dans l'ordre alphabétique
      // Pour les autres routes, on mélange
      const finalItems = location.pathname.endsWith('/alphabet')
        ? selectedItems.sort((a, b) => a.element.localeCompare(b.element)) // Tri alphabétique
        : shuffle(selectedItems);

      return finalItems.map((item, index) => ({
        ...item,
        id: `${index}`,
        answer: undefined,
      }));
    },
    [content, location.pathname]
  );

  useEffect(() => {
    if (content && content.contenus) {
      const responses = content.contenus.map((contenu) => ({
        element: contenu.element,
        done: false,
        sound_group: contenu.sound_group,
      }));

      // Toujours utiliser le tableau d'origine sans duplication
      const shuffledResponses = shuffle([...responses]);

      setTabResponses(shuffledResponses);

      const firstContent = generateContentExercise(shuffledResponses[0]);
      setContentExercise(firstContent);
      setIsFinished(
        new Array(shuffledResponses.length).fill({ isFinished: false })
      );
    }
  }, [content]);

  useEffect(() => {
    if (
      tabResponses.length > 0 &&
      !isFinished.every((item) => item.isFinished)
    ) {
      const firstNonDone = tabResponses.find((response) => !response.done);
      if (firstNonDone) {
        const newContent = generateContentExercise(firstNonDone);
        setContentExercise(newContent);
        speak(firstNonDone.element);
      }
    }
  }, [tabResponses, generateContentExercise, speak, isFinished]);

  useEffect(() => {
    if (isFinished.every((item) => item.isFinished)) {
      const totalQuestions = tabResponses.length;
      const score = Math.round((totalQuestions / attempt) * 100);
      onDone(score);
    }
  }, [isFinished, attempt, tabResponses.length]);

  const handleFinish = (index) => {
    setIsFinished((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, isFinished: true } : item
      )
    );
  };

  const handleClickOKButton = () => {
    const correctAnswer = () =>
      contentExercise.find((item) => {
        if (item.answer === true) return true;
      });

    if (correctAnswer()) {
      const index = tabResponses.findIndex((response) => !response.done);
      setTabResponses((prevResponses) =>
        prevResponses.map((response, i) =>
          i === index ? { ...response, done: true } : response
        )
      );
      handleFinish(index);
      setContentExercise((prevContent) =>
        prevContent.map((item) =>
          item.answer === true ? { ...item, answer: undefined } : item
        )
      );
    }
  };

  const setAnswerLabel = useCallback((isCorrect, index) => {
    setContentExercise((prevContent) =>
      prevContent.map((item, idx) => {
        if (idx === index) {
          return { ...item, answer: isCorrect };
        }
        return item;
      })
    );
  }, []);

  const handleLabelClick = useCallback(
    (index, element) => {
      const isClicked = () =>
        contentExercise.find((item) => {
          if (item.answer !== undefined) return true;
        });

      if (isClicked()) return;

      const firstNonDone = tabResponses.find((response) => !response.done);
      const isCorrect = element === firstNonDone.element;

      if (isCorrect) {
        new Audio(urlSucces).play();
        setAnswerLabel(true, index);
        setAttempt((prev) => prev + 1);
      } else {
        new Audio(urlEchec).play();
        setAnswerLabel(false, index);
        setAttempt((prev) => prev + 1);
        setTimeout(() => {
          setAnswerLabel(undefined, index);
          speak(firstNonDone.element);
        }, 2000);
      }
    },
    [contentExercise, tabResponses, setAnswerLabel, speak, setAttempt]
  );

  const displayLabels = useMemo(() => {
    if (!contentExercise || !contentExercise.length) return null;

    return contentExercise.map((contenu, index) => (
      <Label
        key={`${contenu.element}-${index}`}
        text={contenu.element}
        onClick={() => handleLabelClick(index, contenu.element)}
        answer={contenu.answer}
        format={contenu.contenuFormats ?? null}
      />
    ));
  }, [contentExercise, handleLabelClick]);

  const getCorrectAnswerImage = (correctAnswer) => {
    const correctAnswerItem = contentExercise.find(
      (item) => item.element === correctAnswer
    );
    return correctAnswerItem?.image_url;
  };

  const getCorrectAnswerAudio = (correctAnswer) => {
    const correctAnswerItem = contentExercise.find(
      (item) => item.element === correctAnswer
    );
    return correctAnswerItem?.sons_url;
  };

  return (
    <>
      {content ? (
        <>
          <div className='exercices'>
            {contentExercise && <Instruction instruction={content.consigne} />}
            <div className='exercice__item pt-5'>
              {content.type !== 'B.1' &&
              getCorrectAnswerImage(
                tabResponses.find((response) => !response.done)?.element
              ) ? (
                <LabelImage
                  text={'?'}
                  voiceLine={
                    tabResponses &&
                    tabResponses.find((response) => !response.done)?.element
                  }
                  imageSrc={getCorrectAnswerImage(
                    tabResponses.find((response) => !response.done)?.element
                  )}
                  sound={true}
                  audioUrl={getCorrectAnswerAudio(
                    tabResponses.find((response) => !response.done)?.element
                  )}
                />
              ) : (
                <Label
                  classe='label-sound'
                  text='?'
                  audioUrl={getCorrectAnswerAudio(
                      tabResponses.find((response) => !response.done)?.element
                  )}
                  voiceLine={
                    tabResponses &&
                    tabResponses.find((response) => !response.done)?.element
                  }
                  sound={true}
                />
              )}
            </div>
            <div className='exercice__item pt-5'>{displayLabels}</div>
          </div>

          <ProgressBar content={isFinished} />
          {contentExercise.some((item) => item.answer === true) && (
            <OKButton onClick={handleClickOKButton} />
          )}
        </>
      ) : (
        <div>Erreur dans le chargement du contenu de l'exercice...</div>
      )}
    </>
  );
};

export default ExerciseTypeB;
