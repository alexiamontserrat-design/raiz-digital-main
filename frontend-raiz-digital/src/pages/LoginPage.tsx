import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, Lock, Mail, UserCheck, Shield } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, setDemoUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError('Error al iniciar sesión. Verifique sus credenciales.');
    }
  };

  const handleDemoClick = (rol: 'ENFERMERO' | 'FAMILIAR' | 'RESIDENTE' | 'ADMIN') => {
    setDemoUser(rol);
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '440px', padding: '36px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ display: 'inline-flex', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', width: '56px', height: '56px', borderRadius: '16px', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)' }}>
            <Heart size={30} color="#fff" />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '6px' }}>Raíz Digital</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Plataforma de Salud & Cuidados Digitales</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#fca5a5', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Correo Electrónico</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                className="form-input"
                placeholder="ejemplo@raizdigital.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '40px' }}
                required
              />
              <Mail size={18} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label">Contraseña</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '40px' }}
                required
              />
              <Lock size={18} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
            Iniciar Sesión
          </button>
        </form>

        {/* Demo Fast Logins */}
        <div style={{ marginTop: '32px', borderTop: '1px solid var(--glass-border)', paddingTop: '20px' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '12px', fontWeight: 600 }}>
            Acceso Rápido de Prueba (Demo):
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button onClick={() => handleDemoClick('ENFERMERO')} className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '8px' }}>
              <UserCheck size={14} color="#10b981" /> Enfermero
            </button>
            <button onClick={() => handleDemoClick('FAMILIAR')} className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '8px' }}>
              <Heart size={14} color="#3b82f6" /> Familiar
            </button>
            <button onClick={() => handleDemoClick('RESIDENTE')} className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '8px' }}>
              <UserCheck size={14} color="#8b5cf6" /> Residente
            </button>
            <button onClick={() => handleDemoClick('ADMIN')} className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '8px' }}>
              <Shield size={14} color="#f59e0b" /> Admin
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
