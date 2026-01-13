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

  /**
   * Inscription d'un nouvel utilisateur
   * @param {Object} registrationData - Données d'inscription
   * @returns {Promise<Object>} Données de l'utilisateur inscrit
   */
  register: async (registrationData) => {
    const response = await fetch(config.register, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registrationData),
    });

    if (!response.ok) {
      const data = await response.json();
      switch (response.status) {
        case 400:
          throw {
            message: data.message || "Données d'inscription invalides.",
            errors: data.errors || [],
          };
        case 409:
          throw {
            message: data.message || "Conflit lors de l'inscription.",
            errors: data.errors || [],
          };
        default:
          throw new Error(
            data.error ||
              data.message ||
              data.detail ||
              "Erreur lors de l'inscription."
          );
      }
    }

    return response.json();
  },
};
