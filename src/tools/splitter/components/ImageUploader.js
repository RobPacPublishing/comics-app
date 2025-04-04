// src/tools/splitter/components/ImageUploader.js

import React, { useState, useRef } from 'react';
import './ImageUploader.css';

const ImageUploader = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Gestisce il drop di un file
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  // Gestisce il drag over
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // Gestisce l'uscita dal drag
  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Gestisce il click sul pulsante di upload
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // Gestisce la selezione di file tramite input
  const handleFileChange = (e) => {
    const files = e.target.files;
    handleFiles(files);
  };

  // Elabora i file caricati
  const handleFiles = (files) => {
    setError('');
    
    if (files.length === 0) return;
    
    const file = files[0];
    
    // Verifica che il file sia un'immagine
    if (!file.type.startsWith('image/')) {
      setError('Per favore seleziona un file immagine valido (JPG, PNG, GIF, ecc.)');
      return;
    }
    
    // Limita la dimensione a 5MB
    if (file.size > 5 * 1024 * 1024) {
      setError('L\'immagine è troppo grande. La dimensione massima è 5MB.');
      return;
    }
    
    // Carica l'immagine
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        onImageUpload(img);
      };
      img.src = event.target.result;
    };
    
    reader.onerror = () => {
      setError('Si è verificato un errore durante la lettura del file.');
    };
    
    reader.readAsDataURL(file);
  };

  return (
    <div className="image-uploader">
      <div 
        className={`upload-area ${isDragging ? 'dragging' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleUploadClick}
      >
        <div className="upload-icon">
          <i className="fas fa-cloud-upload-alt"></i>
        </div>
        <h3>Carica un'immagine</h3>
        <p>Trascina un'immagine qui o clicca per selezionarne una</p>
        <p className="upload-formats">Formati supportati: JPG, PNG, GIF</p>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="file-input"
          onChange={handleFileChange}
        />
        
        {error && <div className="upload-error">{error}</div>}
      </div>
      
      <div className="upload-instructions">
        <h4>Come funziona:</h4>
        <ol>
          <li>Carica un'immagine del personaggio</li>
          <li>Seleziona le parti che vuoi ritagliare</li>
          <li>Assegna un tipo e un nome a ogni parte</li>
          <li>Salva le parti per usarle nel Character Composer</li>
        </ol>
      </div>
    </div>
  );
};

export default ImageUploader;