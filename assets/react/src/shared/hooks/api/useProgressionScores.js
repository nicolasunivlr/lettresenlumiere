import { useCallback, useEffect, useState } from "react";
import { profilesApi } from "../../api/profiles-api";
import { useAuth } from "../../../features/auth";

/**
 * Calcule le type de médaille à partir du score moyen (scoreAvg).
 * @param {number} scoreAvg - Score moyen (0-100)
 * @returns {string|null} 'gold' | 'silver' | 'bronze' | null
 */
export const getMedalFromScore = (scoreAvg) => {
  if (scoreAvg >= 80) return "gold";
  if (scoreAvg >= 60) return "silver";
  if (scoreAvg >= 40) return "bronze";
  return null;
};

/**
 * Hook qui récupère la progression via l'API account_profile/{id}/progression.
 * Le score dans chaque progression est le score d'une séquence.
 * Retourne scoreBySequenceId pour permettre le calcul de la médaille par étape
 * (moyenne des scores des séquences de l'étape).
 * @returns {{ scoreBySequenceId: Record<number, number>, loading: boolean }}
 */
const useProgressionScores = () => {
  const { user } = useAuth();
  const [scoreBySequenceId, setScoreBySequenceId] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchProgress = useCallback(async (accountId) => {
    try {
      setLoading(true);
      const data = await profilesApi.getProgress(accountId);
      const profile = data?.member?.[0];
      const progressions = profile?.progressions ?? [];

      // Chaque score représente le score d'une séquence. On moyenne si plusieurs
      // progressions pour la même séquence (ex. plusieurs exercices/tentatives).
      const sumBySequence = {};
      const countBySequence = {};

      for (const p of progressions) {
        const sequenceId = p?.exercice?.sequence?.id;
        if (sequenceId == null) continue;
        const score = Number(p.score);
        if (Number.isNaN(score)) continue;

        sumBySequence[sequenceId] = (sumBySequence[sequenceId] ?? 0) + score;
        countBySequence[sequenceId] = (countBySequence[sequenceId] ?? 0) + 1;
      }

      const nextScoreBySequenceId = {};
      for (const seqId of Object.keys(sumBySequence)) {
        const total = sumBySequence[seqId];
        const count = countBySequence[seqId];
        nextScoreBySequenceId[Number(seqId)] = count > 0 ? total / count : 0;
      }

      setScoreBySequenceId(nextScoreBySequenceId);
    } catch (err) {
      console.error("Erreur récupération progression:", err);
      setScoreBySequenceId({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const accountId = user?.accountId;
    if (accountId && user?.id !== "guest") {
      fetchProgress(accountId);
    } else {
      setScoreBySequenceId({});
      setLoading(false);
    }
  }, [user?.accountId, user?.id, fetchProgress]);

  return { scoreBySequenceId, loading };
};

export default useProgressionScores;
