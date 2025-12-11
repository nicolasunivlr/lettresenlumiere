import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";

/**
 * Composant de contrôle d'accès aux routes protégées.
 * Si l'utilisateur n'est pas authentifié, il est redirigé vers la page de login.
 */
export const AccessControl = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          // Pour rediriger après login vers la page initialement demandée
          from: location,
        }}
      />
    );
  }

  return <Outlet />;
};
