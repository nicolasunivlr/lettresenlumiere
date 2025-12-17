import { config } from "../../shared/config";

export class AccountProfile {
  constructor(data) {
    this.id = data.id;
  }

  async getProgressForSequence(sequence) {
    try {
      const response = await fetch(config.accountProfileProgress(this.id), {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Error accountProfileProgress");
      }
      const data = await response.json();
      // Mise au propre de la réponse du back
      const progress = data.member[0].progressions.map((p) => ({
        id: p.id,
        exerciseId: p.exercice.id,
        score: p.score,
      }));
      // Pour que l'ordre des scores soit le même que celui des exercices
      return sequence.exercises.map((ex) => {
        const score = progress.find((p) => p.exerciseId === ex.id);
        return score ?? null;
      });
    } catch (error) {}
  }

  async updateProgress(progress, newScore) {
    try {
      const response = await fetch(`${config.progressions}/${progress.id}`, {
        credentials: "include",
        method: "PATCH",
        headers: {
          "Content-Type": "application/merge-patch+json",
        },
        body: JSON.stringify({
          score: newScore,
          exercice: `/api/exercices/${progress.exerciseId}`,
          accountProfile: `/api/account_profiles/${this.id}`,
        }),
      });
      if (!response.ok) {
        throw new Error("Error updateProgress");
      }
    } catch (e) {}
  }

  async createProgressForExercise(exerciseId, score) {
    try {
      const response = await fetch(config.progressions, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/ld+json",
        },
        body: JSON.stringify({
          score: score,
          exercice: `/api/exercices/${exerciseId}`,
          accountProfile: `/api/account_profiles/${this.id}`,
        }),
      });
      if (!response.ok) {
        throw new Error("Error createProgressForExercise");
      }
    } catch (e) {}
  }
}
