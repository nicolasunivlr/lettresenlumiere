import { useState, useEffect, useCallback } from "react";
import Header from "../../shared/components/Header";

import NextExerciseButton from "../../shared/components/UI/NextExerciseButton";
import Sidebar from "../../shared/components/Sidebar";
import ModalEndExercise from "../../shared/components/Exercises/ModalEndExercise";

import graphemeData from "../../api/graphemes.json";
import ErrorPage from "./Error";

import Loader from "../../shared/components/UI/Loader";
import { ExerciseRenderer } from "../../features/exercises";
import ResultPage from "./ResultPage";

const GraphemePage = () => {
  const [isRetryingAfterBilan, setIsRetryingAfterBilan] = useState(false);
  const [exerciseKey, setExerciseKey] = useState(Date.now());

  const exerciseData = graphemeData;

  const [exercises, setExercises] = useState([]);
  const [currentExercise, setCurrentExercise] = useState(null);

  useEffect(() => {
    if (exerciseData) {
      setExercises(
        exerciseData.exercises?.map((exercise) => ({
          ...exercise,
          score: undefined,
          done: false,
        })),
      );
    }
  }, [exerciseData]);

  useEffect(() => {
    if (!exercises?.some((exercise) => exercise.done === "pending")) {
      getFirstIncompleteExercise();
    }
  }, [exercises]);

  const getFirstIncompleteExercise = () => {
    const firstIncomplete =
      exercises && exercises.find((exercice) => exercice.done === false);

    if (firstIncomplete && firstIncomplete !== currentExercise) {
      setCurrentExercise(firstIncomplete);
    }
  };

  const handleSettingDoneExercise = useCallback(
    (score = undefined) => {
      setExercises((prevExercises) =>
        prevExercises.map((exercise) =>
          exercise.id === currentExercise?.id
            ? { ...exercise, score: score, done: "pending" }
            : exercise,
        ),
      );
    },
    [currentExercise],
  );

  const handleNextExercise = () => {
    setExercises((prevExercises) =>
      prevExercises.map((exercise) =>
        exercise.done === "pending" ? { ...exercise, done: true } : exercise,
      ),
    );
  };

  const handleRedo = (id) => {
    setExerciseKey(Date.now());

    setExercises((prevExercises) => {
      let found = false;
      return prevExercises.map((exercise) => {
        if (exercise.id === id) {
          found = true;
          return { ...exercise, done: false, score: undefined };
        }
        return { ...exercise, done: !found };
      });
    });
  };

  const handleOnClickOnCircleResultPage = (id) => {
    setIsRetryingAfterBilan(true);
    setExerciseKey(Date.now());

    setExercises((prevExercises) => {
      return prevExercises.map((exercise) => {
        if (exercise.id === id) {
          return { ...exercise, done: false, score: undefined };
        }
        return { ...exercise, done: true };
      });
    });
  };

  const getCurrentExercise = () => {
    if (currentExercise) {
      if (exercises?.every((exercise) => exercise.done === true)) {
        return (
          <ResultPage
            content={exercises}
            circleOnClick={handleOnClickOnCircleResultPage}
            sequence={exerciseData}
            etapeid={"Graphèmes"}
          />
        );
      }

      return (
        <ExerciseRenderer
          grapheme={currentExercise.type.charAt(0).toLowerCase() === "a"}
          exercise={currentExercise}
          onDone={handleSettingDoneExercise}
        />
      );
    }
  };

  // Vérification de l'erreur 404 au début du rendu
  if (exerciseData?.status === 404) {
    return (
      <>
        <Header link="/" pageName="Erreur" />
        <ErrorPage
          title="Séquence non trouvée"
          message="Désolé, la séquence d’exercices que vous cherchez n’existe pas."
        />
      </>
    );
  }

  return (
    <>
      <Header
        link="/"
        pageName="Graphèmes"
        sequence=""
        video={exerciseData}
        isVideoOpenOnMount={true}
        openBilan={() => {
          setExercises((prevExercises) =>
            prevExercises.map((exercise) => ({
              ...exercise,
              done: true,
            })),
          );
        }}
      />

      <div className="sequence-group">
        {exercises && exercises.length > 0 ? (
          <>
            {!exercises.every((exercice) => exercice.done === true) && (
              <Sidebar
                exercices={exercises}
                onClick={handleRedo}
                disabled={isRetryingAfterBilan}
              />
            )}
          </>
        ) : (
          <Loader />
        )}
        <div className="sequence-group__content">
          {getCurrentExercise()}
          {exercises.find((exercice) => exercice.done === "pending") && (
            <>
              {currentExercise &&
              currentExercise.type.charAt(0).toLowerCase() === "a" ? (
                <NextExerciseButton onClick={handleNextExercise} />
              ) : (
                <ModalEndExercise
                  next={handleNextExercise}
                  redo={() => handleRedo(currentExercise.id)}
                  score={
                    exercises.find((exercice) => exercice.done === "pending")
                      ?.score
                  }
                />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default GraphemePage;
