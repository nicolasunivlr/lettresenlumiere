import { useProfile } from "../profile-provider";
import LogoApp from "../../../assets/images/Logolettresenlumiere.png";

export const ProfileBanner = ({ children, className, visible, ...rest }) => {
  const { profile } = useProfile();

  console.log("ProfileBanner rendu avec le profil :", profile);

  if (visible === false) {
    return null;
  }

  return (
    profile && (
      <div className={`profile-banner ${className ?? ""}`} {...rest}>
        {/* Texte à gauche */}
        <span className="profile-banner__title">
          {profile.isGuest()
            ? "Mode Invité"
            : `Bienvenue, ${profile
                .getFirstname()} `}
        </span>

        {/* Logo centré */}
        <img
          src={LogoApp}
          alt="Logo de l'application Lettres en Lumière"
          className="profile-banner__logo"
        />

        {/* Autres éléments à droite */}
        <div className="profile-banner__right">{children}</div>

        {/*{children}*/}
      </div>
    )
  );
};
