import { config } from "../config";

/**
 * API client pour les profils utilisateur
 */
export const profilesApi = {
  /**
   * Récupère le profil d'un utilisateur par son ID
   * @param {string|number} userId - ID de l'utilisateur
   * @returns {Promise<Object>} Données du profil utilisateur
   */
  getById: async (userId) => {
    const response = await fetch(`${config.accountProfiles}/${userId}`);

    if (!response.ok) {
      throw new Error(
        "Erreur lors de la récupération des données utilisateur."
      );
    }

    return response.json();
  },

  /**
   * Récupère le profil de l'utilisateur connecté
   * @returns {Promise<Object>} Données du profil utilisateur
   */
  getMe: async () => {
    const response = await fetch(config.accountProfilesMe, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(
        "Erreur lors de la récupération de votre profil."
      );
    }

    return response.json();
  },

  /**
   * Récupère la progression d'un compte utilisateur
   * @param {string|number} accountId - ID du compte
   * @returns {Promise<Object>} Données de progression
   */
  getProgress: async (accountId) => {
    const response = await fetch(config.accountProfileProgress(accountId), {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération de la progression.");
    }

    return response.json();
  },
};

