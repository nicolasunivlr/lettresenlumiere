import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import EtapesPage from "./pages/EtapesPage";
import Credits from "./pages/Credits";
import { SequencePage } from "../features/sequences";
import { AccessControl } from "../features/auth";
import { LoginPage } from "./pages/login-page";
import { HomePage } from "./pages/home-page";
import { RootLayout } from "./layouts/root-layout";
import { RegistrationPage } from "./pages/registration-page";
import AlphabetPage from "./pages/alphabet-page";
import { SequenceLayout } from "./layouts/sequence-layout";
import GraphemePage from "./pages/grapheme-page";
import { ProgressionPage } from "./pages/ProgressionPage";

export const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<RootLayout />}>
          <Route element={<AccessControl />}>
            <Route path="/" element={<HomePage />} />

            <Route path="/etapes" element={<EtapesPage />} />
            <Route path="/progression" element={<ProgressionPage />} />
            <Route
              path="/progression/:accountId"
              element={<ProgressionPage />}
            />

            <Route path="/sequence" element={<SequenceLayout />}>
              <Route path="/sequence/alphabet" element={<AlphabetPage />} />
              <Route path="/sequence/graphemes" element={<GraphemePage />} />
              <Route path="/sequence/:id" element={<SequencePage />} />
            </Route>
          </Route>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/credits" element={<Credits />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
};
