import React from "react";
import { useAuth } from "../providers/auth-provider";

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
      {children?.(isLoggingOut) ?? <DefaultLabel isLoading={isLoggingOut} />}
    </button>
  );
};

const DefaultLabel = ({ isLoading }) => {
  return <span>{isLoading ? "Déconnexion..." : "Se déconnecter"}</span>;
};
