import { useState, useEffect, useRef } from 'react';
import Label from '../UI/Label';
import LabelImage from '../UI/LabelImage';
import ProgressBar from './ProgressBar';
import OKbutton from '../UI/OKButton';
import Instruction from '../Instruction';
import useSpeak from '../../hooks/useSpeak';
import urlEchec from '../../assets/sons/apprentissage/error-sound.mp3';
import urlSucces from '../../assets/sons/apprentissage/reward-sound.mp3';
import useConfig from '../../hooks/useConfig';

const ExerciseTypeD = (props) => {
  const { content, onDone } = props;
  const { speak } = useSpeak();
  const [contentExercise, setContentExercise] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [availableCorrectAnswer, setAvailableCorrectAnswer] = useState(null);
  const [isFinished, setIsFinished] = useState([]);
  const [iterationExercice, setIterationExercice] = useState(0);
  const [score, setScore] = useState(100);
  const [isLocked, setisLocked] = useState(false);
  const [compteur, setCompteur] = useState(0);
  const [iterationCount, setIterationCount] = useState(0); // Nouveau compteur pour forcer la prononciation
  const config = useConfig();

  // Ref pour suivre si l'initialisation a été effectuée
  const initializedRef = useRef(false);
  // Ref pour suivre le changement de correctAnswer
  const previousCorrectAnswerRef = useRef('');
  // Effet unique pour initialiser l'exercice
  useEffect(() => {
    if (!content || !content.contenus || initializedRef.current) return;

    // Marquer l'initialisation comme effectuée
    initializedRef.current = true;

    // Dupliquer le contenu uniquement si nécessaire
    const baseContent = [...content.contenus];

    // Mélanger les réponses une seule fois
    const shuffledAnswerContent = baseContent.sort(() => Math.random() - 0.5);

    setAvailableCorrectAnswer(
      shuffledAnswerContent.map((item) => item.element)
    );
    setIterationExercice(shuffledAnswerContent.length);

  }, [content]);

  // Effet pour mettre à jour isFinished quand l'itération change
  useEffect(() => {
    if (iterationExercice > 0) {
      setIsFinished(Array(iterationExercice).fill({ isFinished: false }));
    }
  }, [iterationExercice]);

  // Effet combiné pour générer les labels et définir la réponse correcte
  useEffect(() => {
    // Ne procéder que si nous avons des réponses disponibles et que le tableau n'est pas vide
    if (!availableCorrectAnswer || availableCorrectAnswer.length === 0) {
      if (availableCorrectAnswer && availableCorrectAnswer.length === 0) {
        setisLocked(true);
        onDone(score);
      }
      return;
    }

    // Mémoriser la réponse courante
    const newCorrectAnswer = availableCorrectAnswer[0];

    // Vérifier si on change de réponse
    if (previousCorrectAnswerRef.current !== newCorrectAnswer) {
      previousCorrectAnswerRef.current = newCorrectAnswer;
      setCorrectAnswer(newCorrectAnswer);
    } else {
      // Même réponse, mais incrémenter le compteur pour forcer la prononciation
      setIterationCount((prev) => prev + 1);
      setCorrectAnswer(newCorrectAnswer);
    }

    // Dupliquer le contenu avec 3 styles par élément - une seule fois
    const duplicatedContent = content.contenus.flatMap((item, index) => [
      {
        ...item,
        id: `${index}-cursive`,
        font: 'cursive',
        isSelected: false,
        answer: undefined,
      },
      {
        ...item,
        id: `${index}-script`,
        font: 'script',
        isSelected: false,
        answer: undefined,
      },
      {
        ...item,
        id: `${index}-script-uppercase`,
        font: 'script-uppercase',
        isSelected: false,
        answer: undefined,
      },
    ]);

    // Récupérer tous les éléments pour la réponse correcte
    const correctItems = duplicatedContent.filter(
      (item) => item.element === newCorrectAnswer
    );

    // Vérifier si les éléments ont la propriété sound_group
    const hasSoundGroup = content.contenus.some(
      (item) => item.sound_group !== undefined
    );

    let otherItems = [];

    if (hasSoundGroup) {
      // Récupérer le sound_group de la réponse correcte
      const correctItem = content.contenus.find(
        (item) => item.element === newCorrectAnswer
      );
      const correctSoundGroup = correctItem?.sound_group;

      // Filtrer les éléments différents en fonction des sound_group, mais une seule fois
      const otherElementsWithDifferentSoundGroups = content.contenus
        .filter(
          (item) =>
            item.element !== newCorrectAnswer &&
            item.sound_group !== correctSoundGroup
        )
        .reduce((acc, item) => {
          // Vérifier si un élément avec ce sound_group a déjà été ajouté
          const groupExists = acc.some(
            (accItem) => accItem.sound_group === item.sound_group
          );

          if (!groupExists) {
            return [...acc, item];
          }
          return acc;
        }, []);

      // Utiliser un seedé pour stabiliser le tri aléatoire
      const selectedOtherElements = [...otherElementsWithDifferentSoundGroups]
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);

      // Récupérer les 3 versions (cursive, script, majuscule) pour ces 2 éléments
      otherItems = selectedOtherElements.flatMap((selectedItem) =>
        duplicatedContent.filter(
          (item) => item.element === selectedItem.element
        )
      );
    } else {
      // Logique originale: prendre des éléments aléatoires
      const otherElements = content.contenus.filter(
        (item) => item.element !== newCorrectAnswer
      );

      // Créer une copie avant de trier pour éviter les changements lors des rendus
      const selectedOtherElements = [...otherElements]
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);

      otherItems = selectedOtherElements.flatMap((selectedItem) =>
        duplicatedContent.filter(
          (item) => item.element === selectedItem.element
        )
      );
    }

    // Créer une copie pour le tri aléatoire pour éviter les changements lors des rendus
    const mixedItems = [...correctItems, ...otherItems];
    const shuffledItems = [...mixedItems].sort(() => Math.random() - 0.5);

    // Définir le contenu de l'exercice en une seule fois
    setContentExercise(shuffledItems);
  }, [availableCorrectAnswer, content.contenus]);

  // Nouvel effet pour toujours prononcer la réponse quand l'exercice change
  useEffect(() => {
    if (correctAnswer) {
      // recherche de l'élément dans contentExercise
      const currentItem = contentExercise.find(
        (item) => item.element === correctAnswer
        );
      if( currentItem.sons_url) {
        const url = `${config.audiosUrl}/${currentItem.sons_url}`;
        const audio = new Audio(url);
        audio.play();
      } else {
        speak(correctAnswer);
      }
    }
  }, [correctAnswer, iterationCount, speak]);

  // Gestion du clic sur OK
  const handleClickOKButton = () => {
    if (isLocked) {
      return;
    }

    const correctAnswersCount = contentExercise.filter(
      (item) => item.answer === true
    ).length;

    // Vérifier si 3 éléments sont sélectionnés
    if (contentExercise.filter((item) => item.isSelected).length !== 3) {
      return;
    }

    // Vérifier si les éléments sélectionnés sont corrects
    setContentExercise((prev) =>
      prev.map((item) =>
        item.isSelected
          ? {
              ...item,
              answer: item.element === correctAnswer ? true : false,
            }
          : item
      )
    );

    if (correctAnswersCount === 3) {
      setisLocked(true);
      setCompteur(0);
      // Attendre que le verrouillage soit effectif avant de poursuivre
      setTimeout(() => {
        // Mettre à jour les réponses correctes
        setAvailableCorrectAnswer((prev) => {
          const index = prev.findIndex((answer) => answer === correctAnswer);
          if (index !== -1) {
            const newAvailableCorrectAnswer = [...prev];
            newAvailableCorrectAnswer.splice(index, 1);
            return newAvailableCorrectAnswer;
          }
          return prev;
        });

        // Mettre à jour le progrès
        setIsFinished((prev) =>
          prev.map((item, index) =>
            index === prev.findIndex((item) => !item.isFinished)
              ? { ...item, isFinished: true }
              : item
          )
        );

        // Réinitialiser les sélections et les réponses après une courte pause

        setContentExercise((prev) =>
          prev
            .map((item) => ({
              ...item,
              isSelected: false,
              answer: undefined,
            }))
            .sort(() => Math.random() - 0.5)
        );
        // Déverrouiller à la fin de la séquence
        setisLocked(false);
      }, 500);
    }

    const hasIncorrectAnswer = contentExercise.filter(
      (item) => item.isSelected && item.element !== correctAnswer
    ).length;

    if (hasIncorrectAnswer > 0) {
      setisLocked(true); // Verrouiller immédiatement en cas d'erreur
      setScore((prev) => prev - 5 * hasIncorrectAnswer);
      const audio = new Audio(urlEchec);
      audio.play();

      setTimeout(() => {
        setContentExercise((prev) =>
          prev.map((item) => ({
            ...item,
            isSelected: false,
            answer: undefined,
          }))
        );
        speak(correctAnswer);
        setisLocked(false);
      }, 2000);
    }

    if (hasIncorrectAnswer === 0 && compteur === 0) {
      const audio = new Audio(urlSucces);
      audio.play();
      setCompteur(compteur + 1);
    }

    if (isFinished.every((item) => item.isFinished)) {
      onDone();
    }
  };

  // Gestion du clic sur un label
  const handleClickOnLabel = (id) => {
    if (isLocked) {
      return;
    }

    const selectedCount = contentExercise.filter(
      (item) => item.isSelected
    ).length;

    const isSelected = contentExercise.find(
      (item) => item.id === id
    ).isSelected;

    if (isSelected) {
      setContentExercise((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, isSelected: false } : item
        )
      );
    } else if (selectedCount < 3) {
      setContentExercise((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, isSelected: true } : item
        )
      );
    }
  };

  const displayLabels = (contentExercise) => {
    return contentExercise.map((contenu) => {
      const text =
        contenu.font === 'script-uppercase'
          ? contenu.element.toUpperCase()
          : contenu.element;
      return (
        <Label
          key={contenu.id}
          text={text}
          onClick={() => handleClickOnLabel(contenu.id)}
          font={contenu.font === 'script-uppercase' ? 'script' : contenu.font}
          answer={contenu.answer}
          isSelected={contenu.isSelected}
          format={contenu.contenuFormats ?? null}
          audioUrl={contenu.sons_url ?? null}
        />
      );
    });
  };

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

  // Effet pour gérer la touche Entrée
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.key === 'Enter' &&
        !isLocked &&
        contentExercise.filter((item) => item.isSelected).length === 3
      ) {
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
  }, [isLocked, contentExercise, isFinished]);

  return (
    <>
      {content ? (
        <div className='exercices'>
          {<Instruction instruction={content.consigne} />}
          <div className='exercice__item consigne-label pt-5'>
            {content.type !== 'D.1' && getCorrectAnswerImage(correctAnswer) ? (
              <LabelImage
                text={'?'}
                imageSrc={getCorrectAnswerImage(correctAnswer)}
                sound={true}
                voiceLine={correctAnswer}
                audioUrl={getCorrectAnswerAudio(correctAnswer)}
              />
            ) : (
              <Label
                classe='label-sound'
                text={'?'}
                sound={true}
                voiceLine={correctAnswer}
                audioUrl={getCorrectAnswerAudio(correctAnswer)}
              />
            )}
          </div>
          <div className='exercice__item pt-5'>
            {Array.isArray(contentExercise) && displayLabels(contentExercise)}
          </div>
        </div>
      ) : (
        <div>Erreur dans le chargement du contenu de l'exercice...</div>
      )}

      <ProgressBar content={isFinished} />
      <div>{!isLocked && <OKbutton onClick={handleClickOKButton} />}</div>
    </>
  );
};

export default ExerciseTypeD;
