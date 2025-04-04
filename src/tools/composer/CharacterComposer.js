// src/tools/composer/CharacterComposer.js

import React, { useState, useEffect, useRef } from 'react';
import { useBodyParts } from '../../context/BodyPartsContext';
import eventService from '../../services/eventService';
import { useLocation } from 'react-router-dom';
import CanvasControls from './components/CanvasControls';
import PartSelector from './components/PartSelector';
import './CharacterComposer.css';

const CharacterComposer = () => {
  const { bodyParts, loading, loadAllParts } = useBodyParts();
  const location = useLocation();
  const [selectedParts, setSelectedParts] = useState({
    head: null,
    body: null,
    arms: null,
    legs: null,
    accessories: []
  });
  const [characterName, setCharacterName] = useState('');
  const [canvasSize, setCanvasSize] = useState({ width: 500, height: 700 });
  const [activeTab, setActiveTab] = useState('head');
  const [savedCharacters, setSavedCharacters] = useState([]);
  const [newPartHighlight, setNewPartHighlight] = useState(null);
  
  // Riferimento al canvas e all'event handler
  const canvasRef = useRef(null);
  const unsubscribeRef = useRef(null);
  
  // Funzione per aggiornare il canvas
  useEffect(() => {
    const drawCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Disegna nell'ordine corretto: tronco, gambe, braccia, testa, accessori
      const drawOrder = ['body', 'legs', 'arms', 'head', 'accessories'];
      
      for (const partType of drawOrder) {
        if (partType === 'accessories') {
          // Disegna tutti gli accessori se presenti
          if (selectedParts.accessories && selectedParts.accessories.length > 0) {
            selectedParts.accessories.forEach(accessory => {
              if (accessory) {
                const img = new Image();
                img.src = accessory.image;
                img.onload = () => {
                  // Posiziona l'accessorio in base al tipo e alla posizione relativa
                  const x = canvas.width / 2 - img.width / 2;
                  const y = 100; // Posizione di default, da personalizzare
                  ctx.drawImage(img, x, y, img.width, img.height);
                };
              }
            });
          }
        } else {
          // Disegna parti singole
          const part = selectedParts[partType];
          if (part) {
            const img = new Image();
            img.src = part.image;
            img.onload = () => {
              // Posiziona la parte in base al tipo e alla posizione relativa
              let x = canvas.width / 2 - img.width / 2;
              let y;
              
              // Posizionamento base in base al tipo di parte
              switch (partType) {
                case 'head':
                  y = 50;
                  break;
                case 'body':
                  y = 180;
                  break;
                case 'arms':
                  y = 200;
                  break;
                case 'legs':
                  y = 350;
                  break;
                default:
                  y = 0;
              }
              
              ctx.drawImage(img, x, y, img.width, img.height);
            };
          }
        }
      }
    };
    
    drawCanvas();
  }, [selectedParts, canvasSize]);
  
  // Gestisce la selezione di una parte
  const handlePartSelect = (part) => {
    if (part.type === 'accessories') {
      // Aggiungi l'accessorio alla lista
      setSelectedParts(prev => ({
        ...prev,
        accessories: [...(prev.accessories || []), part]
      }));
    } else {
      // Imposta la parte singola
      setSelectedParts(prev => ({
        ...prev,
        [part.type]: part
      }));
    }
  };
  
  // Gestisce la rimozione di una parte
  const handleRemovePart = (partType, partId = null) => {
    if (partType === 'accessories' && partId) {
      // Rimuovi uno specifico accessorio
      setSelectedParts(prev => ({
        ...prev,
        accessories: prev.accessories.filter(acc => acc.id !== partId)
      }));
    } else {
      // Rimuovi una parte singola
      setSelectedParts(prev => ({
        ...prev,
        [partType]: null
      }));
    }
  };
  
  // Gestisce il salvataggio del personaggio
  const handleSaveCharacter = () => {
    if (!characterName.trim()) {
      alert('Inserisci un nome per il personaggio');
      return;
    }
    
    // Verifica che ci sia almeno una parte selezionata
    const hasAnyPart = Object.values(selectedParts).some(part => 
      part !== null || (Array.isArray(part) && part.length > 0)
    );
    
    if (!hasAnyPart) {
      alert('Seleziona almeno una parte per creare un personaggio');
      return;
    }
    
    // Crea il personaggio
    const character = {
      id: `character_${Date.now()}`,
      name: characterName,
      parts: selectedParts,
      createdAt: new Date().toISOString()
    };
    
    // Salva nel localStorage
    const savedChars = JSON.parse(localStorage.getItem('comics-app-characters') || '[]');
    savedChars.push(character);
    localStorage.setItem('comics-app-characters', JSON.stringify(savedChars));
    
    // Aggiorna lo stato locale
    setSavedCharacters([...savedCharacters, character]);
    
    // Resetta il form
    setCharacterName('');
    
    alert(`Personaggio "${characterName}" salvato con successo!`);
  };
  
  // Registra l'evento per ricevere le nuove parti salvate
  useEffect(() => {
    // Funzione per gestire l'arrivo di una nuova parte
    const handleNewPart = (part) => {
      // Forza il ricaricamento di tutte le parti
      loadAllParts();
      // Imposta il tipo attivo sul tipo della parte appena salvata
      setActiveTab(part.type);
      // Evidenzia temporaneamente la nuova parte
      setNewPartHighlight(part.id);
      // Rimuovi l'evidenziazione dopo 3 secondi
      setTimeout(() => setNewPartHighlight(null), 3000);
    };
    
    // Registra l'handler per l'evento 'partSaved'
    unsubscribeRef.current = eventService.on('partSaved', handleNewPart);
    
    return () => {
      // Pulizia dell'handler quando il componente si smonta
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [loadAllParts]);
  
  // Carica i personaggi salvati all'avvio
  useEffect(() => {
    const loadSavedCharacters = () => {
      const savedChars = JSON.parse(localStorage.getItem('comics-app-characters') || '[]');
      setSavedCharacters(savedChars);
    };
    
    loadSavedCharacters();
  }, []);
  
  return (
    <div className="tool-container character-composer">
      <div className="tool-header">
        <h2>Character Composer</h2>
        <div className="tool-actions">
          <button className="btn btn-secondary">
            <i className="fas fa-question-circle"></i> Guida
          </button>
        </div>
      </div>
      
      <div className="composer-layout">
        <div className="parts-selector">
          <div className="part-tabs">
            <button 
              className={`part-tab ${activeTab === 'head' ? 'active' : ''}`}
              onClick={() => setActiveTab('head')}
            >
              Testa
            </button>
            <button 
              className={`part-tab ${activeTab === 'body' ? 'active' : ''}`}
              onClick={() => setActiveTab('body')}
            >
              Corpo
            </button>
            <button 
              className={`part-tab ${activeTab === 'arms' ? 'active' : ''}`}
              onClick={() => setActiveTab('arms')}
            >
              Braccia
            </button>
            <button 
              className={`part-tab ${activeTab === 'legs' ? 'active' : ''}`}
              onClick={() => setActiveTab('legs')}
            >
              Gambe
            </button>
            <button 
              className={`part-tab ${activeTab === 'accessories' ? 'active' : ''}`}
              onClick={() => setActiveTab('accessories')}
            >
              Accessori
            </button>
          </div>
          
          <div className="parts-list">
            {loading ? (
              <div className="loading-parts">Caricamento parti...</div>
            ) : bodyParts[activeTab] && bodyParts[activeTab].length > 0 ? (
              <PartSelector
                parts={bodyParts[activeTab]}
                onPartSelect={handlePartSelect}
                highlightedPartId={newPartHighlight}
              />
            ) : (
              <div className="no-parts-message">
                <p>Non hai ancora parti di questo tipo.</p>
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => window.location.href = '/splitter'}
                >
                  <i className="fas fa-cut"></i> Vai allo Splitter
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="canvas-container">
          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            className="character-canvas"
          />
        </div>
        
        <div className="composer-controls">
          <CanvasControls
            selectedParts={selectedParts}
            onRemovePart={handleRemovePart}
            characterName={characterName}
            onCharacterNameChange={(e) => setCharacterName(e.target.value)}
            onSaveCharacter={handleSaveCharacter}
          />
          
          <div className="tool-section">
            <h3 className="tool-section-title">Personaggi Salvati</h3>
            {savedCharacters.length > 0 ? (
              <div className="saved-characters">
                {savedCharacters.map(character => (
                  <div key={character.id} className="saved-character">
                    <div className="character-name">{character.name}</div>
                    <div className="character-date">
                      {new Date(character.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-characters">
                Crea e salva il tuo primo personaggio
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterComposer;