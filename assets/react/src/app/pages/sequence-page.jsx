import React from "react";
import Header from "../../shared/components/Header";
import Loader from "../../shared/components/UI/Loader";
import Error from "./Error";
import { useSequence } from "../../features/sequences/SequenceProvider";
import { ExerciseRenderer } from "../../features/exercises";
import { ProgressCircles } from "../../features/sequences/components/ProgressCircles";
import NextExerciseButton from "../../shared/components/UI/NextExerciseButton";
import ModalEndExercise from "../../shared/components/Exercises/ModalEndExercise";
import { useSequenceUIState } from "../../features/sequences/useSequenceUIState";
import { useAccountProfile } from "../../features/account-profile/account-profile-provider";

/*
  On pourrait imaginer une API user avec des méthodes en lecture/écriture

  Par exemple :

  const progress = accountProfile.getProgressForSequence(sequence.id)
  accountProfile.updateProgressForSequence(sequence.id, newProgress)
  // Voir MR
  */

export const SequencePage = () => {
  // --- Logique liée à la séquence ---
  const { sequence, loading, error } = useSequence();

  // --- Logique liée à l'utilisateur ---
  const { accountProfile } = useAccountProfile();
  const [progress, setProgress] = React.useState(null);
  const [isProgressLoading, setIsProgressLoading] = React.useState(true);

  // --- Logique UI ---
  const {
    UI,
    showEndOfExerciseModal,
    showSequenceSummary,
    redoExercise,
    goToExercise,
    goToNextExercise,
    showProgressCircles,
  } = useSequenceUIState({
    showNextButton: false,
    showModal: false,
    showSummary: false,
    showProgress: false,
    /*
    Dépendra de la progression de l'utilisateur.
    TODO: .

    const progress = user.getProgressForSequence(sequence.id)
    currentExerciseIndex: progress.findIndex(p => p === null) || 0
    */
    currentExerciseIndex: 0,
    attemptCount: 0, // Compteur de tentative pour forcer le remontage de l'ExerciseRenderer
  });

  React.useEffect(() => {
    const initProgress = async () => {
      setIsProgressLoading(true);
      const progress = await accountProfile.getProgressForSequence(sequence);
      setProgress(progress);
      showProgressCircles();
      const currentExercise = progress.findIndex((p) => p === null) || 0;
      goToExercise(currentExercise);
      setIsProgressLoading(false);
    };

    if (sequence && accountProfile) {
      initProgress();
    }
  }, [sequence, accountProfile]);

  const handleExerciseDone = (score) => {
    // Fonction de AccountProfile qu'on pourrait nommer updateProgressForExercise(exerciseId, score)
    // qui mettrait à jour la progression de l'exercice en cours.
    // Pour obtenir l'id de l'exercice en cours :
    // const currentExerciseId = sequence.getExerciseByIndex(UI.currentExerciseIndex).id
    setProgress((prev) => {
      const newProgress = [...prev];
      newProgress[UI.currentExerciseIndex] = score;
      return newProgress;
    });

    showEndOfExerciseModal();
  };

  const handleNextExercise = () => {
    const isLast = UI.currentExerciseIndex >= sequence - 1;
    if (isLast) {
      showSequenceSummary();
    } else {
      goToNextExercise();
    }
  };

  const handleRedo = () => {
    // Fonction de user qu'on pourrait nommer resetProgressForExercise(exerciseId)
    // qui réinitialiserait la progression de l'exercice en cours.
    // Pour obtenir l'id de l'exercice en cours :
    // const currentExerciseId = sequence.getExerciseByIndex(UI.currentExerciseIndex).id
    setProgress((prev) => {
      const newProgress = [...prev];
      newProgress[UI.currentExerciseIndex] = null;
      return newProgress;
    });

    redoExercise();
  };

  if (loading || isProgressLoading) return <Loader />;
  if (error) return <Error title="Erreur" message={error} />;

  return (
    <>
      {sequence && (
        <>
          <Header
            link="/"
            pageName={`Étape ${sequence.etapeId}`}
            sequence={sequence.name}
            videoUrl={sequence.videoUrl}
            isVideoOpenOnMount={UI.currentExerciseIndex === 0}
          />
          {UI.showProgress && (
            <ProgressCircles
              count={sequence.exercises.length}
              current={UI.currentExerciseIndex}
              scores={progress}
              onChange={(next) => goToExercise(next)}
            />
          )}

          {UI.showSummary ? (
            <div>Affichage des résultats de la séquence...</div>
          ) : (
            <ExerciseRenderer
              key={`attempt-${UI.attemptCount}`}
              exercise={sequence.exercises[UI.currentExerciseIndex]}
              onDone={handleExerciseDone}
            />
          )}

          {UI.showNextButton && (
            <NextExerciseButton onClick={handleNextExercise} />
          )}

          {UI.showModal && (
            <ModalEndExercise
              next={handleNextExercise}
              redo={handleRedo}
              score={progress[UI.currentExerciseIndex]}
            />
          )}
        </>
      )}
    </>
  );
};
