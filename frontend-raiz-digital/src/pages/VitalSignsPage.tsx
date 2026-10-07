import React, { useState, useEffect } from 'react';
import { useResident } from '../context/ResidentContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { VitalSign } from '../types';
import { Activity, Plus, Heart, Thermometer, Wind, CheckCircle2 } from 'lucide-react';

export const VitalSignsPage: React.FC = () => {
  const { selectedResident } = useResident();
  const { user } = useAuth();
  const [vitalSigns, setVitalSigns] = useState<VitalSign[]>([]);
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [presionArterial, setPresionArterial] = useState('120/80');
  const [frecuenciaCardiaca, setFrecuenciaCardiaca] = useState('72');
  const [temperatura, setTemperatura] = useState('36.6');
  const [saturacionOxigeno, setSaturacionOxigeno] = useState('98');
  const [notas, setNotas] = useState('');

  const loadVitals = async () => {
    if (selectedResident) {
      const data = await api.getVitalSigns(selectedResident.id);
      setVitalSigns(data);
    }
  };

  useEffect(() => {
    loadVitals();
  }, [selectedResident]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResident) return;
    await api.addVitalSign(selectedResident.id, {
      presionArterial,
      frecuenciaCardiaca: Number(frecuenciaCardiaca),
      temperatura: Number(temperatura),
      saturacionOxigeno: Number(saturacionOxigeno),
      notas,
    });
    await loadVitals();
    setShowForm(false);
    setNotas('');
  };

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
            <Activity size={22} color="#10b981" />
            <h1 style={{ fontSize: '1.5rem' }}>Registro & Historial de Signos Vitales</h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Residente: <strong style={{ color: '#fff' }}>{selectedResident.nombre} {selectedResident.apellido}</strong> ({selectedResident.habitacion})
          </p>
        </div>

        {user?.rol === 'ENFERMERO' && (
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            <Plus size={18} /> {showForm ? 'Ocultar Formulario' : 'Nuevo Registro de Signos'}
          </button>
        )}
      </div>

      {/* Form Section */}
      {showForm && (
        <div className="glass-card animate-fade-in" style={{ padding: '24px', borderColor: 'var(--accent-primary)' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Ingresar Nueva Toma de Signos Vitales</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Presión Arterial (mmHg)</label>
                <input type="text" className="form-input" required value={presionArterial} onChange={(e) => setPresionArterial(e.target.value)} placeholder="Ej. 120/80" />
              </div>
              <div className="form-group">
                <label className="form-label">Frecuencia Cardíaca (bpm)</label>
                <input type="number" className="form-input" required value={frecuenciaCardiaca} onChange={(e) => setFrecuenciaCardiaca(e.target.value)} placeholder="Ej. 72" />
              </div>
              <div className="form-group">
                <label className="form-label">Temperatura (°C)</label>
                <input type="number" step="0.1" className="form-input" required value={temperatura} onChange={(e) => setTemperatura(e.target.value)} placeholder="Ej. 36.6" />
              </div>
              <div className="form-group">
                <label className="form-label">Saturación Oxígeno (% SpO₂)</label>
                <input type="number" className="form-input" required value={saturacionOxigeno} onChange={(e) => setSaturacionOxigeno(e.target.value)} placeholder="Ej. 98" />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '12px' }}>
              <label className="form-label">Observaciones / Notas Clínicas</label>
              <textarea className="form-textarea" rows={2} value={notas} onChange={(e) => setNotas(e.target.value)} placeholder="Ej. Paciente descansado, refirió sentirse bien..." />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
              <button type="submit" className="btn btn-primary">Guardar Signos Vitales</button>
            </div>
          </form>
        </div>
      )}

      {/* History Table / Timeline */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Historial Clinico Registrado</h2>

        {vitalSigns.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No hay mediciones registradas para este residente.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {vitalSigns.map((v) => (
              <div key={v.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>
                    {new Date(v.fecha).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' })}
                  </div>
                  <div style={{ display: 'flex', gap: '20px', marginTop: '8px', flexWrap: 'wrap' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Presión:</span>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{v.presionArterial}</div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Frec. Cardíaca:</span>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{v.frecuenciaCardiaca} bpm</div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Temp:</span>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{v.temperatura}°C</div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SpO₂:</span>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{v.saturacionOxigeno}%</div>
                    </div>
                  </div>
                  {v.notas && (
                    <div style={{ fontSize: '0.85rem', color: '#d1d5db', marginTop: '8px', fontStyle: 'italic' }}>
                      "{v.notas}"
                    </div>
                  )}
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-normal">
                    <CheckCircle2 size={13} /> Registrado
                  </span>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Por: {v.registradoPor?.nombre || 'Enfermería'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
