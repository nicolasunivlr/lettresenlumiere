export class Sequence {
  constructor(data) {
    this.id = data.id;
    this.name = data.nom;
    this.exercises = data.exercices;
    this.videoUrl = data.video_url;
    this.etapeId = data.etape.id;
  }

  static createDTO(data) {
    return new Sequence(data);
  }

  /**
   * Retourne un exercice de la séquence depuis son identifiant.
   * @param {number} id identifiant unique de l'exercice
   * @returns l'exercice correspondant ou null si il n'existe pas
   */
  getExerciseById(id) {
    const numericId = Number(id);
    if (Number.isNaN(numericId)) return null;

    return this.exercises.get(numericId) ?? null;
  }

  getExerciseByIndex(index) {
    return this.exercises.at(index) ?? null;
  }
}
