import React, { createContext, useContext, useState, useEffect } from 'react';
import { Resident } from '../types';
import { api } from '../services/api';

interface ResidentContextType {
  selectedResident: Resident | null;
  setSelectedResident: (resident: Resident | null) => void;
  residentsList: Resident[];
  reloadResidents: () => Promise<void>;
  loading: boolean;
}

const ResidentContext = createContext<ResidentContextType | undefined>(undefined);

export const ResidentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedResident, setSelectedResidentState] = useState<Resident | null>(() => {
    const saved = localStorage.getItem('raiz_selected_resident');
    return saved ? JSON.parse(saved) : null;
  });

  const [residentsList, setResidentsList] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(false);

  const setSelectedResident = (resident: Resident | null) => {
    setSelectedResidentState(resident);
    if (resident) {
      localStorage.setItem('raiz_selected_resident', JSON.stringify(resident));
    } else {
      localStorage.removeItem('raiz_selected_resident');
    }
  };

  const reloadResidents = async () => {
    setLoading(true);
    try {
      const list = await api.getResidents();
      setResidentsList(list);
      // Auto-select first resident if none selected
      if (!selectedResident && list.length > 0) {
        setSelectedResident(list[0]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadResidents();
  }, []);

  return (
    <ResidentContext.Provider
      value={{
        selectedResident,
        setSelectedResident,
        residentsList,
        reloadResidents,
        loading,
      }}
    >
      {children}
    </ResidentContext.Provider>
  );
};

export const useResident = () => {
  const context = useContext(ResidentContext);
  if (!context) throw new Error('useResident must be used within ResidentProvider');
  return context;
};
