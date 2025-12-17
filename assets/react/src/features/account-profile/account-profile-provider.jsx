import React from "react";
import { config } from "../../shared/config";
import { useAuth } from "../auth";
import { AccountProfile } from "./account-profile";

/*
{
  "@context": "/api/contexts/AccountProfile",
  "@id": "/api/account_profiles/1",
  "@type": "AccountProfile",
  "id": 1,
  "firstName": "Joe", ???
  "lastName": "Doe", ???
}




*/

/**
 * Contexte englobant l'état et les actions liés à l'entité métier AccountProfile.
 */
const AccountProfileContext = React.createContext();

const initialState = {
  loading: false,
  error: false,
  accountProfile: null,
};

export const AccountProfileProvider = ({ children }) => {
  const [state, setState] = React.useState(initialState);
  const { isAuthenticated, user } = useAuth();

  // Au montage du provider, on récupère les données de l'utilisateur (si authentifié)
  React.useEffect(() => {
    const getAccountProfile = async (userId) => {
      try {
        // On appel l'API pour récupérer les données du compte associé à cet utilisateur
        console.debug(`[GET:api/account_profiles/${userId}:start]`);
        setState((prev) => ({ ...prev, loading: true }));
        // --- Toute cette logique pourrait être déléguée à un service externe ---
        const response = await fetch(config.accountProfiles + `/${userId}`);
        if (!response.ok) {
          throw new Error(
            "Erreur lors de la récupération des données utilisateur."
          );
        }
        const data = await response.json();
        // ----------------------------------------------------------------------
        console.debug(`[GET:api/account_profiles/${userId}:success]`, data);
        setState({
          ...initialState,
          accountProfile: new AccountProfile(data),
        });
      } catch (error) {
        console.debug(`[GET:api/account_profiles/${userId}:error]`, error);
        setState({
          ...initialState,
          error: "Une erreur est survenue lors du chargement de votre profil.",
        });
      }
    };
    // Récupération des données utilisateur après l'authentification
    if (isAuthenticated && user) {
      getAccountProfile(user.accountId);
    } else {
      setState(initialState);
    }
  }, [isAuthenticated, user]);

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
