import { RegistrationForm } from "../../features/auth/components/registration-form";
import { useAuth } from "../../features/auth";
import { Navigate } from "react-router-dom";
import { Alert } from "../../shared/ui/alert";
import React from "react";

export const RegistrationPage = () => {
  const { register, isChecking, errors, errorMessage, isLoading, isAuthenticated, clearErrors } =
    useAuth();

  // Réinitialise les erreurs laissées par une autre page (ex: login) à l'arrivée sur l'inscription.
  React.useEffect(() => {
    clearErrors();
  }, [clearErrors]);

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
    <div className="registration-page">
      {errorMessage && <Alert variant="error">{errorMessage}</Alert>}
      <RegistrationForm
        isSubmitting={isLoading}
        errors={errors}
        onSubmit={handleRegistration}
      />
    </div>
  );
};
