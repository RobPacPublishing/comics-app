import React, { useState, useRef } from 'react';
import ImageUploader from './components/ImageUploader';
import SplitterCanvas from './components/SplitterCanvas';
import SplitterControls from './components/SplitterControls';
import './CharacterSplitter.css';

const CharacterSplitter = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [parts, setParts] = useState([]);
  const [currentTool, setCurrentTool] = useState('pen'); // 'pen', 'eraser', 'auto'
  const [currentPartType, setCurrentPartType] = useState('head'); // 'head', 'body', 'arm', 'leg'
  const canvasRef = useRef(null);

  const handleImageUpload = (imageFile) => {
    const imageUrl = URL.createObjectURL(imageFile);
    setUploadedImage(imageUrl);
    // Reset parts when a new image is uploaded
    setParts([]);
  };

  const handleAddPart = (partData) => {
    const newPart = {
      id: Date.now(),
      type: currentPartType,
      maskData: partData.path,
      previewUrl: partData.previewUrl,
      name: `${currentPartType.charAt(0).toUpperCase() + currentPartType.slice(1)} ${parts.length + 1}`,
    };
    
    setParts([...parts, newPart]);
  };

  const handleToolChange = (tool) => {
    setCurrentTool(tool);
  };

  const handlePartTypeChange = (type) => {
    setCurrentPartType(type);
  };

  const handleSaveParts = () => {
    // In a real app, you would save parts to storage or database
    console.log('Saving parts to library:', parts);
    alert(`${parts.length} parti salvate nella libreria!`);
    // Reset after saving
    setUploadedImage(null);
    setParts([]);
  };

  return (
    <div className="character-splitter">
      <div className="splitter-header">
        <h2>Character Splitter</h2>
        <p>Carica un'immagine del personaggio e separala in parti riutilizzabili</p>
      </div>
      
      <div className="splitter-content">
        {!uploadedImage ? (
          <ImageUploader onImageUpload={handleImageUpload} />
        ) : (
          <>
            <div className="canvas-workspace">
              <SplitterCanvas 
                ref={canvasRef}
                image={uploadedImage}
                tool={currentTool}
                partType={currentPartType}
                onAddPart={handleAddPart}
              />
              
              <div className="parts-preview">
                <h3>Parti create ({parts.length})</h3>
                <div className="parts-list">
                  {parts.map(part => (
                    <div key={part.id} className="part-preview">
                      <div className="part-image">
                        {part.previewUrl ? (
                          <img src={part.previewUrl} alt={part.name} />
                        ) : (
                          <div className="placeholder-image"></div>
                        )}
                      </div>
                      <span className="part-name">{part.name}</span>
                    </div>
                  ))}
                </div>
                
                {parts.length > 0 && (
                  <button 
                    className="save-parts-button"
                    onClick={handleSaveParts}
                  >
                    Salva parti nella libreria
                  </button>
                )}
              </div>
            </div>
            
            <SplitterControls
              currentTool={currentTool}
              currentPartType={currentPartType}
              onToolChange={handleToolChange}
              onPartTypeChange={handlePartTypeChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default CharacterSplitter;