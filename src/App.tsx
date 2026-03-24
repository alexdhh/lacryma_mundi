// src/App.tsx
import { useState } from 'react';
import './App.css';
import introBg from './assets/lm_scene1.jpg'; 
import Room1 from './rooms/room1';

// L'import avec le NOUVEAU nom
import Door from './rooms/door'; 

function App() {
  const [currentLocation, setCurrentLocation] = useState('home');
  // Nouvel état pour savoir si le joueur a cliqué sur "Commencer"
  const [isPathReady, setIsPathReady] = useState(false);

  // Étape 1 : Cache le menu et active le chemin
  const handleStartGame = () => {
    setIsPathReady(true);
  };

  // Étape 2 : Le clic sur le chemin mène à la porte
  const handlePathClick = () => {
    if (isPathReady) {
      setCurrentLocation('porte');
    }
  };

  return (
    <div className="game-container">
      
      {/* 1. ÉCRAN D'ACCUEIL */}
      {currentLocation === 'home' && (
        <div className="intro-screen">
          <img src={introBg} alt="La Basilique" className="intro-background pixel-art" />
          
          {/* NOUVEAU : La hitbox du chemin (active uniquement après le clic sur Commencer) */}
          {isPathReady && (
            <div 
              className="path-hitbox" 
              onClick={handlePathClick}
              title="Avancer vers la cathédrale"
            ></div>
          )}

          {/* Le conteneur du texte qui reçoit la classe 'fade-out' quand on commence */}
          <div className={`intro-content ${isPathReady ? 'fade-out' : ''}`}>
            <h1 className="pixel-art">Lacryma Mundi</h1>
            <p className="pixel-art">La larme de crystal est gardée dans la cathédrale...</p>
            <br />
            <button 
              onClick={handleStartGame} 
              className="gothic-button-pure"
            >
              Commencer
            </button>
          </div>
        </div>
      )}

      {/* 2. SCÈNE DE LA PORTE (Appel du NOUVEAU composant) */}
      {currentLocation === 'porte' && (
        <Door onEnter={() => setCurrentLocation('porche')} />
      )}

      {/* 3. PREMIÈRE ÉPREUVE (Le Porche des Damnés) */}
      {currentLocation === 'porche' && (
        <Room1 onSolve={() => setCurrentLocation('nef')} />
      )}
      
      {/* 4. LA NEF (Victoire temporaire) */}
      {currentLocation === 'nef' && (
        <div className="room-content">
          <h2>La Grande Nef</h2>
          <p>Bravo, vous avez survécu au Porche. La suite du cauchemar commence ici...</p>
        </div>
      )}

    </div>
  );
}

export default App;