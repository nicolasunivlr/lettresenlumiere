import React from "react";
import { config } from "../../../shared/config";
import { AuthActions } from "../auth-actions";
import { authReducer } from "../auth-reducer";
import { authApi } from "../../../shared/api/auth-api";
import { authService } from "../auth-service";

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
      console.debug("[auth:login_as_guest:start]");
      dispatch({
        type: AuthActions.LOGIN_SUCCESS,
        payload: authService.createGuestUser(),
      });
      sessionStorage.setItem(config.guestTokenKey, JSON.stringify(Date.now()));
      console.debug("[auth:login_as_guest:success]");
      return true;
    }

    console.debug("[auth:login:start]");
    dispatch({ type: AuthActions.LOGIN_START });
    try {
      const data = await authApi.login(credentials);
      const loggedInUser = authService.createLoggedUser(data);
      console.debug("[auth:login:success]", loggedInUser);
      dispatch({ type: AuthActions.LOGIN_SUCCESS, payload: loggedInUser });
      return true;
    } catch (e) {
      console.debug("[auth:login:error]", e.message);
      dispatch({ type: AuthActions.LOGIN_ERROR, payload: e.message });
      return false;
    }
  };

  const logout = async (asGuest) => {
    if (asGuest) {
      console.debug("[auth:logout_as_guest:start]");
      dispatch({
        type: AuthActions.LOGOUT_START,
      });
      sessionStorage.removeItem(config.guestTokenKey);
      sessionStorage.removeItem(config.guestProgressTokenKey);
      dispatch({ type: AuthActions.LOGOUT_SUCCESS });
      console.debug("[auth:logout_as_guest:success]");
      return;
    }

    console.debug("[auth:logout:start]");
    dispatch({ type: AuthActions.LOGOUT_START });

    try {
      await authApi.logout();
      console.debug("[auth:logout:success]");
      dispatch({ type: AuthActions.LOGOUT_SUCCESS });
    } catch (e) {
      console.debug("[auth:logout:error]");
      dispatch({ type: "LOGOUT_ERROR", payload: e.message });
    }
  };

  React.useEffect(() => {
    const checkAuth = async () => {
      console.debug("[auth:check_guest:start]");
      const isGuest = sessionStorage.getItem(config.guestTokenKey);
      if (isGuest) {
        console.debug("[auth:check_guest:success]");
        dispatch({
          type: AuthActions.CHECK_AUTH_SUCCESS,
          payload: authService.createGuestUser(),
        });
        return;
      }

      console.debug("[auth:check:start]");
      dispatch({ type: AuthActions.CHECK_AUTH_START });

      try {
        const data = await authApi.check();
        const loggedInUser = authService.createLoggedUser(data);
        console.debug("[auth:check:success]", loggedInUser);
        dispatch({
          type: AuthActions.CHECK_AUTH_SUCCESS,
          payload: loggedInUser,
        });
      } catch (e) {
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
