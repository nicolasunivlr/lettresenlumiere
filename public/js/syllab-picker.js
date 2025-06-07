const contentInput = document.getElementById('Contenu_contenu');
const syllabInput = document.getElementById('Contenu_syllabes');
// Cache le champ Syllabe
const backgroundColor = '#ff9090';

if (syllabInput) {
  const parentCol = syllabInput.closest('.col-md-6');
  if (parentCol) {
    parentCol.style.display = 'none';
  }
  syllabInput.style.display = 'none';
}

// Recupere le container des rows du form
const rowForm = contentInput.closest('.row');
const row5 = rowForm.children[5];
// Créer le nouveau champ
const syllabPickerContainer = document.createElement('div');
syllabPickerContainer.style.marginBottom = '20px';

const label = document.createElement('label');
label.classList.add('form-control-label');
label.textContent =
  'Choisir la syllabe manquante (deux clics), clic droit pour annuler';
label.style.fontWeight = '500';
label.style.marginBottom = '10px';
syllabPickerContainer.appendChild(label);
row5.appendChild(syllabPickerContainer);
const exerciceSelect = document.getElementById('Contenu_exercices');

syllabPickerContainer.addEventListener('contextmenu', (event) => {
  event.preventDefault();
  syllabInput.value = '';
  console.log('right click', event);
  handleClick(null, event);
});

const verifySelection = () => {
  if (!exerciceSelect) return;
  const checkboxes = exerciceSelect.querySelectorAll(
    '.form-check input[type="checkbox"]'
  );
  let showSyllabPicker = false;

  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      const label = checkbox.nextElementSibling;
      if (
        label &&
        (label.textContent === 'C.2 bis' || label.textContent === 'E.2 bis')
      ) {
        showSyllabPicker = true;
      }
    }
  });

  syllabPickerContainer.style.display = showSyllabPicker ? 'block' : 'none';
};

verifySelection();

exerciceSelect.addEventListener('change', () => {
  console.log(exerciceSelect);
  verifySelection();
});

const lettersContainer = document.createElement('div');
lettersContainer.style.display = 'grid';
lettersContainer.style.gridTemplateColumns = 'repeat(auto-fill, 30px)';
lettersContainer.style.gap = '5px';

// Gérer la couleurs de fond
let firstLetter;

let clicked = false;

/**
 * Applique la coloration aux syllabes sauvegardées
 * Cette fonction est optimisée pour s'exécuter lorsque les cellules sont disponibles
 */
const applySavedSyllables = () => {
  if (!syllabInput || syllabInput.value === '') return;

  const syllabValues = syllabInput.value.split('-');
  if (syllabValues.length !== 2) return;

  // Convertir en nombres pour gérer les comparaisons et la plage
  const start = parseInt(syllabValues[0], 10);
  const end = parseInt(syllabValues[1], 10);

  if (isNaN(start) || isNaN(end)) return;

  // Vérifier si les éléments existent avant d'appliquer la coloration
  const startElement = document.getElementById(start);
  const endElement = document.getElementById(end);

  if (!startElement || !endElement) return;

  // Appliquer la coloration à toute la plage
  for (let i = start; i <= end; i++) {
    const element = document.getElementById(i);
    if (element) {
      element.style.backgroundColor = backgroundColor;
    }
  }

  // Mettre à jour l'état
  firstLetter = start;
  clicked = true;
};

const handleClick = (id, event) => {
  if (event.type === 'click') {
    if (clicked) {
      return;
    }
    if (firstLetter === undefined) {
      firstLetter = id;
      document.getElementById(id).style.backgroundColor = backgroundColor;
    } else {
      let secondLetter = id;
      if (secondLetter < firstLetter) {
        // Inverse les indices
        const temp = firstLetter;
        firstLetter = secondLetter;
        secondLetter = temp;
      }
      for (let i = firstLetter; i <= secondLetter; i++) {
        document.getElementById(i).style.backgroundColor = backgroundColor;
      }
      clicked = true;
      // Met à jour la valeur pour que l'ordre soit croissant
      syllabInput.value = `${firstLetter}-${secondLetter}`;
    }
  }
  if (event.type === 'contextmenu') {
    clicked = false;
    firstLetter = undefined;
    for (let i = 0; i <= lettersContainer.children.length; i++) {
      if (document.getElementById(i)) {
        document.getElementById(i).style.backgroundColor = '';
      }
    }
  }
};

let cellObjects = [];
let number = false;

/**
 * Crée les cellules de lettres et applique les syllabes sauvegardées
 */
const createCellsAndApplySyllables = () => {
  lettersContainer.innerHTML = '';
  cellObjects = Array.from(contentInput.value).map((letterValue, index) => ({
    letter: letterValue,
    id: index,
  }));

  cellObjects.forEach((cellObject) => {
    syllabPickerContainer.appendChild(lettersContainer);

    const cell = document.createElement('div');
    cell.style.border = '1px solid #ccc';
    cell.style.padding = '5px';
    cell.style.textAlign = 'center';
    cell.style.cursor = 'pointer';
    cell.style.fontSize = '2em';
    cell.textContent = cellObject.letter;
    cell.id = cellObject.id;
    lettersContainer.appendChild(cell);

    cell.addEventListener('click', (event) => {
      if (!clicked) {
        switch (number) {
          case false:
            syllabInput.value += cellObject.id;
            number = true;
            break;
          case true:
            syllabInput.value += `-${cellObject.id}`;
            number = false;
            break;
          default:
            break;
        }
      }
      handleClick(cellObject.id, event);
    });
  });

  // Appliquer les syllabes sauvegardées une fois que toutes les cellules sont créées
  applySavedSyllables();
};

// Initialiser les cellules
createCellsAndApplySyllables();

// Gérer l'affichage des cells à chaque input
contentInput.addEventListener('input', () => {
  // Réinitialiser l'état puisque le contenu change
  clicked = false;
  firstLetter = undefined;
  createCellsAndApplySyllables();
});

// Observer les changements de valeur dans syllabInput
// Utile si la valeur est modifiée par d'autres scripts
syllabInput.addEventListener('change', applySavedSyllables);

// S'assurer que la coloration est appliquée une fois le DOM complètement chargé
document.addEventListener('DOMContentLoaded', () => {
  // Court délai pour s'assurer que toutes les cellules sont rendues
  requestAnimationFrame(applySavedSyllables);
});
