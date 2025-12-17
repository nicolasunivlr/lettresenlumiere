import React from "react";

export const LoginForm = ({
  onSubmit,
  isSubmiting,
  className,
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
      className={`login-form ${className || ""}`}
      onSubmit={handleOnSubmit}
    >
      <label htmlFor="username">Identifiant utilisateur</label>
      <input
        type="text"
        name="username"
        id="username"
        value={credentials.username}
        onChange={handleOnChange}
        disabled={isSubmiting}
      />

      <label htmlFor="password">Mot de passe</label>
      <input
        type="password"
        name="password"
        id="password"
        value={credentials.password}
        onChange={handleOnChange}
        disabled={isSubmiting}
      />

      <input
        type="submit"
        disabled={isSubmiting}
        value={isSubmiting ? "Connexion..." : "Se connecter"}
      />
    </form>
  );
};
