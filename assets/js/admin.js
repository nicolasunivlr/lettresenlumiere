document.addEventListener('DOMContentLoaded', function() {
    const sequenceSelect = document.querySelector('select[name$="[sequence]"]');
    const exerciceSelect = document.querySelector('select[name$="[exercice]"]');

    if (sequenceSelect && exerciceSelect) {
        sequenceSelect.addEventListener('change', function(e) {
            const sequenceId = e.target.value;

            // Recréer l'URL du formulaire avec le nouveau paramètre sequence
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set('sequence', sequenceId);

            // Recharger le formulaire
            window.location.href = currentUrl.toString();
        });
    }
});