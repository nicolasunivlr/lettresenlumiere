import ExerciseTypeA from "../components/Exercises/ExerciseTypeA";
import ExerciseTypeB from "../components/Exercises/ExerciseTypeB";
import ExerciseTypeC from "../components/Exercises/ExerciseTypeC";
import ExerciseTypeD from "../components/Exercises/ExerciseTypeD";
import ExerciseTypeE from "../components/Exercises/ExerciseTypeE";
import ExerciseTypeF from "../components/Exercises/ExerciseTypeF";
import ExerciseTypeG from "../components/Exercises/ExerciseTypeG";
import ExerciseTypeH from "../components/Exercises/ExerciseTypeH";

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
  };

  static get(type) {
    return ExerciseRegistry.registry[String(type).toUpperCase()] || null;
  }
}
