import { useState } from "react";

export const useSequenceUIState = (initialState) => {
  const [state, setState] = useState(initialState);

  const showProgressCircles = () => {
    setState((prev) => ({ ...prev, showProgress: true }));
  };

  const showEndOfExerciseModal = () => {
    setState((prev) => ({
      ...prev,
      showNextButton: prev.currentExerciseIndex === 0,
      showModal: prev.currentExerciseIndex !== 0,
    }));
  };

  const showSequenceSummary = () => {
    setState((prev) => ({
      ...prev,
      showNextButton: false,
      showModal: false,
      showSummary: true,
      showProgress: false,
    }));
  };

  const goToNextExercise = () => {
    setState((prev) => ({
      ...prev,
      showNextButton: false,
      showModal: false,
      currentExerciseIndex: prev.currentExerciseIndex + 1,
      attemptCount: 0,
    }));
  };

  const redoExercise = () => {
    setState((prev) => ({
      ...prev,
      showModal: false,
      attemptCount: prev.attemptCount + 1,
    }));
  };

  const goToExercise = (index) => {
    setState((prev) => ({
      ...prev,
      showSummary: false,
      showProgress: true,
      currentExerciseIndex: Math.max(0, index),
      attemptCount: 0,
    }));
  };

  return {
    UI: state,

    showEndOfExerciseModal,
    showSequenceSummary,
    redoExercise,
    goToExercise,
    goToNextExercise,
    showProgressCircles,
  };
};
