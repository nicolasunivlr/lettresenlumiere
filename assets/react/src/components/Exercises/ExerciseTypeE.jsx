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

function ExerciseTypeE(props) {
  const { content, onDone } = props;
  const [contentExercise, setContentExercise] = useState([]);
  const [isFinished, setIsFinished] = useState([{ isFinished: false }]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isLabelVisible, setIsLabelVisible] = useState(false);
  const [isAnswerValidated, setIsAnswerValidated] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const { speak } = useSpeak();
  const attempt = useRef(0);
  const currentAttempt = useRef(0);
  const timeOutRef = useRef(4000);
  const [correctAnswerGiven, setCorrectAnswerGiven] = useState(false);

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
        setIsLabelVisible(false); // Changed from true to false to reset for next question
        setIsAnswerValidated(null);
        setCorrectAnswerGiven(false); // Reset for the next question
      }
    }
  };

  useEffect(() => {
    if (
      !isLabelVisible &&
      contentExercise[currentIndex] &&
      !correctAnswerGiven
    ) {
      speak(contentExercise[currentIndex].element);
    }
  }, [isLabelVisible, contentExercise, currentIndex, correctAnswerGiven]);

  useEffect(() => {
    if (isLabelVisible) {
      // Only set a timer to hide the label if we haven't given a correct answer
      if (!correctAnswerGiven) {
        const timer = setTimeout(() => {
          setIsLabelVisible(false);
        }, timeOutRef.current);

        return () => clearTimeout(timer);
      }
    }
  }, [isLabelVisible, correctAnswerGiven]);

  const handleAnswer = () => {
    attempt.current += 1;
    // Vérification que contentExercise et l'élément courant existent
    if (!contentExercise || !contentExercise[currentIndex]) {
      console.error("Contenu de l'exercice non chargé");
      return;
    }
    setIsLabelVisible(false);

    const contenu = contentExercise[currentIndex];

    // Vérification supplémentaire que l'élément a bien une propriété 'element'
    if (!contenu || !contenu.element) {
      console.error('Élément de contenu invalide');
      return;
    }

    let isCorrect;

    // Prends en compte les majuscules si c'est type C.3, sinon non
    if (content.type === 'E.3') {
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
      setIsLabelVisible(true);
      setCorrectAnswerGiven(true); // Mark that a correct answer was given

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
        speak(contentExercise[currentIndex].element);

        setIsAnswerValidated(null);
      }, 2000);
    }
  };

  const displayLabels = (contentExercise, currentIndex) => {
    if (!contentExercise[currentIndex]) return null;
    const contenu = contentExercise[currentIndex];

    return (
      <>
        <div className='exercice__item mb-12'>
          {content.type !== 'E.1' && contenu.image_url ? (
            <LabelImage
              classe='label-sound'
              text={
                currentAttempt.current > 2 ||
                isLabelVisible ||
                correctAnswerGiven
                  ? contenu.element
                  : '?'
              }
              voiceLine={contenu.element}
              sound={true}
              format={contenu.contenuFormats ?? null}
              imageSrc={contenu.image_url}
              audioUrl={contenu.audio_url ?? null}
            />
          ) : (
            <Label
              classe='label-sound'
              text={
                currentAttempt.current > 2 ||
                isLabelVisible ||
                correctAnswerGiven
                  ? contenu.element
                  : '?'
              }
              voiceLine={contenu.element}
              sound={true}
              format={contenu.contenuFormats ?? null}
              audioUrl={contenu.audio_url ?? null}
            />
          )}
        </div>
        {contenu.syllabes && content.type === 'E.2 bis' ? (
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
        <div>Erreur dans le chargement du contenu de l'exercice...</div>
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

export default ExerciseTypeE;
