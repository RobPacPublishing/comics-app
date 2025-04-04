// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { BodyPartsProvider } from './context/BodyPartsContext';
import Navigation from './components/Navigation';
import CharacterComposer from './tools/composer/CharacterComposer';
import CharacterSplitter from './tools/splitter/CharacterSplitter';
import PoseEditor from './tools/poseeditor/PoseEditor'; // Importazione del nuovo componente PoseEditor
import HomePage from './components/HomePage';
import NotFound from './components/NotFound';
import './App.css';

// Componenti placeholder per le funzionalità future
const LayoutEditor = () => <div className="placeholder">Layout Editor (In sviluppo)</div>;
const Gallery = () => <div className="placeholder">Galleria (In sviluppo)</div>;
const Settings = () => <div className="placeholder">Impostazioni (In sviluppo)</div>;

function App() {
  return (
    <Router>
      <BodyPartsProvider>
        <div className="app-container">
          <Navigation />
          
          <main className="app-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/composer" element={<CharacterComposer />} />
              <Route path="/splitter" element={<CharacterSplitter />} />
              <Route path="/pose-editor" element={<PoseEditor />} />
              <Route path="/layout-editor" element={<LayoutEditor />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </main>
          
          <footer className="app-footer">
            <p>© {new Date().getFullYear()} Comics App - Tutti i diritti riservati</p>
          </footer>
        </div>
      </BodyPartsProvider>
    </Router>
  );
}

export default App;