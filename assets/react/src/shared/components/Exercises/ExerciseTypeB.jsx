import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import Label from "../UI/Label";
import OKButton from "../UI/OKButton";
import ProgressBar from "./ProgressBar";
import urlSucces from "../../../assets/sounds/ui/reward-sound.mp3";
import urlEchec from "../../../assets/sounds/ui/error-sound.mp3";
import useSpeak from "../../hooks/useSpeak";
import LabelImage from "../UI/LabelImage";
import usePlay from "../../hooks/usePlay";
import Instruction from "../Instruction";
import {
  MAX_ATTEMPTS,
  ITEM_STATUS,
  getItemStatus,
  computeExerciseScore,
} from "../../constants/exerciseAttempts";

const ExerciseTypeB = ({ content, onDone }) => {
  const [contentExercise, setContentExercise] = useState([]);
  const [isFinished, setIsFinished] = useState([
    { status: ITEM_STATUS.PENDING },
  ]);
  const [tabResponses, setTabResponses] = useState([]);
  const [attempt, setAttempt] = useState(0);
  const [isLocked, setisLocked] = useState(false);
  // Nombre d'essais consommés sur l'item courant (plafonné à MAX_ATTEMPTS).
  const attemptsForCurrentItemRef = useRef(0);
  // true quand l'item courant a épuisé ses essais : on attend une validation
  // manuelle (OK) pour passer au suivant, sans révéler la bonne réponse.
  const [itemFailed, setItemFailed] = useState(false);
  const location = useLocation();

  const { speak } = useSpeak();
  const { play } = usePlay();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter" && !isLocked) {
        setisLocked(true);
        handleClickOKButton();
        setTimeout(() => {
          setisLocked(false);
        }, 2000);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
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
            location.pathname.endsWith("/alphabet") ||
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
        const maxAdditionalItems = location.pathname.endsWith("/alphabet")
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
      const finalItems = location.pathname.endsWith("/alphabet")
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
        sons_url: contenu.sons_url,
      }));

      // Toujours utiliser le tableau d'origine sans duplication
      const shuffledResponses = shuffle([...responses]);

      setTabResponses(shuffledResponses);

      const firstContent = generateContentExercise(shuffledResponses[0]);
      setContentExercise(firstContent);
      setIsFinished(
        new Array(shuffledResponses.length).fill({
          status: ITEM_STATUS.PENDING,
        })
      );
    }
  }, [content]);

  useEffect(() => {
    if (
      tabResponses.length > 0 &&
      !isFinished.every((item) => item.status !== ITEM_STATUS.PENDING)
    ) {
      const firstNonDone = tabResponses.find((response) => !response.done);
      if (firstNonDone) {
        // Nouvel item : on réinitialise le compteur d'essais et le
        // verrouillage éventuel de l'item précédent.
        attemptsForCurrentItemRef.current = 0;
        setItemFailed(false);
        const newContent = generateContentExercise(firstNonDone);
        setContentExercise(newContent);
        if (firstNonDone.sons_url) {
          //const url = `${config.audiosUrl}/${firstNonDone.sons_url}`;
          //const audio = new Audio(url);
          //audio.play();
          play(firstNonDone);
        } else {
          speak(firstNonDone.element);
        }
      }
    }
  }, [tabResponses, generateContentExercise, /*speak,*/ isFinished]);

  useEffect(() => {
    if (isFinished.every((item) => item.status !== ITEM_STATUS.PENDING)) {
      onDone(computeExerciseScore(isFinished));
    }
  }, [isFinished]);

  const handleFinish = (index, status) => {
    setIsFinished((prev) =>
      prev.map((item, i) => (i === index ? { ...item, status } : item))
    );
  };

  const handleClickOKButton = () => {
    const index = tabResponses.findIndex((response) => !response.done);
    if (index === -1) return;

    if (itemFailed) {
      // Essais épuisés : on passe manuellement au suivant sans révéler la
      // bonne réponse.
      setTabResponses((prevResponses) =>
        prevResponses.map((response, i) =>
          i === index ? { ...response, done: true } : response
        )
      );
      handleFinish(index, ITEM_STATUS.FAILED);
      setItemFailed(false);
      setContentExercise((prevContent) =>
        prevContent.map((item) => ({ ...item, answer: undefined }))
      );
      return;
    }

    const correctAnswer = () =>
      contentExercise.find((item) => {
        if (item.answer === true) return true;
      });

    if (correctAnswer()) {
      setTabResponses((prevResponses) =>
        prevResponses.map((response, i) =>
          i === index ? { ...response, done: true } : response
        )
      );
      handleFinish(
        index,
        getItemStatus(attemptsForCurrentItemRef.current, true)
      );
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
      if (itemFailed) return;

      const isClicked = () =>
        contentExercise.find((item) => {
          if (item.answer !== undefined) return true;
        });

      if (isClicked()) return;

      const firstNonDone = tabResponses.find((response) => !response.done);
      const isCorrect = element === firstNonDone.element;

      attemptsForCurrentItemRef.current += 1;

      if (isCorrect) {
        new Audio(urlSucces).play();
        setAnswerLabel(true, index);
        setAttempt((prev) => prev + 1);
      } else {
        new Audio(urlEchec).play();
        setAnswerLabel(false, index);
        setAttempt((prev) => prev + 1);

        if (attemptsForCurrentItemRef.current >= MAX_ATTEMPTS) {
          // Essais épuisés : on verrouille l'item, l'utilisateur devra
          // valider manuellement (OK) pour passer au suivant.
          setItemFailed(true);
          return;
        }

        setTimeout(() => {
          setAnswerLabel(undefined, index);
          if (firstNonDone.sons_url) {
            // const url = `${config.audiosUrl}/${firstNonDone.sons_url}`;
            // const audio = new Audio(url);
            // audio.play();
            play(firstNonDone);
          } else {
            speak(firstNonDone.element);
          }
        }, 2000);
      }
    },
    [contentExercise, tabResponses, setAnswerLabel, /*speak,*/ setAttempt, itemFailed]
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
        audioUrl={contenu.sons_url}
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
          <div className="exercices">
            {contentExercise && <Instruction exercice={content} />}
            <div className="exercice__item pt-5">
              {content.type !== "B.1" &&
              getCorrectAnswerImage(
                tabResponses.find((response) => !response.done)?.element
              ) ? (
                <LabelImage
                  text={"?"}
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
                  classe="label-sound"
                  text="?"
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
            <div className="exercice__item pt-5">{displayLabels}</div>
          </div>

          <ProgressBar content={isFinished} />
          {(itemFailed ||
            contentExercise.some((item) => item.answer === true)) && (
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
