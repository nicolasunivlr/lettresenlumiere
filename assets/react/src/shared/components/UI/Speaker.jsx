import hautParleur from "../../../assets/images/haut-parleur.svg";
import usePlay from "../../../shared/hooks/usePlay";
import useSpeak from "../../../shared/hooks/useSpeak";

const Speaker = (props) => {
  const { voiceLine, sons_url } = props;

  const { play } = usePlay();
  const { speak } = useSpeak();

  const handleOnClick = () => {
    if (sons_url) {
      play(sons_url);
    } else if (voiceLine) {
      speak(voiceLine);
    }
  };

  return (
    <img
      className="h-12 w-12 speaker"
      src={hautParleur}
      alt="Speaker"
      onClick={handleOnClick}
      style={{ cursor: "pointer" }}
    />
  );
};

export default Speaker;
