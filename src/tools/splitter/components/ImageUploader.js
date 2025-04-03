import React, { useState } from 'react';
import './ImageUploader.css';

const ImageUploader = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndUpload(file);
    }
  };
  
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      validateAndUpload(file);
    }
  };
  
  const validateAndUpload = (file) => {
    // Check if file is an image
    if (!file.type.match('image.*')) {
      alert('Per favore carica un file immagine (JPEG, PNG, GIF, etc.)');
      return;
    }
    
    onImageUpload(file);
  };
  
  return (
    <div 
      className={`image-uploader ${isDragging ? 'dragging' : ''}`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="upload-icon">
        <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5V19M12 5L18 11M12 5L6 11" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <h3>Carica l'immagine del personaggio</h3>
      <p>Trascina un'immagine o clicca per selezionarla</p>
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleFileChange} 
        id="fileInput" 
        style={{ display: 'none' }}
      />
      <button 
        className="select-file-button"
        onClick={() => document.getElementById('fileInput').click()}
      >
        Seleziona file
      </button>
    </div>
  );
};

export default ImageUploader;