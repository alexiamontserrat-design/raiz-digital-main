import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, pass: string) => Promise<void>;
  register: (data: { nombre: string; email: string; password: string; rol: Role }) => Promise<void>;
  logout: () => void;
  setDemoUser: (rol: Role) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('raiz_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('raiz_token');
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('raiz_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('raiz_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('raiz_token', token);
    } else {
      localStorage.removeItem('raiz_token');
    }
  }, [token]);

  const login = async (email: string, pass: string) => {
    const res = await api.login(email, pass);
    setUser(res.user);
    setToken(res.token);
  };

  const register = async (data: { nombre: string; email: string; password: string; rol: Role }) => {
    const res = await api.register(data);
    setUser(res.user);
    setToken(res.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('raiz_user');
    localStorage.removeItem('raiz_token');
  };

  const setDemoUser = (rol: Role) => {
    const demoMap: Record<Role, User> = {
      ENFERMERO: { id: 1, nombre: 'Enfermero Juan Pérez', email: 'enfermero@raizdigital.org', rol: 'ENFERMERO' },
      FAMILIAR: { id: 2, nombre: 'María García (Familiar)', email: 'familiar@raizdigital.org', rol: 'FAMILIAR' },
      RESIDENTE: { id: 3, nombre: 'Roberto García (Residente)', email: 'residente@raizdigital.org', rol: 'RESIDENTE' },
      ADMIN: { id: 4, nombre: 'Administrador Sistema', email: 'admin@raizdigital.org', rol: 'ADMIN' },
    };
    setUser(demoMap[rol]);
    setToken(`demo-token-${rol.toLowerCase()}`);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, setDemoUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
