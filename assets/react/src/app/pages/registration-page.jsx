import React from "react";
import { RegistrationForm } from "../../features/auth/components/registration-form";
import { authApi } from "../../shared/api/auth-api";

export const RegistrationPage = () => {
  const [genericError, setGenericError] = React.useState("");
  const [validationErrors, setValidationErrors] = React.useState(null);

  const register = async (registrationData) => {
    setGenericError("");
    setValidationErrors([]);
    try {
      const user = await authApi.register(registrationData);

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
      {genericError ? <p style={{ color: "red" }}>{genericError}</p> : null}
      <RegistrationForm errors={validationErrors} onSubmit={register} />
    </>
  );
};
