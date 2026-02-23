import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RegistrationLayout } from './components/RegistrationLayout';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/step/0" replace />} />
        <Route path="/step/:stepId" element={<RegistrationLayout />} />
        <Route path="*" element={<Navigate to="/step/0" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
