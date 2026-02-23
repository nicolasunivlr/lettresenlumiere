import { useEffect, useState } from "react";
import { useProfile } from "../../features/profile/profile-provider";
import { useAuth } from "../../features/auth/providers/auth-provider";
import { profilesApi } from "../../shared/api/profiles-api";
import Loader from "../../shared/components/UI/Loader";
import { useNavigate, useParams } from "react-router-dom";

import GraphiqueProgressioIcon from "../../assets/images/icones/graphique.png";
import ZoomIcon from "../../assets/images/icones/zoom-icon.png";
import GoldMedal from "../../assets/images/gamification/medals/goldMedal-icon.png";
import SilverMedal from "../../assets/images/gamification/medals/silverMedal-icon.png";
import BronzeMedal from "../../assets/images/gamification/medals/bronzeMedal-icon.png";

export const ProgressionPage = () => {

  const { profile } = useProfile();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { accountId } = useParams(); // Récupèrer l'id si admin

  const [progressions, setProgressions] = useState(null);
  const [adminProfiles, setAdminProfiles] = useState(null);
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

        // Si admin et qu'on a un accountId -> load progression de cet account
        if (user?.isAdmin() && accountId) {
          const data = await profilesApi.getAllProgressions(accountId);
          setProgressions(data);
        } else {
          const data = await profilesApi.getAllProgressions(profile.id);
          setProgressions(data);
        }

        // Si admin -> liste des comptes
        if (user?.isAdmin()) {
          const adminData = await profilesApi.getAllAccountProfiles();
          setAdminProfiles(adminData.member);
        }

      } catch (err) {
        setError(err.message);
        console.error("Erreur lors du chargement :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgressions();
  }, [profile, user, accountId]);

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

        <button
          className="header__back-button return-button"
          onClick={() => navigate(-1)}
        >
          Retour
        </button>
        
        <div className="hearder_headline">
          <img
            src={GraphiqueProgressioIcon}
            alt="Graphique progression"
            className="header__icon"
          />
          <h2 className="header__title">Mes progressions</h2>
        </div>
        
      </div>

      {/* CONTENU ADMIN */}
      {user?.isAdmin() && !accountId ? (
        <div className="admin-content">

          <table className="admin-table">
            <caption>Liste des utilisateurs</caption>
            <thead>
              <tr>
                <th>Prénom</th>
                <th>Nom</th>
              </tr>
            </thead>
            <tbody>
              {adminProfiles?.map((acc) => (
                <tr
                  key={acc.id}
                  className="admin-row"
                  onClick={() => navigate(`/progression/${acc.id}`)}
                >
                  <td>{acc.firstname || "—"}</td>
                  <td>{acc.lastname || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      ) : (

        /* CONTENU UTILISATEUR */
        <>
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
                          <td>{sequence.nom}</td>
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
        </>
      )}
    </div>
  );
};
