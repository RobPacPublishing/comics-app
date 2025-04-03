import React from 'react';
import './PartSelector.css';

const PartSelector = ({ parts, onAddPart }) => {
  const partTypes = Array.from(new Set(parts.map(part => part.type)));
  
  return (
    <div className="part-selector">
      <h3>Parti disponibili</h3>
      
      {partTypes.map(type => (
        <div key={type} className="part-category">
          <h4>{type.charAt(0).toUpperCase() + type.slice(1)}</h4>
          
          <div className="part-list">
            {parts
              .filter(part => part.type === type)
              .map(part => (
                <div 
                  key={part.id}
                  className="part-item"
                  onClick={() => onAddPart(part)}
                >
                  <div className="part-image">
                    <img src={part.src} alt={part.name} />
                  </div>
                  <span className="part-name">{part.name}</span>
                </div>
              ))
            }
          </div>
        </div>
      ))}
    </div>
  );
};

export default PartSelector;