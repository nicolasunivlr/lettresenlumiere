import { useEffect, useState } from "react";
import { useProfile } from "../../features/profile/profile-provider";
import { useAuth } from "../../features/auth/providers/auth-provider";
import { profilesApi } from "../../shared/api/profiles-api";
import Loader from "../../shared/components/UI/Loader";

import GraphiqueProgressioIcon  from "../../assets/images/icones/graphique.png"
import ZoomIcon from "../../assets/images/icones/zoom-icon.png"
import GoldMedal from "../../assets/images/gamification/medals/goldMedal-icon.png"
import SilverMedal from "../../assets/images/gamification/medals/silverMedal-icon.png"
import BronzeMedal from "../../assets/images/gamification/medals/bronzeMedal-icon.png"

export const ProgressionPage = () => {

  const { profile } = useProfile();
  const { user } = useAuth();
  const [progressions, setProgressions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgressions = async () => {
      if (!profile || profile.isGuest()) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await profilesApi.getAllProgressions(profile.id);
        setProgressions(data);
      } catch (err) {
        setError(err.message);
        console.error("Erreur lors du chargement des progressions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgressions();
  }, [profile]);

  if (loading) {
    return (
      <div className="loader-container">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="p-4">
          <p className="text-red-600">Erreur: {error}</p>
        </div>
      </div>
    );
  }

  // Renvoyer la médaile adaptée au score obtenu
  const getMedalByScore = (score) => {
    if (score >= 80) return GoldMedal;
    if (score >= 50) return SilverMedal;
    if (score > 0) return BronzeMedal;
    return null;
  };
    
  if (!profile || profile.isGuest()) {
    return (
      <div>
        <div className="p-4">
          <p>Vous devez être connecté pour voir vos progressions.</p>
        </div>
      </div>
    );
  }

  return (
  <div className="container-progression">

     {/* Header */}
    <div className="container-progression__header">
      <img
        src={GraphiqueProgressioIcon}
        alt="Graphique progression"
        className="header__icon"
      />
      <h2 className="header__title">Mes progressions</h2>
    </div>

    {/* Cartes des étapes de progressions */}
    {!progressions || progressions.length === 0 ? (
      <p>Aucune progression disponible.</p>
    ) : (
      <div className="progression-grid">
        {progressions.map((etape) => (
          <div key={etape.id} className="progression-card">
            <h2 className="progression-card__title">{etape.nom}</h2>
            <table className="progression-table">
              <thead>
                <tr>
                  <th></th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {etape.sequences.map((sequence) => (
                  <tr key={sequence.id}>
                    {/* Nom de la séquence */}
                    <td>{sequence.nom}</td>
                    {/* Score moyen des exercices de la séquence et medaille */}
                    <td>
                      {sequence.score_moyen !== null && (
                        <div className="score-content">
                          {getMedalByScore(sequence.score_moyen) && (
                            <img
                              className="medal-icon"
                              src={getMedalByScore(sequence.score_moyen)}
                              alt="medal"
                            />
                          )}
                          <span>{sequence.score_moyen}%</span>
                        </div>
                      )}
                    </td>
                    {/* Lien vers le détail des résultat de la séquence */}
                    <td>
                      <div className="col-right">
                        {sequence.score_moyen !== null && (
                          <img className="zoom-icon" src={ZoomIcon} alt="" />
                        )}
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    )}
  </div>
);

};
