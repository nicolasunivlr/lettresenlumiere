import hautParleur from '../../assets/images/haut-parleur.svg';
import useSpeak from '../../hooks/useSpeak';

const Speaker = (props) => {
  const { voiceLine } = props;

  const { speak } = useSpeak();

  const handleOnClick = () => {
    speak(voiceLine);
  };

  return (
    <img
      className='h-12 w-12 speaker'
      src={hautParleur}
      alt='Speaker'
      onClick={handleOnClick}
      style={{ cursor: 'pointer' }}
    />
  );
};

export default Speaker;
