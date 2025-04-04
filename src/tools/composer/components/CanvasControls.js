// src/tools/composer/components/CanvasControls.js

import React from 'react';
import './CanvasControls.css';

const CanvasControls = ({ 
  selectedParts, 
  onRemovePart, 
  characterName, 
  onCharacterNameChange, 
  onSaveCharacter 
}) => {
  // Funzione per ottenere il nome visualizzato di un tipo di parte
  const getPartTypeName = (type) => {
    const typeMap = {
      head: 'Testa',
      body: 'Corpo',
      arms: 'Braccia',
      legs: 'Gambe',
      accessories: 'Accessori'
    };
    return typeMap[type] || type;
  };

  return (
    <div className="canvas-controls">
      <div className="tool-section">
        <h3 className="tool-section-title">Parti Selezionate</h3>
        
        <div className="selected-parts-list">
          {Object.entries(selectedParts).map(([type, part]) => {
            if (type === 'accessories') {
              if (!part || part.length === 0) {
                return (
                  <div key={type} className="selected-part empty">
                    <span className="part-type">{getPartTypeName(type)}</span>
                    <span className="part-empty-message">Nessun accessorio</span>
                  </div>
                );
              }
              
              return (
                <div key={type} className="selected-part-group">
                  <div className="part-group-header">
                    <span className="part-type">{getPartTypeName(type)}</span>
                    <span className="part-count">{part.length}</span>
                  </div>
                  
                  {part.map(accessory => (
                    <div key={accessory.id} className="selected-part">
                      <div className="part-info">
                        <span className="part-name">{accessory.name}</span>
                      </div>
                      <button 
                        className="btn-remove"
                        onClick={() => onRemovePart(type, accessory.id)}
                        title="Rimuovi accessorio"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                </div>
              );
            } else {
              return (
                <div key={type} className="selected-part">
                  <span className="part-type">{getPartTypeName(type)}</span>
                  
                  {part ? (
                    <div className="part-info">
                      <span className="part-name">{part.name}</span>
                      <button 
                        className="btn-remove"
                        onClick={() => onRemovePart(type)}
                        title="Rimuovi parte"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ) : (
                    <span className="part-empty-message">Non selezionato</span>
                  )}
                </div>
              );
            }
          })}
        </div>
      </div>
      
      <div className="tool-section">
        <h3 className="tool-section-title">Salva Personaggio</h3>
        
        <div className="save-character-form">
          <div className="form-group">
            <label htmlFor="characterName">Nome del Personaggio:</label>
            <input
              id="characterName"
              type="text"
              className="form-control"
              value={characterName}
              onChange={onCharacterNameChange}
              placeholder="es. Supereroe, Pirata, ecc."
            />
          </div>
          
          <button 
            className="btn btn-primary btn-block"
            onClick={onSaveCharacter}
            disabled={!characterName.trim()}
          >
            <i className="fas fa-save"></i> Salva Personaggio
          </button>
        </div>
      </div>
      
      <div className="tool-section">
        <h3 className="tool-section-title">Suggerimenti</h3>
        <ul className="composer-tips">
          <li>Seleziona le parti dai tab sulla sinistra</li>
          <li>Gli accessori possono essere aggiunti più volte</li>
          <li>Dai un nome al personaggio per salvarlo</li>
          <li>I personaggi salvati possono essere usati nel Layout Editor</li>
        </ul>
      </div>
    </div>
  );
};

export default CanvasControls;