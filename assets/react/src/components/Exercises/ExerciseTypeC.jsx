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
import useConfig from '../../hooks/useConfig';

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
  const inputRef = useRef(null);
  const config = useConfig();

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
  }, [isLocked, contentExercise, userInput, currentIndex, isAnswerValidated, isFinished]);

  useEffect(() => {
    if (isFinished.length > 0 && contentExercise.length > 0 && isFinished.length === contentExercise.length && isFinished.every((item) => item.isFinished === true)) {
      const score = Math.round((isFinished.length / attempt.current) * 100);
      onDone(score);
    }
  }, [isFinished, onDone, contentExercise.length]);

  const handleClickOKButton = () => {
    if (isAnswerValidated === null) {
      handleAnswer();
    } else if (isAnswerValidated === true) {
      const nextIndex = currentIndex + 1;
      if (nextIndex < contentExercise.length) {
        setCurrentIndex(nextIndex);
        setUserInput('');
        setIsLabelVisible(true);
        setIsAnswerValidated(null);
        currentAttempt.current = 0;
      }
    }
  };

  useEffect(() => {
    if (!isLabelVisible && contentExercise[currentIndex]) {
      if( contentExercise[currentIndex].sons_url) {
        const url = `${config.audiosUrl}/${contentExercise[currentIndex].sons_url}`;
        const audio = new Audio(url);
        audio.play();
      } else {
        speak(contentExercise[currentIndex].element);
      }
    }
  }, [isLabelVisible, contentExercise, currentIndex, speak]);

  useEffect(() => {
    let timer;
    if (isLabelVisible && contentExercise.length > 0) { // S'assurer que contentExercise est chargé
      timer = setTimeout(() => {
        setIsLabelVisible(false);
      }, timeOutRef.current);

      return () => clearTimeout(timer);
    }
  }, [isLabelVisible, currentIndex, contentExercise.length]);

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
        setIsLabelVisible(true);
        setIsAnswerValidated(null);
      }, 2000);
    }
  };

  const handleQuestionMarkClick = () => {
    // Réaffiche la bonne réponse pendant le même temps qu'au départ
    setIsLabelVisible(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
    // Le timer existant dans useEffect se chargera de la cacher après le délai
  };

  const displayLabels = (currentContent) => {
    if (!currentContent) return null;
    const contenu = currentContent;

    const revealAnswerCondition =
        (currentAttempt.current > 1 && content.type === 'C.3') ||
        (currentAttempt.current > 2 && content.type !== 'C.3');

    // Le label initial est affiché si isLabelVisible est vrai ET que la réponse ne doit pas encore être révélée
    const showInitialLabelElement = isLabelVisible && !revealAnswerCondition;

    // InputLabel est visible si on n'est PAS dans la phase d'affichage du label initial (donc isLabelVisible = false)
    // OU si la réponse est révélée (revealAnswerCondition = true)
    const isInputActuallyVisible = !isLabelVisible || revealAnswerCondition;

    return (
        <>
          <div className='exercice__item mb-12'>
            {showInitialLabelElement ? (
                // Phase 1: Affichage initial du label/image avec la réponse
                <>
                  {content.type !== 'C.1' && contenu?.image_url ? (
                      <LabelImage
                          // key={`initial-${currentIndex}`} // Optionnel, si currentIndex ne suffit pas
                          text={contenu.element}
                          format={contenu.contenuFormats ?? null}
                          imageSrc={contenu.image_url}
                      />
                  ) : (
                      <Label
                          // key={`initial-${currentIndex}`}
                          text={contenu.element}
                          format={contenu.contenuFormats ?? null}
                      />
                  )}
                </>
            ) : (
                // Phase 2: Affichage du '?' ou de la réponse après trop d'erreurs (ou après timeout de isLabelVisible)
                <>
                  {content.type !== 'C.1' && contenu.image_url ? (
                      <LabelImage
                          classe='label-sound'
                          text={revealAnswerCondition ? contenu.element : '?'}
                          voiceLine={contenu.element}
                          sound={false}
                          format={contenu.contenuFormats ?? null}
                          imageSrc={contenu.image_url}
                          audioUrl={contenu.sons_url ?? null}
                          onClick={handleQuestionMarkClick}
                      />
                  ) : (
                      <Label
                          classe='label-sound'
                          text={revealAnswerCondition ? contenu.element : '?'}
                          voiceLine={contenu.element}
                          sound={false}
                          format={contenu.contenuFormats ?? null}
                          audioUrl={contenu.sons_url ?? null}
                          onClick={handleQuestionMarkClick}
                      />
                  )}
                </>
            )}
          </div>

          {/* InputLabel est toujours rendu, sa visibilité est contrôlée par le style */}
          <div style={{ display: isInputActuallyVisible ? 'block' : 'none' }}>
            {contenu.syllabes && content.type === 'C.2 bis' ? (
                <InputLabel
                    correctAnswer={contenu.element}
                    setUserInput={setUserInput}
                    answer={isAnswerValidated}
                    syllabIndexes={contenu.syllabes}
                    value={userInput}
                    isEffectivelyVisible={isInputActuallyVisible}
                    ref={inputRef}
                />
            ) : (
                <InputLabel
                    correctAnswer={contenu.element}
                    setUserInput={setUserInput}
                    answer={isAnswerValidated}
                    value={userInput}
                    isEffectivelyVisible={isInputActuallyVisible}
                    ref={inputRef}
                />
            )}
          </div>
        </>
    );
  };

  const currentExerciseContent = contentExercise[currentIndex];

  return (
      <>
        {content && currentExerciseContent ? (
            <div className='exercices'>
              <Instruction instruction={content.consigne} />
              <div className='exercice__item pt-5'>
                {displayLabels(currentExerciseContent)}
              </div>
            </div>
        ) : (
            <div>Chargement de l&apos;exercice...</div>
        )}

        <ProgressBar content={isFinished} />
        <div>
          {contentExercise.length > 0 && !isFinished.every((item) => item.isFinished) && (
              <OKButton onClick={handleClickOKButton} />
          )}
        </div>
      </>
  );
}

export default ExerciseTypeC;
