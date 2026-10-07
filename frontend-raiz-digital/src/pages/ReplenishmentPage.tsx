import React, { useState, useEffect } from 'react';
import { useResident } from '../context/ResidentContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Alert } from '../types';
import { AlertTriangle, CheckCircle2, Heart, Bell } from 'lucide-react';

export const ReplenishmentPage: React.FC = () => {
  const { selectedResident } = useResident();
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const loadAlerts = async () => {
    if (selectedResident) {
      const data = await api.getAlerts(selectedResident.id);
      setAlerts(data);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, [selectedResident]);

  if (!selectedResident) {
    return (
      <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
        <h2>No hay residente seleccionado</h2>
        <p style={{ color: 'var(--text-muted)' }}>Por favor seleccione un residente en la barra superior.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div className="glass-card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <AlertTriangle size={22} color="#ef4444" />
            <h1 style={{ fontSize: '1.5rem' }}>Alertas & Reabastecimiento de Insumos</h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Alertas de consumo e insumos para: <strong style={{ color: '#fff' }}>{selectedResident.nombre} {selectedResident.apellido}</strong>
          </p>
        </div>
      </div>

      {/* Alerts List */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Alertas Generadas por el Sistema</h2>

        {alerts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
            <CheckCircle2 size={36} color="#10b981" style={{ marginBottom: '8px' }} />
            <p style={{ fontSize: '1.05rem', color: '#fff' }}>¡Todo al día!</p>
            <p style={{ fontSize: '0.85rem' }}>No existen alertas de stock bajo ni reabastecimiento para este residente.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {alerts.map((a) => (
              <div key={a.id} className="glass-card" style={{ padding: '16px', borderColor: a.atendida ? 'var(--glass-border)' : 'rgba(239, 68, 68, 0.4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ background: a.atendida ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', padding: '10px', borderRadius: '12px' }}>
                    <AlertTriangle size={20} color={a.atendida ? '#10b981' : '#ef4444'} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff' }}>{a.mensaje}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Tipo: {a.tipo} • Fecha: {new Date(a.fecha).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {a.atendida ? (
                    <span className="badge badge-normal">
                      <CheckCircle2 size={13} /> Atendida por Enfermería
                    </span>
                  ) : (
                    <span className="badge badge-danger">Pendiente</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
