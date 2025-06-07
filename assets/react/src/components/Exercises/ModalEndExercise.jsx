import NextExerciseButton from '../UI/NextExerciseButton';
import RedoButton from '../UI/RedoButton';

const ModalEndExercise = ({ next, redo, score }) => {
  let message;
  let bgc;
  if (score <= 25) {
    message = 'À REVOIR !';
    bgc = 'medal-score--revoir';
  } else if (score <= 50) {
    message = 'PAS MAL !';
    bgc = 'medal-score--pasmal';
  } else if (score <= 75) {
    message = 'BIEN !';
    bgc = 'medal-score--bien';
  } else {
    message = 'BRAVO !';
    bgc = 'medal-score--bravo';
  }
  return (
    <div className='modal-exercise'>
      <div className='modal-exercise__content small'>
        <div className={`medal-score ${bgc}`}>
          <p>{score}%</p>
        </div>

        <div className='modal-button-container'>
          <RedoButton onClick={redo} />
          <h2>{message.toUpperCase()}</h2>
          <NextExerciseButton onClick={next} />
        </div>
      </div>
    </div>
  );
};

export default ModalEndExercise;
