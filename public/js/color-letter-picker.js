document.addEventListener('DOMContentLoaded', function () {
  console.log('color-letter-picker.js loaded');

  const contentInput = document.getElementById('Contenu_contenu');
  if (!contentInput) {
    console.error('Champ contenu introuvable');
    return;
  }

  // Initialiser une seule fois au chargement de la page
  initializeLetterPickers();

  // Réagir aux changements du contenu principal
  contentInput.addEventListener('input', function () {
    // Réinitialiser et recréer les sélecteurs après modification du contenu
    initializeLetterPickers();
  });

  // Observer les changements dans le DOM pour détecter les nouveaux champs ajoutés
  const contentObserver = new MutationObserver(function (mutations) {
    let shouldInit = false;

    mutations.forEach(function (mutation) {
      // Vérifier si des éléments ont été ajoutés
      if (mutation.addedNodes.length > 0) {
        // Regarder les éléments ajoutés et vérifier s'ils contiennent des champs de lettres
        mutation.addedNodes.forEach(function (node) {
          if (node.nodeType === 1) {
            // Node.ELEMENT_NODE
            if (
              node.querySelector &&
              node.querySelector('input[id$="_lettres"]')
            ) {
              shouldInit = true;
            }
          }
        });
      }
    });

    if (shouldInit) {
      console.log('Nouveaux champs détectés, initialisation des sélecteurs...');
      setTimeout(initializeLetterPickers, 50);
    }
  });

  // Observer tout le formulaire pour détecter les changements
  const formElement = document.querySelector('form[name="Contenu"]');
  if (formElement) {
    contentObserver.observe(formElement, {
      childList: true,
      subtree: true,
    });
  }

  // Surveiller explicitement les boutons d'ajout de collection
  document.addEventListener('click', function (event) {
    if (
      event.target.classList.contains('collection-add') ||
      event.target.closest('.collection-add')
    ) {
      console.log("Bouton d'ajout de collection cliqué");
      // Attendre que le DOM soit mis à jour après l'ajout
      setTimeout(function () {
        console.log('Initialisation des sélecteurs après ajout...');
        initializeLetterPickers();
      }, 100);
    }
  });

  function initializeLetterPickers() {
    // Supprimer les sélecteurs existants
    document
      .querySelectorAll('.letter-picker-container')
      .forEach((el) => el.remove());

    // Chercher tous les champs de lettres
    const lettresInputs = document.querySelectorAll('input[id$="_lettres"]');
    console.log(`Trouvé ${lettresInputs.length} champs de lettres`);

    lettresInputs.forEach(function (input) {
      const formGroup = input.closest('.form-group');
      if (formGroup) {
        // Cacher le champ et son label
        const label = formGroup.querySelector('label');
        if (label) label.style.display = 'none';
        input.style.display = 'none';

        // Cacher le texte d'aide
        const helpText = formGroup.querySelector('.form-help');
        if (helpText) helpText.style.display = 'none';

        // Créer le sélecteur de lettres s'il n'existe pas déjà
        if (!formGroup.querySelector('.letter-picker-container')) {
          createLetterPicker(input, formGroup);
        }
      }
    });
  }

  function createLetterPicker(input, parent) {
    // Trouver le sélecteur de couleur associé à ce groupe
    const formRow =
      parent.closest('.form-row') ||
      parent.closest('.row') ||
      parent.closest('.collection-item');
    const colorSelect = formRow
      ? formRow.querySelector('.couleur-select')
      : null;

    // Conteneur principal
    const letterPickerContainer = document.createElement('div');
    letterPickerContainer.classList.add('letter-picker-container');
    letterPickerContainer.style.marginBottom = '15px';
    letterPickerContainer.style.marginTop = '10px';
    letterPickerContainer.style.padding = '10px';
    letterPickerContainer.style.border = '1px solid #ddd';
    letterPickerContainer.style.borderRadius = '4px';
    letterPickerContainer.style.backgroundColor = '#f9f9f9';

    // Label pour les instructions
    const label = document.createElement('label');
    label.textContent =
      'Cliquez sur une lettre puis sur une autre pour sélectionner une plage';
    label.style.fontWeight = '500';
    label.style.marginBottom = '10px';
    label.style.display = 'block';
    letterPickerContainer.appendChild(label);

    // Conteneur de lettres
    const lettersContainer = document.createElement('div');
    lettersContainer.style.display = 'grid';
    lettersContainer.style.gridTemplateColumns = 'repeat(auto-fill, 30px)';
    lettersContainer.style.gap = '5px';
    letterPickerContainer.appendChild(lettersContainer);

    // Note pour le clic droit
    const note = document.createElement('small');
    note.textContent = 'Clic droit pour annuler la sélection';
    note.style.display = 'block';
    note.style.color = '#666';
    note.style.marginTop = '5px';
    letterPickerContainer.appendChild(note);

    // Insérer notre sélecteur dans le DOM
    parent.appendChild(letterPickerContainer);

    // Variables pour garder l'état de la sélection
    let firstLetter = null;
    let isFirstSelection = true;

    // Générer les cellules de lettres
    generateLetterCells();

    // Observer les changements du select de couleur
    if (colorSelect) {
      colorSelect.addEventListener('change', function () {
        // Réappliquer la couleur aux lettres si une sélection existe déjà
        if (input.value) {
          applyExistingSelection(input.value);
        }
      });
    }

    // Clic droit pour réinitialiser la sélection
    letterPickerContainer.addEventListener('contextmenu', function (event) {
      event.preventDefault();
      resetSelection();
    });

    // Fonctions internes au sélecteur
    function generateLetterCells() {
      lettersContainer.innerHTML = '';
      const contentText = contentInput.value;

      if (!contentText || contentText.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.textContent = "Veuillez d'abord saisir du contenu";
        emptyMessage.style.padding = '10px';
        emptyMessage.style.color = '#666';
        lettersContainer.appendChild(emptyMessage);
        return;
      }

      Array.from(contentText).forEach((letter, index) => {
        const cell = document.createElement('div');
        cell.classList.add('letter-cell');
        cell.style.border = '1px solid #ccc';
        cell.style.padding = '5px';
        cell.style.textAlign = 'center';
        cell.style.cursor = 'pointer';
        cell.style.userSelect = 'none';
        cell.style.backgroundColor = 'white';
        cell.style.fontSize = '1.2em';
        cell.textContent = letter;
        cell.dataset.index = index;

        lettersContainer.appendChild(cell);

        // Gestionnaire de clic
        cell.addEventListener('click', function (e) {
          handleCellClick(index, this);
        });
      });

      // Appliquer la sélection existante s'il y en a une
      if (input.value) {
        applyExistingSelection(input.value);
      }
    }

    function getSelectedColor() {
      if (!colorSelect) return '#ffcd85'; // Couleur par défaut

      // Récupérer la couleur depuis l'option sélectionnée
      const selectedOption = colorSelect.options[colorSelect.selectedIndex];
      if (selectedOption && selectedOption.dataset.color) {
        return selectedOption.dataset.color;
      }

      return '#ffcd85'; // Couleur par défaut si pas de sélection
    }

    function handleCellClick(index, cell) {
      if (isFirstSelection) {
        // Premier clic: sélectionner cette lettre
        resetCellHighlighting();
        firstLetter = index;
        highlightCell(cell);
        input.value = index.toString();
        isFirstSelection = false;
      } else {
        // Second clic: sélectionner une plage
        const startIndex = Math.min(firstLetter, index);
        const endIndex = Math.max(firstLetter, index);

        // Réinitialiser l'affichage
        resetCellHighlighting();

        // Mettre en évidence toute la plage
        for (let i = startIndex; i <= endIndex; i++) {
          const cellToHighlight = lettersContainer.querySelector(
            `[data-index="${i}"]`
          );
          if (cellToHighlight) {
            highlightCell(cellToHighlight);
          }
        }

        // Mettre à jour la valeur du champ
        if (startIndex === endIndex) {
          input.value = startIndex.toString();
        } else {
          input.value = `${startIndex}-${endIndex}`;
        }

        // Réinitialiser pour une nouvelle sélection
        isFirstSelection = true;
      }
    }

    function highlightCell(cell) {
      const color = getSelectedColor();
      cell.style.backgroundColor = color;
      cell.style.color = isLightColor(color) ? 'black' : 'white';
      cell.style.fontWeight = 'bold';
      cell.style.border = `2px solid ${adjustColorBrightness(color, -30)}`;
    }

    function resetCellHighlighting() {
      lettersContainer.querySelectorAll('.letter-cell').forEach((cell) => {
        cell.style.backgroundColor = 'white';
        cell.style.color = 'black';
        cell.style.fontWeight = '';
        cell.style.border = '1px solid #ccc';
      });
    }

    function applyExistingSelection(value) {
      const match = value.match(/^(\d+)(?:-(\d+))?$/);
      if (!match) return;

      const start = parseInt(match[1]);
      const end = match[2] ? parseInt(match[2]) : start;

      // Si c'est une plage, on considère que la sélection est complète
      isFirstSelection = true;
      firstLetter = start;

      // Mettre en évidence les lettres sélectionnées
      for (let i = start; i <= end; i++) {
        const cell = lettersContainer.querySelector(`[data-index="${i}"]`);
        if (cell) {
          highlightCell(cell);
        }
      }
    }

    function resetSelection() {
      resetCellHighlighting();
      input.value = '';
      firstLetter = null;
      isFirstSelection = true;
    }

    // Détermine si une couleur est claire ou foncée
    function isLightColor(color) {
      let r, g, b;
      if (color.startsWith('#')) {
        const hex = color.substring(1);
        r = parseInt(hex.substr(0, 2), 16);
        g = parseInt(hex.substr(2, 2), 16);
        b = parseInt(hex.substr(4, 2), 16);
      } else {
        return true;
      }

      const yiq = (r * 299 + g * 587 + b * 114) / 1000;
      return yiq >= 128;
    }

    // Ajuster la luminosité d'une couleur (pour la bordure)
    function adjustColorBrightness(color, amount) {
      let hex = color;
      if (hex.startsWith('#')) {
        hex = hex.substring(1);
      }

      let r = parseInt(hex.substr(0, 2), 16);
      let g = parseInt(hex.substr(2, 2), 16);
      let b = parseInt(hex.substr(4, 2), 16);

      r = Math.max(0, Math.min(255, r + amount));
      g = Math.max(0, Math.min(255, g + amount));
      b = Math.max(0, Math.min(255, b + amount));

      return `#${r
        .toString(16)
        .padStart(
          2,
          '0'
        )}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
  }
});
