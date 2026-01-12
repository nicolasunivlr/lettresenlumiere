import { Outlet } from "react-router-dom";
import { ProfileBanner } from "../../features/profile/components/profile-banner";
import { LogoutButton } from "../../features/auth";

export const RootLayout = () => {
  return (
    <div className="app-container">
      <ProfileBanner>
        <LogoutButton />
      </ProfileBanner>
      <main>
        <Outlet />
      </main>
      <footer>{/* Contenu du pied de page commun */}</footer>
    </div>
  );
};
