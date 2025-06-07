import { useCallback, useEffect, useState } from 'react';
import useConfig from '../useConfig.js';

const useDataExercice = (seqId) => {
  const [exerciceData, setExerciceData] = useState(null);
  const config = useConfig();

  const getExercises = useCallback(
    async (seqId) => {
      if (!config || !seqId) return;
      try {
        const response = await fetch(`${config.apiSequences}/${seqId}`);
        const data = await response.json();
        setExerciceData(data);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'exercice :", error);
        throw error;
      }
    },
    [config]
  );

  useEffect(() => {
    if (config && seqId) {
      getExercises(seqId);
    }
  }, [getExercises, seqId, config]);

  return exerciceData;
};

export default useDataExercice;
