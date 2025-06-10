import BASE_ROUTE from './env.js';
document.addEventListener('DOMContentLoaded', () => {
  const sequenceField = document.querySelector(
    'select[name="Contenu[sequence]"]'
  );
  const exerciceContainer = document.querySelector('.exercice-checkboxes');

  const updateExercices = async () => {
    const sequenceId = sequenceField.value;

    exerciceContainer.innerHTML = '';

    if (!sequenceId) {
      return;
    }

    try {
      const response = await fetch(
        `${BASE_ROUTE}/api/custom/sequences/${sequenceId}`
      );
      const data = await response.json();

      if (data && Array.isArray(data[0].exercices)) {
        // Ajout de la checkbox "Tous cocher"
        const selectAllDiv = document.createElement('div');
        selectAllDiv.className = 'form-check';

        const selectAllInput = document.createElement('input');
        selectAllInput.type = 'checkbox';
        selectAllInput.className = 'form-check-input';
        selectAllInput.id = 'select-all-exercices';

        const selectAllLabel = document.createElement('label');
        selectAllLabel.className = 'form-check-label';
        selectAllLabel.htmlFor = 'select-all-exercices';
        selectAllLabel.textContent = 'Sélectionner tous les exercices';

        selectAllDiv.appendChild(selectAllInput);
        selectAllDiv.appendChild(selectAllLabel);
        exerciceContainer.appendChild(selectAllDiv);

        const exercices = data[0].exercices;

        const contenuInput = document.getElementById('Contenu_contenu');
        contenuInput.focus();

        const contenuValue = contenuInput.value;

        exercices.forEach((exercice) => {
          const div = document.createElement('div');
          div.className = 'form-check';

          const input = document.createElement('input');
          input.type = 'checkbox';
          input.className = 'form-check-input';
          input.name = 'Contenu[exercices][]';
          input.value = exercice.exercice_id;
          input.id = `exercice_${exercice.exercice_id}`;
          if (exercice.contenus.length > 0) {
            if (
              exercice.contenus.find(
                (contenu) => contenu.element === contenuValue
              )
            ) {
              input.checked = true;
            }
          }

          const label = document.createElement('label');
          label.className = 'form-check-label';
          label.htmlFor = `exercice_${exercice.exercice_id}`;
          label.textContent = exercice.type;

          div.appendChild(input);
          div.appendChild(label);
          exerciceContainer.appendChild(div);
        });

        // Ajouter les événements pour la checkbox "Tout cocher"
        selectAllInput.addEventListener('change', (e) => {
          const checkboxes = exerciceContainer.querySelectorAll(
            'input[name="Contenu[exercices][]"]'
          );
          checkboxes.forEach((checkbox) => {
            checkbox.checked = e.target.checked;
          });
        });

        // Ajouter les événements pour les checkboxes individuelles
        exerciceContainer.addEventListener('change', (e) => {
          if (e.target.name === 'Contenu[exercices][]') {
            const checkboxes = exerciceContainer.querySelectorAll(
              'input[name="Contenu[exercices][]"]'
            );
            const allChecked = Array.from(checkboxes).every(
              (checkbox) => checkbox.checked
            );
            selectAllInput.checked = allChecked;
          }
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des exercices :', error);
    }
  };

  if (sequenceField && exerciceContainer) {
    updateExercices();

    sequenceField.addEventListener('change', async () => {
      updateExercices();
    });
  }
});
