import React from "react";
import Header from "../../shared/components/Header";
import Loader from "../../shared/components/UI/Loader";
import Error from "./Error";
import { useSequence } from "../../features/sequences/sequence-provider";
import { ExerciseRenderer } from "../../features/exercises";
import { ProgressCircles } from "../../features/sequences/components/progress-circle";
import NextExerciseButton from "../../shared/components/UI/NextExerciseButton";
import ModalEndExercise from "../../shared/components/Exercises/ModalEndExercise";
import { useSequenceUIState } from "../../features/sequences/useSequenceUIState";
import { useAccountProfile } from "../../features/account-profile/account-profile-provider";

export const SequencePage = () => {
  // --- Logique liée à la séquence ---
  const { sequence, loading, error } = useSequence();

  // --- Logique liée à l'utilisateur ---
  const { accountProfile } = useAccountProfile();
  const [progress, setProgress] = React.useState([]);
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
    currentExerciseIndex: 0,
    attemptCount: 0, // Compteur de tentative pour forcer le remontage de l'ExerciseRenderer
  });

  React.useEffect(() => {
    const initProgress = async () => {
      setIsProgressLoading(true);
      const progressForSequence = await accountProfile.getProgressForSequence(
        sequence
      );
      setProgress(progressForSequence);
      showProgressCircles();
      goToExercise(progressForSequence.findIndex((p) => p === null) || 0);
      setIsProgressLoading(false);
    };

    if (sequence && accountProfile) {
      initProgress();
    }
  }, [sequence, accountProfile]);

  const handleExerciseDone = (score) => {
    const progressForExercise = progress[UI.currentExerciseIndex];
    if (progressForExercise) {
      accountProfile.updateProgress(progressForExercise, score);
    } else {
      accountProfile.createProgressForExercise(
        sequence.exercises[UI.currentExerciseIndex].id,
        score
      );
    }
    setProgress((prev) => {
      const newProgress = [...prev];
      newProgress[UI.currentExerciseIndex] = {
        ...newProgress[UI.currentExerciseIndex],
        score: score,
      };
      return newProgress;
    });

    showEndOfExerciseModal();
  };

  const handleNextExercise = () => {
    const isLast = UI.currentExerciseIndex >= sequence.exercises.length - 1;
    if (isLast) {
      showSequenceSummary();
    } else {
      goToNextExercise();
    }
  };

  const handleRedo = () => {
    // Fonction de accountProfile qu'on pourrait nommer resetProgressForExercise(exerciseId)
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
              progress={progress}
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
              score={progress[UI.currentExerciseIndex].score}
            />
          )}
        </>
      )}
    </>
  );
};
