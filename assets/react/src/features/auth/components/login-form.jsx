import React from "react";
import { InputPassword } from "../../../shared/ui/input-password.jsx";
import { FormControl } from "../../../shared/ui/form-control.jsx";
import { Link } from "react-router-dom";

export const LoginForm = ({
  errors,
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

      <div className="form-group">
        <label className="form__label" htmlFor="username">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M367-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm296.5-343.5Q560-607 560-640t-23.5-56.5Q513-720 480-720t-56.5 23.5Q400-673 400-640t23.5 56.5Q447-560 480-560t56.5-23.5ZM480-640Zm0 400Z"/><script xmlns=""/></svg>
          Identifiant utilisateur :
        </label>
        <input
            type="text"
            name="username"
            id="username"
            value={credentials.username}
            onChange={handleOnChange}
            disabled={isSubmiting}
            className="form__input"
        />
      </div>

      <FormControl label="Mot de passe" error={errors?.password}>
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
