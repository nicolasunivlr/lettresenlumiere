import React from "react";
import { config } from "../config";
import { Sequence } from "./Sequence";
import { useParams } from "react-router-dom";

/**
 * Contexte englobant l'état et les actions liés à l'entité métier Sequence.
 */
export const SequenceContext = React.createContext();

const initialState = {
  loading: false,
  error: false,
  sequence: null,
};

/**
 * Ce provider fourni le contexte `SequenceContext` à ses composants enfants.
 * Il est monté à chaque fois que la route `/sequence/:id` est demandée (voir `App.jsx`).
 */
export const SequenceProvider = ({ children }) => {
  const { id } = useParams();
  const [sequenceState, setSequenceState] = React.useState(initialState);

  React.useEffect(() => {
    console.debug("SequenceContext mounted");
    const fetchSequenceById = async (id) => {
      console.debug("[sequence:fetch:start]");
      setSequenceState((prev) => ({ ...prev, loading: true }));

      if (!config?.apiSequences) {
        console.debug("[sequence:fetch:error]");
        console.error("Missing configuration for the requested ressource.");
        setSequenceState({
          ...initialState,
          error: "Une erreur est survenue.",
        });
        return;
      }

      try {
        const response = await fetch(`${config.apiSequences}/${id}`);

        if (!response.ok) {
          console.log(response);
          switch (response.status) {
            case 404:
              throw new Error(
                "La séquence d'exercices que vous recherchez n'existe pas."
              );
            default:
              throw new Error(
                `Une erreur est survenue lors du chargement de la séquence d'exercice.`
              );
          }
        }
        const data = await response.json();
        console.debug("[sequence:fetch:success]");
        setSequenceState({
          ...initialState,
          sequence: Sequence.createDTO(data),
        });
      } catch (e) {
        console.debug("[sequence:fetch:error]");
        console.error(e.message);
        setSequenceState({
          ...initialState,
          error: e.message,
        });
      }
    };

    fetchSequenceById(id);

    return () => {
      console.debug("SequenceContext unmounted");
    };
  }, []);

  const ctx = {
    state: sequenceState,
  };

  return (
    <SequenceContext.Provider value={ctx}>{children}</SequenceContext.Provider>
  );
};

/**
 * Ce hook offre une abstraction pour accèder à l'état et aux actions du contexte de la séquence.
 */
export const useSequence = () => {
  const ctx = React.useContext(SequenceContext);

  if (!ctx) throw new Error("This hook must be wrapped in a SequenceProvider.");

  return ctx.state;
};
