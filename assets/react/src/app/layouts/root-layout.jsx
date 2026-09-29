import { Outlet, useLocation } from "react-router-dom";
import { ProfileBanner } from "../../features/profile/components/profile-banner";
import { LogoutButton } from "../../features/auth";
import { AdminButton } from "../../features/auth/components/admin-button";

export const RootLayout = () => {
  const location = useLocation();

  const pagesWithBanner = ["/"];
  const showBanner = pagesWithBanner.includes(location.pathname);

  return (
    <div className="app-container">
      <ProfileBanner visible={showBanner}>
        <AdminButton label="Administration" />
        <LogoutButton />
      </ProfileBanner>
      <main>
        <Outlet />
      </main>
      <footer>{/* Contenu du pied de page commun */}</footer>
    </div>
  );
};
