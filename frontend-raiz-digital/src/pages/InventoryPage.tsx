import React, { useState, useEffect } from 'react';
import { useResident } from '../context/ResidentContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Product } from '../types';
import { Package, Plus, Minus, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const InventoryPage: React.FC = () => {
  const { selectedResident } = useResident();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  // New product state
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('Medicamentos');
  const [cantidad, setCantidad] = useState('10');
  const [stockMinimo, setStockMinimo] = useState('5');
  const [unidadMedida, setUnidadMedida] = useState('tabletas');
  const [fechaVencimiento, setFechaVencimiento] = useState('');

  const loadProducts = async () => {
    if (selectedResident) {
      const data = await api.getProducts(selectedResident.id);
      setProducts(data);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [selectedResident]);

  const handleQuantityChange = async (productId: number, delta: number) => {
    if (!selectedResident) return;
    await api.updateQuantity(selectedResident.id, productId, delta);
    await loadProducts();
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResident) return;
    await api.addProduct(selectedResident.id, {
      nombre,
      categoria,
      cantidad: Number(cantidad),
      stockMinimo: Number(stockMinimo),
      unidadMedida,
      fechaVencimiento,
    });
    await loadProducts();
    setShowAddForm(false);
    setNombre('');
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
            <Package size={22} color="#3b82f6" />
            <h1 style={{ fontSize: '1.5rem' }}>Inventario de Insumos & Medicamentos</h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Insumos pertenecientes a: <strong style={{ color: '#fff' }}>{selectedResident.nombre} {selectedResident.apellido}</strong> ({selectedResident.habitacion})
          </p>
        </div>

        {user?.rol !== 'RESIDENTE' && (
          <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
            <Plus size={18} /> {showAddForm ? 'Ocultar Formulario' : 'Agregar Nuevo Insumo'}
          </button>
        )}
      </div>

      {/* Add Product Form */}
      {showAddForm && (
        <div className="glass-card animate-fade-in" style={{ padding: '24px', borderColor: 'var(--accent-secondary)' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Registrar Insumo para el Residente</h2>
          <form onSubmit={handleAddProduct}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Nombre del Producto / Insumo</label>
                <input type="text" className="form-input" required value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. Losartán 50mg" />
              </div>
              <div className="form-group">
                <label className="form-label">Categoría</label>
                <select className="form-select" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                  <option value="Medicamentos">Medicamentos</option>
                  <option value="Higiene">Higiene Personal</option>
                  <option value="Material de Cuidado">Material de Cuidado</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Cantidad Inicial</label>
                <input type="number" className="form-input" required value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Stock Mínimo de Alerta</label>
                <input type="number" className="form-input" required value={stockMinimo} onChange={(e) => setStockMinimo(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Unidad de Medida</label>
                <input type="text" className="form-input" required value={unidadMedida} onChange={(e) => setUnidadMedida(e.target.value)} placeholder="Ej. tabletas, paquetes, frascos" />
              </div>
              <div className="form-group">
                <label className="form-label">Fecha de Vencimiento</label>
                <input type="date" className="form-input" value={fechaVencimiento} onChange={(e) => setFechaVencimiento(e.target.value)} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowAddForm(false)}>Cancelar</button>
              <button type="submit" className="btn btn-primary">Guardar en Inventario</button>
            </div>
          </form>
        </div>
      )}

      {/* Inventory List */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Insumos Disponibles ({products.length})</h2>

        {products.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No hay productos registrados en el inventario de este residente.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {products.map((p) => {
              const isLowStock = p.cantidad <= p.stockMinimo;
              return (
                <div key={p.id} className="glass-card" style={{ padding: '20px', borderColor: isLowStock ? 'rgba(239, 68, 68, 0.4)' : 'var(--glass-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <h3 style={{ fontSize: '1.1rem' }}>{p.nombre}</h3>
                      <span className="badge badge-normal" style={{ fontSize: '0.7rem', marginTop: '4px' }}>
                        {p.categoria}
                      </span>
                    </div>
                    {isLowStock ? (
                      <span className="badge badge-danger" style={{ fontSize: '0.7rem' }}>
                        <AlertTriangle size={12} /> Requiere Reabastecer
                      </span>
                    ) : (
                      <span className="badge badge-normal" style={{ fontSize: '0.7rem' }}>
                        <CheckCircle2 size={12} /> Stock Suficiente
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '10px' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Stock Disponible</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 700, color: isLowStock ? '#ef4444' : '#10b981' }}>
                        {p.cantidad} <span style={{ fontSize: '0.9rem', fontWeight: 400 }}>{p.unidadMedida}</span>
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>Mínimo: {p.stockMinimo} {p.unidadMedida}</div>
                    </div>

                    {/* Controls */}
                    {user?.rol === 'ENFERMERO' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '8px', borderRadius: '8px' }}
                          onClick={() => handleQuantityChange(p.id, -1)}
                          title="Restar 1"
                        >
                          <Minus size={16} />
                        </button>
                        <button
                          className="btn btn-primary"
                          style={{ padding: '8px', borderRadius: '8px' }}
                          onClick={() => handleQuantityChange(p.id, 1)}
                          title="Sumar 1"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
