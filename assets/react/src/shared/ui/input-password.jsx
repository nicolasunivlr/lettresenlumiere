import React from "react";

/**
 * Composant générique pour un champ de mot de passe avec option de révélation du mot de passe.
 *
 * Props :
 * @param {string} className - Classe CSS additionnelle pour le conteneur du composant.
 * @param {boolean} toggle - Indique si le bouton de révélation doit être affiché (par défaut : false).
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

  // La props est facultative, on lui assigne `false` par défaut
  const showToggle = toggle === undefined ? false : toggle;
  // Pas encore en props, mais à envisager pour plus tard
  const titleWhenVisible = "Cacher le mot de passe";
  const titleWhenHidden = "Révèler le mot de passe";
  const iconWhenVisible = <span className="default-icon" />;
  const iconWhenHidden = <span className="default-icon" />;

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <div className="input-password">
      <input
        type={isPasswordVisible ? "text" : "password"}
        className="input-password__inner"
        {...inputProps}
      />
      {showToggle ? (
        <button
          onClick={togglePasswordVisibility}
          type="button"
          className={`input-password__toggle input-password__toggle--${
            isPasswordVisible ? "visible" : "hidden"
          }`}
          title={isPasswordVisible ? titleWhenVisible : titleWhenHidden}
        >
          {isPasswordVisible ? iconWhenVisible : iconWhenHidden}
        </button>
      ) : null}
    </div>
  );
};
