import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/providers/auth-provider";
import { LoginForm } from "../../features/auth/components/login-form";

export const LoginPage = () => {
  const { isAuthenticated, login, isLoading } = useAuth();
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
    <>
      <LoginForm onSubmit={handleSubmit} isSubmiting={isLoading}>
        <button onClick={handleGuestMode} type="button">
          Mode libre
        </button>
      </LoginForm>
    </>
  );
};
