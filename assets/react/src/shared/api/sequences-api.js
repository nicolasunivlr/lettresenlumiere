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

  
  /**
   * Récupèrer les résultats détaillés d'une séquence pour un compte utilisateur donné
   *
   * Cette route renvoye la liste des exercices avec leurs scores individuels.
   *
   * Exemple de réponse :
   * [
   *   {
   *     id: 12,
   *     consigne: "Entoure la lettre A",
   *     score: 1
   *   },
   *   {
   *     id: 13,
   *     consigne: "Lis le mot",
   *     score: 0
   *   }
   * ]
   *
   * @param {string|number} accountId - ID du compte utilisateur
   * @param {string|number} sequenceId - ID de la séquence
   * @returns {Promise<Array>} Liste des exercices avec score individuel
   */
  getResultsForAccount: async (accountId, sequenceId) => {
  const response = await fetch(
    config.accountProfileSequenceResults(accountId, sequenceId),
    { credentials: "include" }
  );

  if (!response.ok) {
    throw new Error(
      "Erreur lors de la récupération des résultats de la séquence."
    );
  }

  return response.json();
},
};

