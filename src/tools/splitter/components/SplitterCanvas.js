import React, { useRef, useEffect, forwardRef, useImperativeHandle, useState } from 'react';
import './SplitterCanvas.css';

const SplitterCanvas = forwardRef(({ image, tool, partType, onAddPart }, ref) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const imageRef = useRef(null);
  const isDrawingRef = useRef(false);
  const pathRef = useRef([]);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  
  useImperativeHandle(ref, () => ({
    getCanvas: () => canvasRef.current,
    getContext: () => contextRef.current,
  }));
  
  useEffect(() => {
    // Load the image
    const img = new Image();
    img.src = image;
    img.onload = () => {
      imageRef.current = img;
      
      // Set up canvas
      const canvas = canvasRef.current;
      const container = canvas.parentElement;
      
      // Adjust size to fit container while maintaining aspect ratio
      const containerWidth = container.clientWidth;
      const scale = containerWidth / img.width;
      const scaledHeight = img.height * scale;
      
      // Set displayed size
      canvas.style.width = `${containerWidth}px`;
      canvas.style.height = `${scaledHeight}px`;
      
      // Set actual canvas dimensions (for high resolution)
      canvas.width = img.width;
      canvas.height = img.height;
      
      setCanvasSize({
        width: containerWidth,
        height: scaledHeight,
        scaleX: img.width / containerWidth,
        scaleY: img.height / scaledHeight
      });
      
      const context = canvas.getContext('2d');
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.strokeStyle = getToolColor(tool);
      context.lineWidth = 5;
      contextRef.current = context;
      
      // Draw the image
      context.drawImage(img, 0, 0, img.width, img.height);
    };
  }, [image]);
  
  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = getToolColor(tool);
    }
  }, [tool]);
  
  const getToolColor = (currentTool) => {
    switch(currentTool) {
      case 'pen':
        return '#FF0000';
      case 'eraser':
        return '#FFFFFF';
      case 'auto':
        return '#00FF00';
      default:
        return '#FF0000';
    }
  };
  
  const startDrawing = ({ nativeEvent }) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Calculate positions with proper scaling
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    // Get mouse position relative to canvas
    const x = (nativeEvent.clientX - rect.left) * scaleX;
    const y = (nativeEvent.clientY - rect.top) * scaleY;
    
    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    isDrawingRef.current = true;
    
    // Save point for path
    pathRef.current = [{ x, y }];
  };
  
  const draw = ({ nativeEvent }) => {
    if (!isDrawingRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Calculate positions with proper scaling
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    // Get mouse position relative to canvas
    const x = (nativeEvent.clientX - rect.left) * scaleX;
    const y = (nativeEvent.clientY - rect.top) * scaleY;
    
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
    
    // Save point for path
    pathRef.current.push({ x, y });
  };
  
  const finishDrawing = () => {
    contextRef.current.closePath();
    isDrawingRef.current = false;
    
    // Simple example - in a real app, this would extract the area inside the path
    if (pathRef.current.length > 2) {
      onAddPart(pathRef.current);
    }
  };
  
  return (
    <div className="splitter-canvas-container">
      <canvas
        ref={canvasRef}
        className="splitter-canvas"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={finishDrawing}
        onMouseLeave={finishDrawing}
      ></canvas>
      <div className="current-tool-indicator">
        Strumento: {tool.charAt(0).toUpperCase() + tool.slice(1)} | 
        Parte: {partType.charAt(0).toUpperCase() + partType.slice(1)}
      </div>
    </div>
  );
});

export default SplitterCanvas;