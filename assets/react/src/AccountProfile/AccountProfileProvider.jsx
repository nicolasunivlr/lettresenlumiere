import React from "react";
import { config } from "../config";

// Ce que useAuth() retournerait lorsque l'utilisateur est authentifié.
const isAuthenticated = true;
const authUser = {
  id: 1,
  username: "John Doe",
  role: ["ROLE_USER"],
};

/**
 * Contexte englobant l'état et les actions liés à l'entité métier User.
 */
const AccountProfileContext = React.createContext();

const initialState = {
  loading: false,
  error: false,
  accountProfile: null,
};

export const AccountProfileProvider = ({ children }) => {
  const [state, setState] = React.useState(initialState);
  // const { isAuthenticated, user: authUser } = useAuth();

  // Au montage du provider, on récupère les données de l'utilisateur (si authentifié)
  React.useEffect(() => {
    const getAccountProfile = async (userId) => {
      try {
        // On appel l'API pour récupérer les données utilisateur
        console.debug(`[GET:api/account_profiles/${authUser.id}:start]`);
        setState((prev) => ({ ...prev, loading: true }));
        // --- Toute cette logique pourrait être déléguée à un service externe ---
        const response = await fetch(config.accountProfiles + `/${userId}`);
        if (!response.ok) {
          throw new Error(
            "Erreur lors de la récupération des données utilisateur."
          );
        }
        const accountProfile = await response.json();
        // ----------------------------------------------------------------------
        console.debug(
          `[GET:api/account_profiles/${authUser.id}:success]`,
          accountProfile
        );
        setState({
          ...initialState,
          accountProfile: accountProfile,
        });
      } catch (error) {
        console.debug(`[GET:api/account_profiles/${authUser.id}:error]`, error);
        setState({
          ...initialState,
          error: "Une erreur est survenue lors du chargement de votre profil.",
        });
      }
    };
    // Récupération des données utilisateur après l'authentification
    if (isAuthenticated && authUser) {
      getAccountProfile(authUser.id);
    }
  }, []);

  return (
    <AccountProfileContext.Provider value={{ ...state }}>
      {children}
    </AccountProfileContext.Provider>
  );
};

/**
 * Hook pour accéder au contexte de AccountProfile.
 */
export const useAccountProfile = () => {
  const ctx = React.useContext(AccountProfileContext);

  if (!ctx) {
    throw new Error(
      "useAccountProfile must be used within an AccountProfileProvider"
    );
  }

  return ctx;
};
