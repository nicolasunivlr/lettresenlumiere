import { useEffect } from 'react';
import Instruction from '../Instruction';
import OKButton from './OKButton';
import useSpeak from '../../hooks/useSpeak';

const ModalExerciseG = ({ onReady, isVisible, instruction }) => {
  const { speak } = useSpeak();
  useEffect(() => {
    if (instruction && isVisible) {
      speak(instruction);
    }
  }, [isVisible]);

  if (!isVisible) return null;
  return (
    <div className='modal-exercise'>
      <div className='modal-exercise__content'>
        <div className='Instruction-container'>
          <Instruction instruction={instruction} />
        </div>
        <h2>PRÊT ?</h2>
        <OKButton onClick={onReady} />
      </div>
    </div>
  );
};

export default ModalExerciseG;
