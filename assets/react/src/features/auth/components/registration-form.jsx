import React from "react";
import { InputPassword } from "../../../shared/ui/input-password.jsx";

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

      <div className="form-group">
        <label className="form__label" htmlFor="username">
          Nom :
        </label>
        <input
          type="text"
          name="lastname"
          id="lastname"
          value={registrationData.lastname}
          onChange={handleOnChange}
          disabled={isSubmitting}
          className="form__input"
        />
        {errors?.["lastname"] && (
          <p className="input__error">⚠️ {errors["lastname"]}</p>
        )}
      </div>

      <div className="form-group">
        <label className="form__label" htmlFor="username">
          Prénom :
        </label>
        <input
          type="text"
          name="firstname"
          id="firstname"
          value={registrationData.firstname}
          onChange={handleOnChange}
          disabled={isSubmitting}
          className="form__input"
        />
        {errors?.["firstname"] && (
          <p className="input__error">⚠️ {errors["firstname"]}</p>
        )}
      </div>

      <div className="form-group">
        <label className="form__label" htmlFor="username">
          Identifiant :
        </label>
        <input
          type="text"
          name="username"
          id="username"
          value={registrationData.username}
          onChange={handleOnChange}
          disabled={isSubmitting}
          className="form__input"
        />

        {errors?.["username"] && (
          <p className="input__error">⚠️ {errors["username"]}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="password" className="form__label">
          Mot de passe :
        </label>
        <InputPassword
          toggle={false}
          className="form__input"
          name="password"
          id="password"
          value={registrationData.password}
          onChange={handleOnChange}
          disabled={isSubmitting}
        />
        {errors?.["password"] && (
          <p className="input__error">⚠️ {errors["password"]}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword" className="form__label">
          Confirmer le mot de passe :
        </label>
        <InputPassword
          toggle={false}
          className="form__input"
          name="confirmPassword"
          id="confirmPassword"
          value={registrationData.confirmPassword}
          onChange={handleOnChange}
          disabled={isSubmitting}
        />
        {errors?.["confirmPassword"] && (
          <p className="input__error">⚠️ {errors["confirmPassword"]}</p>
        )}
      </div>

      <div className="form-group form-group--inline">
        <input
          className="form__submit"
          type="submit"
          value={isSubmitting ? "Inscription en cours..." : "S'inscrire"}
          disabled={isSubmitting}
        />
      </div>
    </form>
  );
};
