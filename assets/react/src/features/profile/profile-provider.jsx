import React from "react";
import { config } from "../../shared/config";
import { useAuth } from "../auth";
import { AccountProfile } from "./account-profile";
import { GuestProfile } from "./guest-profile";

/**
 * Contexte englobant l'état et les actions liés à l'entité métier AccountProfile.
 */
const ProfileContext = React.createContext();

const initialState = {
  loading: false,
  error: false,
  profile: null,
};

export const ProfileProvider = ({ children }) => {
  const [state, setState] = React.useState(initialState);
  const { isAuthenticated, user } = useAuth();

  // Au montage du provider, on récupère les données de l'utilisateur (si authentifié)
  React.useEffect(() => {
    const getGuestProfile = () => {
      console.debug(`[profile:guest:init]`);
      setState({
        ...initialState,
        profile: new GuestProfile(),
      });
    };

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
          profile: new AccountProfile(data),
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
    if (isAuthenticated && user && user.id !== "guest") {
      getAccountProfile(user.accountId);
    } else if (isAuthenticated && user && user.id === "guest") {
      console.log("getting guest");
      getGuestProfile();
    } else {
      setState(initialState);
    }
  }, [isAuthenticated, user]);

  return (
    <ProfileContext.Provider value={{ ...state }}>
      {children}
    </ProfileContext.Provider>
  );
};

/**
 * Hook pour accéder au contexte de AccountProfile.
 */
export const useProfile = () => {
  const ctx = React.useContext(ProfileContext);

  if (!ctx) {
    throw new Error("useProfile must be used within an ProfileProvider");
  }

  return ctx;
};
