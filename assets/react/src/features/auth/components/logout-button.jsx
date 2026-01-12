import React from "react";
import { useAuth } from "../providers/auth-provider";
import iconeLogout from "../../../assets/images/icones/logout.png";

export const LogoutButton = ({ children, ...rest }) => {
  const { logout, user } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const asGuest = React.useMemo(() => {
    return user?.id === "guest";
  }, [user]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout(asGuest);
    setIsLoggingOut(false);
  };

  return (
    <button
      className="logout-button"
      type="button"
      onClick={handleLogout}
      disabled={isLoggingOut}
      {...rest}
    >

      <span className="logout-button__label">{children?.(isLoggingOut) ?? <DefaultLabel isLoading={isLoggingOut} />}</span>
      
      <img 
        src={iconeLogout} 
        className="logout-button__icon"
        aria-hidden="true"
        alt="Icone de déconnexion" 
      />
    </button>
  );
};

const DefaultLabel = ({ isLoading }) => {
  return <span>{isLoading ? "Déconnexion..." : "Se déconnecter"}</span>;
};
