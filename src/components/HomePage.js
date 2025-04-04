// src/components/HomePage.js

import React from 'react';
import { Link } from 'react-router-dom';
import { useBodyParts } from '../context/BodyPartsContext';
import './HomePage.css';

const HomePage = () => {
  const { bodyParts, loading } = useBodyParts();
  
  // Conteggio totale delle parti
  const totalParts = Object.values(bodyParts).reduce(
    (total, parts) => total + parts.length, 0
  );

  // Funzione per ottenere un riepilogo delle parti per tipo
  const getPartsSummary = () => {
    return Object.entries(bodyParts).map(([type, parts]) => ({
      type,
      count: parts.length
    }));
  };

  const partsSummary = getPartsSummary();

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Benvenuto in Comics App</h1>
        <p>Crea personaggi unici e componi fumetti in modo semplice e intuitivo</p>
        
        <div className="hero-actions">
          <Link to="/composer" className="btn btn-primary">
            <i className="fas fa-paint-brush"></i> Crea un Personaggio
          </Link>
          <Link to="/splitter" className="btn btn-secondary">
            <i className="fas fa-cut"></i> Dividi un'Immagine
          </Link>
        </div>
      </div>
      
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Parti dei Personaggi</h3>
            <span className="badge">{loading ? '...' : totalParts}</span>
          </div>
          
          <div className="card-content">
            {loading ? (
              <p>Caricamento...</p>
            ) : totalParts > 0 ? (
              <div className="parts-summary">
                {partsSummary.map(item => (
                  <div key={item.type} className="summary-item">
                    <span className="summary-label">{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</span>
                    <span className="summary-value">{item.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>Non hai ancora salvato parti di personaggi</p>
                <Link to="/splitter" className="btn btn-sm btn-secondary">
                  Inizia a dividere immagini
                </Link>
              </div>
            )}
          </div>
        </div>
        
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Personaggi Recenti</h3>
          </div>
          
          <div className="card-content">
            <div className="empty-state">
              <p>Nessun personaggio creato di recente</p>
              <Link to="/composer" className="btn btn-sm btn-secondary">
                Crea un personaggio
              </Link>
            </div>
          </div>
        </div>
        
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Strumenti</h3>
          </div>
          
          <div className="card-content">
            <div className="tools-grid">
              <Link to="/composer" className="tool-card">
                <div className="tool-icon"><i className="fas fa-paint-brush"></i></div>
                <h4>Character Composer</h4>
                <p>Combina parti per creare personaggi</p>
              </Link>
              
              <Link to="/splitter" className="tool-card">
                <div className="tool-icon"><i className="fas fa-cut"></i></div>
                <h4>Character Splitter</h4>
                <p>Dividi immagini in parti riutilizzabili</p>
              </Link>
              
              <Link to="/pose-editor" className="tool-card wip">
                <div className="tool-icon"><i className="fas fa-bone"></i></div>
                <h4>Pose Editor</h4>
                <p>Modifica le pose dei personaggi</p>
                <span className="wip-badge">In Sviluppo</span>
              </Link>
              
              <Link to="/layout-editor" className="tool-card wip">
                <div className="tool-icon"><i className="fas fa-th-large"></i></div>
                <h4>Layout Editor</h4>
                <p>Crea layout per le tue storie</p>
                <span className="wip-badge">In Sviluppo</span>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Risorse</h3>
          </div>
          
          <div className="card-content">
            <div className="resources-list">
              <a href="#" className="resource-item">
                <i className="fas fa-book"></i>
                <span>Tutorial: Come creare un personaggio</span>
              </a>
              <a href="#" className="resource-item">
                <i className="fas fa-video"></i>
                <span>Video: Utilizzare lo Splitter</span>
              </a>
              <a href="https://github.com/comics-app" target="_blank" rel="noopener noreferrer" className="resource-item">
                <i className="fab fa-github"></i>
                <span>Repository GitHub</span>
              </a>
              <a href="#" className="resource-item">
                <i className="fas fa-download"></i>
                <span>Pacchetto di risorse gratuite</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;