import React from 'react';
import './CanvasControls.css';

const CanvasControls = ({ onRotate, onScale, onDelete, isPartSelected }) => {
  return (
    <div className="canvas-controls">
      <div className="control-group">
        <button 
          onClick={() => onRotate('left')}
          disabled={!isPartSelected}
          className="control-button"
        >
          ↺ Ruota sinistra
        </button>
        <button 
          onClick={() => onRotate('right')}
          disabled={!isPartSelected}
          className="control-button"
        >
          ↻ Ruota destra
        </button>
      </div>
      
      <div className="control-group">
        <button 
          onClick={() => onScale('up')}
          disabled={!isPartSelected}
          className="control-button"
        >
          + Ingrandisci
        </button>
        <button 
          onClick={() => onScale('down')}
          disabled={!isPartSelected}
          className="control-button"
        >
          - Rimpicciolisci
        </button>
      </div>
      
      <button 
        onClick={onDelete}
        disabled={!isPartSelected}
        className="control-button delete-button"
      >
        🗑️ Elimina
      </button>
    </div>
  );
};

export default CanvasControls;