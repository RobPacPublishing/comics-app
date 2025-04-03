import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Image } from 'react-konva';
import PartSelector from './components/PartSelector';
import CanvasControls from './components/CanvasControls';
import './CharacterComposer.css';

const CharacterComposer = () => {
  const [selectedParts, setSelectedParts] = useState([]);
  const [selectedPartId, setSelectedPartId] = useState(null);
  const stageRef = useRef(null);

  // Esempio di parti disponibili (da sostituire con dati reali)
  const availableParts = [
    { id: 1, type: 'head', src: '/placeholder-head.png', name: 'Testa Base' },
    { id: 2, type: 'body', src: '/placeholder-body.png', name: 'Corpo Base' },
    { id: 3, type: 'arm', src: '/placeholder-arm.png', name: 'Braccio Base' },
    { id: 4, type: 'leg', src: '/placeholder-leg.png', name: 'Gamba Base' },
  ];

  const handleAddPart = (part) => {
    const newPart = {
      ...part,
      x: 200,
      y: 150,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      draggable: true,
      id: Date.now(),
    };
    
    setSelectedParts([...selectedParts, newPart]);
  };

  const handleSelectPart = (id) => {
    setSelectedPartId(id);
  };

  const handleDragEnd = (e, id) => {
    const updatedParts = selectedParts.map(part => 
      part.id === id ? { ...part, x: e.target.x(), y: e.target.y() } : part
    );
    setSelectedParts(updatedParts);
  };

  const handleRotate = (direction) => {
    if (!selectedPartId) return;
    
    const updatedParts = selectedParts.map(part => {
      if (part.id === selectedPartId) {
        const newRotation = part.rotation + (direction === 'right' ? 15 : -15);
        return { ...part, rotation: newRotation };
      }
      return part;
    });
    
    setSelectedParts(updatedParts);
  };

  const handleScale = (scaleDirection) => {
    if (!selectedPartId) return;
    
    const updatedParts = selectedParts.map(part => {
      if (part.id === selectedPartId) {
        const scaleChange = 0.1;
        const newScaleX = scaleDirection === 'up' ? part.scaleX + scaleChange : part.scaleX - scaleChange;
        const newScaleY = scaleDirection === 'up' ? part.scaleY + scaleChange : part.scaleY - scaleChange;
        
        // Prevent negative scaling
        if (newScaleX > 0.1 && newScaleY > 0.1) {
          return { ...part, scaleX: newScaleX, scaleY: newScaleY };
        }
      }
      return part;
    });
    
    setSelectedParts(updatedParts);
  };

  const handleDeleteSelected = () => {
    if (!selectedPartId) return;
    const updatedParts = selectedParts.filter(part => part.id !== selectedPartId);
    setSelectedParts(updatedParts);
    setSelectedPartId(null);
  };

  return (
    <div className="character-composer">
      <div className="composer-header">
        <h2>Character Composer</h2>
      </div>
      
      <div className="composer-content">
        <PartSelector parts={availableParts} onAddPart={handleAddPart} />
        
        <div className="canvas-container">
          <Stage
            width={500}
            height={500}
            ref={stageRef}
            className="composer-canvas"
          >
            <Layer>
              {selectedParts.map(part => (
                <Image
                  key={part.id}
                  id={part.id}
                  x={part.x}
                  y={part.y}
                  rotation={part.rotation}
                  scaleX={part.scaleX}
                  scaleY={part.scaleY}
                  draggable={true}
                  onClick={() => handleSelectPart(part.id)}
                  onDragEnd={(e) => handleDragEnd(e, part.id)}
                  stroke={selectedPartId === part.id ? '#00A0FF' : ''}
                  strokeWidth={selectedPartId === part.id ? 2 : 0}
                />
              ))}
            </Layer>
          </Stage>
          
          <CanvasControls 
            onRotate={handleRotate}
            onScale={handleScale}
            onDelete={handleDeleteSelected}
            isPartSelected={!!selectedPartId}
          />
        </div>
      </div>
    </div>
  );
};

export default CharacterComposer;