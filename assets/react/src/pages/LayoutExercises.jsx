import { useState, useEffect } from 'react';
import useDataExercice from '../hooks/api/useDataExercice';
import { useParams, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import ExerciseTypeA from '../components/Exercises/ExerciseTypeA';
import ExerciseTypeB from '../components/Exercises/ExerciseTypeB';
import ExerciseTypeC from '../components/Exercises/ExerciseTypeC';
import ExerciseTypeD from '../components/Exercises/ExerciseTypeD';
import ExerciseTypeG from '../components/Exercises/ExerciseTypeG';
import ExerciseTypeE from '../components/Exercises/ExerciseTypeE';
import ExerciseTypeF from '../components/Exercises/ExerciseTypeF';
import ExerciseTypeH from '../components/Exercises/ExerciseTypeH';
import NextExerciseButton from '../components/UI/NextExerciseButton';
import Sidebar from '../components/Sidebar';
import ModalEndExercise from '../components/Exercises/ModalEndExercise';

import AlphabetData from '../api/alphabet.json';
import ExerciseTypeAAlphabet from '../components/Exercises/ExerciseTypeAAlphabet';
import ResultPage from '../components/Exercises/ResultPage';

import GraphemeData from '../api/graphèmes.json';
import ExerciseTypeAGrapheme from '../components/Exercises/ExerciseTypeAGrapheme';
import Loader from '../components/UI/Loader';

const LayoutExercices = () => {
  const { etapeid, id } = useParams();
  let exerciceData =  (id ? (exerciceData = useDataExercice(id)) : null);
  const [isNotStep, setIsNotStep] = useState();
  const [sequence, setSequence] = useState();
  const [isRetryingAfterBilan, setIsRetryingAfterBilan] = useState(false);
  const [exerciceKey, setExerciceKey] = useState(Date.now());
  const location = useLocation();
  function setLastSegment() {
    const pathSegments = location.pathname.split('/').filter(Boolean); // Divise l'URL et retire les segments vides
    const lastSegment = pathSegments[pathSegments.length - 1];
    if (lastSegment === 'alphabet') {
      setIsNotStep(lastSegment);
      exerciceData = AlphabetData;
    } else if (lastSegment === 'graphemes') {
      setIsNotStep(lastSegment);
      exerciceData = GraphemeData;
    }
  }

  useEffect(() => {
    setLastSegment();
  }, []);

  const [exercices, setExercices] = useState([]);
  const [currentExercice, setCurrentExercice] = useState(null);

  useEffect(() => {
    if (exerciceData) {
      setSequence(exerciceData.nom);
      setExercices(
        exerciceData.exercices.map((exercice) => ({
          ...exercice,
          score: undefined,
          done: false,
        }))
      );
    }
  }, [exerciceData]);

  useEffect(() => {
    if (!exercices.some((exercice) => exercice.done === 'pending')) {
      getFirstIncompleteExercise();
    }
  }, [exercices]);

  const getFirstIncompleteExercise = () => {
    const firstIncomplete =
      exercices && exercices.find((exercice) => exercice.done === false);

    if (firstIncomplete && firstIncomplete !== currentExercice) {
      setCurrentExercice(firstIncomplete);
    }
  };

  const handleSettingDoneExercice = (score = undefined) => {
    setExercices((prevExercices) =>
      prevExercices.map((exercice) =>
        exercice === currentExercice
          ? { ...exercice, score: score, done: 'pending' }
          : exercice
      )
    );
  };

  const handleNextExercise = () => {
    setExercices((prevExercices) =>
      prevExercices.map((exercice) =>
        exercice.done === 'pending' ? { ...exercice, done: true } : exercice
      )
    );
  };

  const handleRedo = (id) => {
    setExerciceKey(Date.now());

    setExercices((prevExercices) => {
      let found = false;
      return prevExercices.map((exercice) => {
        if (exercice.id === id) {
          found = true;
          return { ...exercice, done: false, score: undefined };
        }
        return { ...exercice, done: !found };
      });
    });
  };

  const handleOnClickOnCircleResultPage = (id) => {
    setIsRetryingAfterBilan(true);
    setExerciceKey(Date.now());

    setExercices((prevExercices) => {
      return prevExercices.map((exercice) => {
        if (exercice.id === id) {
          return { ...exercice, done: false, score: undefined };
        }
        return { ...exercice, done: true };
      });
    });
  };

  const getCurrentExercise = () => {
    if (currentExercice) {
      if (exercices?.every((exercice) => exercice.done === true)) {
        return (
          <ResultPage
            content={exercices}
            circleOnClick={handleOnClickOnCircleResultPage}
            sequence={sequence}
            etapeid={etapeid}
          />
        );
      }
      switch (currentExercice.type.charAt(0).toLowerCase()) {
        case 'a':
          if (isNotStep === 'alphabet') {
            return (
              <ExerciseTypeAAlphabet
                key={exerciceKey}
                content={currentExercice}
                onDone={handleSettingDoneExercice}
              />
            );
          }
          if (isNotStep === 'graphemes') {
            return (
              <ExerciseTypeAGrapheme
                key={exerciceKey}
                content={currentExercice}
                onDone={handleSettingDoneExercice}
              />
            );
          }
          return (
            <ExerciseTypeA
              key={exerciceKey}
              content={currentExercice}
              onDone={handleSettingDoneExercice}
            />
          );
        case 'b':
          return (
            <ExerciseTypeB
              key={exerciceKey}
              content={currentExercice}
              onDone={handleSettingDoneExercice}
            />
          );
        case 'c':
          return (
            <ExerciseTypeC
              key={exerciceKey}
              content={currentExercice}
              onDone={handleSettingDoneExercice}
            />
          );
        case 'd':
          return (
            <ExerciseTypeD
              key={exerciceKey}
              content={currentExercice}
              onDone={handleSettingDoneExercice}
            />
          );
        case 'e':
          return (
            <ExerciseTypeE
              key={exerciceKey}
              content={currentExercice}
              onDone={handleSettingDoneExercice}
            />
          );
        case 'f':
          return (
            <ExerciseTypeF
              key={exerciceKey}
              content={currentExercice}
              onDone={handleSettingDoneExercice}
            />
          );
        case 'g':
          return (
            <ExerciseTypeG
              key={exerciceKey}
              content={currentExercice}
              onDone={handleSettingDoneExercice}
            />
          );
        case 'h':
          return (
            <ExerciseTypeH
              key={exerciceKey}
              content={currentExercice}
              onDone={handleSettingDoneExercice}
            />
          );
      }
    }
  };

  return (
    <>
      <Header
        link='/'
        pageName={
          isNotStep === 'alphabet'
            ? 'Alphabet'
            : isNotStep === 'graphemes'
            ? 'Graphèmes'
            : `Étape ${etapeid}`
        }
        sequence={
          isNotStep === 'alphabet' || isNotStep === 'graphemes'
            ? ''
            : exerciceData && exerciceData.nom
            ? exerciceData.nom
            : ''
        }
        video={exerciceData}
        isVideoOpenOnMount={true}
        openBilan={() => {
          setExercices((prevExercices) =>
            prevExercices.map((exercice) => ({
              ...exercice,
              done: true,
            }))
          );
        }}
      />

      <div className='layoutExercice'>
        {exercices && exercices.length > 0 ? (
          <>
            {!exercices.every((exercice) => exercice.done === true) && (
              <Sidebar
                exercices={exercices}
                onClick={handleRedo}
                disabled={isRetryingAfterBilan}
              />
            )}
          </>
        ) : (
          <Loader />
        )}
        {getCurrentExercise()}
        {exercices.find((exercice) => exercice.done === 'pending') && (
          <>
            {currentExercice &&
            currentExercice.type.charAt(0).toLowerCase() === 'a' ? (
              <NextExerciseButton onClick={handleNextExercise} />
            ) : (
              <ModalEndExercise
                next={handleNextExercise}
                redo={() => handleRedo(currentExercice.id)}
                score={
                  exercices.find((exercice) => exercice.done === 'pending')
                    ?.score
                }
              />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default LayoutExercices;
