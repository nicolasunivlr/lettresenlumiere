import { useCallback, useEffect, useState } from "react";
import { etapesApi } from "../../api/etapes-api";

/**
 * @deprecated
 */
const useDataEtapes = () => {
  const [etapesData, setEtapesData] = useState(null);

  const getEtapes = useCallback(async () => {
    try {
      const data = await etapesApi.getAll();
      setEtapesData(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des Etapes :", error);
      throw error;
    }
  }, []);

  useEffect(() => {
    getEtapes();
  }, [getEtapes]);

  return etapesData;
};

export default useDataEtapes;
