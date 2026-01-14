import React from "react";
import { InputPassword } from "../../../shared/ui/input-password.jsx";
import { FormControl } from "../../../shared/ui/form-control.jsx";
import { Link } from "react-router-dom";

export const LoginForm = ({
  onSubmit,
  isSubmiting,
  className,
  children,
  ...formProps
}) => {
  const [credentials, setCredentials] = React.useState({
    username: "",
    password: "",
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(credentials);
  };

  return (
    <form {...formProps} className="form-container" onSubmit={handleOnSubmit}>
      <h1 className="form__title">Connexion</h1>

      <FormControl label="Identifiant">
        <input
          type="text"
          name="username"
          id="username"
          value={credentials.username}
          onChange={handleOnChange}
          disabled={isSubmiting}
        />
      </FormControl>

      <FormControl label="Mot de passe">
        <InputPassword
          toggle
          name="password"
          id="password"
          value={credentials.password}
          onChange={handleOnChange}
          disabled={isSubmiting}
        />
      </FormControl>

      <div className="form-group form-group--inline">
        <input
          className="form__submit"
          type="submit"
          disabled={isSubmiting}
          value={isSubmiting ? "Connexion..." : "Se connecter"}
        />
        <Link to="/register">Créer un compte</Link>
      </div>
    </form>
  );
};
