import React from 'react';
import './App.css';
import CharacterComposer from './tools/composer/CharacterComposer';

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>Comics App</h1>
      </header>
      <main className="app-main">
        <CharacterComposer />
      </main>
    </div>
  );
}

export default App;