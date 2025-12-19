import {
  HashRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LayoutExercises from "./pages/LayoutExercises";
import EtapesPage from "./pages/EtapesPage";
import Credits from "./pages/Credits";
import { SequencePage, SequenceProvider } from "../features/sequences";
import { AccessControl } from "../features/auth";
import { LoginPage } from "./pages/login-page";
import { HomePage } from "./pages/home-page";
import { RootLayout } from "./layouts/root-layout";

export const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<RootLayout />}>
          <Route element={<AccessControl />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/alphabet" element={<LayoutExercises />} />
            <Route path="/graphemes" element={<LayoutExercises />} />
            <Route path="/etapes" element={<EtapesPage />} />
            <Route
              path="/sequence/:id"
              element={
                <SequenceProvider>
                  <SequencePage />
                </SequenceProvider>
              }
            />
          </Route>

          <Route path="/login" element={<LoginPage />} />

          <Route path="/credits" element={<Credits />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
};
