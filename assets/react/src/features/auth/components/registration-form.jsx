import React from "react";
import { InputPassword } from "../../../shared/ui/input-password.jsx";
import { FormControl, Input } from "../../../shared/ui/form-control.jsx";
import { Link } from "react-router-dom";

export const RegistrationForm = ({
  errors,
  onSubmit,
  isSubmitting,
  className,
  ...formProps
}) => {
  const [registrationData, setRegistrationData] = React.useState({
    firstname: "",
    lastname: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setRegistrationData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(registrationData);
  };

  return (
    <form {...formProps} className="form-container" onSubmit={handleOnSubmit}>
      <h1 className="form__title">Créer un compte étudiant</h1>

      <FormControl label="Prénom" error={errors?.["firstname"]}>
        <input
          type="text"
          name="firstname"
          id="firstname"
          value={registrationData.firstname}
          onChange={handleOnChange}
          disabled={isSubmitting}
        />
      </FormControl>

      <FormControl label="Nom" error={errors?.["lastname"]}>
        <input
          type="text"
          name="lastname"
          id="lastname"
          value={registrationData.lastname}
          onChange={handleOnChange}
          disabled={isSubmitting}
        />
      </FormControl>

      <FormControl label="Identifiant" error={errors?.["username"]}>
        <input
          type="text"
          name="username"
          id="username"
          value={registrationData.username}
          onChange={handleOnChange}
          disabled={isSubmitting}
        />
      </FormControl>

      <FormControl label="Mot de passe" error={errors?.["password"]}>
        <InputPassword
          name="password"
          id="password"
          value={registrationData.password}
          onChange={handleOnChange}
          disabled={isSubmitting}
        />
      </FormControl>

      <FormControl
        label="Confirmer le mot de passe"
        error={errors?.["confirmPassword"]}
      >
        <InputPassword
          toggle
          name="confirmPassword"
          id="confirmPassword"
          value={registrationData.confirmPassword}
          onChange={handleOnChange}
          disabled={isSubmitting}
        />
      </FormControl>

      <div className="form-group form-group--inline">
        <input
          className="form__submit"
          type="submit"
          value={isSubmitting ? "Inscription en cours..." : "S'inscrire"}
          disabled={isSubmitting}
        />
        <Link to="/login">Annuler</Link>
      </div>
    </form>
  );
};
