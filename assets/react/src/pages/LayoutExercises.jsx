import { useState, useEffect, useCallback } from 'react';
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
import ErrorPage from '../pages/Error';

import GraphemeData from '../api/graphèmes.json';
import ExerciseTypeAGrapheme from '../components/Exercises/ExerciseTypeAGrapheme';
import Loader from '../components/UI/Loader';

const LayoutExercices = () => {
  const { etapeid, id } = useParams();
  const [sequence, setSequence] = useState();
  const [isRetryingAfterBilan, setIsRetryingAfterBilan] = useState(false);
  const [exerciceKey, setExerciceKey] = useState(Date.now());
  const location = useLocation();

  const pathSegments = location.pathname.split('/').filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1];
  const isAlphabet = lastSegment === 'alphabet';
  const isGraphemes = lastSegment === 'graphemes';

  const apiData = useDataExercice(id && !isAlphabet && !isGraphemes ? id : null);

  const exerciceData = isAlphabet ? AlphabetData : isGraphemes ? GraphemeData : apiData;

  const [exercices, setExercices] = useState([]);
  const [currentExercice, setCurrentExercice] = useState(null);

  useEffect(() => {
    if (exerciceData) {
      setSequence(exerciceData.nom);
      setExercices(
        exerciceData.exercices?.map((exercice) => ({
          ...exercice,
          score: undefined,
          done: false,
        }))
      );
    }
  }, [exerciceData]);

  useEffect(() => {
    if (!exercices?.some((exercice) => exercice.done === 'pending')) {
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

  const handleSettingDoneExercice = useCallback((score = undefined) => {
    setExercices((prevExercices) =>
        prevExercices.map((exercice) =>
            exercice.id === currentExercice?.id
                ? { ...exercice, score: score, done: 'pending' }
                : exercice
        )
    );
  }, [currentExercice]);

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
            sequence={exerciceData}
            etapeid={etapeid}
          />
        );
      }
      switch (currentExercice.type.charAt(0).toLowerCase()) {
        case 'a':
          if (isAlphabet) {
            return (
              <ExerciseTypeAAlphabet
                key={exerciceKey}
                content={currentExercice}
                onDone={handleSettingDoneExercice}
              />
            );
          }
          if (isGraphemes) {
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

  if (!isAlphabet && !isGraphemes && !exerciceData) {
    return <Loader />;
  }

  // Vérification de l'erreur 404 au début du rendu
  if ( exerciceData?.status === 404) {
    return (
        <>
          <Header link='/' pageName='Erreur' />
          <ErrorPage
              title='Séquence non trouvée'
              message='Désolé, la séquence d’exercices que vous cherchez n’existe pas.'
          />
        </>
    );
  }

  return (
    <>
      <Header
        link='/'
        pageName={
          isAlphabet
            ? 'Alphabet'
            : isGraphemes
            ? 'Graphèmes'
            : `Étape ${exerciceData?.etape.id}`
        }
        sequence={
          isAlphabet || isGraphemes
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
