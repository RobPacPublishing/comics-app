// src/tools/splitter/CharacterSplitter.js

import React, { useState } from 'react';
import { useBodyParts } from '../../context/BodyPartsContext';
import SplitterCanvas from './components/SplitterCanvas';
import SplitterControls from './components/SplitterControls';
import ImageUploader from './components/ImageUploader';
import eventService from '../../services/eventService';
import { useNavigate } from 'react-router-dom';
import './CharacterSplitter.css';

const CharacterSplitter = () => {
  const { savePart } = useBodyParts();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [partType, setPartType] = useState('body');
  const [partName, setPartName] = useState('');
  const [savedParts, setSavedParts] = useState([]);
  const [showComposerPrompt, setShowComposerPrompt] = useState(false);
  
  // Gestisce il caricamento di un'immagine
  const handleImageUpload = (uploadedImage) => {
    setImage(uploadedImage);
    setSelectedArea(null);
    setSavedParts([]);
  };
  
  // Gestisce la selezione di un'area sull'immagine
  const handleAreaSelect = (area) => {
    setSelectedArea(area);
    // Suggerisci un nome per la parte in base al tipo
    const partCount = savedParts.filter(p => p.type === partType).length + 1;
    setPartName(`${partType}_${partCount}`);
  };
  
  // Gestisce il cambio del tipo di parte
  const handlePartTypeChange = (type) => {
    setPartType(type);
    // Aggiorna il nome suggerito in base al nuovo tipo
    const partCount = savedParts.filter(p => p.type === type).length + 1;
    setPartName(`${type}_${partCount}`);
  };
  
  // Gestisce il salvataggio di una parte
  const handleSavePart = async () => {
    if (!selectedArea || !image || !partName.trim()) {
      alert('Seleziona un\'area e inserisci un nome per la parte');
      return;
    }
    
    try {
      // Crea un canvas per ritagliare l'immagine
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Imposta le dimensioni del canvas in base all'area selezionata
      canvas.width = selectedArea.width;
      canvas.height = selectedArea.height;
      
      // Disegna solo la porzione selezionata dell'immagine
      ctx.drawImage(
        image,
        selectedArea.x, selectedArea.y, selectedArea.width, selectedArea.height,
        0, 0, selectedArea.width, selectedArea.height
      );
      
      // Converti il canvas in una data URL (base64)
      const dataUrl = canvas.toDataURL('image/png');
      
      // Crea l'oggetto parte
      const part = {
        id: `${partType}_${Date.now()}`,
        name: partName,
        type: partType,
        image: dataUrl,
        width: selectedArea.width,
        height: selectedArea.height,
        createdAt: new Date().toISOString()
      };
      
      // Salva la parte nel contesto
      await savePart(part);
      
      // Aggiungi la parte all'elenco locale delle parti salvate
      setSavedParts([...savedParts, part]);
      
      // Emetti un evento per notificare il salvataggio della parte
      eventService.emit('partSaved', part);
      
      // Resetta la selezione e il nome
      setSelectedArea(null);
      const newPartCount = savedParts.filter(p => p.type === partType).length + 2;
      setPartName(`${partType}_${newPartCount}`);
      
      // Mostra il prompt per passare al composer
      setShowComposerPrompt(true);
    } catch (error) {
      console.error('Errore durante il salvataggio della parte:', error);
      alert(`Errore durante il salvataggio: ${error.message}`);
    }
  };
  
  // Funzione per gestire il passaggio al Composer
  const handleGoToComposer = () => {
    navigate('/composer');
  };
  
  return (
    <div className="tool-container character-splitter">
      <div className="tool-header">
        <h2>Character Splitter</h2>
        <div className="tool-actions">
          <button 
            className="btn btn-primary" 
            onClick={handleGoToComposer}
          >
            <i className="fas fa-paint-brush"></i> Vai al Composer
          </button>
          <button className="btn btn-secondary">
            <i className="fas fa-question-circle"></i> Guida
          </button>
        </div>
      </div>
      
      {showComposerPrompt && (
        <div className="composer-prompt">
          <div className="prompt-content">
            <i className="fas fa-check-circle"></i>
            <p>Parte <strong>"{partName}"</strong> salvata con successo!</p>
            <div className="prompt-actions">
              <button 
                className="btn btn-primary" 
                onClick={handleGoToComposer}
              >
                Vai al Composer per usarla
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => setShowComposerPrompt(false)}
              >
                Continua qui
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="splitter-layout">
        {!image ? (
          <div className="upload-section">
            <ImageUploader onImageUpload={handleImageUpload} />
          </div>
        ) : (
          <>
            <div className="canvas-area">
              <SplitterCanvas 
                image={image} 
                selectedArea={selectedArea}
                onAreaSelect={handleAreaSelect}
              />
            </div>
            
            <div className="controls-area">
              <SplitterControls 
                partType={partType}
                partName={partName}
                selectedArea={selectedArea}
                onPartTypeChange={handlePartTypeChange}
                onPartNameChange={(e) => setPartName(e.target.value)}
                onSavePart={handleSavePart}
              />
              
              <div className="tool-section">
                <h3 className="tool-section-title">Parti Salvate</h3>
                {savedParts.length > 0 ? (
                  <div className="saved-parts">
                    {savedParts.map((part) => (
                      <div key={part.id} className="saved-part">
                        <img src={part.image} alt={part.name} />
                        <div className="saved-part-info">
                          <span>{part.name}</span>
                          <small>{part.type}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-parts">
                    Seleziona un'area e salva le parti del personaggio
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CharacterSplitter;