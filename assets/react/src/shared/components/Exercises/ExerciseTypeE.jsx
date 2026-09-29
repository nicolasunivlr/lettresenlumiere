import { useState, useEffect, useRef } from "react";
import Label from "../UI/Label";
import LabelImage from "../UI/LabelImage";
import InputLabel from "../UI/InputLabel";
import ProgressBar from "./ProgressBar";
import Instruction from "../Instruction";
import OKButton from "../UI/OKButton";
import usePlay, { play } from "../../hooks/usePlay";
import urlSucces from "../../../assets/sounds/ui/reward-sound.mp3";
import urlEchec from "../../../assets/sounds/ui/error-sound.mp3";
import {
  MAX_ATTEMPTS,
  ITEM_STATUS,
  getItemStatus,
  computeExerciseScore,
} from "../../constants/exerciseAttempts";

function ExerciseTypeE(props) {
  const { content, onDone } = props;
  const [contentExercise, setContentExercise] = useState([]);
  const [isFinished, setIsFinished] = useState([
    { status: ITEM_STATUS.PENDING },
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [isLabelVisible, setIsLabelVisible] = useState(false);
  const [isAnswerValidated, setIsAnswerValidated] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  // true quand l'item courant a épuisé ses MAX_ATTEMPTS essais : on attend
  // une validation manuelle (OK) pour passer au suivant, sans révéler la
  // bonne réponse (au-delà de la révélation existante avant le dernier essai).
  const [isItemLocked, setIsItemLocked] = useState(false);
  const { play } = usePlay();
  const attempt = useRef(0);
  const currentAttempt = useRef(0);
  const timeOutRef = useRef(4000);
  const [correctAnswerGiven, setCorrectAnswerGiven] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (content && content.contenus) {
      // Utiliser directement le contenu original sans duplication
      const duplicatedContents = content.contenus;

      const shuffledContents = [...duplicatedContents].sort(
        () => Math.random() - 0.5
      );
      setContentExercise(shuffledContents);
      setIsFinished(shuffledContents.map(() => ({ status: ITEM_STATUS.PENDING })));
    }
    if (content.type === "E.3") {
      timeOutRef.current = 6000;
    }
  }, [content]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter" && !isLocked) {
        handleClickOKButton();
        setIsLocked(true);

        setTimeout(() => {
          setIsLocked(false);
        }, 2000);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLocked, contentExercise, userInput, isItemLocked]);

  useEffect(() => {
    if (isFinished.every((item) => item.status !== ITEM_STATUS.PENDING)) {
      onDone(computeExerciseScore(isFinished));
    }
  }, [isFinished]);

  const goToNextItem = () => {
    const isAllFinished = contentExercise.every(
      (_, index) => isFinished[index]?.status !== ITEM_STATUS.PENDING
    );

    if (!isAllFinished) {
      setCurrentIndex((prev) => prev + 1);
      setUserInput("");
      setIsLabelVisible(false); // Changed from true to false to reset for next question
      setIsAnswerValidated(null);
      setCorrectAnswerGiven(false); // Reset for the next question
      currentAttempt.current = 0;
      setIsItemLocked(false);
    }
  };

  const handleClickOKButton = () => {
    if (isItemLocked) {
      // Essais épuisés : on marque l'item en échec et on passe manuellement
      // au suivant, sans révéler la bonne réponse.
      setIsFinished((prev) => {
        const updated = [...prev];
        updated[currentIndex] = { status: ITEM_STATUS.FAILED };
        return updated;
      });
      goToNextItem();
      return;
    }

    if (isAnswerValidated === null) {
      handleAnswer();
    }

    if (isAnswerValidated) {
      goToNextItem();
    }
  };

  useEffect(() => {
    if (
      !isLabelVisible &&
      contentExercise[currentIndex] &&
      !correctAnswerGiven
    ) {
      if (contentExercise[currentIndex].sons_url) {
        play(contentExercise[currentIndex]);
      }
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

  const handleLabelClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

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
      console.error("Élément de contenu invalide");
      return;
    }

    let isCorrect;

    // Prends en compte les majuscules si c'est type C.3, sinon non
    if (content.type === "E.3") {
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
      const attemptsUsed = currentAttempt.current + 1;
      currentAttempt.current = 0;
      setIsLabelVisible(true);
      setCorrectAnswerGiven(true); // Mark that a correct answer was given

      setIsFinished((prev) => {
        const updated = [...prev];
        updated[currentIndex] = {
          status: getItemStatus(attemptsUsed, true),
        };
        return updated;
      });
    } else {
      currentAttempt.current += 1;
      new Audio(urlEchec).play();
      setIsAnswerValidated(false);

      if (currentAttempt.current >= MAX_ATTEMPTS) {
        // Essais épuisés : on verrouille l'item, l'utilisateur devra
        // valider manuellement (OK) pour passer au suivant.
        setIsItemLocked(true);
        return;
      }

      setTimeout(() => {
        setUserInput("");
        if (contentExercise[currentIndex].sons_url) {
          play(contentExercise[currentIndex]);
        }

        setIsAnswerValidated(null);
      }, 2000);
    }
  };

  const displayLabels = (contentExercise, currentIndex) => {
    if (!contentExercise[currentIndex]) return null;
    const contenu = contentExercise[currentIndex];

    return (
      <>
        <div className="exercice__item mb-12">
          {content.type !== "E.1" && contenu.image_url ? (
            <LabelImage
              classe="label-sound"
              text={
                currentAttempt.current > 2 ||
                isLabelVisible ||
                correctAnswerGiven
                  ? contenu.element
                  : "?"
              }
              voiceLine={contenu.element}
              sound={true}
              format={contenu.contenuFormats ?? null}
              imageSrc={contenu.image_url}
              audioUrl={contenu.sons_url ?? null}
              onClick={handleLabelClick}
            />
          ) : (
            <Label
              classe="label-sound"
              text={
                currentAttempt.current > 2 ||
                isLabelVisible ||
                correctAnswerGiven
                  ? contenu.element
                  : "?"
              }
              voiceLine={contenu.element}
              sound={true}
              format={contenu.contenuFormats ?? null}
              audioUrl={contenu.sons_url ?? null}
              onClick={handleLabelClick}
            />
          )}
        </div>
        {contenu.syllabes && content.type === "E.2 bis" ? (
          <InputLabel
            correctAnswer={contenu.element}
            setUserInput={setUserInput}
            answer={isAnswerValidated}
            syllabIndexes={contenu.syllabes}
            ref={inputRef}
          />
        ) : (
          <InputLabel
            correctAnswer={contenu.element}
            setUserInput={setUserInput}
            answer={isAnswerValidated}
            ref={inputRef}
          />
        )}
      </>
    );
  };

  return (
    <>
      {content ? (
        <div className="exercices">
          <Instruction exercice={content} />
          <div className="exercice__item pt-5">
            {displayLabels(contentExercise, currentIndex)}
          </div>
        </div>
      ) : (
        <div>Erreur dans le chargement du contenu de l'exercice...</div>
      )}

      <ProgressBar content={isFinished} />
      <div>
        {!isFinished.every((item) => item.status !== ITEM_STATUS.PENDING) && (
          <OKButton onClick={handleClickOKButton} />
        )}
      </div>
    </>
  );
}

export default ExerciseTypeE;
