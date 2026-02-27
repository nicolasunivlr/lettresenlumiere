import { useNavigate, useParams } from "react-router-dom";
import CircleProgress from "../UI/CircleProgress";
import NextExerciseButton from "../UI/NextExerciseButton";
import PDFModal from "../UI/PDFModal";
import { useEffect } from "react";
import GoldMedal from "../../../assets/images/gamification/medailleetapeor.svg";
import SilverMedal from "../../../assets/images/gamification/medailleetapeargent.svg";
import BronzeMedal from "../../../assets/images/gamification/medailleetapebronze.svg";

const ResultPage = (props) => {
  const { content, circleOnClick, sequence, etapeid } = props;
  const { id } = useParams();
  const navigate = useNavigate();

  /*const showScore = () => {
    if (!content || content.length === 0) {
      return { scoreAvg: 0, medalSrc: null };
    }

    const scoreTotal = content.reduce(
      (acc, exercice) => acc + (exercice.score || 0),
      0,
    );
    const scoreAvg = Math.round((scoreTotal / content.length) * 100) / 100;
    let medalSrc = "";

    let bgc;

    if (scoreAvg >= 80) {
      medalSrc = GoldMedal;
      bgc = "medal-score--bravo";
    } else if (scoreAvg >= 60) {
      medalSrc = SilverMedal;
      bgc = "medal-score--bien";
    } else if (scoreAvg >= 40) {
      medalSrc = BronzeMedal;
      bgc = "medal-score--pasmal";
    } else {
      bgc = "medal-score--revoir";
    }

    return { scoreAvg, medalSrc, bgc };
  };
  */
  const showScore = () => {
    if (!content || content.length === 0) {
      return { scoreAvg: 0, medalSrc: null };
    }

    // Filtrer les exercices ayant un score non null
    const validScores = content
      .filter((exercice) => exercice.score !== null)
      .map((exercice) => exercice.score);

    console.log(validScores);

    // Calculer la moyenne uniquement sur les scores valides
    const scoreTotal = validScores.reduce((acc, score) => acc + score, 0);
    const scoreAvg =
      validScores.length > 0
        ? Math.round((scoreTotal / validScores.length) * 100) / 100
        : null;

    // Déterminer la médaille en fonction du score moyen
    let medalSrc = "";
    let bgc;

    if (scoreAvg >= 80) {
      medalSrc = GoldMedal;
      bgc = "medal-score--bravo";
    } else if (scoreAvg >= 60) {
      medalSrc = SilverMedal;
      bgc = "medal-score--bien";
    } else if (scoreAvg >= 40) {
      medalSrc = BronzeMedal;
      bgc = "medal-score--pasmal";
    } else {
      bgc = "medal-score--revoir";
    }

    return { scoreAvg, medalSrc, bgc };
  };

  useEffect(() => {
    const sessionScores = JSON.parse(sessionStorage.getItem("scores")) || {};
    // ajout du scoreAvg en tant qu'objet avec l'id de la séquence
    sessionScores[id] = scoreAvg;
    sessionStorage.setItem("scores", JSON.stringify(sessionScores));
  }, [content]);

  const handleOnClick = () => {
    console.log(sequence);

    if (sequence.nom === "Alphabet" || sequence.nom === "Graphèmes") {
      navigate(`/`);
    } else {
      navigate(`/etapes/${etapeid}`);
    }
  };

  const { scoreAvg, medalSrc, bgc } = showScore();

  return (
    <section className="results-container">
      <div className="header-result">
        {
          <div className={`medal-score ${bgc}`}>
            {medalSrc && <img src={medalSrc}></img>}
            <p>{scoreAvg.toFixed()}%</p>
          </div>
        }

        <PDFModal
          content={content}
          sequence={sequence.nom}
          etapeid={etapeid}
          score={scoreAvg.toFixed()}
        />
      </div>
      <div className="results">
        {content.map((exercice, index) => (
          <div key={index} className="result">
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
