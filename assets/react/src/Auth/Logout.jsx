import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export const Logout = () => {
  const { logout, isAuthenticated } = useAuth();

  return isAuthenticated ? (
    <button onClick={logout}>Logout</button>
  ) : (
    <Navigate to="/" />
  );
};
