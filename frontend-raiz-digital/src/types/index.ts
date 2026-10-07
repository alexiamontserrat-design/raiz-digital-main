export type Role = 'ADMIN' | 'ENFERMERO' | 'FAMILIAR' | 'RESIDENTE';

export interface User {
  id: number;
  nombre: string;
  email: string;
  rol: Role;
}

export interface Resident {
  id: number;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  habitacion: string;
  estado: string;
  familiarId?: number;
  familiar?: { id: number; nombre: string; email: string };
  vitalSigns?: VitalSign[];
  products?: Product[];
  recipes?: Recipe[];
  alerts?: Alert[];
  _count?: { vitalSigns: number; products: number; recipes: number };
}

export interface VitalSign {
  id: number;
  residentId: number;
  fecha: string;
  presionArterial: string;
  frecuenciaCardiaca: number;
  temperatura: number;
  saturacionOxigeno: number;
  notas?: string;
  registradoPor?: { nombre: string };
}

export interface Product {
  id: number;
  residentId: number;
  nombre: string;
  categoria: string;
  cantidad: number;
  stockMinimo: number;
  unidadMedida: string;
  fechaVencimiento?: string;
}

export interface RecipeDetail {
  id: number;
  medicamento: string;
  dosis: string;
  frecuencia: string;
  duracion: string;
}

export interface Recipe {
  id: number;
  residentId: number;
  diagnostico: string;
  medico: string;
  fecha: string;
  estado: 'ACTIVA' | 'FINALIZADA' | 'CANCELADA';
  detalles: RecipeDetail[];
}

export interface Alert {
  id: number;
  residentId: number;
  productId?: number;
  product?: Product;
  tipo: string;
  mensaje: string;
  atendida: boolean;
  enteradoFamiliar: boolean;
  fecha: string;
}
