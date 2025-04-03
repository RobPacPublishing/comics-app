import React from 'react';
import './App.css';
import CharacterSplitter from './tools/splitter/CharacterSplitter';

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>Comics App</h1>
      </header>
      <main className="app-main">
        <CharacterSplitter />
      </main>
    </div>
  );
}

export default App;