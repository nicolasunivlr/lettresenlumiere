import { ExerciseRegistry } from "./ExerciseRegistry";

/**
 * Moteur de rendu des exercices. Les composants d'exercices doivent respecter
 * le contrat en exposant les props `content` et `onDone`.
 */
export const ExerciseRenderer = ({ grapheme, alphabet, exercise, onDone }) => {
  let ExerciseComponent = null;

  if (alphabet) {
    ExerciseComponent = ExerciseRegistry.get("ALPHABET");
  } else if (grapheme) {
    ExerciseComponent = ExerciseRegistry.get("GRAPHEMES");
  } else {
    ExerciseComponent = ExerciseRegistry.get(normalizeType(exercise.type));
  }

  console.log(
    "Rendering exercise of type:",
    exercise.type,
    "with component:",
    ExerciseComponent,
  );

  if (!ExerciseComponent) {
    return <div>Type d'exercice inconnu : {exercise.type}</div>;
  }

  return <ExerciseComponent content={exercise} onDone={onDone} />;
};

/**
 * Utilitaire permettant de normaliser le type de l'exercice pour qu'il coïncide
 * avec la clef du registre. Reprend l'implémentation utilisée dans `LayoutExercise.jsx`.
 */
const normalizeType = (type) => {
  return type.charAt(0).toUpperCase();
};
