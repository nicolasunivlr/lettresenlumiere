import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import MainMenu from './pages/MainMenu';
import LayoutExercises from './pages/LayoutExercises';
import EtapesPage from './pages/EtapesPage';
import Credits from './pages/Credits';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<MainMenu />} />
        <Route path='/alphabet' element={<LayoutExercises />} />
        <Route path='/graphemes' element={<LayoutExercises />} />
        <Route
          path='/sequence/:id'
          element={<LayoutExercises />}
        />
        <Route path='/etapes' element={<EtapesPage />} />
        <Route path='/credits' element={<Credits />} />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </Router>
  );
}

export default App;
