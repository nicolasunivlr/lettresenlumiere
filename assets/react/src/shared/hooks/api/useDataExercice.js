import { useCallback, useEffect, useState } from "react";
import { sequencesApi } from "../../api/sequences-api";

/**
 * @deprecated
 */
const useDataExercice = (seqId) => {
  const [exerciceData, setExerciceData] = useState(null);

  const getExercises = useCallback(async (seqId) => {
    if (!seqId) return;
    try {
      const data = await sequencesApi.getById(seqId);
      setExerciceData(data);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'exercice :", error);
      throw error;
    }
  }, []);

  useEffect(() => {
    if (seqId) {
      getExercises(seqId);
    }
  }, [getExercises, seqId]);

  return exerciceData;
};

export default useDataExercice;
