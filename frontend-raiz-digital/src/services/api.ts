import { User, Resident, VitalSign, Product, Recipe, Alert, Role } from '../types';

const API_BASE = 'http://localhost:3001/api';

// Demo Mock State for standalone frontend execution
const MOCK_USER: User = {
  id: 1,
  nombre: 'Enfermero Juan Pérez',
  email: 'enfermero@raizdigital.org',
  rol: 'ENFERMERO',
};

const MOCK_RESIDENTS: Resident[] = [
  {
    id: 1,
    nombre: 'Roberto',
    apellido: 'García',
    fechaNacimiento: '1945-05-12',
    habitacion: 'Habitación 104-A',
    estado: 'Estable',
    familiar: { id: 2, nombre: 'María García', email: 'familiar@raizdigital.org' },
    vitalSigns: [
      {
        id: 101,
        residentId: 1,
        fecha: new Date().toISOString(),
        presionArterial: '120/80',
        frecuenciaCardiaca: 72,
        temperatura: 36.6,
        saturacionOxigeno: 98,
        notas: 'Paciente de buen ánimo y colaborativo.',
        registradoPor: { nombre: 'Enfermero Juan' },
      },
    ],
    products: [
      {
        id: 201,
        residentId: 1,
        nombre: 'Losartán 50mg',
        categoria: 'Medicamentos',
        cantidad: 3,
        stockMinimo: 5,
        unidadMedida: 'tabletas',
        fechaVencimiento: '2026-12-31',
      },
      {
        id: 202,
        residentId: 1,
        nombre: 'Pañales Adulto G',
        categoria: 'Higiene',
        cantidad: 20,
        stockMinimo: 10,
        unidadMedida: 'paquetes',
        fechaVencimiento: '2027-01-01',
      },
    ],
    recipes: [
      {
        id: 301,
        residentId: 1,
        diagnostico: 'Hipertensión Arterial Sistémica',
        medico: 'Dr. Alejandro Martínez',
        fecha: new Date().toISOString(),
        estado: 'ACTIVA',
        detalles: [
          { id: 1, medicamento: 'Losartán 50mg', dosis: '1 tableta', frecuencia: 'Cada 12 horas', duracion: '30 días' },
          { id: 2, medicamento: 'Aspirina 100mg', dosis: '1 tableta', frecuencia: 'Cada 24 horas', duracion: '30 días' },
        ],
      },
    ],
    alerts: [
      {
        id: 401,
        residentId: 1,
        tipo: 'REABASTECIMIENTO',
        mensaje: 'Quedan 3 tabletas de Losartán 50mg. Se requiere reabastecer pronto.',
        atendida: false,
        enteradoFamiliar: false,
        fecha: new Date().toISOString(),
      },
    ],
  },
  {
    id: 2,
    nombre: 'Elena',
    apellido: 'Torres',
    fechaNacimiento: '1948-09-20',
    habitacion: 'Habitación 108-B',
    estado: 'Requiere Atención',
    familiar: { id: 3, nombre: 'Carlos Torres', email: 'carlos@torres.com' },
    vitalSigns: [
      {
        id: 102,
        residentId: 2,
        fecha: new Date().toISOString(),
        presionArterial: '135/88',
        frecuenciaCardiaca: 82,
        temperatura: 37.1,
        saturacionOxigeno: 95,
        notas: 'Ligera elevación de temperatura.',
        registradoPor: { nombre: 'Enfermera Ana' },
      },
    ],
    products: [
      {
        id: 203,
        residentId: 2,
        nombre: 'Paracetamol 500mg',
        categoria: 'Medicamentos',
        cantidad: 15,
        stockMinimo: 5,
        unidadMedida: 'tabletas',
      },
    ],
    recipes: [],
    alerts: [],
  },
];

export const api = {
  // Auth
  login: async (email: string, password: string): Promise<{ token: string; user: User }> => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API connection failed, falling back to mock login');
    }
    
    // Fallback role based on email pattern
    let rol: Role = 'ENFERMERO';
    if (email.includes('familiar')) rol = 'FAMILIAR';
    if (email.includes('residente')) rol = 'RESIDENTE';
    if (email.includes('admin')) rol = 'ADMIN';

    return {
      token: 'demo-token-123',
      user: {
        id: 1,
        nombre: email.split('@')[0].toUpperCase(),
        email,
        rol,
      },
    };
  },

  register: async (data: { nombre: string; email: string; password: string; rol: Role }): Promise<{ token: string; user: User }> => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API connection failed, falling back to mock register');
    }
    return {
      token: 'demo-token-123',
      user: { id: Date.now(), ...data },
    };
  },

  // Residents
  getResidents: async (search?: string): Promise<Resident[]> => {
    try {
      const url = search ? `${API_BASE}/residents?search=${encodeURIComponent(search)}` : `${API_BASE}/residents`;
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API connection failed, falling back to mock residents');
    }
    if (search) {
      return MOCK_RESIDENTS.filter((r) =>
        `${r.nombre} ${r.apellido} ${r.habitacion}`.toLowerCase().includes(search.toLowerCase())
      );
    }
    return MOCK_RESIDENTS;
  },

  getResidentById: async (id: number): Promise<Resident | null> => {
    try {
      const res = await fetch(`${API_BASE}/residents/${id}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API connection failed, falling back to mock resident detail');
    }
    return MOCK_RESIDENTS.find((r) => r.id === id) || MOCK_RESIDENTS[0];
  },

  createResident: async (data: Partial<Resident>): Promise<Resident> => {
    try {
      const res = await fetch(`${API_BASE}/residents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API connection failed, falling back to mock create resident');
    }
    const newRes: Resident = {
      id: Date.now(),
      nombre: data.nombre || '',
      apellido: data.apellido || '',
      fechaNacimiento: data.fechaNacimiento || '1950-01-01',
      habitacion: data.habitacion || 'Habitación 101',
      estado: 'Estable',
      vitalSigns: [],
      products: [],
      recipes: [],
      alerts: [],
    };
    MOCK_RESIDENTS.push(newRes);
    return newRes;
  },

  // Vital Signs
  getVitalSigns: async (residentId: number): Promise<VitalSign[]> => {
    try {
      const res = await fetch(`${API_BASE}/residents/${residentId}/vitals`);
      if (res.ok) return await res.json();
    } catch (e) {}
    const r = MOCK_RESIDENTS.find((x) => x.id === residentId);
    return r?.vitalSigns || [];
  },

  addVitalSign: async (residentId: number, data: Partial<VitalSign>): Promise<VitalSign> => {
    try {
      const res = await fetch(`${API_BASE}/residents/${residentId}/vitals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    const newVital: VitalSign = {
      id: Date.now(),
      residentId,
      fecha: new Date().toISOString(),
      presionArterial: data.presionArterial || '120/80',
      frecuenciaCardiaca: Number(data.frecuenciaCardiaca) || 70,
      temperatura: Number(data.temperatura) || 36.5,
      saturacionOxigeno: Number(data.saturacionOxigeno) || 98,
      notas: data.notas,
      registradoPor: { nombre: 'Usuario Actual' },
    };
    const r = MOCK_RESIDENTS.find((x) => x.id === residentId);
    if (r) r.vitalSigns?.unshift(newVital);
    return newVital;
  },

  // Products
  getProducts: async (residentId: number): Promise<Product[]> => {
    try {
      const res = await fetch(`${API_BASE}/residents/${residentId}/products`);
      if (res.ok) return await res.json();
    } catch (e) {}
    const r = MOCK_RESIDENTS.find((x) => x.id === residentId);
    return r?.products || [];
  },

  addProduct: async (residentId: number, data: Partial<Product>): Promise<Product> => {
    try {
      const res = await fetch(`${API_BASE}/residents/${residentId}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    const newProd: Product = {
      id: Date.now(),
      residentId,
      nombre: data.nombre || 'Nuevo Producto',
      categoria: data.categoria || 'General',
      cantidad: Number(data.cantidad) || 0,
      stockMinimo: Number(data.stockMinimo) || 5,
      unidadMedida: data.unidadMedida || 'unidades',
      fechaVencimiento: data.fechaVencimiento,
    };
    const r = MOCK_RESIDENTS.find((x) => x.id === residentId);
    if (r) r.products?.push(newProd);
    return newProd;
  },

  updateQuantity: async (residentId: number, productId: number, delta: number): Promise<Product | null> => {
    try {
      const res = await fetch(`${API_BASE}/residents/${residentId}/products/${productId}/quantity`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delta }),
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    const r = MOCK_RESIDENTS.find((x) => x.id === residentId);
    const p = r?.products?.find((item) => item.id === productId);
    if (p) {
      p.cantidad = Math.max(0, p.cantidad + delta);
      return { ...p };
    }
    return null;
  },

  // Recipes
  getRecipes: async (residentId: number): Promise<Recipe[]> => {
    try {
      const res = await fetch(`${API_BASE}/residents/${residentId}/recipes`);
      if (res.ok) return await res.json();
    } catch (e) {}
    const r = MOCK_RESIDENTS.find((x) => x.id === residentId);
    return r?.recipes || [];
  },

  addRecipe: async (residentId: number, data: any): Promise<Recipe> => {
    try {
      const res = await fetch(`${API_BASE}/residents/${residentId}/recipes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    const newRec: Recipe = {
      id: Date.now(),
      residentId,
      diagnostico: data.diagnostico || 'Diagnóstico Médico',
      medico: data.medico || 'Dr. Asignado',
      fecha: new Date().toISOString(),
      estado: 'ACTIVA',
      detalles: data.detalles || [],
    };
    const r = MOCK_RESIDENTS.find((x) => x.id === residentId);
    if (r) r.recipes?.unshift(newRec);
    return newRec;
  },

  // Alerts
  getAlerts: async (residentId: number): Promise<Alert[]> => {
    try {
      const res = await fetch(`${API_BASE}/residents/${residentId}/alerts`);
      if (res.ok) return await res.json();
    } catch (e) {}
    const r = MOCK_RESIDENTS.find((x) => x.id === residentId);
    return r?.alerts || [];
  },
};
