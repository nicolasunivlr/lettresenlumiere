import { RegistrationForm } from "../../features/auth/components/registration-form";
import { useAuth } from "../../features/auth";
import { Navigate, useNavigate } from "react-router-dom";
import Loader from "../../shared/components/UI/Loader";

export const RegistrationPage = () => {
  const { user, register, isChecking, errors, errorMessage, isAuthenticated } =
    useAuth();

  const navigate = useNavigate();

  const handleRegistration = async (registrationData) => {
    const registered = await register(registrationData);

    if (registered) {
      alert("Inscription réussie !");
    }
  };

  /*
  Les prochaines lignes évite l'accès à la page
  via l'URL si l'utilisateur est déjà authentifié.
  */
  if (isChecking) {
    return null; // Ne rien monter pendant la vérification
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      {errorMessage ? <p style={{ color: "red" }}>{errorMessage}</p> : null}
      <RegistrationForm errors={errors} onSubmit={handleRegistration} />
    </>
  );
};
