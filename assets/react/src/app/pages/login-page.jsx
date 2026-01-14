import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/providers/auth-provider";
import { LoginForm } from "../../features/auth/components/login-form";
import logoLeL from "../../assets/images/Logolettresenlumiere.png";

export const LoginPage = () => {
  const { isAuthenticated, login, isLoading, errorMessage } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
      <LoginForm onSubmit={handleSubmit} isSubmiting={isLoading} />
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
