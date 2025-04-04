// src/components/Navigation.js

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="app-navigation">
      <div className="logo">
        <Link to="/">Comics App</Link>
      </div>
      
      <div className="nav-tools">
        <Link to="/composer" className={`nav-item ${isActive('/composer')}`}>
          <i className="fas fa-paint-brush"></i>
          Character Composer
        </Link>
        
        <Link to="/splitter" className={`nav-item ${isActive('/splitter')}`}>
          <i className="fas fa-cut"></i>
          Character Splitter
        </Link>
        
        <Link to="/pose-editor" className={`nav-item ${isActive('/pose-editor')}`}>
          <i className="fas fa-bone"></i>
          Pose Editor
        </Link>
        
        <Link to="/layout-editor" className={`nav-item ${isActive('/layout-editor')}`}>
          <i className="fas fa-th-large"></i>
          Layout Editor
        </Link>
      </div>
      
      <div className="nav-utils">
        <Link to="/gallery" className={`nav-item ${isActive('/gallery')}`}>
          <i className="fas fa-images"></i>
          Galleria
        </Link>
        
        <Link to="/settings" className={`nav-item ${isActive('/settings')}`}>
          <i className="fas fa-cog"></i>
          Impostazioni
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;