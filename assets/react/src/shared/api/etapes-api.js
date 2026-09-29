import { config } from "../config";

/**
 * API client pour les étapes
 */
export const etapesApi = {
  /**
   * Récupère toutes les étapes
   * @returns {Promise<Array>} Liste des étapes
   */
  getAll: async () => {
    const response = await fetch(config.apiEtapes);

    if (!response.ok) {
      throw new Error(
        "Erreur lors de la récupération des étapes."
      );
    }

    const data = await response.json();
    return data.member;
  },
};

