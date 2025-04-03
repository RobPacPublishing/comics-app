import React from 'react';
import './SplitterControls.css';

const SplitterControls = ({ currentTool, currentPartType, onToolChange, onPartTypeChange }) => {
  const tools = [
    { id: 'pen', name: 'Pennello', icon: '✏️' },
    { id: 'eraser', name: 'Gomma', icon: '🧽' },
    { id: 'auto', name: 'Auto-detect', icon: '🔍' }
  ];
  
  const partTypes = [
    { id: 'head', name: 'Testa' },
    { id: 'body', name: 'Corpo' },
    { id: 'arm', name: 'Braccio' },
    { id: 'leg', name: 'Gamba' }
  ];
  
  return (
    <div className="splitter-controls">
      <div className="control-section">
        <h3>Strumenti</h3>
        <div className="tools-list">
          {tools.map(tool => (
            <button
              key={tool.id}
              className={`tool-button ${currentTool === tool.id ? 'active' : ''}`}
              onClick={() => onToolChange(tool.id)}
            >
              <span className="tool-icon">{tool.icon}</span>
              <span className="tool-name">{tool.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="control-section">
        <h3>Tipo di parte</h3>
        <div className="part-types-list">
          {partTypes.map(type => (
            <button
              key={type.id}
              className={`part-type-button ${currentPartType === type.id ? 'active' : ''}`}
              onClick={() => onPartTypeChange(type.id)}
            >
              {type.name}
            </button>
          ))}
        </div>
      </div>
      
      <div className="control-section">
        <h3>Istruzioni</h3>
        <ol className="instructions-list">
          <li>Seleziona il tipo di parte che vuoi estrarre</li>
          <li>Usa il pennello per tracciare il contorno della parte</li>
          <li>Usa la gomma per correggere eventuali errori</li>
          <li>Quando sei soddisfatto, la parte verrà aggiunta alla libreria</li>
        </ol>
      </div>
    </div>
  );
};

export default SplitterControls;