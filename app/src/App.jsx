import { BrowserRouter, Routes, Route } from 'react-router-dom';
import VisaoGeral from './pages/VisaoGeral/index.jsx';
import Board from './pages/Board/index.jsx';
import Resultados from './pages/Resultados/index.jsx';
import Admin from './pages/Admin/index.jsx';
import Onboarding from './pages/Onboarding/index.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<VisaoGeral />} />
        <Route path="/visao-geral" element={<VisaoGeral />} />
        <Route path="/alertas" element={<Board />} />
        <Route path="/resultados" element={<Resultados />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/contexto" element={<Onboarding />} />
        <Route path="/contexto-onboarding" element={<Onboarding />} />
      </Routes>
    </BrowserRouter>
  );
}
