import { useProfile } from "../profile-provider";

export const ProfileBanner = ({ children, className, ...rest }) => {
  const { profile } = useProfile();

  return (
    profile && (
      <div className={`profile-banner ${className ?? ""}`} {...rest}>
        {profile.isGuest() ? (
          <span className="profile-banner__title">Mode Invité</span>
        ) : (
          <span className="profile-banner__title">
            Bienvenue, utilisateur #{profile.id}
          </span>
        )}
        {children}
      </div>
    )
  );
};
