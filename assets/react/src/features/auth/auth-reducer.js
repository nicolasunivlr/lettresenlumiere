import { AuthActions } from "./constants";

export const authReducer = (state, action) => {
  switch (action.type) {
    case AuthActions.LOGIN_START:
      return {
        ...state,
        isLoading: true,
        error: false,
      };
    case AuthActions.LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: {
          id: action.payload.id,
          username: action.payload.username,
          roles: action.payload.roles,
          accountId: action.payload.accountId,
        },
      };
    case AuthActions.LOGIN_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case AuthActions.LOGOUT_START:
      return {
        ...state,
        isLoading: true,
        error: false,
      };
    case AuthActions.LOGOUT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
      };
    case AuthActions.LOGOUT_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case AuthActions.CHECK_AUTH_START:
      return {
        ...state,
        isChecking: true,
        error: false,
      };
    case AuthActions.CHECK_AUTH_SUCCESS:
      return {
        ...state,
        isChecking: false,
        isAuthenticated: true,
        user: {
          id: action.payload.id,
          username: action.payload.username,
          roles: action.payload.roles,
          accountId: action.payload.accountId,
        },
      };
    case AuthActions.CHECK_AUTH_ERROR:
      return {
        ...state,
        isChecking: false,
        isAuthenticated: false,
        error: action.payload,
        user: null,
      };
    default:
      return state;
  }
};
