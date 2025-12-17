import { config } from "../../shared/config";

export class AccountProfile {
  constructor(data) {
    this.id = data.id;
  }

  /**

   const accountProfile = useAccountProfile()
  const progress = accountProfile.getProgressForSequence(sequence.id)
  accountProfile.updateProgressForSequence(sequence.id, newProgress)
   */

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
        exerciceId: p.exercice.id,
        score: p.score,
      }));
      // Pour que l'ordre des scores soit le même que celui des exercices
      return sequence.exercises.map((ex) => {
        const score = progress.find((p) => p.exerciceId === ex.id);
        return score ?? null;
      });
    } catch (error) {}
  }

  updateProgressForSequence(sequenceId, newProgress) {
    console.log("updating progress");
  }
}
