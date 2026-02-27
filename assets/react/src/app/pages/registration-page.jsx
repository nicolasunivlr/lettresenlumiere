import { RegistrationForm } from "../../features/auth/components/registration-form";
import { useAuth } from "../../features/auth";
import { Navigate } from "react-router-dom";

export const RegistrationPage = () => {
  const { register, isChecking, errors, isLoading, isAuthenticated } =
    useAuth();

  const handleRegistration = async (registrationData) => {
    const registered = await register(registrationData);

    if (registered) {
      alert("Inscription réussie !");
    }
  };

  /*
  Les prochaines lignes redirige l'utilisateur
  vers la page d'accueil s'il est authentifié
  (empêche les utilisateurs connectés d'accéder à
  la page d'inscription via l'URL).
  */
  if (isChecking) {
    return null; // Ne rien monter pendant la vérification
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <RegistrationForm
        isSubmitting={isLoading}
        errors={errors}
        onSubmit={handleRegistration}
      />
    </>
  );
};
