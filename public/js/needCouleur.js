//import BASE_ROUTE from './env.js';
const BASE_ROUTE = ''
// Sélecteurs plus spécifiques pour le formulaire
const color = document.querySelector('form .field-color');
const fieldSelect = document.querySelector('form .field-select');
const needCouleur = document.getElementById('Contenu_needCouleur');
const inputColor = document.getElementById('Contenu_couleur_code');
const selectValue = document.getElementById('Contenu_existingCouleur');
const createColor =
  document.getElementById('Contenu_newCouleur')?.parentElement;
const createColorInput = document.getElementById('Contenu_newCouleur');
const existingColor = document.getElementById('Contenu_couleur_bold')
  ?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement
  ?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement;
const letterInput = document.getElementById('Contenu_couleur_lettres')
  ?.parentElement?.parentElement;

document.addEventListener('DOMContentLoaded', async () => {
  const getContentIdFromUrl = () => {
    const urlPattern = /\/admin\/contenu\/(\d+)\/edit/;
    const match = window.location.pathname.match(urlPattern);
    return match ? match[1] : null;
  };

  // Extraction simplifiée du code couleur
  const getColorHex = (data) => {
    if (data.value?.includes('#')) return data.value.split(' ')[0];
    if (data.label?.includes('#')) return data.label.split(' ')[0];
    return '000000';
  };

  // Récupération du texte (5ᵉ segment ou 'Choisissez votre couleur')
  const getLabelPart = (data) =>
    data.label?.split(' ')[1] === 'une'
      ? 'Choisissez votre couleur'
      : data.label.split(' ')[1];

  // Remove this redeclaration of selectValue
  existingColor.style.display = 'none';
  createColor.style.display = 'none';
  console.log(createColorInput);

  if (!selectValue) return;

  // Initialisation de Choices.js dès le début
  const choicesInstance = new Choices(selectValue, {
    searchEnabled: true,
    searchFields: ['label'],
    searchPlaceholderValue: 'Rechercher une lettre...',

    callbackOnCreateTemplates(template) {
      return {
        item: (classNames, data) => {
          const colorHex = getColorHex(data);
          return template(`
            <div class="${classNames.item} ${
            data.highlighted
              ? classNames.highlightedState
              : classNames.itemSelectable
          }"
                 data-item data-id="${data.id}" data-value="${data.value}">
              <span class="color-preview" style="background-color: ${colorHex} !important;"></span>
              <span style="color: ${colorHex}">${getLabelPart(data)}</span>
            </div>
          `);
        },
        choice: (classNames, data) => {
          const colorHex = getColorHex(data);
          return template(`
            <div class="${classNames.item} ${classNames.itemChoice} ${
            data.disabled ? classNames.itemDisabled : classNames.itemSelectable
          }"
                 data-choice data-id="${data.id}" data-value="${
            data.value
          }" data-select-text="${data.customProperties?.selectText || ''}"
                 ${
                   data.disabled
                     ? 'data-choice-disabled aria-disabled="true"'
                     : 'data-choice-selectable'
                 }>
              <span class="color-preview" style="background-color: ${colorHex} !important;"></span>
             ${
               getLabelPart(data) !== 'Choisissez votre couleur'
                 ? `<span style="color: ${colorHex}">${getLabelPart(
                     data
                   )}</span>`
                 : ''
             }
             
            </div>
          `);
        },
      };
    },
  });

  try {
    const contentId = getContentIdFromUrl();
    const response = await fetch(`${BASE_ROUTE}/api/contenus/${contentId}`);
    const data = await response.json();
    if (data && data.codeCouleur) {
      needCouleur.checked = true;
      fieldSelect.style.display = 'block';
      createColor.style.display = 'block';

      console.log('Couleur récupérée:', data.codeCouleur, data.lettresCouleur);

      // Parcourir toutes les options disponibles pour trouver la correspondance
      const allOptions = choicesInstance.config.choices;
      console.log('Options disponibles:', allOptions);

      // Rechercher parmi les options de Choices.js
      const matchingOption = Array.from(selectValue.options).find((option) => {
        const optionText = option.textContent.trim();
        const expectedText =
          `${data.codeCouleur} ${data.lettresCouleur}`.trim();
        console.log(`Comparaison: "${optionText}" vs "${expectedText}"`);
        return optionText === expectedText;
      });

      if (matchingOption) {
        console.log(
          'Option trouvée:',
          matchingOption.value,
          matchingOption.textContent
        );
        // Utiliser l'API de Choices.js pour définir la valeur
        choicesInstance.setChoiceByValue(matchingOption.value);
      } else {
        console.log('Aucune option correspondante trouvée');
      }
    }
  } catch (error) {
    console.error('Erreur lors du chargement des données :', error);
  }
});

// Declare selectedText at a higher scope
let selectedText = '';

selectValue?.addEventListener('change', () => {
  console.log('test', selectValue.value);
  console.log('ta capté', selectValue.value === '');
  selectedText = selectValue.options[selectValue.selectedIndex]?.text || '';
  if (selectValue.value === '') {
    letterInput.style.display = 'block';
    inputColor.value = '#000000';
  } else {
    const colorHex = selectedText.split(' ')[1];
    inputColor.value = colorHex;
    letterInput.style.display = 'none';
  }
});

inputColor?.addEventListener('click', (ev) => {
  if (selectValue.value !== '') {
    ev.preventDefault();
  }
});

if (color?.closest('form') && color.style) {
  color.style.display = 'none';
}
if (fieldSelect?.closest('form') && fieldSelect.style) {
  fieldSelect.style.display = 'none';
}

needCouleur?.addEventListener('change', () => {
  if (needCouleur.checked === true) {
    color.style.display = 'none';
    existingColor.style.display = 'none';
    fieldSelect.style.display = 'block';
    createColor.style.display = 'block';
  } else {
    color.style.display = 'none';
    fieldSelect.style.display = 'none';
    existingColor.style.display = 'none';
    createColor.style.display = 'none';
  }
});

createColorInput?.addEventListener('change', () => {
  if (createColorInput.checked === true) {
    console.log(createColorInput.checked);
    console.log('fieldSelect', fieldSelect);
    console.log('color', color);
    color.style.display = 'block';
    fieldSelect.style.display = 'none';
    existingColor.style.display = 'block';
  } else {
    color.style.display = 'block';
    fieldSelect.style.display = 'block';
    existingColor.style.display = 'none';
  }
});
