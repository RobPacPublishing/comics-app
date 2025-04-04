// src/tools/poseeditor/components/PoseControls.js
import React, { useState } from 'react';
import './PoseControls.css';

const PoseControls = ({ 
  onRotate, 
  onMove, 
  onScale,
  onSave, 
  onSaveAs, 
  savedPoses, 
  onLoadPose,
  selectedPart
}) => {
  const [poseName, setPoseName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const handleSaveAs = () => {
    if (!poseName.trim()) {
      alert('Inserisci un nome per la posa');
      return;
    }
    
    onSaveAs(poseName);
    setPoseName('');
    setShowSaveDialog(false);
  };

  return (
    <div className="pose-controls">
      <h3>Controlli di Posa</h3>
      
      {selectedPart ? (
        <div className="part-controls">
          <h4>Modifica: {selectedPart.type}</h4>
          
          <div className="control-section">
            <h5>Rotazione</h5>
            <div className="button-group">
              <button onClick={() => onRotate(-10)}>-10°</button>
              <button onClick={() => onRotate(-5)}>-5°</button>
              <button onClick={() => onRotate(-1)}>-1°</button>
              <button onClick={() => onRotate(1)}>+1°</button>
              <button onClick={() => onRotate(5)}>+5°</button>
              <button onClick={() => onRotate(10)}>+10°</button>
            </div>
          </div>
          
          <div className="control-section">
            <h5>Movimento</h5>
            <div className="movement-controls">
              <div className="movement-row">
                <button onClick={() => onMove(-10, -10)} className="diagonal">↖</button>
                <button onClick={() => onMove(0, -10)} className="direction">↑</button>
                <button onClick={() => onMove(10, -10)} className="diagonal">↗</button>
              </div>
              <div className="movement-row">
                <button onClick={() => onMove(-10, 0)} className="direction">←</button>
                <button className="center-btn">•</button>
                <button onClick={() => onMove(10, 0)} className="direction">→</button>
              </div>
              <div className="movement-row">
                <button onClick={() => onMove(-10, 10)} className="diagonal">↙</button>
                <button onClick={() => onMove(0, 10)} className="direction">↓</button>
                <button onClick={() => onMove(10, 10)} className="diagonal">↘</button>
              </div>
            </div>
          </div>
          
          <div className="control-section">
            <h5>Scala</h5>
            <div className="button-group">
              <button onClick={() => onScale(-0.1, -0.1)}>-</button>
              <button onClick={() => onScale(0.1, 0.1)}>+</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="no-selection-message">
          <p>Seleziona una parte del personaggio per modificarla</p>
        </div>
      )}
      
      <div className="pose-management">
        <h4>Gestione Pose</h4>
        
        <div className="button-group">
          <button 
            onClick={onSave}
            className="primary-button"
            disabled={!selectedPart}
          >
            Salva Posa
          </button>
          <button 
            onClick={() => setShowSaveDialog(true)}
            className="secondary-button"
            disabled={!selectedPart}
          >
            Salva come...
          </button>
        </div>
        
        {showSaveDialog && (
          <div className="save-dialog">
            <input
              type="text"
              value={poseName}
              onChange={(e) => setPoseName(e.target.value)}
              placeholder="Nome della posa"
              className="pose-name-input"
            />
            <div className="dialog-buttons">
              <button onClick={handleSaveAs} className="primary-button">Salva</button>
              <button onClick={() => setShowSaveDialog(false)} className="secondary-button">Annulla</button>
            </div>
          </div>
        )}
        
        <div className="saved-poses">
          <h5>Pose Salvate</h5>
          {savedPoses.length > 0 ? (
            <select 
              onChange={(e) => e.target.value && onLoadPose(e.target.value)}
              defaultValue=""
              className="pose-select"
            >
              <option value="" disabled>Seleziona una posa</option>
              {savedPoses.map(pose => (
                <option key={pose.id} value={pose.id}>
                  {pose.name}
                </option>
              ))}
            </select>
          ) : (
            <p className="no-poses-message">Nessuna posa salvata</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PoseControls;