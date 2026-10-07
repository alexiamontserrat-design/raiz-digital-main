import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ResidentProvider } from './context/ResidentContext';
import { Navbar } from './components/Navbar';

// Pages
import { LoginPage } from './pages/LoginPage';
import { NurseDashboard } from './pages/NurseDashboard';
import { FamilyDashboard } from './pages/FamilyDashboard';
import { ResidentDashboard } from './pages/ResidentDashboard';
import { VitalSignsPage } from './pages/VitalSignsPage';
import { InventoryPage } from './pages/InventoryPage';
import { RecipesPage } from './pages/RecipesPage';
import { ReplenishmentPage } from './pages/ReplenishmentPage';

const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  return (
    <ResidentProvider>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main className="app-container" style={{ flex: 1, paddingTop: '24px', paddingBottom: '40px' }}>
          {children}
        </main>
      </div>
    </ResidentProvider>
  );
};

const RoleBasedHome: React.FC = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  if (user.rol === 'FAMILIAR') return <FamilyDashboard />;
  if (user.rol === 'RESIDENTE') return <ResidentDashboard />;
  return <NurseDashboard />;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route
            path="/"
            element={
              <ProtectedLayout>
                <RoleBasedHome />
              </ProtectedLayout>
            }
          />

          <Route
            path="/enfermero"
            element={
              <ProtectedLayout>
                <NurseDashboard />
              </ProtectedLayout>
            }
          />

          <Route
            path="/familiar"
            element={
              <ProtectedLayout>
                <FamilyDashboard />
              </ProtectedLayout>
            }
          />

          <Route
            path="/residente"
            element={
              <ProtectedLayout>
                <ResidentDashboard />
              </ProtectedLayout>
            }
          />

          <Route
            path="/signos-vitales"
            element={
              <ProtectedLayout>
                <VitalSignsPage />
              </ProtectedLayout>
            }
          />

          <Route
            path="/inventario"
            element={
              <ProtectedLayout>
                <InventoryPage />
              </ProtectedLayout>
            }
          />

          <Route
            path="/recetas"
            element={
              <ProtectedLayout>
                <RecipesPage />
              </ProtectedLayout>
            }
          />

          <Route
            path="/reabastecimiento"
            element={
              <ProtectedLayout>
                <ReplenishmentPage />
              </ProtectedLayout>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
