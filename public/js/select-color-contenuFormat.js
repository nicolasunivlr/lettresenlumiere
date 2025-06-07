document.addEventListener('DOMContentLoaded', function () {
  // Fonction pour maintenir les styles de couleur sur les sélecteurs
  function updateColorSelectStyles() {
    // Cibler tous les sélecteurs avec la classe couleur-select
    const colorSelects = document.querySelectorAll('.couleur-select');

    colorSelects.forEach((select) => {
      // Appliquer le style initial basé sur l'option sélectionnée
      applySelectedStyle(select);

      // Ajouter un écouteur d'événements pour le changement de sélection
      select.addEventListener('change', function () {
        applySelectedStyle(this);
      });
    });
  }

  // Fonction pour appliquer le style à l'option sélectionnée
  function applySelectedStyle(select) {
    const selectedOption = select.options[select.selectedIndex];
    if (selectedOption && selectedOption.dataset.color) {
      // Récupérer la couleur depuis l'attribut data-color
      const color = selectedOption.dataset.color;

      // Appliquer le style à l'élément select lui-même
      select.style.color = color;
      select.style.fontWeight = 'bold';
      select.style.borderLeft = `10px solid ${color}`;
      select.style.paddingLeft = '5px';
    } else {
      // Réinitialiser les styles si aucune couleur n'est sélectionnée
      select.style.color = '';
      select.style.fontWeight = '';
      select.style.borderLeft = '';
      select.style.paddingLeft = '';
    }
  }

  // Observer les changements dans le DOM pour les collections qui peuvent être ajoutées dynamiquement
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.addedNodes.length) {
        updateColorSelectStyles();
      }
    });
  });

  // Configurer l'observateur pour surveiller les changements dans le contenu
  const config = { childList: true, subtree: true };
  observer.observe(document.body, config);

  // Initialiser les styles au chargement de la page
  updateColorSelectStyles();
});
