import React from 'react';
import { useResident } from '../context/ResidentContext';
import { Heart, Sun, Bell, Smile, ShieldAlert } from 'lucide-react';

export const ResidentDashboard: React.FC = () => {
  const { selectedResident } = useResident();

  if (!selectedResident) {
    return (
      <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Bienvenido</h2>
        <p style={{ color: 'var(--text-muted)' }}>Cargando su información personal...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Resident Personal Welcome Header */}
      <div className="glass-card" style={{ padding: '32px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(139, 92, 246, 0.15) 100%)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
        <div style={{ display: 'inline-flex', background: '#10b981', padding: '16px', borderRadius: '50%', marginBottom: '16px', boxShadow: 'var(--shadow-glow)' }}>
          <Sun size={36} color="#fff" />
        </div>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>
          ¡Buenos días, {selectedResident.nombre}!
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#d1d5db' }}>
          Esperamos que tenga un excelente día. Su estado de salud reportado hoy es <strong style={{ color: '#34d399' }}>{selectedResident.estado}</strong>.
        </p>
      </div>

      {/* Simplified Status Card */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Heart color="#ef4444" size={22} /> Mi Resumen de Salud Hoy
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ background: 'rgba(255,255,255,0.04)', padding: '16px', borderRadius: '12px' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Presión Arterial</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10b981', marginTop: '4px' }}>
              {selectedResident.vitalSigns?.[0]?.presionArterial || '120/80'}
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.04)', padding: '16px', borderRadius: '12px' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Oxígeno en Sangre</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3b82f6', marginTop: '4px' }}>
              {selectedResident.vitalSigns?.[0]?.saturacionOxigeno || 98}%
            </div>
          </div>
        </div>
      </div>

      {/* Call Assistance Button */}
      <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>¿Necesita asistencia de enfermería?</h3>
        <button
          className="btn btn-primary"
          style={{ padding: '14px 28px', fontSize: '1.1rem', width: '100%', background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' }}
          onClick={() => alert('¡Alerta de llamada a enfermería enviada! Un enfermero asistirá en breve.')}
        >
          <Bell size={22} /> Solicitar Atención Médica / Asistencia
        </button>
      </div>

    </div>
  );
};
