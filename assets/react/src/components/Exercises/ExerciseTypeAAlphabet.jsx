import { useState, useEffect } from 'react';
import Label from '../UI/Label';
import Instruction from '../Instruction';
import VideoModal from '../UI/VideoModal';

const ExerciseTypeAAlphabet = (props) => {
  const { content, onDone } = props;

  const [contentExercise, setContentExercise] = useState([]);

  useEffect(() => {
    if (content && content.contenus) {
      setContentExercise(content.contenus);
    }
    onDone(100);
  }, [content]);

  const displayLabels = (contentExercise) => {
    return (
      <div className='exercice__item--type-a'>
        {contentExercise.map((contenu, index) => (
          <div className='labelContainer' key={index}>
            <div className='watch-button'>
              <VideoModal
                sequence={contenu}
                title={`Lettre ${contenu.element}`}
              />
            </div>
            <Label
              key={`${index}-script`}
              text={contenu.element}
              sound={true}
              font={'script'}
            />
            <Label
              key={`${index}-cursive`}
              text={contenu.element}
              sound={true}
              font={'cursive'}
            />
            <Label
              key={`${index}-script-upp`}
              text={contenu.element.toUpperCase()}
              sound={true}
              font={'script'}
            />
            <Label
              key={`${index}-cursive-upp`}
              text={contenu.element.toUpperCase()}
              sound={true}
              font={'cursiveupp'}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      {content ? (
        <>
          <Instruction instruction={content.consigne} />
          <div className='exercice pt-5'>
            {Array.isArray(contentExercise) && displayLabels(contentExercise)}
          </div>
        </>
      ) : (
        <div>Erreur dans le chargement du contenu de l'exercice...</div>
      )}
    </>
  );
};

export default ExerciseTypeAAlphabet;
