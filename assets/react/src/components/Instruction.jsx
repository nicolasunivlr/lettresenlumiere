//import useSpeak from '../hooks/useSpeak';
import usePlay from "../hooks/usePlay";
import Speaker from './UI/Speaker';
//import useConfig from '../hooks/useConfig';

const Instruction = (props) => {
  const { exercice } = props;
  //const { speak } = useSpeak();
  const { play } = usePlay();
  //const config = useConfig();

  const handleOnClick = () => {
    if (exercice.sons_url) {
      //const url = `${config.audiosUrl}/${exercice.sons_url}`;
      //const audio = new Audio(url);
      //audio.play();
      play(exercice);
    } //else {
      //speak(exercice.consigne);
    //}
  };

  return (
    <div className='consigneContainerWrapper' onClick={handleOnClick}>
      <div className='consigneContainer'>
        <h3 className=' consigne text-center'>{exercice.consigne}</h3>
        <Speaker />
      </div>
    </div>
  );
};

export default Instruction;
