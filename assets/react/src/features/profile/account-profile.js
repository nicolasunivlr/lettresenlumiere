import { profilesApi } from "../../shared/api/profiles-api";
import { progressionsApi } from "../../shared/api/progressions-api";

export class AccountProfile {
  constructor(data) {
    this.id = data.id;
  }

  isGuest() {
    return false;
  }

  async getProgressForSequence(sequence) {
    try {
      const data = await profilesApi.getProgress(this.id);
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
      await progressionsApi.update({
        id: progress.id,
        score: newScore,
        exerciseId: progress.exerciseId,
        accountId: this.id,
      });
    } catch (e) {}
  }

  async createProgressForExercise(exerciseId, score) {
    try {
      await progressionsApi.create({
        score: score,
        exerciseId: exerciseId,
        accountId: this.id,
      });
    } catch (e) {}
  }
}
