import React from "react";
import { sequencesApi } from "../../shared/api/sequences-api";
import { Sequence } from "./sequence";
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
 * Il est monté à chaque fois qu'une des routes `/sequence/:id` est demandée (voir `App.jsx`).
 */
export const SequenceProvider = ({ children }) => {
  const { id } = useParams();
  const [sequenceState, setSequenceState] = React.useState(initialState);

  React.useEffect(() => {
    const fetchSequenceById = async (id) => {
      setSequenceState((prev) => ({ ...prev, loading: true }));

      try {
        const data = await sequencesApi.getById(id);
        setSequenceState({
          ...initialState,
          sequence: Sequence.createFromData(data),
        });
      } catch (e) {
        console.error(e.message);
        setSequenceState({
          ...initialState,
          error: e.message,
        });
      }
    };

    // Pas de params pour 'alphabet' et 'graphemes'
    if (!id) {
      return;
    }

    fetchSequenceById(id);
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
