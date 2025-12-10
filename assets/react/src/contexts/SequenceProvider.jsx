import React from "react";

export const SequenceContext = React.createContext();

const SequenceProvider = ({ children }) => {
  return (
    <SequenceContext.Provider value={null}>{children}</SequenceContext.Provider>
  );
};
