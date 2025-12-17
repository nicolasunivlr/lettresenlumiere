import {useState, useEffect, useRef, useMemo, useCallback, forwardRef} from 'react';

const InputLabel = forwardRef((props, ref) => {
  const {
    correctAnswer,
    setUserInput,
    isSelected = false,
    answer = null,
    syllabIndexes,
    isEffectivelyVisible = true
  } = props;

  const [currentInput, setCurrentInput] = useState('');
  const [feedbackClass, setFeedbackClass] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const [inputWidth, setInputWidth] = useState('auto');
  const measureRef = useRef(null);
  const [displayValue, setDisplayValue] = useState('');
  const errorTimerRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState(0);

  const charRefs = useRef([]);
  const [measuresDone, setMeasuresDone] = useState(false);
  const textContainerRef = useRef(null);

  const hasUnderscorePrefix = correctAnswer.startsWith('_');

  const syllab = useMemo(() => {
    if (!syllabIndexes) return '';
    const [start, end] = syllabIndexes.split('-').map(Number);
    return correctAnswer.slice(start, end + 1);
  }, [correctAnswer, syllabIndexes]);

  const indexSyllab = useMemo(
    () => (syllabIndexes ? parseInt(syllabIndexes.split('-')[0]) : undefined),
    [syllabIndexes]
  );

  const syllabEndIndex = useMemo(
    () => (syllabIndexes ? parseInt(syllabIndexes.split('-')[1]) : undefined),
    [syllabIndexes]
  );

  // USEFFECT

  useEffect(() => {
    setUserInput('');
    setFeedbackClass('');
    setIsDisabled(false);
    setCursorPosition(0);

    if (syllabIndexes) {
      const initialDisplay = correctAnswer
        .split('')
        .map((char, index) => {
          if (
            indexSyllab !== undefined &&
            index >= indexSyllab &&
            index <= syllabEndIndex
          ) {
            return '_';
          }
          return char;
        })
        .join('');
      setDisplayValue(initialDisplay);
    } else {
      const initialDisplay = '_'.repeat(correctAnswer.length);
      setDisplayValue(initialDisplay);
    }
  }, [correctAnswer, syllabIndexes, indexSyllab, syllabEndIndex]);

  useEffect(() => {
    if (syllabIndexes) {
      if (currentInput.length === 0) {
        setUserInput('');
        return;
      }

      const beforeSyllab = correctAnswer.substring(0, indexSyllab);
      const afterSyllab = correctAnswer.substring(syllabEndIndex + 1);
      const fullWord = beforeSyllab + currentInput + afterSyllab;

      setUserInput(fullWord);
    } else {
      setUserInput(currentInput);
    }
  }, [
    currentInput,
    correctAnswer,
    syllabIndexes,
    indexSyllab,
    syllabEndIndex,
    displayValue,
  ]);

  // on remet le focus sur l'input
  useEffect(() => {
    if (!isDisabled) {
      ref.current?.focus();
    }
  }, [isDisabled, isEffectivelyVisible]);

  useEffect(() => {
    if (answer === true) {
      setIsDisabled(true);
      setFeedbackClass('label--true');
    } else if (answer === false) {
      setIsDisabled(true);
      setFeedbackClass('label--false');
      if (errorTimerRef.current === null) {
        errorTimerRef.current = setTimeout(() => {
          setCurrentInput('');
          setCursorPosition(0);
          if (syllabIndexes) {
            const initialDisplay = correctAnswer
                .split('')
                .map((char, index) => {
                  if (
                      indexSyllab !== undefined &&
                      index >= indexSyllab &&
                      index <= syllabEndIndex
                  ) {
                    return '_';
                  }
                  return char;
                })
                .join('');
            setDisplayValue(initialDisplay);
          } else {
            setDisplayValue('_'.repeat(correctAnswer.length));
          }
          errorTimerRef.current = null;
        }, 2000);
      }
    } else if (answer === null) {
      setFeedbackClass('');
      setIsDisabled(false);
    }
  }, [answer]);

  // nouvelle réponse
  useEffect(() => {
    if (measureRef.current) {
      const width = measureRef.current.offsetWidth === 0 ? 1 : measureRef.current.offsetWidth;
      // crée un bug lorsqu'on tape un caractère composé de ^ ou ¨ avec un width de 0
      setInputWidth(`${width}px`);
    }
    ref.current?.focus();
    setCurrentInput(hasUnderscorePrefix ? '_' : '');
    setCursorPosition(0);
  }, [correctAnswer]);

  // mise à jour de la position du curseur
  useEffect(() => {
    if (ref.current && !isDisabled) {
      const adjustedPos = hasUnderscorePrefix
          ? cursorPosition + 1
          : cursorPosition;
      ref.current.selectionStart = adjustedPos;
      ref.current.selectionEnd = adjustedPos;
    }
  }, [cursorPosition, isDisabled, hasUnderscorePrefix]);

  // Mesures des dimensions du conteneur de texte et du premier caractère
  useEffect(() => {
    // Si le composant n'est pas visible, ou si le conteneur de texte n'est pas encore référencé,
    // ou si la valeur à afficher est vide (aucun caractère à mesurer),
    // alors les mesures ne sont pas considérées comme faites.
    if (!isEffectivelyVisible || !textContainerRef.current || displayValue.length === 0) {
      setMeasuresDone(false);
      return; // Sortie anticipée
    }

    // À ce stade, le composant est visible, a un conteneur de texte, et a du contenu à afficher.
    // Nous utilisons requestAnimationFrame pour attendre le prochain cycle de peinture du navigateur.
    // Cela donne au navigateur le temps de calculer le layout des éléments DOM,
    // en particulier s'ils viennent de devenir visibles.
    const animationFrameId = requestAnimationFrame(() => {
      // Il est bon de re-vérifier les conditions ici, au cas où l'état aurait changé
      // très rapidement entre le moment où le rAF a été demandé et son exécution.
      if (!isEffectivelyVisible || !textContainerRef.current || displayValue.length === 0) {
        setMeasuresDone(false);
        return;
      }

      // Vérifier si la ref du premier caractère est disponible.
      // charRefs.current est peuplé lors du rendu de displayValue.
      const firstCharRef = charRefs.current[0];

      if (firstCharRef) {
        const containerRect = textContainerRef.current.getBoundingClientRect();
        const firstCharRect = firstCharRef.getBoundingClientRect();

        // Les mesures sont considérées comme prêtes si le conteneur de texte
        // et le premier caractère ont des dimensions physiques valides (par exemple, une largeur > 0).
        if (containerRect.width > 0 && firstCharRect.width > 0) {
          setMeasuresDone(true);
        } else {
          // Les dimensions sont encore nulles ou invalides.
          // Cela peut se produire si l'élément est toujours caché d'une manière ou d'une autre,
          // ou si le layout n'est pas encore complètement finalisé.
          setMeasuresDone(false);
        }
      } else {
        // displayValue n'est pas vide, mais charRefs.current[0] n'existe pas.
        // Cela pourrait indiquer un décalage ou un cas imprévu.
        // Par sécurité, on considère les mesures comme non prêtes.
        setMeasuresDone(false);
      }
    });

    // Nettoyage : annuler le requestAnimationFrame si le composant est démonté
    // ou si les dépendances du useEffect changent avant son exécution.
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [displayValue, isEffectivelyVisible]);

    // HANDLERS

  const handleInputChange = (event) => {
    let newInput = event.target.value;

    const selectionStart = event.target.selectionStart;

    if (hasUnderscorePrefix && !newInput.startsWith('_')) {
      newInput = '_' + newInput.replace(/^_/, '');
    }

    if (syllabIndexes) {
      if (newInput.length > (hasUnderscorePrefix ? 1 : 0) + syllab.length)
        return;
      setCurrentInput(newInput);

      const newDisplay = correctAnswer
        .split('')
        .map((char, index) => {
          if (
            indexSyllab !== undefined &&
            index >= indexSyllab &&
            index <= syllabEndIndex
          ) {
            const syllabPosition = index - indexSyllab;
            if (
              syllabPosition <
              newInput.length - (hasUnderscorePrefix ? 1 : 0)
            ) {
              return newInput[syllabPosition + (hasUnderscorePrefix ? 1 : 0)];
            }
            return '_';
          }
          return char;
        })
        .join('');

      setDisplayValue(newDisplay);
    } else {
      if (newInput.length > correctAnswer.length) return;
      setCurrentInput(newInput);

      const newDisplay = correctAnswer
        .split('')
        .map((_, index) => {
          if (index < newInput.length) {
            return newInput[index];
          }
          return '_';
        })
        .join('');

      setDisplayValue(newDisplay);
    }

    const newCursorPos = selectionStart - (hasUnderscorePrefix ? 1 : 0);
    setCursorPosition(Math.max(0, newCursorPos));
  };

  const handleKeyDown = (e) => {
    if (isDisabled) return;

    const currentPos = cursorPosition;
    const maxPos = syllabIndexes ? syllab.length : currentInput.length;

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        if (currentPos > 0 || (hasUnderscorePrefix && currentPos > -1)) {
          setCursorPosition(Math.max(0, currentPos - 1));
        }
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (currentPos < maxPos) {
          setCursorPosition(Math.min(maxPos, currentPos + 1));
        }
        break;
      case 'Home':
        e.preventDefault();
        setCursorPosition(0);
        break;
      case 'End':
        e.preventDefault();
        setCursorPosition(currentInput.length - (hasUnderscorePrefix ? 1 : 0));
        break;
      case 'Backspace':
        if (hasUnderscorePrefix && currentPos === 0) {
          e.preventDefault();
        } else if (currentPos > 0) {
          e.preventDefault();

          const prefixAdjustment = hasUnderscorePrefix ? 1 : 0;

          const beforeDelete = currentInput.substring(
            0,
            currentPos - 1 + prefixAdjustment
          );

          const afterDelete = currentInput.substring(
            currentPos + prefixAdjustment
          );

          const newValue = beforeDelete + afterDelete;
          setCurrentInput(newValue);

          setCursorPosition(currentPos - 1);

          updateDisplayValue(newValue);
        }
        break;
    }
  };

  const handleDisplayClick = () => {
    if (!isDisabled) {
      ref.current?.focus();
    }
  };

  const handleCharClick = (index) => {
    if (isDisabled) return;
    ref.current?.focus();
    if (syllabIndexes) {
      if (index >= indexSyllab && index <= syllabEndIndex) {
        setCursorPosition(index + 1 - indexSyllab);
      }
    } else {
      setCursorPosition(index + 1);
    }
  };

  // Update display value based on user input

  const updateDisplayValue = (input) => {
    if (syllabIndexes) {
      const newDisplay = correctAnswer
        .split('')
        .map((char, index) => {
          if (
            indexSyllab !== undefined &&
            index >= indexSyllab &&
            index <= syllabEndIndex
          ) {
            const syllabPosition = index - indexSyllab;
            if (syllabPosition < input.length - (hasUnderscorePrefix ? 1 : 0)) {
              return input[syllabPosition + (hasUnderscorePrefix ? 1 : 0)];
            }
            return '_';
          }
          return char;
        })
        .join('');

      setDisplayValue(newDisplay);
    } else {
      const newDisplay = correctAnswer
        .split('')
        .map((_, index) => {
          if (index < input.length) {
            return input[index];
          }
          return '_';
        })
        .join('');

      setDisplayValue(newDisplay);
    }

    if (syllabIndexes) {
      if (input.length === 0) {
        setUserInput('');
        return;
      }

      const beforeSyllab = correctAnswer.substring(0, indexSyllab);
      const afterSyllab = correctAnswer.substring(syllabEndIndex + 1);
      const fullWord = beforeSyllab + input + afterSyllab;

      setUserInput(fullWord);
    } else {
      setUserInput(input);
    }
  };

  // Callbacks

  const calculateCursorPosition = useCallback(() => {
    if (syllabIndexes) {
      if (cursorPosition >= syllab.length) {
        const endSyllabCharRef = charRefs.current[syllabEndIndex];
        if (endSyllabCharRef && textContainerRef.current) {
          const containerRect =
            textContainerRef.current.getBoundingClientRect();
          const endCharRect = endSyllabCharRef.getBoundingClientRect();
          return `${endCharRect.right - containerRect.left}px`;
        }
      }

      const cursorIndex =
        indexSyllab !== undefined && cursorPosition < syllab.length
          ? indexSyllab + cursorPosition
          : syllabEndIndex;

      const currentCharRef = charRefs.current[cursorIndex];
      if (!currentCharRef || !textContainerRef.current) return '0px';

      const containerRect = textContainerRef.current.getBoundingClientRect();
      const charRect = currentCharRef.getBoundingClientRect();
      return `${charRect.left - containerRect.left}px`;
    } else {
      if (currentInput.length === 0) {
        const firstCharRef = charRefs.current[0];
        if (firstCharRef && textContainerRef.current) {
          const containerRect =
            textContainerRef.current.getBoundingClientRect();
          const firstCharRect = firstCharRef.getBoundingClientRect();
          return `${firstCharRect.left - containerRect.left}px`;
        }
        return '0px';
      }

      if (cursorPosition >= currentInput.length) {
        const lastInputIndex = Math.max(0, currentInput.length - 1);
        const lastCharRef = charRefs.current[lastInputIndex];

        if (lastCharRef && textContainerRef.current) {
          const containerRect =
            textContainerRef.current.getBoundingClientRect();
          const lastCharRect = lastCharRef.getBoundingClientRect();
          return `${lastCharRect.right - containerRect.left}px`;
        }
        return '100%';
      }

      const currentCharRef = charRefs.current[cursorPosition];
      if (!currentCharRef || !textContainerRef.current) return '0px';

      const containerRect = textContainerRef.current.getBoundingClientRect();
      const charRect = currentCharRef.getBoundingClientRect();
      return `${charRect.left - containerRect.left}px`;
    }
  }, [
    cursorPosition,
    indexSyllab,
    syllabEndIndex,
    syllabIndexes,
    currentInput,
    syllab,
  ]);

  return (
    <div
      className={`label font-regular rounded-2xl relative flex flex-col items-center px-12 ${
        isSelected ? 'label--selected' : ''
      } ${feedbackClass}`}
      onClick={handleDisplayClick}
    >
      <span
        ref={measureRef}
        className='tracking-widest opacity-0 absolute whitespace-pre'
        style={{ fontFamily: 'inherit', fontSize: 'inherit' }}
      >
        {correctAnswer}
      </span>

      <input
        ref={ ref }
        type='text'
        value={currentInput}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className='font-regular border-none bg-transparent outline-none inputLabel opacity-0 absolute}'
        autoFocus
        disabled={isDisabled}
        style={{
          width: inputWidth,
          userSelect: 'none',
          zIndex: -999,
          pointerEvents: 'none',
        }}
      />
      <div
        className='display-text inputLabel relative'
        ref={textContainerRef}
        style={{ cursor: isDisabled ? 'default' : 'text' }}
      >
        {displayValue.split('').map((char, index) => {
          return (
            <span
              key={`char-${index}`}
              ref={(el) => (charRefs.current[index] = el)}
              style={{ cursor: isDisabled ? 'default' : 'text', zIndex: 100 }}
              onClick={() => {
                handleCharClick(index);
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          );
        })}

        {!isDisabled && measuresDone && isEffectivelyVisible && (
          <div
            className='text-cursor'
            style={{
              position: 'absolute',
              height: '1.2em',
              width: '1px',
              backgroundColor: 'black',
              left: calculateCursorPosition(),
              top: '0',
            }}
          />
        )}
      </div>
    </div>
  );
});

export default InputLabel;
