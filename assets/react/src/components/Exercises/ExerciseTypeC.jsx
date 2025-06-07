import { useState, useEffect, useRef } from 'react';
import Label from '../UI/Label';
import LabelImage from '../UI/LabelImage';
import InputLabel from '../UI/InputLabel';
import ProgressBar from './ProgressBar';
import Instruction from '../Instruction';
import OKButton from '../UI/OKButton';
import useSpeak from '../../hooks/useSpeak';
import urlSucces from '../../assets/sons/apprentissage/reward-sound.mp3';
import urlEchec from '../../assets/sons/apprentissage/error-sound.mp3';

function ExerciseTypeC(props) {
  const { content, onDone } = props;
  const [contentExercise, setContentExercise] = useState([]);
  const [isFinished, setIsFinished] = useState([{ isFinished: false }]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isLabelVisible, setIsLabelVisible] = useState(true);
  const [isAnswerValidated, setIsAnswerValidated] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const { speak } = useSpeak();
  const attempt = useRef(0);
  const currentAttempt = useRef(0);
  const timeOutRef = useRef(4000);

  useEffect(() => {
    if (content && content.contenus) {
      // Utiliser directement le contenu original sans duplication
      const duplicatedContents = content.contenus;

      const shuffledContents = [...duplicatedContents].sort(
        () => Math.random() - 0.5
      );
      setContentExercise(shuffledContents);
      setIsFinished(shuffledContents.map(() => ({ isFinished: false })));
    }
    if (content.type === 'C.3') {
      timeOutRef.current = 6000;
    }
  }, [content]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter' && !isLocked) {
        handleClickOKButton();
        setIsLocked(true);

        setTimeout(() => {
          setIsLocked(false);
        }, 2000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLocked, contentExercise, userInput]);

  useEffect(() => {
    if (isFinished.every((item) => item.isFinished === true)) {
      const score = Math.round((isFinished.length / attempt.current) * 100);
      onDone(score);
    }
  }, [isFinished]);

  const handleClickOKButton = () => {
    if (isAnswerValidated === null) {
      handleAnswer();
    }

    if (isAnswerValidated) {
      setIsFinished((prev) => {
        const updated = [...prev];
        updated[currentIndex] = { isFinished: true };
        return updated;
      });

      const isAllFinished = contentExercise.every(
        (_, index) => isFinished[index]?.isFinished
      );

      if (!isAllFinished) {
        setCurrentIndex((prev) => prev + 1);
        setUserInput('');
        setIsLabelVisible(true);
        setIsAnswerValidated(null);
      }
    }
  };

  useEffect(() => {
    if (!isLabelVisible && contentExercise[currentIndex]) {
      speak(contentExercise[currentIndex].element);
    }
  }, [isLabelVisible, contentExercise, currentIndex]);

  useEffect(() => {
    if (isLabelVisible) {
      const timer = setTimeout(() => {
        setIsLabelVisible(false);
      }, timeOutRef.current);

      return () => clearTimeout(timer);
    }
  }, [isLabelVisible]);

  const handleAnswer = () => {
    attempt.current += 1;
    // Vérification que contentExercise et l'élément courant existent
    if (!contentExercise || !contentExercise[currentIndex]) {
      console.error("Contenu de l'exercice non chargé");
      return;
    }

    const contenu = contentExercise[currentIndex];

    // Vérification supplémentaire que l'élément a bien une propriété 'element'
    if (!contenu || !contenu.element) {
      console.error('Élément de contenu invalide');
      return;
    }

    let isCorrect;

    // Prends en compte les majuscules si c'est type C.3, sinon non
    if (content.type === 'C.3') {
      if (userInput.trim() === contenu.element.trim()) {
        isCorrect = true;
      } else {
        isCorrect = false;
      }
    } else {
      if (
        userInput.trim().toLowerCase() === contenu.element.trim().toLowerCase()
      ) {
        isCorrect = true;
      } else {
        isCorrect = false;
      }
    }

    if (isCorrect) {
      new Audio(urlSucces).play();
      setIsAnswerValidated(true);
      currentAttempt.current = 0;

      setIsFinished((prev) => {
        const updated = [...prev];
        updated[currentIndex] = { isFinished: true };
        return updated;
      });
    } else {
      currentAttempt.current += 1;
      new Audio(urlEchec).play();
      setIsAnswerValidated(false);
      setTimeout(() => {
        setUserInput('');
        setIsLabelVisible(true);
        setIsAnswerValidated(null);
      }, 2000);
    }
  };

  const handleQuestionMarkClick = () => {
    // Réaffiche la bonne réponse pendant le même temps qu'au départ
    setIsLabelVisible(true);

    // Le timer existant dans useEffect se chargera de la cacher après le délai
  };

  const displayLabels = (contentExercise, currentIndex) => {
    if (!contentExercise[currentIndex]) return null;
    const contenu = contentExercise[currentIndex];

    return (
      <>
        {isLabelVisible &&
        !(
          (!currentAttempt.current > 1 && content.type === 'C.3') ||
          (!currentAttempt.current > 2 && content.type !== 'C.3')
        ) ? (
          <>
            {content.type !== 'C.1' && contenu?.image_url ? (
              <LabelImage
                key={currentIndex}
                text={contenu.element}
                format={contenu.contenuFormats ?? null}
                imageSrc={contenu.image_url}
              />
            ) : (
              <Label
                key={currentIndex}
                text={contenu.element}
                format={contenu.contenuFormats ?? null}
              />
            )}
          </>
        ) : (
          <>
            <div className='exercice__item mb-12'>
              {content.type !== 'C.1' && contenu.image_url ? (
                <LabelImage
                  classe='label-sound'
                  text={
                    (currentAttempt.current > 1 && content.type === 'C.3') ||
                    (currentAttempt.current > 2 && content.type !== 'C.3')
                      ? contenu.element
                      : '?'
                  }
                  voiceLine={contenu.element}
                  sound={false}
                  format={contenu.contenuFormats ?? null}
                  imageSrc={contenu.image_url}
                  audioUrl={contenu.audio_url ?? null}
                  onClick={handleQuestionMarkClick}
                />
              ) : (
                <Label
                  classe='label-sound'
                  text={
                    (currentAttempt.current > 1 && content.type === 'C.3') ||
                    (currentAttempt.current > 2 && content.type !== 'C.3')
                      ? contenu.element
                      : '?'
                  }
                  voiceLine={contenu.element}
                  sound={false}
                  format={contenu.contenuFormats ?? null}
                  audioUrl={contenu.audio_url ?? null}
                  onClick={handleQuestionMarkClick}
                />
              )}
            </div>
            {contenu.syllabes && content.type === 'C.2 bis' ? (
              <InputLabel
                correctAnswer={contenu.element}
                setUserInput={setUserInput}
                answer={isAnswerValidated}
                syllabIndexes={contenu.syllabes}
              />
            ) : (
              <InputLabel
                correctAnswer={contenu.element}
                setUserInput={setUserInput}
                answer={isAnswerValidated}
              />
            )}
          </>
        )}
      </>
    );
  };

  return (
    <>
      {content ? (
        <div className='exercices'>
          <Instruction instruction={content.consigne} />
          <div className='exercice__item pt-5'>
            {displayLabels(contentExercise, currentIndex)}
          </div>
        </div>
      ) : (
        <div>Erreur dans le chargement du contenu de l&apos;exercice...</div>
      )}

      <ProgressBar content={isFinished} />
      <div>
        {!isFinished.every((item) => item.isFinished) && (
          <OKButton onClick={handleClickOKButton} />
        )}
      </div>
    </>
  );
}

export default ExerciseTypeC;
