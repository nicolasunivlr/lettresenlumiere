import { useState, useEffect } from 'react';
import Label from '../UI/Label';
import LabelImage from '../UI/LabelImage';
import ProgressBar from './ProgressBar';
import Instruction from '../Instruction';

const ExerciseTypeA = (props) => {
  const { content, onDone } = props;

  const [contentExercise, setContentExercise] = useState([]);
  const [isFinished, setIsFinished] = useState([{ isFinished: false }]);

  useEffect(() => {
    if (content && content.contenus) {
      setContentExercise(content.contenus);
      setIsFinished(content.contenus.map(() => ({ isFinished: false })));
    }
  }, [content]);

  const handleFinish = (index) => {
    setIsFinished((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, isFinished: true } : item
      )
    );
  };

  useEffect(() => {
    const isAllFinished = isFinished.every((item) => item.isFinished);
    if (isAllFinished) {
      onDone(100);
    }
  }, [isFinished]);

  const displayLabels = (contentExercise) => {
    return contentExercise.map((contenu, index) =>
      contenu.image_url && content.type != 'A.1' ? (
        <LabelImage
          key={`${index}-label`}
          classe='label'
          text={contenu.element}
          sound={true}
          voiceLine={contenu.element}
          index={index}
          onClick={() => handleFinish(index)}
          format={contenu.contenuFormats ?? null}
          imageSrc={contenu.image_url}
          isClickable={true}
        />
      ) : (
        <Label
          classe='label'
          key={`${index}-label`}
          text={contenu.element}
          sound={true}
          voiceLine={contenu.element}
          index={index}
          onClick={() => handleFinish(index)}
          format={contenu.contenuFormats ?? null}
          audioUrl={contenu.sons_url ?? null}
        />
      )
    );
  };

  return (
    <>
      {content ? (
        <>
          <div className='exercices'>
            <Instruction instruction={content.consigne} />
            <div className='exercice__item pt-5'>
              {Array.isArray(contentExercise) && displayLabels(contentExercise)}
            </div>
          </div>
        </>
      ) : (
        <div>Erreur dans le chargement du contenu de l'exercice...</div>
      )}

      <ProgressBar content={isFinished} />
    </>
  );
};

export default ExerciseTypeA;
