import { useState, useEffect, useMemo, useCallback } from 'react';
import Label from '../UI/Label';
import LabelImage from '../UI/LabelImage';
import urlEchec from '../../assets/sons/apprentissage/error-sound.mp3';
import useSpeak from '../../hooks/useSpeak';
import Timer from '../UI/Timer';
import Instruction from '../Instruction';
import ModalExerciseG from '../UI/ModalExerciseG';
import useConfig from '../../hooks/useConfig';

const ExerciseTypeG = (props) => {
  const { content, onDone } = props;
  // Ajout d'une clé unique pour le timer
  const [timerKey, setTimerKey] = useState(0);

  const [contentExercise, setContentExercise] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [response, setResponse] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const [goodResponse, setGoodResponse] = useState(0);
  const [usedResponses, setUsedResponses] = useState([]); // Pour suivre les réponses déjà utilisées
  const [availableContent, setAvailableContent] = useState([]); // Pour stocker les 6 éléments sélectionnés
  const [showModal, setShowModal] = useState(false);
  const [exerciseStarted, setExerciseStarted] = useState(false);
  const config = useConfig();

  const { speak } = useSpeak();

  const shuffle = (array) => {
    const newArray = [...array];
    newArray.sort(() => Math.random() - 0.5);
    return newArray;
  };

  // Sélectionne une nouvelle réponse parmi les éléments disponibles
  const newResponse = useCallback(() => {
    let availableResponses;

    // Vérifier si tous les éléments ont été utilisés
    if (usedResponses.length >= availableContent.length) {
      // Si tous utilisés, réinitialiser la liste
      setUsedResponses([]);
      availableResponses = [...availableContent];
    } else {
      // Sinon, filtrer pour n'avoir que les éléments non encore utilisés
      availableResponses = availableContent.filter(
        (item) => !usedResponses.includes(item.element)
      );
    }

    // Choisir un élément au hasard parmi les disponibles
    const randomIndex = Math.floor(Math.random() * availableResponses.length);
    const selectedResponse = availableResponses[randomIndex].element;

    // Ajouter à la liste des éléments utilisés
    setUsedResponses((prev) => [...prev, selectedResponse]);
    setResponse(selectedResponse);
  }, [availableContent, usedResponses]);

  // Fonction pour réinitialiser tous les états
  const resetExercise = useCallback(() => {
    setContentExercise([]);
    setIsFinished(false);
    setResponse([]);
    setSelectedItem(null);
    setAttempt(0);
    setGoodResponse(0);
    setUsedResponses([]);
    setAvailableContent([]);
    setTimerKey((prev) => prev + 1);
    setShowModal(true);
    setExerciseStarted(false);
  }, []);

  useEffect(() => {
    // Réinitialiser l'exercice à chaque changement de contenu
    setShowModal(true);
    resetExercise();

    if (content && content.contenus) {
      // Sélectionner aléatoirement 6 éléments (ou moins si pas assez)
      const shuffledContent = shuffle([...content.contenus]);
      const selectedContent = shuffledContent.slice(
        0,
        Math.min(6, shuffledContent.length)
      );

      // Préparer les éléments pour l'affichage
      const displayContent = selectedContent.map((item, index) => ({
        ...item,
        id: `${index}`,
        answer: undefined,
      }));

      setContentExercise(displayContent);
      setAvailableContent(selectedContent);

      // Sélectionner la première réponse
      if (selectedContent.length > 0) {
        const firstResponse = selectedContent[0].element;
        setResponse(firstResponse);
        setUsedResponses([firstResponse]);
      }
    }
  }, [content, resetExercise]);

  useEffect(() => {
    if (response && exerciseStarted && timerKey > 0) {
      const currentItem = contentExercise.find(
          (item) => item.element === response
      );
      if( currentItem.sons_url) {
        const url = `${config.audiosUrl}/${currentItem.sons_url}`;
        const audio = new Audio(url);
        audio.play();
      } else {
        speak(response);
      }
    }
  }, [attempt, response, exerciseStarted]);

  useEffect(() => {
    if (isFinished) {
      const score = calculScore(goodResponse);
      onDone(score);
    }
  }, [isFinished, goodResponse]);

  const calculScore = (goodResponseCount) => {
    let score;
    switch (true) {
      case goodResponseCount < 4:
        score = 0;
        break;
      case goodResponseCount <= 6:
        score = 50;
        break;
      case goodResponseCount <= 8:
        score = 75;
        break;
      default:
        score = 100;
        break;
    }
    return score;
  };

  const endTimer = () => {
    setIsFinished(true);
  };

  const setAnswerLabel = (isCorrect, index) => {
    setContentExercise((prevContent) =>
      prevContent.map((item, idx) => {
        if (idx === index) {
          return { ...item, answer: isCorrect };
        }
        return item;
      })
    );
  };

  const handleLabelClick = (index, element) => {
    if (isFinished) return;
    const isClicked = () =>
      contentExercise.find((item) => {
        if (item.answer !== undefined) return true;
      });

    if (isClicked()) return;

    setSelectedItem(index);

    const isCorrect = element === response;

    if (isCorrect) {
      setAnswerLabel(true, index);
      setGoodResponse(goodResponse + 1);
      setTimeout(() => {
        setAnswerLabel(undefined, index);
        newResponse(); // Utilise la nouvelle fonction qui respecte la distribution
        setAttempt(attempt + 1);
      }, 1000);
    } else {
      new Audio(urlEchec).play();
      setAnswerLabel(false, index);
      let isTrue = undefined;
      const intervalId = setInterval(() => {
        isTrue = !isTrue;
        setAnswerLabel(
          isTrue ? true : undefined,
          contentExercise.findIndex((item) => item.element === response)
        );
      }, 370);

      setTimeout(() => {
        clearInterval(intervalId);
        setAnswerLabel(undefined, index);
        setAnswerLabel(
          undefined,
          contentExercise.findIndex((item) => item.element === response)
        );
        newResponse(); // Utilise la nouvelle fonction
        setAttempt(attempt + 1);
      }, 2000);
    }
  };

  const handleReady = () => {
    setShowModal(false);
    setExerciseStarted(true);
  };

  const memoizedTimer = useMemo(() => {
    if (!exerciseStarted) return null;
    return <Timer key={timerKey} duration={30} onComplete={endTimer} />;
  }, [timerKey, exerciseStarted]);

  const displayLabels = (contentExercise) => {
    return contentExercise.map((contenu, index) => (
      <Label
        key={index}
        text={contenu.element}
        onClick={() => handleLabelClick(index, contenu.element)}
        answer={contenu.answer}
        format={contenu.contenuFormats ?? null}
        audioUrl={contenu.sons_url ?? null}
      />
    ));
  };

  const getCorrectAnswer = (correctAnswer) => {
    if (!contentExercise || !correctAnswer) return null;
    return contentExercise.find((item) => item.element === correctAnswer);
  };

  return (
    <>
      <ModalExerciseG
        onReady={handleReady}
        isVisible={showModal}
        instruction={content.consigne}
      />

      {content ? (
        <>
          <div className='consigne-timer-container flex justify-center items-center'>
            <Instruction instruction={content.consigne} />
            <div className='timer-container fixed right-0 mr-6'>
              {memoizedTimer}
            </div>
          </div>
          <div className='exercice__item pt-5 flex justify-center'>
            {response && getCorrectAnswer(response) ? (
              content.type !== 'G.1' && getCorrectAnswer(response).image_url ? (
                <LabelImage
                  classe='label-sound'
                  text='?'
                  voiceLine={response}
                  sound={true}
                  isClickable={true}
                  imageSrc={getCorrectAnswer(response).image_url}
                  audioUrl={getCorrectAnswer(response)?.sons_url ?? null}
                />
              ) : (
                <Label
                  classe='label-sound'
                  text='?'
                  voiceLine={response}
                  sound={true}
                  isClickable={true}
                  audioUrl={getCorrectAnswer(response)?.sons_url ?? null}
                />
              )
            ) : (
              <div>Chargement...</div> // Message de chargement si aucune réponse n'est disponible
            )}
          </div>
          <div className='exercice__item pt-5'>
            {Array.isArray(contentExercise) && displayLabels(contentExercise)}
          </div>
        </>
      ) : (
        <div>Erreur dans le chargement du contenu de l'exercice...</div>
      )}
      <div className='container-score'>
        <div className='score font-regular'>{goodResponse}</div>
      </div>
    </>
  );
};

export default ExerciseTypeG;
