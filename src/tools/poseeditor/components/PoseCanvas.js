// src/tools/poseeditor/components/PoseCanvas.js
import React from 'react';
import './PoseCanvas.css';

const PoseCanvas = ({ canvasId }) => {
  return (
    <div className="pose-canvas-wrapper">
      <canvas id={canvasId} />
    </div>
  );
};

export default PoseCanvas;