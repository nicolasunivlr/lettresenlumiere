import ExerciseTypeA from "../../shared/components/Exercises/ExerciseTypeA";
import ExerciseTypeAAlphabet from "../../shared/components/Exercises/ExerciseTypeAAlphabet";
import ExerciceTypeAGrapheme from "../../shared/components/Exercises/ExerciseTypeAGrapheme";
import ExerciseTypeB from "../../shared/components/Exercises/ExerciseTypeB";
import ExerciseTypeC from "../../shared/components/Exercises/ExerciseTypeC";
import ExerciseTypeD from "../../shared/components/Exercises/ExerciseTypeD";
import ExerciseTypeE from "../../shared/components/Exercises/ExerciseTypeE";
import ExerciseTypeF from "../../shared/components/Exercises/ExerciseTypeF";
import ExerciseTypeG from "../../shared/components/Exercises/ExerciseTypeG";
import ExerciseTypeH from "../../shared/components/Exercises/ExerciseTypeH";

/**
 * Cette classe recence et permet un accès rapide aux composants des exercices.
 */
export class ExerciseRegistry {
  static registry = {
    A: ExerciseTypeA,
    B: ExerciseTypeB,
    C: ExerciseTypeC,
    D: ExerciseTypeD,
    E: ExerciseTypeE,
    F: ExerciseTypeF,
    G: ExerciseTypeG,
    H: ExerciseTypeH,
    ALPHABET: ExerciseTypeAAlphabet,
    GRAPHEMES: ExerciceTypeAGrapheme,
  };

  static get(type) {
    return ExerciseRegistry.registry[String(type).toUpperCase()] || null;
  }
}
