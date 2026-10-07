import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useResident } from '../context/ResidentContext';
import { 
  Heart, 
  Activity, 
  Package, 
  FileText, 
  AlertTriangle, 
  LogOut, 
  User as UserIcon, 
  UserCheck, 
  Shield 
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, setDemoUser } = useAuth();
  const { selectedResident, setSelectedResident, residentsList } = useResident();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const isActive = (path: string) => location.pathname === path;

  return (
    <header style={{ background: 'rgba(11, 19, 41, 0.9)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.08)', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Brand */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)' }}>
            <Heart size={22} color="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.2rem', color: '#fff', lineHeight: 1.1 }}>
              Raíz Digital
            </div>
            <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600, letterSpacing: '0.05em' }}>
              FASE 2 • REACT & NODE
            </div>
          </div>
        </Link>

        {/* Resident Selector Context Bar */}
        {user.rol !== 'RESIDENTE' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '6px 14px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <UserCheck size={16} color="#10b981" />
            <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Residente:</span>
            <select
              value={selectedResident?.id || ''}
              onChange={(e) => {
                const found = residentsList.find((r) => r.id === Number(e.target.value));
                if (found) setSelectedResident(found);
              }}
              style={{ background: 'transparent', color: '#fff', border: 'none', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', outline: 'none' }}
            >
              {residentsList.map((r) => (
                <option key={r.id} value={r.id} style={{ background: '#131d38', color: '#fff' }}>
                  {r.nombre} {r.apellido} ({r.habitacion})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link
            to={user.rol === 'ENFERMERO' ? '/enfermero' : user.rol === 'FAMILIAR' ? '/familiar' : '/residente'}
            className="btn"
            style={{
              background: isActive('/') || isActive('/enfermero') || isActive('/familiar') || isActive('/residente') ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
              color: isActive('/') ? '#10b981' : '#d1d5db',
              padding: '6px 12px',
              fontSize: '0.85rem',
            }}
          >
            Inicio
          </Link>
          
          <Link
            to="/signos-vitales"
            className="btn"
            style={{
              background: isActive('/signos-vitales') ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
              color: isActive('/signos-vitales') ? '#10b981' : '#d1d5db',
              padding: '6px 12px',
              fontSize: '0.85rem',
            }}
          >
            <Activity size={16} /> Signos Vitales
          </Link>

          <Link
            to="/inventario"
            className="btn"
            style={{
              background: isActive('/inventario') ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
              color: isActive('/inventario') ? '#10b981' : '#d1d5db',
              padding: '6px 12px',
              fontSize: '0.85rem',
            }}
          >
            <Package size={16} /> Inventario
          </Link>

          <Link
            to="/recetas"
            className="btn"
            style={{
              background: isActive('/recetas') ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
              color: isActive('/recetas') ? '#10b981' : '#d1d5db',
              padding: '6px 12px',
              fontSize: '0.85rem',
            }}
          >
            <FileText size={16} /> Recetas
          </Link>

          <Link
            to="/reabastecimiento"
            className="btn"
            style={{
              background: isActive('/reabastecimiento') ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
              color: isActive('/reabastecimiento') ? '#10b981' : '#d1d5db',
              padding: '6px 12px',
              fontSize: '0.85rem',
            }}
          >
            <AlertTriangle size={16} /> Alertas
          </Link>
        </nav>

        {/* User Badge & Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>{user.nombre}</div>
            <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>ROL: {user.rol}</div>
          </div>

          {/* Quick Role Switcher for Testing */}
          <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.05)', padding: '2px', borderRadius: '8px' }}>
            <button
              onClick={() => setDemoUser('ENFERMERO')}
              title="Cambiar a vista Enfermero"
              style={{ background: user.rol === 'ENFERMERO' ? '#10b981' : 'transparent', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.7rem' }}
            >
              Enf
            </button>
            <button
              onClick={() => setDemoUser('FAMILIAR')}
              title="Cambiar a vista Familiar"
              style={{ background: user.rol === 'FAMILIAR' ? '#3b82f6' : 'transparent', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.7rem' }}
            >
              Fam
            </button>
            <button
              onClick={() => setDemoUser('RESIDENTE')}
              title="Cambiar a vista Residente"
              style={{ background: user.rol === 'RESIDENTE' ? '#8b5cf6' : 'transparent', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.7rem' }}
            >
              Res
            </button>
          </div>

          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="btn btn-secondary"
            style={{ padding: '8px' }}
            title="Cerrar Sesión"
          >
            <LogOut size={16} />
          </button>
        </div>

      </div>
    </header>
  );
};
