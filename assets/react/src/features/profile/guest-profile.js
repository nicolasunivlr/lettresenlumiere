export class GuestProfile {
  isGuest() {
    return true;
  }

  async getProgressForSequence(sequence) {
    console.warn("Not implemented");
    return Array.from({ length: sequence.exercises.length }).map(() => null);
  }

  async updateProgress(progress, newScore) {
    console.warn("Not implemented");
  }

  async createProgressForExercise(exerciseId, score) {
    console.warn("Not implemented");
  }
}
