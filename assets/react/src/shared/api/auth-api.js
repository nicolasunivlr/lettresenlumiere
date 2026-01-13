import { config } from "../config";

/**
 * API client pour l'authentification
 */
export const authApi = {
  /**
   * Connexion d'un utilisateur
   * @param {Object} credentials - { username: string, password: string }
   * @returns {Promise<Object>} Données de l'utilisateur connecté
   */
  login: async (credentials) => {
    const response = await fetch(config.login, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(
        data.error ||
          data.message ||
          data.detail ||
          "Erreur lors de la connexion."
      );
    }

    return response.json();
  },

  /**
   * Déconnexion d'un utilisateur
   * @returns {Promise<void>}
   */
  logout: async () => {
    await fetch(config.logout, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  },

  /**
   * Vérification de l'authentification de l'utilisateur
   * @returns {Promise<Object>} Données de l'utilisateur si authentifié
   */
  check: async () => {
    const response = await fetch(config.check, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(
        data.error ||
          data.message ||
          data.detail ||
          "Erreur lors de la vérification de l'authentification."
      );
    }
    return response.json();
  },
};
