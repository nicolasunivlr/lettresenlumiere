import { Navigate } from "react-router-dom";
import { useAuth } from "../../features/auth/providers/auth-provider";

export const LogoutPage = () => {
  const { logout, isAuthenticated } = useAuth();

  return isAuthenticated ? (
    <button onClick={logout}>Logout</button>
  ) : (
    <Navigate to="/" />
  );
};
