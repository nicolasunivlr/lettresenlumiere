/**
 * Constantes et helpers partagés pour la logique de tentatives des exercices
 * B, C, D, E, F, H.
 *
 * Chaque item (ou round) d'un exercice dispose au maximum de `MAX_ATTEMPTS`
 * essais. Le statut final de l'item est déterminé par `getItemStatus`.
 */

export const MAX_ATTEMPTS = 4;

export const ITEM_STATUS = {
  PENDING: "pending",
  SUCCESS: "success",
  PARTIAL: "partial",
  FAILED: "failed",
};

/**
 * Détermine le statut final d'un item en fonction du nombre d'essais utilisés
 * et de si la réponse a finalement été trouvée.
 *
 * @param {number} attemptsUsed - Nombre d'essais consommés sur cet item (>= 1).
 * @param {boolean} isCorrect - true si l'item a été résolu correctement.
 * @returns {string} Une des valeurs de ITEM_STATUS.
 */
export const getItemStatus = (attemptsUsed, isCorrect) => {
  if (isCorrect) {
    return attemptsUsed <= 1 ? ITEM_STATUS.SUCCESS : ITEM_STATUS.PARTIAL;
  }
  return ITEM_STATUS.FAILED;
};

/**
 * Un item est considéré comme "terminé" (ne bloque plus la progression)
 * dès qu'il a un statut autre que PENDING, qu'il ait réussi ou échoué.
 */
export const isItemDone = (item) =>
  Boolean(item) && item.status !== ITEM_STATUS.PENDING;

/**
 * Raccourci pour construire un tableau initial d'items en attente.
 */
export const createPendingStatusArray = (length) =>
  new Array(length).fill(null).map(() => ({ status: ITEM_STATUS.PENDING }));

/**
 * Pondération utilisée pour calculer le score global d'un exercice à partir
 * des statuts de ses items : un item réussi du premier coup compte pour
 * 100%, un item réussi après plusieurs essais (partiel) pour 50%, et un
 * item resté en échec après MAX_ATTEMPTS essais pour 0%.
 */
export const STATUS_SCORE_WEIGHT = {
  [ITEM_STATUS.SUCCESS]: 100,
  [ITEM_STATUS.PARTIAL]: 50,
  [ITEM_STATUS.FAILED]: 0,
};

/**
 * Calcule le score global (0-100) d'un exercice à partir du tableau de
 * statuts de ses items (voir ITEM_STATUS). La moyenne des pondérations est
 * arrondie à l'entier le plus proche.
 *
 * @param {{status: string}[]} items
 * @returns {number}
 */
export const computeExerciseScore = (items) => {
  if (!Array.isArray(items) || items.length === 0) return 0;
  const total = items.reduce(
    (sum, item) => sum + (STATUS_SCORE_WEIGHT[item?.status] ?? 0),
    0
  );
  return Math.round(total / items.length);
};
