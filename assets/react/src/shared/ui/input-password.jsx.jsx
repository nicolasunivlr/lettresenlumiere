import React from "react";

/**
 * Composant générique pour un champ de mot de passe avec option de révélation du mot de passe.
 *
 * Props :
 * @param {string} className - Classe CSS additionnelle pour le conteneur du composant.
 * @param {boolean} toggle - Indique si le bouton de révélation doit être affiché (par défaut : true).
 * @param {object} inputProps - Toutes les autres props standard pour un élément input.
 *
 * Exemple d'utilisation :
 * ```jsx
 * <InputPassword
 *   name="password"
 *   value={password}
 *   onChange={handleChange}
 *   disabled={isSubmitting}
 * />
 * ```
 */
export const InputPassword = ({ className, toggle, ...inputProps }) => {
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  // La props est facultative, true par défaut
  const showToggle = toggle !== undefined ? toggle : true;

  return (
    <div className={`input-password ${className}`}>
      <input
        type={isPasswordVisible ? "text" : "password"}
        className="input-password__inner"
        {...inputProps}
      />
      {showToggle ? (
        <button
          onClick={togglePasswordVisibility}
          type="button"
          className="input-password__toggle"
          title={
            isPasswordVisible
              ? "Cacher le mot de passe"
              : "Révèler le mot de passe"
          }
        >
          {isPasswordVisible ? "🙈" : "🐵"}
        </button>
      ) : null}
    </div>
  );
};
