// src/App.tsx
import { useState } from 'react';
import './App.css';
import introBg from './assets/lm_scene1.jpg'; 
import Door from './rooms/door'; 
import Room1 from './rooms/room1';
import ParchmentIntro from './rooms/parchmentIntro'; 

function App() {
  const [currentLocation, setCurrentLocation] = useState('home');
  const [isPathReady, setIsPathReady] = useState(false);
  
  // ✅ NOUVEAU : On gère plusieurs types de transitions ('none', 'path', ou 'door')
  const [activeTransition, setActiveTransition] = useState<'none' | 'path' | 'door'>('none');
  const [transitionText, setTransitionText] = useState("");
  const [showTransitionText, setShowTransitionText] = useState(false);

  const handleStartGame = () => {
    setCurrentLocation('intro');
  };

  const handleIntroFinished = () => {
    setIsPathReady(true);
    setCurrentLocation('home');
  };

  // ✅ FONCTION GLOBALE POUR CRÉER UNE CINÉMATIQUE ✅
  const triggerCinematic = (type: 'path' | 'door', text: string, nextLocation: string) => {
    setActiveTransition(type); // Lance le zoom et le fond noir sur la bonne scène

    // 1. Affichage du texte dans le noir
    setTimeout(() => {
      setTransitionText(text);
      setShowTransitionText(true);
    }, 1500);

    // 2. Disparition du texte
    setTimeout(() => {
      setShowTransitionText(false);
    }, 4500);

    // 3. Changement de pièce et fin du noir
    setTimeout(() => {
      setCurrentLocation(nextLocation);
      setActiveTransition('none'); 
    }, 5500);
  };

  // Clic sur le chemin -> Cinématique du chemin
  const handlePathClick = () => {
    if (isPathReady && activeTransition === 'none') {
      triggerCinematic(
        'path', 
        "Vous marchez le long du pont brumeux jusqu'aux grandes portes...", 
        'porte'
      );
    }
  };

  // ✅ NOUVEAU : Ouverture de la porte -> Cinématique de la porte
  const handleDoorEnter = () => {
    if (activeTransition === 'none') {
      triggerCinematic(
        'door', 
        "Les lourds battants cèdent. Vous pénétrez dans l'obscurité du Porche...", 
        'porche'
      );
    }
  };

  return (
    <div className="game-container">
      
      {/* L'OVERLAY NOIR AVEC LE TEXTE NARRATIF */}
      {/* S'active si une transition est en cours (différente de 'none') */}
      <div className={`transition-overlay ${activeTransition !== 'none' ? 'active' : ''}`}>
        <p className={`transition-text ${showTransitionText ? 'show' : ''}`}>
          {transitionText}
        </p>
      </div>
      
      {/* 1. ÉCRAN D'ACCUEIL */}
      {currentLocation === 'home' && (
        /* Le zoom 'walking-forward' ne s'active que si la transition est 'path' */
        <div className={`intro-screen scene-fade-in ${activeTransition === 'path' ? 'walking-forward' : ''}`}>
          <img src={introBg} alt="La Basilique" className="intro-background pixel-art" />
          
          {isPathReady && (
            <div 
              className="path-hitbox" 
              onClick={handlePathClick}
              style={{ 
                cursor: 'default',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 5,
                clipPath: 'polygon(48% 44%, 58% 51%, 84% 58%, 95% 75%, 100% 100%, 35% 100%, 60% 85%, 70% 65%, 50% 50%)',
              }}
            ></div>
          )}

          <div className={`intro-content ${isPathReady ? 'fade-out' : ''}`}>
            <h1>Lacryma Mundi</h1>
            <p>La larme de crystal est gardée dans la cathédrale...</p>
            <button onClick={handleStartGame} className="gothic-button-pure">
              Commencer
            </button>
          </div>
        </div>
      )}

      {/* 2. SCÈNE DU PARCHEMIN */}
      {currentLocation === 'intro' && (
        <div className="scene-fade-in">
          <ParchmentIntro onIntroFinished={handleIntroFinished} />
        </div>
      )}

      {/* 3. SCÈNE DE LA PORTE */}
      {currentLocation === 'porte' && (
        /* ✅ Le zoom 'walking-forward' s'active ici si la transition est 'door' ✅ */
        <div className={`scene-fade-in ${activeTransition === 'door' ? 'walking-forward' : ''}`}>
          <Door onEnter={handleDoorEnter} />
        </div>
      )}

      {/* 4. SCÈNE DU PORCHE */}
      {currentLocation === 'porche' && (
        <div className="scene-fade-in">
          <Room1 onSolve={() => setCurrentLocation('nef')} /> 
        </div>
      )}
      
      {/* 5. LA NEF */}
      {currentLocation === 'nef' && (
        <div className="room-content scene-fade-in">
          <h2>La Grande Nef</h2>
          <p>Bravo, vous avez survécu au Porche. La suite du cauchemar commence ici...</p>
        </div>
      )}

    </div>
  );
}

export default App;