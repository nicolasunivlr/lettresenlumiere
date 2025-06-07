import {
  forwardRef,
  useState,
  useImperativeHandle,
  useEffect,
  useMemo,
} from 'react';
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import syllabify from 'syllabify-fr';
import SortableItem from './SortableItem';

const DragItem = ({ letter, isValidated, letterStyle }) => {
  if (isValidated) {
    return null;
  }

  const fontClass = (() => {
    if (letterStyle?.font === 'script') {
      return 'font-script';
    } else if (letterStyle?.font === 'cursive') {
      return 'font-cursiv';
    } else if (letterStyle?.font === 'cursiveupp') {
      return 'font-cursivupp';
    } else {
      return 'font-regular';
    }
  })();

  let styledLetter = letter;
  if (letterStyle) {
    styledLetter = letterStyle.isUppercase
      ? letter.toUpperCase()
      : letter.toLowerCase();
  }

  return (
    <div
      className={`label label__drag py-6 px-14 rounded-2xl relative ${fontClass}`}
    >
      {styledLetter}
    </div>
  );
};

const DraggableList = forwardRef(
  (
    {
      word,
      type,
      isValidated,
      showLabel,
      letterStyle,
      elementValidations = [],
    },
    ref
  ) => {
    // Fonction pour préparer les éléments et marquer les espaces comme non-déplaçables
    const prepareElements = (word, type) => {
      let draggableElements = [];
      let elements = [];
      let prePositionedElements = [];

      // Vérifier si c'est un type H (ne doit jamais avoir d'éléments pré-positionnés)
      const isTypeH =
        type === 'H' || type === 'H.Alphabet' || type === 'H.Graphemes';

      // Si le mot contient un espace et ce n'est pas de type F.3 et pas de type H
      if (word.includes(' ') && type !== 'F.3' && !isTypeH) {
        const parts = word.split(' ');

        // Marquer les éléments avant l'espace comme pré-positionnés
        if (type === 'F.1') {
          // Pour F.1, on prend le premier "mot" en entier
          elements.push({
            content: parts[0],
            isDraggable: true,
            prePositioned: true,
          });
          prePositionedElements.push(parts[0]);
        } else {
          // Pour les autres types, on prend chaque lettre du premier "mot"
          for (let i = 0; i < parts[0].length; i++) {
            elements.push({
              content: parts[0][i],
              isDraggable: true,
              prePositioned: true,
            });
            prePositionedElements.push(parts[0][i]);
          }
        }

        // Ajouter l'espace
        elements.push({ content: ' ', isDraggable: false });

        // Traitement spécifique pour la partie après l'espace
        if (type === 'F.1') {
          // Pour F.1, diviser en syllabes
          for (let i = 1; i < parts.length; i++) {
            const syllables = syllabify(parts[i]).syllabes;
            for (const syllable of syllables) {
              elements.push({ content: syllable, isDraggable: true });
              draggableElements.push(syllable);
            }
            if (i < parts.length - 1) {
              elements.push({ content: ' ', isDraggable: false });
            }
          }
        } else {
          // Pour les autres types, traiter lettre par lettre
          for (let i = 1; i < parts.length; i++) {
            for (let j = 0; j < parts[i].length; j++) {
              elements.push({ content: parts[i][j], isDraggable: true });
              draggableElements.push(parts[i][j]);
            }
            if (i < parts.length - 1) {
              elements.push({ content: ' ', isDraggable: false });
            }
          }
        }
      } else {
        if (type === 'F.1') {
          const syllables = syllabify(word).syllabes;
          for (const syllable of syllables) {
            elements.push({ content: syllable, isDraggable: true });
            draggableElements.push(syllable);
          }
        } else if (type === 'F.3') {
          const words = word.split(' ');
          for (let i = 0; i < words.length; i++) {
            elements.push({ content: words[i], isDraggable: true });
            draggableElements.push(words[i]);

            if (i < words.length - 1) {
              elements.push({ content: ' ', isDraggable: false });
            }
          }
        } else if (isTypeH) {
          if (type === 'H.Alphabet' || type === 'H.Graphemes') {
            // Pour H.Alphabet et H.Graphemes, on traite chaque mot séparément
            const words = word.split(' ');
            for (let i = 0; i < words.length; i++) {
              const char = words[i];
              elements.push({ content: char, isDraggable: true });
              draggableElements.push(char);
            }
          } else {
            // Pour le type H standard, utiliser le séparateur spécial
            const phrases = word.split('|||');
            for (let i = 0; i < phrases.length; i++) {
              elements.push({ content: phrases[i], isDraggable: true });
              draggableElements.push(phrases[i]);

              // Ajouter un espace non-draggable entre les éléments (sauf après le dernier)
              if (i < phrases.length - 1) {
                elements.push({ content: ' ', isDraggable: false });
              }
            }
          }
        } else {
          for (let i = 0; i < word.length; i++) {
            const char = word[i];
            if (char === ' ') {
              elements.push({ content: ' ', isDraggable: false });
            } else {
              elements.push({ content: char, isDraggable: true });
              draggableElements.push(char);
            }
          }
        }
      }

      return { elements, draggableElements, prePositionedElements };
    };

    const shuffle = (array) => {
      const newArray = [...array];
      for (let i = 0; i < Math.random() * 10; i++) {
        newArray.sort(() => 0.5 - Math.random());
      }
      return newArray;
    };

    // Utiliser useMemo pour éviter de recalculer ces valeurs à chaque rendu
    const { elements, draggableElements, prePositionedElements } = useMemo(
      () => prepareElements(word, type),
      [word, type]
    );

    // Initialiser les éléments dans la banque et la zone de réponse
    const [bankLetters, setBankLetters] = useState([]);
    const [answerLetters, setAnswerLetters] = useState([]);
    const [activeId, setActiveId] = useState(null);
    const [initialized, setInitialized] = useState(false);

    // Réinitialiser quand le mot change - avec une vérification pour éviter les boucles infinies
    useEffect(() => {
      if (
        !initialized ||
        word !== answerLetters.reduce((acc, item) => acc + item.letter, '')
      ) {
        const prePositioned = prePositionedElements.map((element, index) => ({
          id: `prepositioned-${element}-${index}-${Date.now()}`, // Ajout d'un timestamp unique
          letter: element,
          prePositioned: true,
        }));

        setAnswerLetters(prePositioned);
        setBankLetters(
          shuffle(draggableElements).map((element, index) => ({
            id: `${element}-${index}-${Date.now()}`, // Ajout d'un timestamp unique
            letter: element,
          }))
        );
        setInitialized(true);
      }
    }, [word, type, initialized]);

    const handleDragStart = (event) => {
      setActiveId(event.active.id);
    };

    const handleDragEnd = (event) => {
      const { active, over } = event;
      setActiveId(null);

      if (!over) return;

      const activeLetter =
        bankLetters.find((item) => item.id === active.id) ||
        answerLetters.find(
          (item) => item.id === active.id && !item.prePositioned
        );

      if (!activeLetter) return;

      if (bankLetters.some((item) => item.id === active.id)) {
        setBankLetters((prev) => prev.filter((item) => item.id !== active.id));
        setAnswerLetters((prev) => [...prev, activeLetter]);
      } else {
        const oldIndex = answerLetters.findIndex(
          (item) => item.id === active.id
        );
        const newIndex = answerLetters.findIndex((item) => item.id === over.id);

        if (oldIndex !== newIndex) {
          setAnswerLetters((prev) => arrayMove(prev, oldIndex, newIndex));
        }
      }
    };

    // Générer les placeholders pour la réponse
    const answerPlaceholders = elements.map((element, index) => {
      if (!element.isDraggable) {
        return (
          <div
            key={`fixed-${index}`}
            className='flex items-center justify-center'
            style={{ margin: '0 8px' }}
          >
            {element.content}
          </div>
        );
      }

      // Trouver la position de cet élément parmi les éléments draggables
      const draggableIndex = elements
        .slice(0, index)
        .filter((el) => el.isDraggable).length;

      // Si c'est un élément pré-positionné ou si on a déjà une réponse
      if (
        (element.prePositioned && answerLetters[draggableIndex]) ||
        (!element.prePositioned && answerLetters[draggableIndex])
      ) {
        // Determine individual element validation status
        let elementIsValidated = isValidated;

        // If the whole answer is false but we have individual validations, use those
        if (isValidated === false && elementValidations.length > 0) {
          elementIsValidated = elementValidations[draggableIndex];
        }

        return (
          <SortableItem
            key={answerLetters[draggableIndex].id}
            id={answerLetters[draggableIndex].id}
            letter={answerLetters[draggableIndex].letter}
            isValidated={elementIsValidated}
            showLabel={showLabel}
            letterStyle={letterStyle}
            disabled={answerLetters[draggableIndex].prePositioned}
          />
        );
      } else {
        return (
          <div
            key={`placeholder-${index}`}
            className={`rounded-2xl relative flex items-center justify-center `}
            style={{ fontSize: '6rem', fontWeight: 'bold' }}
          >
            _
          </div>
        );
      }
    });

    useImperativeHandle(ref, () => ({
      getAnswerLetters: () => {
        let result = '';
        let answerIndex = 0;

        for (const element of elements) {
          if (element.isDraggable) {
            if (answerLetters[answerIndex]) {
              result += answerLetters[answerIndex].letter;
            }
            answerIndex++;
          } else {
            result += element.content;
          }
        }
        return result;
      },
      getAnswerElements: () => {
        // Return the array of draggable elements that have been answered
        return answerLetters.map((item) => item.letter);
      },
      getCorrectElements: () => {
        // Return the array of correct draggable elements in order
        return elements
          .filter((element) => element.isDraggable)
          .map((element) => element.content);
      },
    }));

    return (
      <DndContext
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className='flex flex-col justify-center items-center p-4'>
          <div className='p-4'>
            <SortableContext
              items={answerLetters.map((item) => item.id)}
              strategy={horizontalListSortingStrategy}
            >
              <div className='flex gap-2 p-4'>{answerPlaceholders}</div>
            </SortableContext>
          </div>
          {bankLetters.length > 0 && (
            <div className='p-4'>
              <SortableContext
                items={bankLetters.map((item) => item.id)}
                strategy={horizontalListSortingStrategy}
              >
                <div className='flex gap-2 min-h-[60px] items-center'>
                  {bankLetters.map(({ id, letter }) => (
                    <SortableItem
                      key={id}
                      id={id}
                      letter={letter}
                      showLabel={showLabel}
                      letterStyle={letterStyle}
                    />
                  ))}
                </div>
              </SortableContext>
            </div>
          )}
        </div>
        <DragOverlay>
          {activeId && (
            <DragItem
              letter={
                bankLetters.find((item) => item.id === activeId)?.letter ||
                answerLetters.find((item) => item.id === activeId)?.letter
              }
              isValidated={isValidated}
              letterStyle={letterStyle}
            />
          )}
        </DragOverlay>
      </DndContext>
    );
  }
);

DraggableList.displayName = 'DraggableList';

export default DraggableList;
