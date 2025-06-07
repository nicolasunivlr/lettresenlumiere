import useSpeak from '../hooks/useSpeak';
import Speaker from './UI/Speaker';

const Instruction = (props) => {
  const { instruction } = props;
  const { speak } = useSpeak();

  const handleOnClick = () => {
    speak(instruction);
  };

  return (
    <div className='consigneContainerWrapper' onClick={handleOnClick}>
      <div className='consigneContainer'>
        <h3 className=' consigne text-center'>{instruction}</h3>
        <Speaker />
      </div>
    </div>
  );
};

export default Instruction;
