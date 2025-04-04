// src/tools/poseeditor/PoseEditor.js
import React, { useEffect, useState, useContext, useRef } from 'react';
import { fabric } from 'fabric';
import { BodyPartsContext } from '../../context/BodyPartsContext';
import PoseCanvas from './components/PoseCanvas';
import PoseControls from './components/PoseControls';
import JointControls from './components/JointControls';
import './PoseEditor.css';

const PoseEditor = () => {
  const { bodyParts } = useContext(BodyPartsContext);
  const [canvas, setCanvas] = useState(null);
  const [selectedPart, setSelectedPart] = useState(null);
  const [characterPose, setCharacterPose] = useState(null);
  const [savedPoses, setSavedPoses] = useState([]);
  const [joints, setJoints] = useState({});
  const canvasRef = useRef(null);

  // Inizializza il canvas
  useEffect(() => {
    if (canvas) return;
    
    const fabricCanvas = new fabric.Canvas('pose-canvas', {
      width: 800,
      height: 600,
      backgroundColor: '#f0f0f0'
    });
    
    setCanvas(fabricCanvas);
    
    // Carica le pose salvate
    const storedPoses = loadCharacterPoses();
    if (storedPoses && storedPoses.length > 0) {
      setSavedPoses(storedPoses);
    }
    
    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  // Carica le parti del corpo nel canvas
  useEffect(() => {
    if (!canvas || !bodyParts || Object.keys(bodyParts).length === 0) return;
    
    // Rimuove gli oggetti esistenti
    canvas.clear();
    
    // Inizializza il modello di giunti
    const initialJoints = {};
    
    // Carica ogni parte del corpo come oggetto fabric
    Object.entries(bodyParts).forEach(([partType, partData]) => {
      if (!partData.url) return;
      
      fabric.Image.fromURL(partData.url, (img) => {
        // Configura l'immagine
        img.set({
          left: partData.position?.x || 100,
          top: partData.position?.y || 100,
          originX: 'center',
          originY: 'center',
          partType: partType,
          selectable: true,
          hasControls: true,
          hasBorders: true
        });
        
        // Definisci i punti di articolazione per questa parte
        initialJoints[partType] = defineJointsForPart(partType, img);
        
        // Aggiungi l'immagine al canvas
        canvas.add(img);
        
        // Aggiorna il modello di giunti
        setJoints(initialJoints);
      });
    });
    
    // Imposta gli eventi di selezione
    canvas.on('selection:created', handleSelection);
    canvas.on('selection:updated', handleSelection);
    canvas.on('selection:cleared', () => setSelectedPart(null));
    
    // Renderizza il canvas
    canvas.renderAll();
  }, [canvas, bodyParts]);

  // Definisci i punti di articolazione per ogni tipo di parte
  const defineJointsForPart = (partType, imgObject) => {
    const joints = {};
    
    switch (partType) {
      case 'head':
        joints.neck = { x: imgObject.width / 2, y: imgObject.height * 0.9 };
        break;
      case 'torso':
        joints.neck = { x: imgObject.width / 2, y: imgObject.height * 0.1 };
        joints.leftShoulder = { x: imgObject.width * 0.2, y: imgObject.height * 0.2 };
        joints.rightShoulder = { x: imgObject.width * 0.8, y: imgObject.height * 0.2 };
        joints.leftHip = { x: imgObject.width * 0.3, y: imgObject.height * 0.85 };
        joints.rightHip = { x: imgObject.width * 0.7, y: imgObject.height * 0.85 };
        break;
      case 'leftArm':
        joints.shoulder = { x: imgObject.width * 0.2, y: imgObject.height * 0.1 };
        joints.elbow = { x: imgObject.width * 0.5, y: imgObject.height * 0.5 };
        joints.wrist = { x: imgObject.width * 0.8, y: imgObject.height * 0.9 };
        break;
      case 'rightArm':
        joints.shoulder = { x: imgObject.width * 0.8, y: imgObject.height * 0.1 };
        joints.elbow = { x: imgObject.width * 0.5, y: imgObject.height * 0.5 };
        joints.wrist = { x: imgObject.width * 0.2, y: imgObject.height * 0.9 };
        break;
      case 'leftLeg':
        joints.hip = { x: imgObject.width * 0.3, y: imgObject.height * 0.1 };
        joints.knee = { x: imgObject.width * 0.5, y: imgObject.height * 0.5 };
        joints.ankle = { x: imgObject.width * 0.5, y: imgObject.height * 0.9 };
        break;
      case 'rightLeg':
        joints.hip = { x: imgObject.width * 0.7, y: imgObject.height * 0.1 };
        joints.knee = { x: imgObject.width * 0.5, y: imgObject.height * 0.5 };
        joints.ankle = { x: imgObject.width * 0.5, y: imgObject.height * 0.9 };
        break;
      default:
        break;
    }
    
    return joints;
  };

  // Gestisci la selezione di una parte
  const handleSelection = (options) => {
    if (!options.selected || options.selected.length === 0) return;
    
    const selected = options.selected[0];
    setSelectedPart({
      object: selected,
      type: selected.partType
    });
  };

  // Ruota una parte
  const rotatePart = (angle) => {
    if (!selectedPart || !selectedPart.object) return;
    
    selectedPart.object.rotate(selectedPart.object.angle + angle);
    canvas.renderAll();
    
    // Aggiorna la posa del personaggio
    updateCharacterPose();
  };

  // Sposta una parte
  const movePart = (x, y) => {
    if (!selectedPart || !selectedPart.object) return;
    
    selectedPart.object.set({
      left: selectedPart.object.left + x,
      top: selectedPart.object.top + y
    });
    
    canvas.renderAll();
    
    // Aggiorna la posa del personaggio
    updateCharacterPose();
  };

  // Scala una parte
  const scalePart = (scaleX, scaleY) => {
    if (!selectedPart || !selectedPart.object) return;
    
    selectedPart.object.set({
      scaleX: selectedPart.object.scaleX + scaleX,
      scaleY: selectedPart.object.scaleY + scaleY
    });
    
    canvas.renderAll();
    
    // Aggiorna la posa del personaggio
    updateCharacterPose();
  };

  // Aggiorna la posa del personaggio
  const updateCharacterPose = () => {
    if (!canvas) return;
    
    const pose = {};
    
    // Salva la posizione e rotazione di ogni parte
    canvas.getObjects().forEach(obj => {
      if (obj.partType) {
        pose[obj.partType] = {
          position: { x: obj.left, y: obj.top },
          rotation: obj.angle,
          scale: { x: obj.scaleX, y: obj.scaleY }
        };
      }
    });
    
    setCharacterPose(pose);
  };

  // Salva la posa corrente
  const savePose = (poseName) => {
    if (!characterPose) return;
    
    const poseToSave = {
      id: Date.now(),
      name: poseName || `Pose ${savedPoses.length + 1}`,
      data: characterPose
    };
    
    const updatedPoses = [...savedPoses, poseToSave];
    setSavedPoses(updatedPoses);
    saveCharacterPose(updatedPoses);
  };

  // Carica una posa salvata
  const loadPose = (poseId) => {
    const pose = savedPoses.find(p => p.id === parseInt(poseId));
    if (!pose || !canvas) return;
    
    // Applica la posa a ogni parte
    canvas.getObjects().forEach(obj => {
      if (obj.partType && pose.data[obj.partType]) {
        const partPose = pose.data[obj.partType];
        
        obj.set({
          left: partPose.position.x,
          top: partPose.position.y,
          angle: partPose.rotation,
          scaleX: partPose.scale.x,
          scaleY: partPose.scale.y
        });
      }
    });
    
    canvas.renderAll();
    setCharacterPose(pose.data);
  };

  // Funzioni localStorage
  const saveCharacterPose = (poses) => {
    try {
      localStorage.setItem('characterPoses', JSON.stringify(poses));
      return true;
    } catch (error) {
      console.error('Errore nel salvataggio della posa:', error);
      return false;
    }
  };

  const loadCharacterPoses = () => {
    try {
      const poses = localStorage.getItem('characterPoses');
      return poses ? JSON.parse(poses) : [];
    } catch (error) {
      console.error('Errore nel caricamento delle pose:', error);
      return [];
    }
  };

  // Aggiorna la posizione di un giunto
  const updateJointPosition = (jointName, newPosition) => {
    if (!selectedPart || !selectedPart.type) return;
    
    const updatedJoints = { ...joints };
    if (updatedJoints[selectedPart.type]) {
      updatedJoints[selectedPart.type][jointName] = newPosition;
      setJoints(updatedJoints);
      
      // Qui potrebbe essere implementata la logica per adattare le parti connesse
      // in base alla nuova posizione del giunto
    }
  };

  return (
    <div className="pose-editor">
      <h2>Editor delle Pose</h2>
      <div className="pose-editor-container">
        <div className="canvas-container">
          <PoseCanvas canvasId="pose-canvas" />
        </div>
        
        <div className="controls-container">
          <PoseControls 
            onRotate={rotatePart}
            onMove={movePart}
            onScale={scalePart}
            onSave={() => savePose()}
            onSaveAs={(name) => savePose(name)}
            savedPoses={savedPoses}
            onLoadPose={loadPose}
            selectedPart={selectedPart}
          />
          
          {selectedPart && (
            <JointControls 
              partType={selectedPart.type}
              joints={joints[selectedPart.type] || {}}
              onJointUpdate={updateJointPosition}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PoseEditor;