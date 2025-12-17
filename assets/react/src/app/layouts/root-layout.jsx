import { Outlet } from "react-router-dom";

export const RootLayout = () => {
  return (
    <div className="app-container">
      <header>{/* Contenu de l'en-tête commun */}</header>
      <main>
        <Outlet />
      </main>
      <footer>{/* Contenu du pied de page commun */}</footer>
    </div>
  );
};
