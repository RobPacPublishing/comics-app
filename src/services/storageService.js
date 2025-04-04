// src/services/storageService.js
/**
 * Service per la gestione dello storage delle parti dei personaggi e delle pose
 * Supporta localStorage con possibilità di estensione a Firebase
 */
class StorageService {
  constructor(storageType = 'local') {
    this.storageType = storageType;
    this.storagePrefix = 'comics-app-';
  }

  // Salva una parte nel localStorage
  saveBodyPart(part) {
    if (!part || !part.id || !part.type) {
      throw new Error('La parte deve avere un id e un tipo');
    }
    const partsList = this.getBodyPartsByType(part.type) || [];
    const existingIndex = partsList.findIndex(p => p.id === part.id);
    
    if (existingIndex >= 0) {
      partsList[existingIndex] = part;
    } else {
      partsList.push(part);
    }

    localStorage.setItem(
      `${this.storagePrefix}${part.type}`,
      JSON.stringify(partsList)
    );
    return part;
  }

  // Ottiene tutte le parti di un certo tipo
  getBodyPartsByType(type) {
    const stored = localStorage.getItem(`${this.storagePrefix}${type}`);
    return stored ? JSON.parse(stored) : [];
  }

  // Ottiene una parte specifica per id e tipo
  getBodyPart(id, type) {
    const parts = this.getBodyPartsByType(type);
    return parts.find(part => part.id === id);
  }

  // Elimina una parte specifica
  deleteBodyPart(id, type) {
    const parts = this.getBodyPartsByType(type);
    const updatedParts = parts.filter(part => part.id !== id);
    
    localStorage.setItem(
      `${this.storagePrefix}${type}`,
      JSON.stringify(updatedParts)
    );
    
    return updatedParts;
  }

  // Ottiene tutte le parti di tutti i tipi
  getAllBodyParts() {
    const partTypes = ['head', 'body', 'legs', 'arms', 'accessories'];
    const allParts = {};
    partTypes.forEach(type => {
      allParts[type] = this.getBodyPartsByType(type);
    });
    return allParts;
  }
  
  // Importa parti da un file JSON
  importBodyParts(jsonData) {
    try {
      const parts = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      
      if (Array.isArray(parts)) {
        parts.forEach(part => this.saveBodyPart(part));
        return parts.length;
      } else if (typeof parts === 'object') {
        Object.keys(parts).forEach(type => {
          if (Array.isArray(parts[type])) {
            parts[type].forEach(part => {
              part.type = type; // Assicuriamoci che il tipo sia corretto
              this.saveBodyPart(part);
            });
          }
        });
        return Object.values(parts).flat().length;
      }
      
      return 0;
    } catch (error) {
      console.error('Errore durante l\'importazione delle parti:', error);
      throw error;
    }
  }
  
  // Esporta tutte le parti in formato JSON
  exportBodyParts() {
    return JSON.stringify(this.getAllBodyParts());
  }

  // --- NUOVE FUNZIONI PER LA GESTIONE DELLE POSE ---

  // Salva una posa nel localStorage
  saveCharacterPose(pose) {
    if (!pose || !pose.id) {
      throw new Error('La posa deve avere un id');
    }

    const posesList = this.getCharacterPoses() || [];
    const existingIndex = posesList.findIndex(p => p.id === pose.id);
    
    if (existingIndex >= 0) {
      posesList[existingIndex] = pose;
    } else {
      posesList.push(pose);
    }

    localStorage.setItem(
      `${this.storagePrefix}poses`,
      JSON.stringify(posesList)
    );
    return pose;
  }

  // Ottiene tutte le pose salvate
  getCharacterPoses() {
    const stored = localStorage.getItem(`${this.storagePrefix}poses`);
    return stored ? JSON.parse(stored) : [];
  }

  // Ottiene una posa specifica per id
  getCharacterPose(id) {
    const poses = this.getCharacterPoses();
    return poses.find(pose => pose.id === id);
  }

  // Elimina una posa specifica
  deleteCharacterPose(id) {
    const poses = this.getCharacterPoses();
    const updatedPoses = poses.filter(pose => pose.id !== id);
    
    localStorage.setItem(
      `${this.storagePrefix}poses`,
      JSON.stringify(updatedPoses)
    );
    
    return updatedPoses;
  }

  // Salva più pose contemporaneamente (sovrascrive quelle esistenti)
  saveCharacterPoses(poses) {
    if (!Array.isArray(poses)) {
      throw new Error('poses deve essere un array');
    }

    localStorage.setItem(
      `${this.storagePrefix}poses`,
      JSON.stringify(poses)
    );
    
    return poses;
  }

  // Importa pose da un file JSON
  importCharacterPoses(jsonData) {
    try {
      const poses = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      
      if (Array.isArray(poses)) {
        this.saveCharacterPoses(poses);
        return poses.length;
      }
      
      return 0;
    } catch (error) {
      console.error('Errore durante l\'importazione delle pose:', error);
      throw error;
    }
  }

  // Esporta tutte le pose in formato JSON
  exportCharacterPoses() {
    return JSON.stringify(this.getCharacterPoses());
  }
}

export default new StorageService();