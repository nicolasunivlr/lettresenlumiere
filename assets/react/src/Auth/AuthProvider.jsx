import React from "react";

export const AuthContext = React.createContext();

/*
Le back doit renvoyer un user avec au minimum ces champs :
{
  id: string
  username: string
  roles: array<string>
}


fetch('/api/login', {
  method: 'POST',
  body: JSON.stringify({ username, password }),
})
.then(response => response.json())
if (!response.ok) {
  // Gérer l'erreur
  switch (error.status) {
    case 401:
      // Identifiants invalides
      break;
      case 404:
      // Utilisateur non trouvé
      break;
    default:
      // Autres erreurs
      break;
  }
}

.then(data => {

  // data?: user
})
*/

const john = {
  id: "user123",
  username: "johndoe",
  roles: ["ROLE_USER"],
};

const initialState = {
  loading: false,
  error: false,
  isAuthenticated: false,
  user: null,
};

// /api/user/id
/*
{
  id: string
  username: string
  roles: array<string>
  progress: [
  {
    id: string
    exerciceId: string // un exercice peut avoir plusieurs progress (tentatives) et une progress peut concerner un seul exercice
    score: number
  }
  ]
}


*/

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        ...state,
        loading: true,
        error: false,
      };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload,
      };
    case "LOGIN_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case "LOGOUT_START":
      return {
        ...state,
        loading: true,
        error: false,
      };
    case "LOGOUT_SUCCESS":
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
      };
    case "LOGOUT_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

/**
 * Ce provider fourni le contexte `AuthContext` à ses composants enfants.
 */
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(authReducer, initialState);

  const login = async (credentials, asGuest) => {
    if (asGuest) {
      console.debug("[auth:login:guest]");
      dispatch({ type: "LOGIN_SUCCESS", payload: { id: "guest", roles: [] } });
      return true;
    }

    console.debug("[auth:login:start]");
    dispatch({ type: "LOGIN_START" });
    try {
      // Simuler un appel API
      const user = await new Promise((resolve, reject) =>
        setTimeout(() => {
          const randomFail = Math.random() < 0.2;
          if (randomFail) {
            reject(
              new Error("Échec de l'authentification. Veuillez réessayer.")
            );
          } else {
            resolve(john);
          }
        }, 1000)
      );
      console.debug("[auth:login:success]", user);
      dispatch({ type: "LOGIN_SUCCESS", payload: user });
      return true;
    } catch (e) {
      console.debug("[auth:login:error]");
      dispatch({ type: "LOGIN_ERROR", payload: e.message });
      return false;
    }
  };

  const logout = async () => {
    console.debug("[auth:logout:start]");
    try {
      dispatch({ type: "LOGOUT_START" });
      // Simuler un appel API
      await new Promise((resolve, reject) =>
        setTimeout(() => {
          const randomFail = Math.random() < 0.1;
          if (randomFail) {
            reject(new Error("Échec de la déconnexion. Veuillez réessayer."));
          } else {
            resolve();
          }
        }, 500)
      );
      console.debug("[auth:logout:success]");
      dispatch({ type: "LOGOUT_SUCCESS" });
    } catch (e) {
      console.debug("[auth:logout:error]");
      dispatch({ type: "LOGOUT_ERROR", payload: e.message });
    }
  };

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
