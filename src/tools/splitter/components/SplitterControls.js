// src/tools/splitter/components/SplitterControls.js

import React from 'react';
import './SplitterControls.css';

const SplitterControls = ({ 
  partType, 
  partName, 
  selectedArea, 
  onPartTypeChange, 
  onPartNameChange, 
  onSavePart 
}) => {
  // Opzioni per i tipi di parte del corpo
  const partTypeOptions = [
    { value: 'head', label: 'Testa' },
    { value: 'body', label: 'Corpo' },
    { value: 'arms', label: 'Braccia' },
    { value: 'legs', label: 'Gambe' },
    { value: 'accessories', label: 'Accessori' }
  ];

  return (
    <div className="splitter-controls">
      <div className="tool-section">
        <h3 className="tool-section-title">Dettagli Selezione</h3>
        
        {selectedArea ? (
          <div className="selection-details">
            <div className="selection-preview">
              <span>Dimensioni: {selectedArea.width} x {selectedArea.height}px</span>
              <span>Posizione: x={selectedArea.x}, y={selectedArea.y}</span>
            </div>
          </div>
        ) : (
          <p className="no-selection">
            Seleziona un'area sull'immagine
          </p>
        )}
      </div>
      
      <div className="tool-section">
        <h3 className="tool-section-title">Salva Parte</h3>
        
        <div className="form-controls">
          <div className="form-group">
            <label htmlFor="partType">Tipo di Parte:</label>
            <select 
              id="partType"
              className="form-control"
              value={partType}
              onChange={(e) => onPartTypeChange(e.target.value)}
            >
              {partTypeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="partName">Nome della Parte:</label>
            <input
              id="partName"
              type="text"
              className="form-control"
              value={partName}
              onChange={onPartNameChange}
              placeholder="es. testa_1"
            />
          </div>
          
          <button 
            className="btn btn-primary btn-block"
            onClick={onSavePart}
            disabled={!selectedArea || !partName.trim()}
          >
            <i className="fas fa-save"></i> Salva Parte
          </button>
        </div>
      </div>
      
      <div className="tool-section">
        <h3 className="tool-section-title">Suggerimenti</h3>
        <ul className="splitter-tips">
          <li>Seleziona un'area rettangolare sull'immagine</li>
          <li>Scegli il tipo di parte appropriato dal menu a tendina</li>
          <li>Dai un nome descrittivo alla parte</li>
          <li>Le parti salvate appariranno nel Composer</li>
        </ul>
      </div>
    </div>
  );
};

export default SplitterControls;