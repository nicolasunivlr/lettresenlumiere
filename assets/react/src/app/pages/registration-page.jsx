import React from "react";
import { authClient } from "../../features/auth/auth-client";
import { RegistrationForm } from "../../features/auth/components/registration-form";

export const RegistrationPage = () => {
  const [genericError, setGenericError] = React.useState("");
  const [validationErrors, setValidationErrors] = React.useState(null);

  const register = async (registrationData) => {
    setGenericError("");
    setValidationErrors([]);
    try {
      const user = await authClient.register(registrationData);

      console.log("Inscription réussie :", user);
    } catch (e) {
      if (e.errors) {
        const errorsMap = {};
        e.errors.forEach((error) => {
          errorsMap[error.property] = error.message;
        });
        setValidationErrors(errorsMap);
      } else {
        setGenericError(e.message || "Erreur lors de l'inscription.");
      }
    }
  };

  return (
    <>
      {genericError ? <p style={{ color: "green" }}>{genericError}</p> : null}
      <RegistrationForm errors={validationErrors} onSubmit={register} />
    </>
  );
};
