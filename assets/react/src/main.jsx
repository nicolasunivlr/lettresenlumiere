import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./scss/main.scss";
import App from "./App.jsx";
import { AccountProfileProvider } from "./AccountProfile/AccountProfileProvider.jsx";
import { AuthProvider } from "./Auth/AuthProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <AccountProfileProvider>
        <App />
      </AccountProfileProvider>
    </AuthProvider>
  </StrictMode>
);
