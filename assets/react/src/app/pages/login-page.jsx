import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/providers/auth-provider";
import { LoginForm } from "../../features/auth/components/login-form";
import logoLeL from "../../assets/images/Logolettresenlumiere.png";
import React from "react";
import { Alert } from "../../shared/ui/alert";

export const LoginPage = () => {
  const { isAuthenticated, login, isLoading, errorMessage, errors } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        // Clear error message after 5 seconds
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (credentials) => {
    const authenticated = await login(credentials);

    if (authenticated) {
      navigate(from);
    }
  };

  const handleGuestMode = () => {
    login(null, true); // true indique le mode invité
    navigate(from);
  };

  return isAuthenticated ? (
    <Navigate to={from} />
  ) : (
    <div className="login-page">
      <img style={{ margin: "2rem auto" }} src={logoLeL} alt="Logo Brain" />
      {errorMessage && <Alert variant="error">{errorMessage}</Alert>}
      <LoginForm
        errors={errors}
        onSubmit={handleSubmit}
        isSubmiting={isLoading}
      />
      <button
        className="guest-mode-button"
        onClick={handleGuestMode}
        type="button"
      >
        Mode libre
      </button>
    </div>
  );
};
