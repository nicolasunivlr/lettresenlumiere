import { useState, useEffect } from 'react';
import RedirectButton from './RedirectButton';
import BronzMedal from '../../assets/images/gamification/medailleetapebronze.svg';
import SilverMedal from '../../assets/images/gamification/medailleetapeargent.svg';
import GoldMedal from '../../assets/images/gamification/medailleetapeor.svg';

const medalsSvg = {
  bronze: BronzMedal,
  silver: SilverMedal,
  gold: GoldMedal,
};

const showMedals = (medal) => {
  const medalSrc = medalsSvg[medal];
  return medalSrc;
};

const EtapesButton = (props) => {
  const { link, text, width, py, id } = props;
  const [medalType, setMedalType] = useState(null);

  useEffect(() => {
    if (sessionStorage.getItem(`${id}`)) {
      const scoreAvg = Number(sessionStorage.getItem(`${id}`));
      if (scoreAvg >= 80) {
        setMedalType('gold');
      } else if (scoreAvg >= 60) {
        setMedalType('silver');
      } else if (scoreAvg >= 40) {
        setMedalType('bronze');
      }
    }
  }, [id]);

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
