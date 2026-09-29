import RedirectButton from "./RedirectButton";
import BronzMedal from "../../../assets/images/gamification/medailleetapebronze.svg";
import SilverMedal from "../../../assets/images/gamification/medailleetapeargent.svg";
import GoldMedal from "../../../assets/images/gamification/medailleetapeor.svg";

const medalsSvg = {
  bronze: BronzMedal,
  silver: SilverMedal,
  gold: GoldMedal,
};

const showMedals = (medal) => medalsSvg[medal];

const EtapesButton = (props) => {
  const { link, text, width, py, medalType } = props;

  return medalType ? (
    <>
      <RedirectButton
        link={link}
        text={text}
        width={width}
        py={py}
        medal={showMedals(medalType)}
      ></RedirectButton>
    </>
  ) : (
    <RedirectButton link={link} text={text} width={width} py={py} />
  );
};

export default EtapesButton;
