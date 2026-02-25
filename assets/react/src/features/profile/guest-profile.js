import { config } from "../../shared/config";

export class GuestProfile {
  isGuest() {
    return true;
  }

  isAdmin() {
    return false;
  }

  getFirstname() {
    throw new Error("Méthode non implémentée pour le profil invité.");
  }

  getLastname() {
    throw new Error("Méthode non implémentée pour le profil invité.");
  }

  async getProgressForSequence(sequence) {
    const existingProgress = sessionStorage.getItem(
      config.guestProgressTokenKey,
    );

    console.log("sequence:", sequence);

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
    console.log(
      "Updating progress for exercise:",
      progress.exerciseId,
      "to new score:",
      newScore,
    );
    // Récupérer les progressions existantes depuis le sessionStorage
    const existingProgress = sessionStorage.getItem(
      config.guestProgressTokenKey,
    );

    if (existingProgress) {
      const progressions = JSON.parse(existingProgress);

      // Trouver la progression à mettre à jour
      const progIndex = progressions.findIndex(
        (p) => p.exerciseId === progress.exerciseId,
      );

      if (progIndex !== -1) {
        // Mettre à jour le score
        progressions[progIndex].score = newScore;

        // Sauvegarder les progressions mises à jour dans le sessionStorage
        sessionStorage.setItem(
          config.guestProgressTokenKey,
          JSON.stringify(progressions),
        );

        console.log("Progress updated in sessionStorage:", progressions);
      } else {
        console.warn(
          "Progression not found for exerciseId:",
          progress.exerciseId,
        );
      }
    } else {
      console.warn("No existing progressions found in sessionStorage.");
    }
  }

  async createProgressForExercise(exerciseId, score) {
    console.log(
      "Creating progress for exercise:",
      exerciseId,
      "with score:",
      score,
    );

    // Récupérer les progressions existantes depuis le sessionStorage
    const existingProgress = sessionStorage.getItem(
      config.guestProgressTokenKey,
    );

    // Verifier si une progression existe
    const progressions = existingProgress ? JSON.parse(existingProgress) : [];

    // Ajouter la nouvelle progression
    progressions.push({
      exerciseId: exerciseId,
      score: score,
    });

    // Sauvegarder dans le sessionStorage
    sessionStorage.setItem(
      config.guestProgressTokenKey,
      JSON.stringify(progressions),
    );

    console.log("Progress saved to sessionStorage:", progressions);
  }
}
