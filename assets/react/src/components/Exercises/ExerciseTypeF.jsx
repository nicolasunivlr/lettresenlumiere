import { useState, useEffect, useRef, useCallback } from 'react';
import DraggableList from '../UI/DraggableList';
import OKButton from '../UI/OKButton';
import Instruction from '../Instruction';
import ProgressBar from './ProgressBar';
import Label from '../UI/Label';
import LabelImage from '../UI/LabelImage';
import useSpeak from '../../hooks/useSpeak';
import urlSucces from '../../assets/sons/apprentissage/reward-sound.mp3';
import urlEchec from '../../assets/sons/apprentissage/error-sound.mp3';
import useConfig from '../../hooks/useConfig';

const ExerciseTypeF = (props) => {
  const { content, onDone } = props;
  const [isFinished, setIsFinished] = useState([{ isFinished: false }]);
  const [tabResponses, setTabResponses] = useState([]);
  const [currentResponse, setCurrentResponse] = useState(null);
  const [isValidated, setIsValidated] = useState(undefined);
  const [elementValidations, setElementValidations] = useState([]);
  const config = useConfig();

  const [attempt, setAttempt] = useState(0);

  const [showLabel, setShowLabel] = useState(true);

  const draggableListRef = useRef();
  const displayTimeRef = useRef(2000); // Temps d'affichage par défaut
  const { speak } = useSpeak();

  const shuffle = (array) => {
    array.sort(() => Math.random() - 0.5);
    return array;
  };

  useEffect(() => {
    if (content && content.contenus) {
      setCurrentResponse(null);
      setShowLabel(true);
      const responses1 = content.contenus.map((contenu, index) => ({
        id: `${index}_1`,
        element: contenu.element,
        image: contenu.image_url,
        done: false,
      }));

      // On utilise toujours responses1 sans duplication, peu importe le nombre d'éléments
      const finalResponses = [...responses1];
      setIsFinished(
        new Array(content.contenus.length).fill({ isFinished: false })
      );

      setTabResponses(shuffle(finalResponses));
      // Définir le temps d'affichage en fonction du type d'exercice
      if (content.type === 'F.3') {
        displayTimeRef.current = 4000; // 2x plus long pour F.3
      } else {
        displayTimeRef.current = 2000; // Temps par défaut
      }

    }
  }, [content]);

  useEffect(() => {
    const firstUndone = tabResponses.find((response) => !response.done);
    if (firstUndone !== currentResponse) {
      setCurrentResponse(firstUndone || null);
    }
  }, [tabResponses]);

  useEffect(() => {
    if (tabResponses.length > 0) {
      const firstNonDone = tabResponses.find((response) => !response.done);
      if (firstNonDone) {
        setTimeout(() => {
          setShowLabel(false);
          if( firstNonDone.sons_url ) {
            const url = `${config.audiosUrl}/${firstNonDone.sons_url}`;
            const audio = new Audio(url);
            audio.play();
          } else {
            speak(firstNonDone.element);
          }
        }, displayTimeRef.current);
      }
    }
  }, [tabResponses]);

  useEffect(() => {
    if (currentResponse) {
      setShowLabel(true);
      const timer = setTimeout(() => {
        setShowLabel(false);
      }, displayTimeRef.current);
      return () => clearTimeout(timer);
    }
  }, [currentResponse]);

  const handleFinish = (index) => {
    setIsFinished((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, isFinished: true } : item
      )
    );
  };

  const handleQuestionMarkClick = () => {
    // Réaffiche la bonne réponse pendant le même temps qu'au départ
    setShowLabel(true);

    // On remet un timer pour cacher à nouveau la réponse après le délai configuré
    setTimeout(() => {
      setShowLabel(false);
    }, displayTimeRef.current);
  };

  const checkAnswer = () => {
    const userAnswer = draggableListRef.current?.getAnswerLetters();
    const correctAnswer = currentResponse?.element;

    if (userAnswer === correctAnswer) {
      new Audio(urlSucces).play();
      setAttempt(attempt + 1);
      setShowLabel(true);

      // Get the elements list from draggableListRef
      const answerElements =
        draggableListRef.current?.getAnswerElements() || [];
      setElementValidations(new Array(answerElements.length).fill(true));
      return true;
    } else {
      // Get the draggable elements from the ref
      const answerElements =
        draggableListRef.current?.getAnswerElements() || [];
      const correctElements =
        draggableListRef.current?.getCorrectElements() || [];

      // Compare each element individually
      const validations = [];

      for (let i = 0; i < answerElements.length; i++) {
        const isCorrect =
          i < correctElements.length &&
          answerElements[i] === correctElements[i];
        validations.push(isCorrect);
      }

      setElementValidations(validations);
      setAttempt(attempt + 1);
      new Audio(urlEchec).play();
      setShowLabel(true);
      setTimeout(() => {
        setShowLabel(false);
        if( currentResponse.sons_url ) {
          const url = `${config.audiosUrl}/${currentResponse.sons_url}`;
          const audio = new Audio(url);
          audio.play();
        } else {
          speak(currentResponse.element);
        }
      }, 3000);
      return false;
    }
  };

  const handleClickOKButton = useCallback(() => {
    if (isValidated === undefined) {
      if (currentResponse) {
        const isCorrect = checkAnswer();
        setIsValidated(isCorrect);

        if (!isCorrect) {
          setTimeout(() => {
            setIsValidated(undefined);
          }, 3000);
        } else {
          handleFinish(tabResponses.findIndex((response) => !response.done));
        }
      }
    } else if (isValidated === true) {
      setTabResponses((prevResponses) => {
        const index = prevResponses.findIndex(
          (response) =>
            !response.done && response.element === currentResponse.element
        );
        const newResponses = [...prevResponses];
        if (index !== -1) {
          newResponses[index] = { ...newResponses[index], done: true };
        }
        const nextUndone = newResponses.find((response) => !response.done);
        setTimeout(() => {
          setCurrentResponse(nextUndone || null);
        }, 0);
        if (!nextUndone) {
          const totalQuestions = tabResponses.length;
          const score = Math.round((totalQuestions / attempt) * 100);
          onDone(score);
        }
        return newResponses;
      });
      setIsValidated(undefined);
    }
  }, [isValidated, currentResponse, tabResponses, attempt, onDone]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        handleClickOKButton();
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleClickOKButton]);

  return (
    <>
      <div className='exercices'>
        {content && <Instruction instruction={content.consigne} />}
        <div className='flex flex-col pt-5 items-center justify-center'>
          {currentResponse && (
            <>
              {showLabel ? (
                <div className='label-container'>
                  {currentResponse?.image ? (
                    <LabelImage
                      key={currentResponse.id}
                      text={currentResponse.element}
                      voiceLine={currentResponse?.element}
                      imageSrc={currentResponse?.image}
                      sound={true}
                      audioUrl={currentResponse.audioUrl ?? null}
                    />
                  ) : (
                    <Label
                      key={currentResponse.id}
                      text={currentResponse.element}
                      voiceLine={currentResponse?.element}
                      sound={true}
                      audioUrl={currentResponse.audioUrl ?? null}
                    />
                  )}
                </div>
              ) : (
                <div className='label-container'>
                  {currentResponse?.image ? (
                    <LabelImage
                      key={currentResponse.id}
                      text={'?'}
                      voiceLine={currentResponse?.element}
                      imageSrc={currentResponse?.image}
                      sound={true}
                      audioUrl={currentResponse.audioUrl ?? null}
                      onClick={handleQuestionMarkClick}
                    />
                  ) : (
                    <Label
                      key={currentResponse.id}
                      text={'?'}
                      voiceLine={currentResponse?.element}
                      sound={true}
                      audioUrl={currentResponse.audioUrl ?? null}
                      onClick={handleQuestionMarkClick}
                    />
                  )}
                </div>
              )}
              <div className='mt-4'>
                <DraggableList
                  key={currentResponse.id}
                  ref={draggableListRef}
                  word={currentResponse.element}
                  type={content.type}
                  isValidated={isValidated}
                  elementValidations={elementValidations}
                />
              </div>
            </>
          )}
        </div>
      </div>
      <ProgressBar content={isFinished} />
      {tabResponses.some((item) => item.done === false) && (
        <OKButton onClick={handleClickOKButton} />
      )}
    </>
  );
};

export default ExerciseTypeF;
