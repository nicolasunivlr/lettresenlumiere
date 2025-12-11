import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import React from "react";
import Loader from "../components/UI/Loader";

export const Login = () => {
  const { isAuthenticated, login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [credentials, setCredentials] = React.useState({
    username: "",
    password: "",
  });

  const from = location.state?.from?.pathname || "/";

  const handleOnChange = (e) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const authenticated = login(credentials);

    if (authenticated) {
      navigate(from);
    }
  };

  const handleGuestMode = () => {
    login(null, true); // true indique le mode invité
    navigate(from);
  };

  if (loading) return <Loader />;

  return isAuthenticated ? (
    <Navigate to={from} />
  ) : (
    <>
      <form onSubmit={handleOnSubmit}>
        <label htmlFor="username">Identifiant utilisateur</label>
        <input
          type="text"
          name="username"
          id="username"
          value={credentials.username}
          onChange={handleOnChange}
        />

        <label htmlFor="password">Mot de passe</label>
        <input
          type="password"
          name="password"
          id="password"
          value={credentials.password}
          onChange={handleOnChange}
        />

        <input type="submit" value="Connexion" />
      </form>
      <button onClick={handleGuestMode} type="button">
        Mode libre
      </button>
    </>
  );
};

export default Login;
