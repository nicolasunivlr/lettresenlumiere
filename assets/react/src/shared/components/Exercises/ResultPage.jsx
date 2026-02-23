import { useEffect } from "react";
import GoldMedal from "../../../assets/images/gamification/medailleetapeor.svg";
import SilverMedal from "../../../assets/images/gamification/medailleetapeargent.svg";
import BronzeMedal from "../../../assets/images/gamification/medailleetapebronze.svg";
import NextExerciseButton from "../UI/NextExerciseButton";
import { useParams, useNavigate } from "react-router-dom";
import PDFModal from "../UI/PDFModal";
import { MedalScore } from "./medal-score";
import { ProgressCircles } from "../../../features/sequences/components/progress-circle";

const ResultPage = ({ context, circleOnClick, progress, onRetry }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  /*
  `context` contient généralement la séquence complète, je l'appel ainsi car il
  pourrait contenir à l'avenir d'autres infos que la séquence, c'est à dire
  uniquement ce dont ce composant à besoin.
  */
  const { exercises, etapeId } = context;

  /**
   * @deprecated Pour le mode **SEQUENCE**, le composant parent renvoit la
   * progression correspondante. Et c'est le composant dédié à l'affichage du
   * score (`MedalScore`) qui se charge de déterminer quelle médaille afficher
   * en fonction du score moyen.
   *
   * @note Pour le mode **ALPHABET** et **GRAPHEMES** cette fonction est
   * toujours utilisée pour le moment.
   */
  const showScore = () => {
    if (!exercises || exercises.length === 0) {
      return { scoreAvg: 0, medalSrc: null };
    }
    const scoreTotal = exercises.reduce(
      (acc, exercice) => acc + (exercice.score || 0),
      0,
    );
    const scoreAvg = Math.round((scoreTotal / exercises.length) * 100) / 100;
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

  // ---------------------------------------------------------------------------
  // TODO: à supprimer, on récupère les médailles via l'API pour les utilisateurs
  // connectés et via LocalStorage pour le mode libre.
  useEffect(() => {
    const sessionScores = JSON.parse(sessionStorage.getItem("scores")) || {};
    // ajout du scoreAvg en tant qu'objet avec l'id de la séquence
    sessionScores[id] = scoreAvg;
    sessionStorage.setItem("scores", JSON.stringify(sessionScores));
  }, [context]);
  // ---------------------------------------------------------------------------

  const handleOnClick = () => {
    navigate({
      pathname: "/etapes",
      search: `?id=${etapeId}`,
    });
  };

  const { scoreAvg, medalSrc, bgc } = showScore();

  return (
    <section className="results-container">
      <div className="header-result">
        {progress ? (
          <MedalScore progress={progress} />
        ) : (
          /* Pour garder la compatibilité avec les autres modes d'exercices. */
          <div className={`medal-score ${bgc}`}>
            {medalSrc && <img src={medalSrc} />}
            <p>{scoreAvg.toFixed()}%</p>
          </div>
        )}
        {/*
        <PDFModal
          content={content}
          sequence={sequence.nom}
          etapeid={etapeid}
          score={scoreAvg.toFixed()}
        /> */}
      </div>
      <ProgressCircles
        count={exercises.length}
        containerClassName="results"
        progress={progress}
        labels={exercises.map((e) => e.consigne)}
        onChange={(index) => onRetry(index)}
      />

      <NextExerciseButton onClick={handleOnClick} />
    </section>
  );
};

export default ResultPage;
