// src/tools/composer/components/PartSelector.js

import React from 'react';
import './PartSelector.css';

const PartSelector = ({ parts, onPartSelect, highlightedPartId = null }) => {
  // Ordina le parti per nome
  const sortedParts = [...parts].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="part-selector">
      {sortedParts.length > 0 ? (
        <div className="parts-grid">
          {sortedParts.map(part => (
            <div 
              key={part.id} 
              className={`part-item ${highlightedPartId === part.id ? 'highlighted' : ''}`}
              onClick={() => onPartSelect(part)}
            >
              <div className="part-image">
                <img src={part.image} alt={part.name} />
              </div>
              <div className="part-info">
                <h4 className="part-name">{part.name}</h4>
                <div className="part-meta">
                  <span className="part-dimensions">
                    {part.width}x{part.height}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-parts">
          Non ci sono parti disponibili
        </div>
      )}
    </div>
  );
};

export default PartSelector;