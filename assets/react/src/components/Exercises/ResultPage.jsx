/* eslint-disable react/prop-types */
import { useEffect } from 'react';
import CircleProgress from '../UI/CircleProgress';
import GoldMedal from '../../assets/images/gamification/medailleetapeor.svg';
import SilverMedal from '../../assets/images/gamification/medailleetapeargent.svg';
import BronzeMedal from '../../assets/images/gamification/medailleetapebronze.svg';
import NextExerciseButton from '../UI/NextExerciseButton';
import { useParams, useNavigate } from 'react-router-dom';
import PDFModal from '../UI/PDFModal';

const ResultPage = (props) => {
  const { content, circleOnClick, sequence, etapeid } = props;
  const { id } = useParams();
  const navigate = useNavigate();
  const showScore = () => {
    if (!content || content.length === 0) {
      return { scoreAvg: 0, medalSrc: null };
    }

    const scoreTotal = content.reduce(
      (acc, exercice) => acc + (exercice.score || 0),
      0
    );
    const scoreAvg = Math.round((scoreTotal / content.length) * 100) / 100;
    let medalSrc = '';

    let bgc;

    if (scoreAvg >= 80) {
      medalSrc = GoldMedal;
      bgc = 'medal-score--bravo';
    } else if (scoreAvg >= 60) {
      medalSrc = SilverMedal;
      bgc = 'medal-score--bien';
    } else if (scoreAvg >= 40) {
      medalSrc = BronzeMedal;
      bgc = 'medal-score--pasmal';
    } else {
      bgc = 'medal-score--revoir';
    }

    return { scoreAvg, medalSrc, bgc };
  };

  useEffect(() => {
    sessionStorage.setItem(`${id}`, scoreAvg);
  }, [content]);

  const handleOnClick = () => {
    navigate(`/`);
  };

  const { scoreAvg, medalSrc, bgc } = showScore();

  return (
    <section className='results-container'>
      <div className='header-result'>
        {
          <div className={`medal-score ${bgc}`}>
            {medalSrc && <img src={medalSrc}></img>}
            <p>{scoreAvg.toFixed()}%</p>
          </div>
        }

        <PDFModal
          content={content}
          sequence={sequence}
          etapeid={etapeid}
          score={scoreAvg.toFixed()}
        />
      </div>
      <div className='results'>
        {content.map((exercice, index) => (
          <div key={index} className='result'>
            <CircleProgress
              score={exercice.score}
              number={index + 1}
              onClick={() => circleOnClick(exercice.id)}
            />
            <p>{exercice.consigne}</p>
          </div>
        ))}
      </div>

      <NextExerciseButton onClick={handleOnClick} />
    </section>
  );
};

export default ResultPage;
