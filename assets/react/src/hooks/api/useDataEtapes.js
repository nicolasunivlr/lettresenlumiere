import { useCallback, useEffect, useState } from 'react';
import useConfig from '../useConfig.js';

const useDataEtapes = () => {
  const [etapesData, setEtapesData] = useState(null);
  const config = useConfig();

  const getEtapes = useCallback(async () => {
    if (!config) return;

    try {
      const response = await fetch(`${config.apiEtapes}`);
      const data = await response.json();
      setEtapesData(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des Etapes :', error);
      throw error;
    }
  }, [config]);

  useEffect(() => {
    if (config) {
      getEtapes();
    }
  }, [getEtapes, config]);

  return etapesData;
};

export default useDataEtapes;
