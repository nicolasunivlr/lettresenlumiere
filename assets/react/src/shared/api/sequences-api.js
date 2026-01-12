import { config } from "../config";

/**
 * API client pour les séquences
 */
export const sequencesApi = {
  /**
   * Récupère une séquence par son ID
   * @param {string|number} id - ID de la séquence
   * @returns {Promise<Object>} Données de la séquence
   */
  getById: async (id) => {
    const response = await fetch(`${config.apiSequences}/${id}`);

    if (!response.ok) {
      switch (response.status) {
        case 404:
          throw new Error(
            "La séquence d'exercices que vous recherchez n'existe pas."
          );
        default:
          throw new Error(
            "Une erreur est survenue lors du chargement de la séquence d'exercice."
          );
      }
    }

    return response.json();
  },
};

