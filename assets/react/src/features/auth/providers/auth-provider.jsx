import React from "react";
import { config } from "../../../shared/config";
import { AuthActions } from "../constants";
import { authReducer } from "../auth-reducer";

export const AuthContext = React.createContext();

const initialState = {
  isLoading: false,
  isChecking: true,
  error: false,
  isAuthenticated: false,
  user: null,
};

/**
 * Ce provider fourni le contexte `AuthContext` à ses composants enfants.
 */
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(authReducer, initialState);

  const login = async (credentials, asGuest) => {
    if (asGuest) {
      console.debug("[auth:login:guest]");
      dispatch({
        type: AuthActions.LOGIN_SUCCESS,
        payload: { id: "guest", roles: [] },
      });
      return true;
    }

    console.debug("[auth:login:start]");
    dispatch({ type: AuthActions.LOGIN_START });
    try {
      const response = await fetch(config.login, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        let errorMessage = "Erreur lors de la connexion.";
        if (response.status === 401) {
          errorMessage = "Identifiants invalides.";
        } else if (response.status === 404) {
          errorMessage = "Utilisateur non trouvé.";
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.debug("[auth:login:success]", data);
      dispatch({ type: AuthActions.LOGIN_SUCCESS, payload: data.data });
      return true;
    } catch (e) {
      console.debug("[auth:login:error]", e.message);
      dispatch({ type: AuthActions.LOGIN_ERROR, payload: e.message });
      return false;
    }
  };

  const logout = async () => {
    console.debug("[auth:logout:start]");
    try {
      dispatch({ type: AuthActions.LOGOUT_START });
      await fetch(config.logout, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.debug("[auth:logout:success]");
      dispatch({ type: AuthActions.LOGOUT_SUCCESS });
    } catch (e) {
      console.debug("[auth:logout:error]");
      dispatch({ type: "LOGOUT_ERROR", payload: e.message });
    }
  };

  React.useEffect(() => {
    const checkAuth = async () => {
      console.debug("[auth:check:start]");
      dispatch({ type: AuthActions.CHECK_AUTH_START });

      try {
        const response = await fetch(config.me, {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Not authenticated");
        }
        console.debug("[auth:check:success]");
        const data = await response.json();
        dispatch({ type: AuthActions.CHECK_AUTH_SUCCESS, payload: data.data });
      } catch (e) {
        console.error(e.message);
        console.debug("[auth:check:error]", e.message);
        dispatch({ type: AuthActions.CHECK_AUTH_ERROR, payload: e.message });
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = React.useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return ctx;
};
