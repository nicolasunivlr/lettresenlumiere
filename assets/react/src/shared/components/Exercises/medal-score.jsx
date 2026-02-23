import GoldMedal from "../../../assets/images/gamification/medailleetapeor.svg";
import SilverMedal from "../../../assets/images/gamification/medailleetapeargent.svg";
import BronzeMedal from "../../../assets/images/gamification/medailleetapebronze.svg";

const GOLD_THRESHOLD = 80;
const SILVER_THRESHOLD = 60;
const BRONZE_THRESHOLD = 40;

/**
 * Helper pour calculer la moyennes des scores et la transférer au ResultPage.
 *
 * @param {array} progress
 * @returns La moyenne des scores de la séquence, ou 0 si non applicable.
 */
const calcAvgScore = (progress) => {
  if (!progress || progress.length === 0) {
    return 0;
  }
  const totalScore = progress.reduce((acc, p) => acc + (p?.score || 0), 0);
  return totalScore / progress.length;
};

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

export const MedalScore = ({ progress }) => {
  const avgScore = calcAvgScore(progress);
  const medalInfo = getMedalInfo(avgScore);

  return (
    <div className={`medal-score ${medalInfo.bgClass}`}>
      {medalInfo.src && <img src={medalInfo.src} />}
      <p>{avgScore.toFixed()}%</p>
    </div>
  );
};
