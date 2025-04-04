// src/tools/splitter/components/SplitterCanvas.js

import React, { useRef, useEffect, useState } from 'react';
import './SplitterCanvas.css';

const SplitterCanvas = ({ image, selectedArea, onAreaSelect }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Ridimensiona il canvas in base all'immagine
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    
    if (!canvas || !container || !image) return;
    
    const ctx = canvas.getContext('2d');
    
    // Adatta il canvas alle dimensioni del container mantenendo l'aspect ratio
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    const aspectRatio = image.width / image.height;
    let canvasWidth, canvasHeight;
    
    if (containerWidth / containerHeight > aspectRatio) {
      // Container più largo dell'immagine
      canvasHeight = containerHeight;
      canvasWidth = canvasHeight * aspectRatio;
    } else {
      // Container più alto dell'immagine
      canvasWidth = containerWidth;
      canvasHeight = canvasWidth / aspectRatio;
    }
    
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    // Resetta zoom e pan
    setZoom(1);
    setPan({ x: 0, y: 0 });
    
    drawCanvas();
  }, [image]);

  // Ridisegna il canvas quando cambiano zoom, pan o selezione
  useEffect(() => {
    drawCanvas();
  }, [zoom, pan, selectedArea]);

  // Funzione per disegnare il canvas
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Applica zoom e pan
    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);
    
    // Disegna l'immagine
    const scaleX = canvas.width / image.width / zoom;
    const scaleY = canvas.height / image.height / zoom;
    
    ctx.drawImage(
      image, 
      0, 
      0, 
      image.width, 
      image.height, 
      -pan.x / zoom, 
      -pan.y / zoom, 
      image.width * scaleX, 
      image.height * scaleY
    );
    
    // Disegna l'area selezionata se presente
    if (selectedArea) {
      const { x, y, width, height } = selectedArea;
      
      // Converti le coordinate dell'immagine alle coordinate del canvas
      const canvasX = x * scaleX;
      const canvasY = y * scaleY;
      const canvasWidth = width * scaleX;
      const canvasHeight = height * scaleY;
      
      // Disegna un rettangolo semi-trasparente intorno all'area selezionata
      ctx.fillStyle = 'rgba(52, 152, 219, 0.3)';
      ctx.fillRect(canvasX, canvasY, canvasWidth, canvasHeight);
      
      // Disegna un bordo intorno all'area selezionata
      ctx.strokeStyle = '#3498db';
      ctx.lineWidth = 2 / zoom;
      ctx.strokeRect(canvasX, canvasY, canvasWidth, canvasHeight);
    }
    
    ctx.restore();
  };

  // Gestisce l'inizio della selezione
  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    if (e.altKey || e.button === 1) {
      // Modalità pan (con tasto Alt o tasto centrale del mouse)
      setIsDragging(true);
      setDragStart({ x: mouseX, y: mouseY });
    } else {
      // Modalità selezione
      setIsSelecting(true);
      setSelectionStart({ x: mouseX, y: mouseY });
      // Reset della selezione corrente
      onAreaSelect(null);
    }
  };

  // Gestisce il movimento del mouse durante la selezione
  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    if (isDragging) {
      // Modalità pan
      const deltaX = mouseX - dragStart.x;
      const deltaY = mouseY - dragStart.y;
      
      setPan(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      setDragStart({ x: mouseX, y: mouseY });
    } else if (isSelecting) {
      // Modalità selezione
      const width = mouseX - selectionStart.x;
      const height = mouseY - selectionStart.y;
      
      // Converti le coordinate del canvas alle coordinate dell'immagine
      const scaleX = image.width / (canvas.width / zoom);
      const scaleY = image.height / (canvas.height / zoom);
      
      const imgX = (selectionStart.x - pan.x) / zoom * scaleX;
      const imgY = (selectionStart.y - pan.y) / zoom * scaleY;
      const imgWidth = width * scaleX;
      const imgHeight = height * scaleY;
      
      // Aggiorna la selezione con valori assoluti (gestendo selezioni negative)
      const area = {
        x: imgWidth >= 0 ? imgX : imgX + imgWidth,
        y: imgHeight >= 0 ? imgY : imgY + imgHeight,
        width: Math.abs(imgWidth),
        height: Math.abs(imgHeight)
      };
      
      onAreaSelect(area);
    }
  };

  // Gestisce la fine della selezione
  const handleMouseUp = () => {
    setIsSelecting(false);
    setIsDragging(false);
  };

  // Gestisce lo zoom con la rotellina del mouse
  const handleWheel = (e) => {
    e.preventDefault();
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Calcola il nuovo zoom
    const zoomDelta = -e.deltaY * 0.001;
    const newZoom = Math.max(0.1, Math.min(5, zoom + zoomDelta));
    
    if (newZoom !== zoom) {
      // Calcola il nuovo pan per mantenere il mouse nella stessa posizione
      const panX = mouseX - (mouseX - pan.x) * (newZoom / zoom);
      const panY = mouseY - (mouseY - pan.y) * (newZoom / zoom);
      
      setZoom(newZoom);
      setPan({ x: panX, y: panY });
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="splitter-canvas-container"
      onWheel={handleWheel}
    >
      <canvas
        ref={canvasRef}
        className="splitter-canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      
      <div className="canvas-controls">
        <button 
          className="canvas-control-btn"
          onClick={() => setZoom(prev => Math.min(5, prev + 0.1))}
          title="Zoom In"
        >
          <i className="fas fa-search-plus"></i>
        </button>
        <button 
          className="canvas-control-btn"
          onClick={() => setZoom(prev => Math.max(0.1, prev - 0.1))}
          title="Zoom Out"
        >
          <i className="fas fa-search-minus"></i>
        </button>
        <button 
          className="canvas-control-btn"
          onClick={() => {
            setZoom(1);
            setPan({ x: 0, y: 0 });
          }}
          title="Reset View"
        >
          <i className="fas fa-expand"></i>
        </button>
      </div>
      
      <div className="canvas-help">
        <span><i className="fas fa-mouse-pointer"></i> Seleziona un'area</span>
        <span><i className="fas fa-hand-paper"></i> Alt + Trascina per spostare</span>
        <span><i className="fas fa-search"></i> Rotellina per zoom</span>
      </div>
    </div>
  );
};

export default SplitterCanvas;