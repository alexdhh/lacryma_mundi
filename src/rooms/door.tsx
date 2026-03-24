// src/rooms/Door.tsx
import { useState, useEffect } from 'react';
import doorBg from '../assets/lm_scene2.png';

interface DoorProps {
  onEnter: () => void;
}

export default function Door({ onEnter }: DoorProps) {
  const [knockCount, setKnockCount] = useState(0);
  const [isWaiting, setIsWaiting] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [message, setMessage] = useState("Deux lourds heurtoirs vous font face...");

  // Gère le clic sur un heurtoir
  const handleKnock = (e: React.MouseEvent) => {
    e.stopPropagation(); // Empêche le clic de se propager à la porte derrière
    
    // Si on a déjà cliqué 3 fois ou que la porte est ouverte, on ignore les clics
    if (knockCount >= 3 || isUnlocked) return;

    const newCount = knockCount + 1;
    setKnockCount(newCount);

    if (newCount === 1) setMessage("BAM... Un écho sourd résonne.");
    if (newCount === 2) setMessage("BAM... La pierre tremble légèrement.");
    if (newCount === 3) {
      setMessage("BAM... Un silence pesant s'installe...");
      setIsWaiting(true);
    }
  };

  // Minuteur de 3 secondes déclenché après le 3ème coup
  useEffect(() => {
    if (knockCount === 3) {
      const timer = setTimeout(() => {
        setIsUnlocked(true);
        setIsWaiting(false);
        setMessage("Un lourd mécanisme se déverrouille. La porte cède...");
      }, 3000); // 3000 millisecondes = 3 secondes

      // Nettoyage du timer si le composant est démonté avant la fin des 3s
      return () => clearTimeout(timer);
    }
  }, [knockCount]);

  // Gère le clic sur la porte elle-même
  const handleDoorClick = () => {
    if (isUnlocked) {
      onEnter(); // Passe à la salle suivante !
    } else if (!isWaiting) {
      setMessage("La porte est fermée de l'intérieur. Tirer ne sert à rien.");
    }
  };

  return (
    <div className="door-scene-container pixel-art">
      <div className={`door-wrapper ${isUnlocked ? 'unlocked' : ''}`}>
        {/* L'image de fond qui sert de porte */}
        <img 
          src={doorBg} 
          alt="Portes fermées" 
          className="door-image" 
          onClick={handleDoorClick} 
        />
        
        {/* Les zones cliquables invisibles (Hitboxes) */}
        {!isUnlocked && (
          <>
            <div className="knocker left-knocker" onClick={handleKnock}></div>
            <div className="knocker right-knocker" onClick={handleKnock}></div>
          </>
        )}
      </div>

      {/* Boîte de dialogue façon RPG */}
      <div className="door-message-box">
        <p>{message}</p>
      </div>
    </div>
  );
}