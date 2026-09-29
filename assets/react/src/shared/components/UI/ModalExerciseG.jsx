import { useEffect } from 'react';
import Instruction from '../Instruction';
import OKButton from './OKButton';
import usePlay from '../../hooks/usePlay';

const ModalExerciseG = ({ onReady, isVisible, instruction }) => {
  const { play } = usePlay();
  useEffect(() => {
    if (instruction?.sons_url && isVisible) {
      play(instruction);
    }
  }, [isVisible]);

  if (!isVisible) return null;
  return (
    <div className='modal-exercise'>
      <div className='modal-exercise__content'>
        <div className='Instruction-container'>
          <Instruction exercice={instruction} />
        </div>
        <h2>PRÊT ?</h2>
        <OKButton onClick={onReady} />
      </div>
    </div>
  );
};

export default ModalExerciseG;
