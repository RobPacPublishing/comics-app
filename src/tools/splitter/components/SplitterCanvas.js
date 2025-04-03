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
      
      // Calculate max available width and height
      const maxWidth = container.clientWidth - 20; // padding
      const maxHeight = 500; // max height constraint
      
      // Calculate aspect ratio
      const imgRatio = img.width / img.height;
      
      // Determine dimensions that fit within constraints while maintaining aspect ratio
      let width = maxWidth;
      let height = width / imgRatio;
      
      // If height exceeds max, adjust it and recalculate width
      if (height > maxHeight) {
        height = maxHeight;
        width = height * imgRatio;
      }
      
      // Set displayed size
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      
      // Set actual canvas dimensions (for high resolution)
      canvas.width = width * 2;  // For higher resolution
      canvas.height = height * 2;
      
      setCanvasSize({
        width: width,
        height: height,
        scaleX: canvas.width / width,
        scaleY: canvas.height / height
      });
      
      const context = canvas.getContext('2d');
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.strokeStyle = getToolColor(tool);
      context.lineWidth = 5;
      contextRef.current = context;
      
      // Scale context to match canvas resolution
      context.scale(2, 2);
      
      // Draw the image
      context.drawImage(img, 0, 0, width, height);
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
    
    // Get mouse position relative to canvas
    const x = nativeEvent.clientX - rect.left;
    const y = nativeEvent.clientY - rect.top;
    
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
    
    // Get mouse position relative to canvas
    const x = nativeEvent.clientX - rect.left;
    const y = nativeEvent.clientY - rect.top;
    
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