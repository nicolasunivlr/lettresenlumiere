import React from "react";

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
    <form
      {...formProps}
      className="form-container"
      onSubmit={handleOnSubmit}
    >
      <h1 className="form__title">Connexion</h1>
      <div className="form-group">
        <label
            className="form__label"
            htmlFor="username">
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

      <div className="form-group">
        <label
            htmlFor="password"
            className="form__label"
        >
          Mot de passe :
        </label>
        <input
            type="password"
            name="password"
            id="password"
            value={credentials.password}
            onChange={handleOnChange}
            disabled={isSubmiting}
            className="form__input form__input--password"
        />
      </div>

      <div className="form-group form-group--inline">
        <input
            className="form__submit"
            type="submit"
            disabled={isSubmiting}
            value={isSubmiting ? "Connexion..." : "Se connecter"}
        />
        {children && <div className="form__mode-libre">
          {children}
        </div>}
      </div>
    </form>
  );
};
