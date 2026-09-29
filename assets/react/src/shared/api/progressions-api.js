import { config } from "../config";

/**
 * API client pour les progressions
 */
export const progressionsApi = {
  /**
   * Crée une nouvelle progression pour un exercice
   * @param {Object} progressionData - Données de la progression
   * @param {number} progressionData.score - Score obtenu
   * @param {number} progressionData.exerciseId - ID de l'exercice
   * @param {number} progressionData.accountId - ID du compte utilisateur
   * @returns {Promise<Object>} Données de la progression créée
   */
  create: async ({ score, exerciseId, accountId }) => {
    const response = await fetch(config.progressions, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/ld+json",
      },
      body: JSON.stringify({
        score: score,
        exercice: `/api/exercices/${exerciseId}`,
        accountProfile: `/api/account_profiles/${accountId}`,
      }),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la création de la progression.");
    }

    return response.json();
  },

  /**
   * Met à jour une progression existante
   * @param {Object} progressionData - Données de la progression
   * @param {number} progressionData.id - ID de la progression
   * @param {number} progressionData.score - Nouveau score
   * @param {number} progressionData.exerciseId - ID de l'exercice
   * @param {number} progressionData.accountId - ID du compte utilisateur
   * @returns {Promise<Object>} Données de la progression mise à jour
   */
  update: async ({ id, score, exerciseId, accountId }) => {
    const response = await fetch(`${config.progressions}/${id}`, {
      credentials: "include",
      method: "PATCH",
      headers: {
        "Content-Type": "application/merge-patch+json",
      },
      body: JSON.stringify({
        score: score,
        exercice: `/api/exercices/${exerciseId}`,
        accountProfile: `/api/account_profiles/${accountId}`,
      }),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la mise à jour de la progression.");
    }

    return response.json();
  },
};

