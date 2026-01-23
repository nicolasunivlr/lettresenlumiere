import { useEffect, useState } from "react";
import { useProfile } from "../../features/profile/profile-provider";
import { profilesApi } from "../../shared/api/profiles-api";
import Loader from "../../shared/components/UI/Loader";
import Header from "../../shared/components/Header";

export const ProgressionPage = () => {
  const { profile } = useProfile();
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
        <Header />
        <div className="p-4">
          <p className="text-red-600">Erreur: {error}</p>
        </div>
      </div>
    );
  }

  if (!profile || profile.isGuest()) {
    return (
      <div>
        <Header />
        <div className="p-4">
          <p>Vous devez être connecté pour voir vos progressions.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Mes Progressions</h1>
        
        {!progressions || progressions.length === 0 ? (
          <p className="text-gray-600">Aucune progression disponible.</p>
        ) : (
          <div className="space-y-6">
            {progressions.map((etape) => (
              <div key={etape.id} className="border rounded-lg p-4 shadow-md">
                <h2 className="text-2xl font-semibold mb-4">
                  {etape.nom}
                </h2>
                
                {etape.sequences.length === 0 ? (
                  <p className="text-gray-500">Aucune séquence disponible.</p>
                ) : (
                  <div className="space-y-3">
                    {etape.sequences.map((sequence) => (
                      <div
                        key={sequence.id}
                        className="border-l-4 border-blue-500 pl-4 py-2"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-xl font-medium">
                              {sequence.nom}
                            </h3>
                          </div>
                          <div className="text-right">
                            {sequence.score_moyen !== null ? (
                              <span className="text-lg font-bold text-blue-600">
                                {sequence.score_moyen}%
                              </span>
                            ) : (
                              <span className="text-gray-400">Non commencé</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
