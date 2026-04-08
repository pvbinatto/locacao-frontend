import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import Customers from './pages/Customers';
import Rentals from './pages/Rentals';
import Maintenance from './pages/Maintenance';
import Documentation from './pages/Documentation';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('locacar_token');
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

import { ThemeProvider } from './utils/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/vehicles" element={<ProtectedRoute><Vehicles /></ProtectedRoute>} />
        <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
        <Route path="/rentals" element={<ProtectedRoute><Rentals /></ProtectedRoute>} />
        <Route path="/maintenance" element={<ProtectedRoute><Maintenance /></ProtectedRoute>} />
        <Route path="/documentation" element={<ProtectedRoute><Documentation /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
