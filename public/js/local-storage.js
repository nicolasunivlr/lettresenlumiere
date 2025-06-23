const saveLabel = document.querySelector(
  '#ea-edit-Contenu-1562 > div > section > div > article > section.content-header > div.page-actions > button.action-saveAndReturn.btn.btn-primary.action-save > span > span'
);
const currentUrl = window.location.href;
const isEditPage = currentUrl.includes('/edit');
//console.log(isEditPage);
if (!isEditPage) {
  const createButtonAndAddNewElement = document.getElementsByClassName(
    'action-saveAndAddAnother'
  )[0];

  const createButton = document.getElementsByClassName(
    'action-saveAndReturn'
  )[0];

  // Set the sequence value from localStorage if available
  const sequenceValue = localStorage.getItem('sequenceValue');
  if (sequenceValue) {
    const sequenceField = document.querySelector(
      'select[name="Contenu[sequence]"]'
    );
    if (sequenceField) {
      sequenceField.value = sequenceValue;
    }
  }
  /**
   * Applique les valeurs sauvegardées des cases à cocher depuis le localStorage
   */
  const applyStoredCheckboxValues = () => {
    const storedExercices = localStorage.getItem('exercicesCheckboxesChecked');
    if (!storedExercices) return;

    const checkedValues = JSON.parse(storedExercices);
    const exercicesCheckboxes = document.querySelectorAll(
      'input[name="Contenu[exercices][]"]'
    );

    if (Array.from(exercicesCheckboxes).some((checkbox) => checkbox.checked))
      return;

    exercicesCheckboxes.forEach((checkbox) => {
      if (checkedValues.includes(checkbox.value)) {
        checkbox.checked = true;
        // Déclencher l'événement change pour mettre à jour l'UI
        checkbox.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
  };

  /**
   * Initialise un observateur pour détecter quand les cases à cocher sont ajoutées au DOM
   */
  const initializeCheckboxObserver = () => {
    if (!localStorage.getItem('exercicesCheckboxesChecked')) return;

    // Fonction qui vérifie si les checkboxes existent et applique les valeurs si c'est le cas
    const checkForCheckboxes = () => {
      const exercicesCheckboxes = document.querySelectorAll(
        'input[name="Contenu[exercices][]"]'
      );

      if (exercicesCheckboxes.length > 0) {
        applyStoredCheckboxValues();
        // On peut arrêter d'observer une fois que les cases à cocher sont trouvées
        observer.disconnect();
      }
    };

    // Créer un observateur qui surveille les changements dans le DOM
    const observer = new MutationObserver(checkForCheckboxes);

    // Observer le corps du document pour détecter tout changement dans la structure du DOM
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Vérifier immédiatement au cas où les cases à cocher seraient déjà présentes
    checkForCheckboxes();
  };

  // Initialiser l'observateur lorsque le DOM est chargé
  document.addEventListener('DOMContentLoaded', initializeCheckboxObserver);

  // Lorsque l'on valide avec le bouton "Créer et ajouter un nouvel élément" et "Créer"
  createButtonAndAddNewElement.addEventListener('click', (e) => {
    const sequenceField = document.querySelector(
      'select[name="Contenu[sequence]"]'
    );
    const sequenceValue = sequenceField.value;
    // Ajoute la séquence sélectionnée dans le local storage pour la réutiliser lors de la création d'un autre contenu
    localStorage.setItem('sequenceValue', sequenceValue);

    const exercicesCheckboxes = document.querySelectorAll(
      'input[name="Contenu[exercices][]"]'
    );
    console.log(exercicesCheckboxes);
    const exercicesCheckboxesChecked = Array.from(exercicesCheckboxes).filter(
      (checkbox) => checkbox.checked
    );
    console.log(exercicesCheckboxesChecked);
    localStorage.setItem(
      'exercicesCheckboxesChecked',
      JSON.stringify(
        exercicesCheckboxesChecked.map((checkbox) => checkbox.value)
      )
    );
  });
  createButton.addEventListener('click', (e) => {
    const sequenceField = document.querySelector(
      'select[name="Contenu[sequence]"]'
    );
    const sequenceValue = sequenceField.value;
    // Ajoute la séquence sélectionnée dans le local storage pour la réutiliser lors de la création d'un autre contenu
    localStorage.setItem('sequenceValue', sequenceValue);

    const exercicesCheckboxes = document.querySelectorAll(
      'input[name="Contenu[exercices][]"]'
    );
    console.log(exercicesCheckboxes);
    const exercicesCheckboxesChecked = Array.from(exercicesCheckboxes).filter(
      (checkbox) => checkbox.checked
    );
    console.log(exercicesCheckboxesChecked);
    localStorage.setItem(
      'exercicesCheckboxesChecked',
      JSON.stringify(
        exercicesCheckboxesChecked.map((checkbox) => checkbox.value)
      )
    );
  });
}
