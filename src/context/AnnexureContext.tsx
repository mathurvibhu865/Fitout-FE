// src/context/AnnexureContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { getAnnexures } from "../api/endpoint";

export interface AnnexureType {
  id: number;
  name: string;
  file?: File | null;
}

interface AnnexureContextType {
  annexures: AnnexureType[];
  addAnnexure: (file: File, name?: string) => void;
}

const AnnexureContext = createContext<AnnexureContextType | undefined>(undefined);

export const AnnexureProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [annexures, setAnnexures] = useState<AnnexureType[]>([]);

  useEffect(() => {
    const fetchAnnexures = async () => {
      const data = await getAnnexures();
      setAnnexures(data);
    };
    fetchAnnexures();
  }, []);

  const addAnnexure = (file: File, name?: string) => {
    const newAnnexure = { id: Date.now(), name: name || file.name, file };
    setAnnexures(prev => [...prev, newAnnexure]);
  };

  return (
    <AnnexureContext.Provider value={{ annexures, addAnnexure }}>
      {children}
    </AnnexureContext.Provider>
  );
};

export const useAnnexures = () => {
  const context = useContext(AnnexureContext);
  if (!context) throw new Error("useAnnexures must be used within AnnexureProvider");
  return context;
};
