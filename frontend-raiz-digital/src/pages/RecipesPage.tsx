import React, { useState, useEffect } from 'react';
import { useResident } from '../context/ResidentContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Recipe } from '../types';
import { FileText, Plus, User, Calendar, CheckCircle2, Clock } from 'lucide-react';

export const RecipesPage: React.FC = () => {
  const { selectedResident } = useResident();
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [diagnostico, setDiagnostico] = useState('');
  const [medico, setMedico] = useState('');
  const [medicamento, setMedicamento] = useState('');
  const [dosis, setDosis] = useState('');
  const [frecuencia, setFrecuencia] = useState('');
  const [duracion, setDuracion] = useState('');

  const loadRecipes = async () => {
    if (selectedResident) {
      const data = await api.getRecipes(selectedResident.id);
      setRecipes(data);
    }
  };

  useEffect(() => {
    loadRecipes();
  }, [selectedResident]);

  const handleAddRecipe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResident) return;
    await api.addRecipe(selectedResident.id, {
      diagnostico,
      medico,
      detalles: [
        {
          medicamento,
          dosis,
          frecuencia,
          duracion,
        },
      ],
    });
    await loadRecipes();
    setShowForm(false);
    setDiagnostico('');
    setMedico('');
    setMedicamento('');
    setDosis('');
    setFrecuencia('');
    setDuracion('');
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
            <FileText size={22} color="#f59e0b" />
            <h1 style={{ fontSize: '1.5rem' }}>Recetas Médicas & Tratamientos</h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Tratamientos activos para: <strong style={{ color: '#fff' }}>{selectedResident.nombre} {selectedResident.apellido}</strong>
          </p>
        </div>

        {user?.rol === 'ENFERMERO' && (
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            <Plus size={18} /> {showForm ? 'Ocultar Formulario' : 'Registrar Nueva Receta'}
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="glass-card animate-fade-in" style={{ padding: '24px', borderColor: '#f59e0b' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Nueva Prescripción Médica</h2>
          <form onSubmit={handleAddRecipe}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Diagnóstico Clínico</label>
                <input type="text" className="form-input" required value={diagnostico} onChange={(e) => setDiagnostico(e.target.value)} placeholder="Ej. Hipertensión Arterial" />
              </div>
              <div className="form-group">
                <label className="form-label">Médico Tratante</label>
                <input type="text" className="form-input" required value={medico} onChange={(e) => setMedico(e.target.value)} placeholder="Ej. Dr. Alejandro Martínez" />
              </div>
              <div className="form-group">
                <label className="form-label">Medicamento Prescrito</label>
                <input type="text" className="form-input" required value={medicamento} onChange={(e) => setMedicamento(e.target.value)} placeholder="Ej. Losartán 50mg" />
              </div>
              <div className="form-group">
                <label className="form-label">Dosis</label>
                <input type="text" className="form-input" required value={dosis} onChange={(e) => setDosis(e.target.value)} placeholder="Ej. 1 tableta" />
              </div>
              <div className="form-group">
                <label className="form-label">Frecuencia de Toma</label>
                <input type="text" className="form-input" required value={frecuencia} onChange={(e) => setFrecuencia(e.target.value)} placeholder="Ej. Cada 12 horas" />
              </div>
              <div className="form-group">
                <label className="form-label">Duración del Tratamiento</label>
                <input type="text" className="form-input" required value={duracion} onChange={(e) => setDuracion(e.target.value)} placeholder="Ej. 30 días" />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
              <button type="submit" className="btn btn-primary">Guardar Receta</button>
            </div>
          </form>
        </div>
      )}

      {/* Recipes List */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Recetas Registradas ({recipes.length})</h2>

        {recipes.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No hay recetas registradas para este residente.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {recipes.map((r) => (
              <div key={r.id} className="glass-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px', marginBottom: '14px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>{r.diagnostico}</h3>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span><User size={14} /> {r.medico}</span>
                      <span><Calendar size={14} /> {new Date(r.fecha).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <span className={`badge ${r.estado === 'ACTIVA' ? 'badge-normal' : 'badge-warning'}`}>
                    {r.estado}
                  </span>
                </div>

                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#10b981', marginBottom: '8px' }}>
                  Detalle de Medicamentos & Posología:
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                  {r.detalles?.map((d) => (
                    <div key={d.id} style={{ background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '10px' }}>
                      <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>{d.medicamento}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Dosis: <strong style={{ color: '#fff' }}>{d.dosis}</strong>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Frecuencia: <strong style={{ color: '#fff' }}>{d.frecuencia}</strong>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#10b981', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={13} /> {d.duracion}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
