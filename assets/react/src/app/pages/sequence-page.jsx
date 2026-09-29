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
import { useProfile } from "../../features/profile/profile-provider";
import SequenceSummary from "../../features/sequences/components/sequence-summary";

export const SequencePage = () => {
  // --- Logique liée à la séquence ---
  const { sequence, loading, error } = useSequence();

  // --- Logique liée au profil ---
  const { profile } = useProfile();
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
      const progressForSequence =
        await profile.getProgressForSequence(sequence);
      setProgress(progressForSequence);
      showProgressCircles();
      goToExercise(progressForSequence?.findIndex((p) => p === null) || 0);
      setIsProgressLoading(false);
    };

    if (sequence && profile) {
      initProgress();
    }
  }, [sequence, profile]);

  const handleExerciseDone = (score) => {
    const progressForExercise = progress[UI.currentExerciseIndex];
    if (progressForExercise) {
      profile.updateProgress(progressForExercise, score);
    } else {
      profile.createProgressForExercise(
        sequence.exercises[UI.currentExerciseIndex].id,
        score,
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
          <div className="sequence-group">
            {UI.showProgress && (
              <ProgressCircles
                count={sequence.exercises.length}
                current={UI.currentExerciseIndex}
                progress={progress}
                onChange={(next) => goToExercise(next)}
                containerClassName="sidebar"
              />
            )}
            <div className="sequence-group__content">
              {UI.showSummary & true ? (
                <SequenceSummary
                  context={{
                    ...sequence,
                  }}
                  progress={progress}
                  onRetry={(index) => goToExercise(index)}
                />
              ) : (
                <ExerciseRenderer
                  key={`attempt-${UI.attemptCount}`}
                  exercise={sequence.exercises[UI.currentExerciseIndex]}
                  onDone={handleExerciseDone}
                />
              )}
            </div>
          </div>

          {UI.showNextButton && (
            <NextExerciseButton onClick={handleNextExercise} />
          )}

          {UI.showModal && (
            <ModalEndExercise
              next={handleNextExercise}
              redo={redoExercise}
              score={progress[UI.currentExerciseIndex].score}
            />
          )}
        </>
      )}
    </>
  );
};
