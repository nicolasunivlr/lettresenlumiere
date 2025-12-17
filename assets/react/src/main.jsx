import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./scss/main.scss";
import { ProfileProvider } from "./features/profile/profile-provider.jsx";
import { AuthProvider } from "./features/auth/providers/auth-provider.jsx";
import { App } from "./app/app.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ProfileProvider>
        <App />
      </ProfileProvider>
    </AuthProvider>
  </StrictMode>
);
