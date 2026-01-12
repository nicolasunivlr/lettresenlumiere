export class GuestProfile {

  static PROGRESSION_STORAGE_KEY = "guest_progressions";

  isGuest() {
    return true;
  }

  async getProgressForSequence(sequence) {
    // Renvoyer objet avec tableau d'objets [null, exerciceId, score] pour chaque exercice

    const existingProgress = localStorage.getItem(GuestProfile.PROGRESSION_STORAGE_KEY);

    if (!existingProgress) {
      // Pas de progression enregistrée
      return sequence.exercises.map(() => null);
    }

    const progress = JSON.parse(existingProgress);

    return sequence.exercises.map((ex) => {
        const score = progress.find((p) => p.exerciseId === ex.id);
        return score ?? null;
      });
  }

  async updateProgress(progress, newScore) {

    console.log(progress);
    console.log("Updating progress for exercise:", progress.exerciseId, "to new score:", newScore);

    // Récupérer les progressions existantes depuis le localStorage
    const existingProgress = localStorage.getItem(GuestProfile.PROGRESSION_STORAGE_KEY);

    if (existingProgress) {
      const progressions = JSON.parse(existingProgress);

      // Trouver la progression à mettre à jour
      const progIndex = progressions.findIndex(
        (p) => p.exerciseId === progress.exerciseId
      );

      console.log("Found progression index:", progIndex);

      if (progIndex !== -1) {
        // Mettre à jour le score
        progressions[progIndex].score = newScore;

        // Sauvegarder les progressions mises à jour dans le localStorage
        localStorage.setItem(
          GuestProfile.PROGRESSION_STORAGE_KEY,
          JSON.stringify(progressions)
        );

        console.log("Progress updated in localStorage:", progressions);
      } else {
        console.warn("Progression not found for exerciseId:", progress.exerciseId);
      }
    } else {
      console.warn("No existing progressions found in localStorage.");
    }
  }

  async createProgressForExercise(exerciseId, score) {

    console.log("Creating progress for exercise:", exerciseId, "with score:", score);

    //
    const existingProgress = localStorage.getItem(GuestProfile.PROGRESSION_STORAGE_KEY);

    // Verifier si une progression existe
    const progressions = existingProgress ? JSON.parse(existingProgress) : [];

    // Ajouter la nouvelle progression
    progressions.push({
      exerciseId: exerciseId,
      score: score,
    });

    // Sauvegarder dans le localStorage
    localStorage.setItem(
      GuestProfile.PROGRESSION_STORAGE_KEY,
      JSON.stringify(progressions)
    );

    console.log("Progress saved to localStorage:", progressions);

  }
}
