import alphabetData from "../../api/alphabet.json";
import graphemesData from "../../api/graphemes.json";

export class Sequence {
  static ALPHABET_ID = "alphabet";
  static GRAPHEMES_ID = "graphemes";

  constructor(data) {
    this.id = data.id ?? "static";
    this.name = data.nom;
    // TODO@somenone: harmoniser les données pour utiliser la même terminologie.
    this.exercises = data.exercices ?? data.exercises ?? []; // fallback car pas d'harmonie dans les données de l'API
    this.videoUrl = data.video_url;
    this.etapeId = data.etape?.id ?? null;
  }

  /**
   * Crée une instance de Sequence à partir de données brutes.
   * @returns
   */
  static createFromData(data) {
    return new Sequence(data);
  }

  /**
   * Helper pour créer la séquence de l'alphabet à partir des données statiques.
   * @returns Sequence de l'alphabet
   */
  static createAlphabetSequence() {
    return Sequence.createFromData(alphabetData);
  }

  /**
   * Helper pour créer la séquence des graphèmes à partir des données statiques.
   * @returns Sequence des graphèmes
   */
  static createGraphemesSequence() {
    return Sequence.createFromData(graphemesData);
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
