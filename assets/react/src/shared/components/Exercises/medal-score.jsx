import GoldMedal from "../../../assets/images/gamification/medailleetapeor.svg";
import SilverMedal from "../../../assets/images/gamification/medailleetapeargent.svg";
import BronzeMedal from "../../../assets/images/gamification/medailleetapebronze.svg";

const GOLD_THRESHOLD = 80;
const SILVER_THRESHOLD = 60;
const BRONZE_THRESHOLD = 40;

const MedalInfo = {
  gold: {
    src: GoldMedal,
    bgClass: "medal-score--bravo",
  },
  silver: {
    src: SilverMedal,
    bgClass: "medal-score--bien",
  },
  bronze: {
    src: BronzeMedal,
    bgClass: "medal-score--pasmal",
  },
  none: {
    src: null,
    bgClass: "medal-score--revoir",
  },
};

const getMedalInfo = (score) => {
  if (score >= GOLD_THRESHOLD) return MedalInfo.gold;
  if (score >= SILVER_THRESHOLD) return MedalInfo.silver;
  if (score >= BRONZE_THRESHOLD) return MedalInfo.bronze;
  return MedalInfo.none;
};

export const MedalScore = ({ averageScore }) => {
  const medalInfo = getMedalInfo(averageScore);

  return (
    <div className={`medal-score ${medalInfo.bgClass}`}>
      {medalInfo.src && <img src={medalInfo.src} />}
      <p>{averageScore.toFixed()}%</p>
    </div>
  );
};
