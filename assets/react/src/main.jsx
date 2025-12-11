import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./scss/main.scss";
import App from "./App.jsx";
import { AuthProvider } from "./Auth/AuthProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      {/* <UserProvider> Etat global des données utilisateur */}
      <App />
      {/* </UserProvider> */}
    </AuthProvider>
  </StrictMode>
);
