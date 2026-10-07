import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResident } from '../context/ResidentContext';
import { Activity, Package, FileText, AlertTriangle, Plus, Search, User, Heart } from 'lucide-react';
import { api } from '../services/api';

export const NurseDashboard: React.FC = () => {
  const { residentsList, selectedResident, setSelectedResident, reloadResidents } = useResident();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // New resident form
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [habitacion, setHabitacion] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');

  const navigate = useNavigate();

  const filteredResidents = residentsList.filter((r) =>
    `${r.nombre} ${r.apellido} ${r.habitacion}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateResident = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.createResident({ nombre, apellido, habitacion, fechaNacimiento });
    await reloadResidents();
    setShowCreateModal(false);
    setNombre('');
    setApellido('');
    setHabitacion('');
    setFechaNacimiento('');
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Banner */}
      <div className="glass-card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', marginBottom: '4px' }}>Panel de Control del Enfermero</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Gestión integral de residentes, control de salud, signos vitales e inventario.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          <Plus size={18} /> Registrar Nuevo Residente
        </button>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
        
        {/* Left Column: Residents List */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.2rem' }}>Residentes Asignados</h2>
            
            {/* Search Input */}
            <div style={{ position: 'relative', width: '260px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Buscar por nombre o habitación..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '36px', fontSize: '0.85rem' }}
              />
              <Search size={16} color="#9ca3af" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {filteredResidents.map((r) => {
              const isSelected = selectedResident?.id === r.id;
              return (
                <div
                  key={r.id}
                  className="glass-card"
                  style={{
                    padding: '20px',
                    cursor: 'pointer',
                    borderColor: isSelected ? 'var(--accent-primary)' : 'var(--glass-border)',
                    boxShadow: isSelected ? 'var(--shadow-glow)' : 'var(--shadow-card)',
                  }}
                  onClick={() => setSelectedResident(r)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ background: 'rgba(16, 185, 129, 0.15)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={20} color="#10b981" />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.05rem' }}>{r.nombre} {r.apellido}</h3>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{r.habitacion}</span>
                      </div>
                    </div>
                    <span className={`badge ${r.estado === 'Estable' ? 'badge-normal' : 'badge-warning'}`}>
                      {r.estado}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                    Familiar a cargo: <strong style={{ color: '#fff' }}>{r.familiar?.nombre || 'No asignado'}</strong>
                  </div>

                  {/* Quick Action Shortcuts */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
                    <button
                      className="btn btn-secondary"
                      style={{ fontSize: '0.75rem', padding: '6px' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedResident(r);
                        navigate('/signos-vitales');
                      }}
                    >
                      <Activity size={13} color="#10b981" /> Signos
                    </button>
                    <button
                      className="btn btn-secondary"
                      style={{ fontSize: '0.75rem', padding: '6px' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedResident(r);
                        navigate('/inventario');
                      }}
                    >
                      <Package size={13} color="#3b82f6" /> Stock
                    </button>
                    <button
                      className="btn btn-secondary"
                      style={{ fontSize: '0.75rem', padding: '6px' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedResident(r);
                        navigate('/recetas');
                      }}
                    >
                      <FileText size={13} color="#f59e0b" /> Recetas
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Resident Quick Summary */}
        <div>
          {selectedResident ? (
            <div className="glass-card" style={{ padding: '20px', position: 'sticky', top: '80px' }}>
              <div style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '14px', marginBottom: '16px' }}>
                <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600, textTransform: 'uppercase' }}>
                  Residente Seleccionado
                </div>
                <h2 style={{ fontSize: '1.3rem', marginTop: '4px' }}>
                  {selectedResident.nombre} {selectedResident.apellido}
                </h2>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{selectedResident.habitacion}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '10px' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Último Registro de Signos</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#10b981', marginTop: '2px' }}>
                    {selectedResident.vitalSigns?.[0]?.presionArterial || '120/80'} PA
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                    {selectedResident.vitalSigns?.[0]?.saturacionOxigeno || 98}% SpO₂ • {selectedResident.vitalSigns?.[0]?.temperatura || 36.6}°C
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '10px' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Alertas Pendientes</div>
                  <div style={{ fontSize: '1rem', fontWeight: 600, color: '#f59e0b', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertTriangle size={16} />
                    {selectedResident.alerts?.length || 1} Alertas de stock
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => navigate('/signos-vitales')}>
                  <Activity size={16} /> Registrar Signos Vitales
                </button>
                <button className="btn btn-secondary" style={{ width: '100%' }} onClick={() => navigate('/reabastecimiento')}>
                  <AlertTriangle size={16} stroke="#f59e0b" /> Ver Alertas Reabastecimiento
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-card" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Seleccione un residente para ver sus detalles.
            </div>
          )}
        </div>

      </div>

      {/* Modal: Create Resident */}
      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '480px', padding: '28px' }}>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '16px' }}>Registrar Nuevo Residente</h2>
            <form onSubmit={handleCreateResident}>
              <div className="form-group">
                <label className="form-label">Nombre</label>
                <input type="text" className="form-input" required value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. Carlos" />
              </div>
              <div className="form-group">
                <label className="form-label">Apellido</label>
                <input type="text" className="form-input" required value={apellido} onChange={(e) => setApellido(e.target.value)} placeholder="Ej. Mendoza" />
              </div>
              <div className="form-group">
                <label className="form-label">Habitación / Cama</label>
                <input type="text" className="form-input" required value={habitacion} onChange={(e) => setHabitacion(e.target.value)} placeholder="Ej. Habitación 105-B" />
              </div>
              <div className="form-group">
                <label className="form-label">Fecha de Nacimiento</label>
                <input type="date" className="form-input" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Guardar Residente</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
