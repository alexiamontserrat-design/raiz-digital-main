import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useResident } from '../context/ResidentContext';
import { Heart, Activity, Package, FileText, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const FamilyDashboard: React.FC = () => {
  const { selectedResident } = useResident();
  const navigate = useNavigate();

  if (!selectedResident) {
    return (
      <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
        <h2>No hay residente seleccionado</h2>
        <p style={{ color: 'var(--text-muted)' }}>Por favor seleccione un residente para continuar.</p>
      </div>
    );
  }

  const lastVital = selectedResident.vitalSigns?.[0];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Welcome Banner */}
      <div className="glass-card" style={{ padding: '28px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(59, 130, 246, 0.1) 100%)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'var(--accent-primary)', width: '52px', height: '52px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-glow)' }}>
            <Heart size={28} color="#fff" />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Portal Familiar • Monitoreo en Tiempo Real
            </span>
            <h1 style={{ fontSize: '1.6rem', marginTop: '2px' }}>
              Resumen de Salud de {selectedResident.nombre} {selectedResident.apellido}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              {selectedResident.habitacion} • Estado actual: <strong style={{ color: '#10b981' }}>{selectedResident.estado}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Main Status Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        
        {/* Vital Signs Widget */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={20} color="#10b981" />
              <h3 style={{ fontSize: '1.1rem' }}>Signos Vitales Recientes</h3>
            </div>
            <button className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '4px 10px' }} onClick={() => navigate('/signos-vitales')}>
              Ver Historial
            </button>
          </div>

          {lastVital ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Presión Arterial</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>{lastVital.presionArterial}</div>
                <span className="badge badge-normal" style={{ marginTop: '4px', fontSize: '0.7rem' }}>Normal</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Frecuencia Cardíaca</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>{lastVital.frecuenciaCardiaca} bpm</div>
                <span className="badge badge-normal" style={{ marginTop: '4px', fontSize: '0.7rem' }}>Óptimo</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Temperatura</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>{lastVital.temperatura}°C</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Oxigenación</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>{lastVital.saturacionOxigeno}% SpO₂</div>
              </div>
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>Sin datos de signos vitales aún.</p>
          )}
        </div>

        {/* Prescription Summary */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={20} color="#3b82f6" />
              <h3 style={{ fontSize: '1.1rem' }}>Receta Médica Activa</h3>
            </div>
            <button className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '4px 10px' }} onClick={() => navigate('/recetas')}>
              Detalles
            </button>
          </div>

          {selectedResident.recipes?.[0] ? (
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Médico: <strong style={{ color: '#fff' }}>{selectedResident.recipes[0].medico}</strong>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '10px', marginBottom: '10px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Diagnóstico</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff' }}>{selectedResident.recipes[0].diagnostico}</div>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Medicamentos activos: {selectedResident.recipes[0].detalles?.length || 2}
              </div>
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>No hay recetas registradas.</p>
          )}
        </div>

        {/* Inventory Status & Reordering */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Package size={20} color="#f59e0b" />
              <h3 style={{ fontSize: '1.1rem' }}>Insumos & Medicamentos</h3>
            </div>
            <button className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '4px 10px' }} onClick={() => navigate('/inventario')}>
              Gestionar
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {selectedResident.products?.map((p) => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.04)', padding: '10px 14px', borderRadius: '8px' }}>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{p.nombre}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.categoria}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: p.cantidad <= p.stockMinimo ? '#ef4444' : '#10b981' }}>
                    {p.cantidad} {p.unidadMedida}
                  </div>
                  {p.cantidad <= p.stockMinimo && (
                    <span style={{ fontSize: '0.7rem', color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <AlertTriangle size={12} /> Stock bajo
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
