// src/components/NotFound.js

import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found">
      <div className="not-found-content">
        <div className="error-code">404</div>
        <h2>Pagina non trovata</h2>
        <p>La pagina che stai cercando non esiste o è stata spostata.</p>
        <Link to="/" className="btn btn-primary">
          <i className="fas fa-home"></i> Torna alla Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;