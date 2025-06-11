const allAudios = document.querySelectorAll('td[data-column="audioUrl"] img');
// replace img by audio with controls
allAudios.forEach( img => {
    const audioUrl = img.getAttribute('src');
    if (audioUrl) {
        const audioElement = document.createElement('audio');
        audioElement.src = audioUrl;
        audioElement.controls = true;
        img.parentNode.replaceChild(audioElement, img);
    }
});

console.log('allAudios', allAudios);

// Créez un nouveau bouton
const newButton = document.createElement('button');
newButton.id = 'speakButton';
newButton.className = 'btn btn-primary';

// Ajoutez l'icône Font Awesome dans le bouton
const icon = document.createElement('i');
icon.className = 'fa-solid fa-volume-high';
newButton.appendChild(icon);

// Insérez le bouton après l'élément input
const inputElement = document.getElementById('Contenu_contenu');
inputElement.parentNode.insertBefore(newButton, inputElement.nextSibling);

// Ajoutez un gestionnaire d'événements pour le clic du bouton
newButton.addEventListener('click', function (event) {
  event.preventDefault(); // Empêche le rafraîchissement de la page
  const inputContent = inputElement.value;
  const utterance = new SpeechSynthesisUtterance(inputContent);

  // Récupérez les voix disponibles
  const availableVoices = window.speechSynthesis.getVoices();

  // Cherchez spécifiquement "Microsoft Paul - French (France)"
  const paul = availableVoices.find(
    (v) => v.name === 'Microsoft Paul - French (France)'
  );

  // Utilisez cette voix si elle est disponible
  if (paul) {
    utterance.voice = paul;
  }

  window.speechSynthesis.speak(utterance);
});

// Assurez-vous que les voix sont chargées avant d'ajouter l'événement
window.speechSynthesis.onvoiceschanged = function () {
  availableVoices = window.speechSynthesis.getVoices();
};
