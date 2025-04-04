// src/tools/poseeditor/components/JointControls.js
import React from 'react';
import './JointControls.css';

const JointControls = ({ partType, joints, onJointUpdate }) => {
  if (!joints || Object.keys(joints).length === 0) {
    return (
      <div className="joint-controls">
        <h3>Punti di Articolazione</h3>
        <p className="no-joints-message">Nessun punto di articolazione disponibile per questa parte.</p>
      </div>
    );
  }

  const handlePositionChange = (jointName, axis, value) => {
    const numValue = Number(value);
    if (isNaN(numValue)) return;
    
    const currentJoint = joints[jointName];
    if (!currentJoint) return;
    
    const newPosition = { ...currentJoint };
    newPosition[axis] = numValue;
    
    onJointUpdate(jointName, newPosition);
  };

  return (
    <div className="joint-controls">
      <h3>Punti di Articolazione</h3>
      <p className="joint-part-type">Parte: {partType}</p>
      
      <div className="joints-list">
        {Object.entries(joints).map(([jointName, position]) => (
          <div key={jointName} className="joint-item">
            <div className="joint-name">{jointName}</div>
            <div className="joint-position-controls">
              <div className="position-control">
                <label htmlFor={`${jointName}-x`}>X:</label>
                <input
                  id={`${jointName}-x`}
                  type="number"
                  value={position.x}
                  onChange={(e) => handlePositionChange(jointName, 'x', e.target.value)}
                  className="position-input"
                />
              </div>
              <div className="position-control">
                <label htmlFor={`${jointName}-y`}>Y:</label>
                <input
                  id={`${jointName}-y`}
                  type="number"
                  value={position.y}
                  onChange={(e) => handlePositionChange(jointName, 'y', e.target.value)}
                  className="position-input"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="joints-info">
        <p><small>I punti di articolazione permettono di definire come le parti si connettono tra loro.</small></p>
      </div>
    </div>
  );
};

export default JointControls;