import usePlay from "../../shared/hooks/usePlay";
import Speaker from "./UI/Speaker";

const Instruction = (props) => {
  const { exercice } = props;
  const { play } = usePlay();

  const handleOnClick = () => {
    if (exercice.sons_url) {
      play(exercice);
    }
  };

  return (
    <div className="consigneContainerWrapper" onClick={handleOnClick}>
      <div className="consigneContainer">
        <h3 className=" consigne text-center">{exercice.consigne}</h3>
        <Speaker />
      </div>
    </div>
  );
};

export default Instruction;
