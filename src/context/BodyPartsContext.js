// src/context/BodyPartsContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';
import storageService from '../services/storageService';

// Creazione del contesto
const BodyPartsContext = createContext();

// Hook personalizzato per utilizzare il contesto
export const useBodyParts = () => {
  const context = useContext(BodyPartsContext);
  if (context === undefined) {
    throw new Error('useBodyParts deve essere usato all\'interno di un BodyPartsProvider');
  }
  return context;
};

// Provider del contesto
export const BodyPartsProvider = ({ children }) => {
  const [bodyParts, setBodyParts] = useState({
    head: [],
    body: [],
    legs: [],
    arms: [],
    accessories: []
  });
  
  const [loading, setLoading] = useState(true);

  // Carica tutte le parti all'inizializzazione
  useEffect(() => {
    loadAllParts();
  }, []);

  // Funzione per caricare tutte le parti
  const loadAllParts = () => {
    setLoading(true);
    try {
      const allParts = storageService.getAllBodyParts();
      setBodyParts(allParts);
    } catch (error) {
      console.error('Errore nel caricamento delle parti:', error);
    } finally {
      setLoading(false);
    }
  };

  // Funzione per salvare una parte
  const savePart = (part) => {
    try {
      const savedPart = storageService.saveBodyPart(part);
      
      setBodyParts(prev => ({
        ...prev,
        [part.type]: [
          ...prev[part.type].filter(p => p.id !== part.id),
          savedPart
        ]
      }));
      
      return savedPart;
    } catch (error) {
      console.error('Errore nel salvataggio della parte:', error);
      throw error;
    }
  };

  // Funzione per eliminare una parte
  const deletePart = (id, type) => {
    try {
      storageService.deleteBodyPart(id, type);
      
      setBodyParts(prev => ({
        ...prev,
        [type]: prev[type].filter(p => p.id !== id)
      }));
      
      return true;
    } catch (error) {
      console.error('Errore nell\'eliminazione della parte:', error);
      throw error;
    }
  };

  // Funzione per importare parti
  const importParts = (jsonData) => {
    try {
      const count = storageService.importBodyParts(jsonData);
      loadAllParts(); // Ricarichiamo tutte le parti dopo l'importazione
      return count;
    } catch (error) {
      console.error('Errore nell\'importazione delle parti:', error);
      throw error;
    }
  };

  // Funzione per esportare parti
  const exportParts = () => {
    try {
      return storageService.exportBodyParts();
    } catch (error) {
      console.error('Errore nell\'esportazione delle parti:', error);
      throw error;
    }
  };

  // Valori esposti dal contesto
  const value = {
    bodyParts,
    loading,
    savePart,
    deletePart,
    loadAllParts,
    importParts,
    exportParts
  };

  return (
    <BodyPartsContext.Provider value={value}>
      {children}
    </BodyPartsContext.Provider>
  );
};

export default BodyPartsContext;