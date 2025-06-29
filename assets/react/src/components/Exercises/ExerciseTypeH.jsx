import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

import Label from '../UI/Label';
import Instruction from '../Instruction';
import ProgressBar from './ProgressBar';
import OKButton from '../UI/OKButton';
import urlEchec from '../../assets/sons/apprentissage/error-sound.mp3';
import urlSucces from '../../assets/sons/apprentissage/reward-sound.mp3';
import useSpeak from '../../hooks/useSpeak';
import DraggableList from '../UI/DraggableList';

const ExerciseTypeH = (props) => {
  const { content, onDone } = props;
  const [groupedContent, setGroupedContent] = useState([]);
  const [randomizedGroup, setRandomizedGroup] = useState([]);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [isLetterSelected, setIsLetterSelected] = useState(false);
  const [progress, setProgress] = useState([]);
  const [isValidated, setIsValidated] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [type, setType] = useState(null);
  const location = useLocation();
  const pathname = location.pathname;
  const [elementValidations, setElementValidations] = useState([]);

  const draggableListRef = useRef();
  const { speakArray } = useSpeak();

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const goToNextGroup = () => {
    const nextGroupIndex = currentGroupIndex + 1;
    if (nextGroupIndex < groupedContent.length) {
      setCurrentGroupIndex(nextGroupIndex);
      setRandomizedGroup(shuffleArray(groupedContent[nextGroupIndex]));
      setIsValidated(null);
    }
  };

  useEffect(() => {
    if (content && content.contenus.length > 0) {
      const contents = content.contenus.map((item) => item.element);
      const groups = [];
      if (pathname.includes('alphabet')) {
        setType('H.Alphabet');
        for (let i = 0; i < contents.length - 6; i += 3) {
          groups.push(contents.slice(i, i + 3).sort());
        }

        const lastGroup = contents.slice(contents.length - 6);
        groups.push(lastGroup.slice(0, 3).sort());
        groups.push(lastGroup.slice(3).sort());

        setGroupedContent(groups);
        setProgress(groups.map(() => ({ isFinished: false })));

        if (groups[0]) {
          setRandomizedGroup(shuffleArray(groups[0]));
        }
      } else if (pathname.includes('graphemes')) {
        setType('H.Graphemes');

        // Étape 1: Créer une copie des données avec les sound_groups
        const graphemesWithSoundGroups = content.contenus.map((item) => ({
          grapheme: item.element,
          soundGroup: item.sound_group || `unique_${item.element}`,
          used: false, // Marquer comme non utilisé
        }));

        // Étape 2: Définir la taille des groupes et le nombre maximum de groupes
        const TARGET_GROUP_SIZE = 3;
        const MAX_GROUPS = 7;

        // Étape 3: Calculer le nombre de groupes nécessaires
        const numberOfGroups = Math.min(
          MAX_GROUPS,
          Math.ceil(graphemesWithSoundGroups.length / TARGET_GROUP_SIZE)
        );

        const groups = Array(numberOfGroups)
          .fill()
          .map(() => []);

        let groupIndex = 0;

        for (let i = 0; i < graphemesWithSoundGroups.length; i++) {
          const currentGroup = groups[groupIndex];

          if (currentGroup.length >= TARGET_GROUP_SIZE) {
            groupIndex = (groupIndex + 1) % numberOfGroups;
            i--;
            continue;
          }
          const grapheme = graphemesWithSoundGroups[i];
          const hasSoundGroupConflict = currentGroup.some(
            (item) => item.soundGroup === grapheme.soundGroup
          );

          if (!hasSoundGroupConflict) {
            currentGroup.push({ ...grapheme, used: true });
            graphemesWithSoundGroups[i].used = true;
            groupIndex = (groupIndex + 1) % numberOfGroups;
          }
        }

        for (let i = 0; i < graphemesWithSoundGroups.length; i++) {
          if (!graphemesWithSoundGroups[i].used) {
            // Trouver un groupe qui a encore de la place
            let placed = false;
            for (let j = 0; j < groups.length; j++) {
              if (groups[j].length < TARGET_GROUP_SIZE) {
                // Vérifier s'il n'y a pas de conflit de sound_group
                const hasSoundGroupConflict = groups[j].some(
                  (item) =>
                    item.soundGroup === graphemesWithSoundGroups[i].soundGroup
                );

                if (!hasSoundGroupConflict) {
                  groups[j].push({
                    ...graphemesWithSoundGroups[i],
                    used: true,
                  });
                  graphemesWithSoundGroups[i].used = true;
                  placed = true;
                  break;
                }
              }
            }

            // Si on n'a pas pu placer ce graphème sans conflit, le placer quand même
            if (!placed) {
              for (let j = 0; j < groups.length; j++) {
                if (groups[j].length < TARGET_GROUP_SIZE) {
                  groups[j].push({
                    ...graphemesWithSoundGroups[i],
                    used: true,
                  });
                  graphemesWithSoundGroups[i].used = true;
                  placed = true;
                  break;
                }
              }
            }

            // Si toujours pas placé (tous les groupes sont pleins), créer un nouveau groupe
            if (!placed && groups.length < MAX_GROUPS) {
              groups.push([{ ...graphemesWithSoundGroups[i], used: true }]);
              graphemesWithSoundGroups[i].used = true;
            }
          }
        }

        // Troisième passe: compléter les groupes à TARGET_GROUP_SIZE
        for (let i = 0; i < groups.length; i++) {
          while (groups[i].length < TARGET_GROUP_SIZE) {
            // Chercher un graphème qui n'a pas de conflit de sound_group
            let added = false;

            for (let j = 0; j < graphemesWithSoundGroups.length; j++) {
              const hasSoundGroupConflict = groups[i].some(
                (item) =>
                  item.soundGroup === graphemesWithSoundGroups[j].soundGroup
              );

              if (!hasSoundGroupConflict) {
                groups[i].push({ ...graphemesWithSoundGroups[j], used: true });
                added = true;
                break;
              }
            }

            // Si on n'a pas trouvé de graphème sans conflit, ajouter n'importe lequel
            if (!added) {
              const randomIndex = Math.floor(
                Math.random() * graphemesWithSoundGroups.length
              );
              groups[i].push({
                ...graphemesWithSoundGroups[randomIndex],
                used: true,
              });
            }
          }
        }

        // Étape 5: Extraire seulement les graphèmes pour le format final
        const finalGroups = groups.map((group) =>
          group.map((item) => item.grapheme)
        );
        setGroupedContent(finalGroups);
        setProgress(finalGroups.map(() => ({ isFinished: false })));

        if (finalGroups[0]) {
          setRandomizedGroup(shuffleArray(finalGroups[0]));
        }
      } else {
        // Default grouping for other exercise types
        setType('H');

        // Create groups of 3 elements
        for (let i = 0; i < content.contenus.length; i += 3) {
          groups.push(content.contenus.slice(i, Math.min(i + 3, content.contenus.length)));
        }

        // If the last group has fewer than 3 elements, fill it with elements from previous groups
        const lastGroup = groups[groups.length - 1];
        if (lastGroup.length < 3) {
          // Get all elements from previous groups
          const previousElements = groups.slice(0, groups.length - 1).flat();

          // If there are previous elements, use them to fill the last group
          if (previousElements.length > 0) {
            while (lastGroup.length < 3) {
              const randomIndex = Math.floor(
                Math.random() * previousElements.length
              );
              lastGroup.push(previousElements[randomIndex]);
            }
          }
        }

        setGroupedContent(groups);
        setProgress(groups.map(() => ({ isFinished: false })));

        if (groups[0]) {
          setRandomizedGroup(shuffleArray(groups[0]));
        }
      }
    } else {
      onDone(100);
    }
  }, [content]);

  useEffect(() => {
    if (isLetterSelected) {
      speakArray(randomizedGroup);
    }
  }, [randomizedGroup, isLetterSelected, speakArray]);

  useEffect(() => {
    if (
      progress.every((item) => item.isFinished === true) &&
      currentGroupIndex === groupedContent.length - 1
    ) {
      const score = Math.round((groupedContent.length / attempt) * 100);
      onDone(score);
    }
  }, [progress, currentGroupIndex]);

  // Define checkAnswer with useCallback BEFORE it's used in useEffect
  const checkAnswer = useCallback(() => {
    if (isButtonDisabled) return;

    if (isCorrectAnswer) {
      goToNextGroup();
      setIsCorrectAnswer(false);
      return;
    }

    // Get user's answer elements
    const userElements = draggableListRef.current.getAnswerElements();
    const correctElements = draggableListRef.current.getCorrectElements();

    if (userElements.length !== correctElements.length) {
      return;
    }

    // Compare each element and create validations array
    const validations = userElements.map((element, index) => {
      return element.toLowerCase() === correctElements[index].toLowerCase();
    });
    if (type === 'H') {
      // Comparaison élément par élément pour type H normal
      const isCorrect = validations.every((validation) => validation === true);

      if (isCorrect) {
        new Audio(urlSucces).play();
        setIsValidated(true);
        setElementValidations(validations.map(() => true));
        setIsCorrectAnswer(true);
        setAttempt((prev) => prev + 1);

        setProgress((prev) => {
          const updatedProgress = [...prev];
          updatedProgress[currentGroupIndex] = { isFinished: true };
          return updatedProgress;
        });
      } else {
        new Audio(urlEchec).play();
        setAttempt((prev) => prev + 1);
        setIsValidated(false);
        setElementValidations(validations);

        setIsButtonDisabled(true);
        setTimeout(() => {
          setIsValidated(null);
          setElementValidations([]);
          speakArray(randomizedGroup); // Utilisation de speakArray ici aussi
          setIsButtonDisabled(false);
        }, 3000);
      }
      return;
    }

    // Pour les autres types, on continue à utiliser la méthode existante
    const userAnswer = draggableListRef.current
      .getAnswerLetters()
      .toLowerCase();

    // Modifions la manière dont correctAnswer est construit pour tenir compte des espaces
    const correctAnswer =
      type === 'H.Alphabet' || type === 'H.Graphemes'
        ? randomizedGroup.join('').toLowerCase()
        : randomizedGroup.join(' ').toLowerCase();

    const isCorrect = userAnswer === correctAnswer;

    if (isCorrect) {
      new Audio(urlSucces).play();
      setIsValidated(true);
      setElementValidations(validations.map(() => true)); // All elements are correct
      setIsCorrectAnswer(true);
      setAttempt((prev) => prev + 1);

      setProgress((prev) => {
        const updatedProgress = [...prev];
        updatedProgress[currentGroupIndex] = { isFinished: true };
        return updatedProgress;
      });
    } else {
      new Audio(urlEchec).play();
      setAttempt((prev) => prev + 1);
      setIsValidated(false);
      setElementValidations(validations); // Set which elements are correct/incorrect

      setIsButtonDisabled(true);
      setTimeout(() => {
        setIsValidated(null);
        setElementValidations([]);
        speakArray(randomizedGroup); // Utilisation de speakArray ici aussi
        setIsButtonDisabled(false);
      }, 3000);
    }
  }, [
    isButtonDisabled,
    isCorrectAnswer,
    type,
    randomizedGroup,
    currentGroupIndex,
    goToNextGroup,
    speakArray,
  ]);

  // Now this useEffect can safely reference checkAnswer
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter' && isLetterSelected && !isButtonDisabled) {
        checkAnswer();
      }
    };

    // Only add the listener when the letter selection screen is passed
    if (isLetterSelected) {
      document.addEventListener('keydown', handleKeyDown);
    }

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLetterSelected, isButtonDisabled, checkAnswer]);

  const handleLetterClick = (letter, font) => {
    setSelectedLetter({
      letter: letter,
      isUppercase: letter === letter.toUpperCase(),
      font: font,
    });
    setIsLetterSelected(true);
  };

  const getCurrentGroupWord = () => {
    // Utiliser un séparateur spécial qui ne sera pas dans le contenu normal
    let newGroup;
    if ( typeof randomizedGroup[0] === 'object' ) {
      newGroup = randomizedGroup.map(item => item.element);
    } else {
      newGroup = randomizedGroup;
    }
    return type === 'H'
      ? newGroup.join('|||')
      : newGroup.join(' ');
  };

  return (
    <>
      {!isLetterSelected ? (
        <div className='exercices'>
          <Instruction instruction={'Choisissez une écriture'} />
          <div className='exercice__item pt-5'>
            <Label
              font='script'
              text={content?.contenus[0]?.element}
              onClick={() => handleLetterClick('a', 'script')}
            />
            <Label
              font='cursive'
              text={content?.contenus[0]?.element}
              onClick={() => handleLetterClick('a', 'cursive')}
            />
            <Label
              font='script'
              text={content?.contenus[0]?.element.toUpperCase()}
              onClick={() => handleLetterClick('A', 'script')}
            />
            <Label
              font='cursive'
              text={content?.contenus[0]?.element.toUpperCase()}
              onClick={() => handleLetterClick('A', 'cursive')}
            />
          </div>
        </div>
      ) : (
        <>
          {content ? (
            <>
              <div className='exercices'>
                <Instruction instruction={content.consigne} />
                <div className='exercice__item pt-5'>
                  <Label
                    className='label-sound'
                    text='?'
                    sound={true}
                    voiceLine={randomizedGroup}
                    useArraySpeak={true}
                  />

                  <div
                    className='exercice__item pt-5'
                    style={{ minHeight: '15rem' }}
                  >
                    <DraggableList
                      key={`${currentGroupIndex}`}
                      ref={draggableListRef}
                      word={getCurrentGroupWord()}
                      type={type}
                      isValidated={isValidated}
                      showLabel={true}
                      letterStyle={selectedLetter}
                      elementValidations={elementValidations}
                    />
                  </div>
                </div>
              </div>
              <ProgressBar content={progress} />
              {progress.some((item) => item.isFinished === false) && (
                <OKButton onClick={checkAnswer} disabled={isButtonDisabled} />
              )}{' '}
            </>
          ) : (
            <div>
              Erreur dans le chargement du contenu de l&apos;exercice...
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ExerciseTypeH;
