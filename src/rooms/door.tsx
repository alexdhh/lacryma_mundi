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

  // Gère le clic sur un heurtoir (Inchangé)
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

  // Minuteur de 3 secondes déclenché après le 3ème coup (Inchangé)
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

  // Gère le clic pour tenter d'ouvrir la porte (Inchangé, mais utilisé différemment)
  const handleDoorAttempt = () => {
    if (isUnlocked) {
      onEnter(); // Passe à la salle suivante !
    } else if (!isWaiting) {
      setMessage("La porte est fermée de l'intérieur. Tirer ne sert à rien.");
    }
  };

  return (
    <div className="door-scene-container pixel-art">
      <div className={`door-wrapper ${isUnlocked ? 'unlocked' : ''}`}>
        
        {/* --- CORRECTION 1 : L'IMAGE N'A PLUS DE onClick --- */}
        <img 
          src={doorBg} 
          alt="Portes fermées" 
          className="door-image" 
          /* onClick={handleDoorClick}  <-- Supprimé d'ici */
        />
        
        {/* --- CORRECTION 2 : NOUVELLE ZONE DE CLIC SPÉCIFIQUE (Hitbox) --- */}
        {/* Cette div recouvre uniquement le bois des portes au centre de l'image.
            Elle est stylisée dans le CSS pour délimiter la zone cliquable précise. */}
        <div 
          className="door-interaction-hitbox" 
          onClick={handleDoorAttempt}
        ></div>

        {/* Les zones cliquables invisibles pour les heurtoirs (Hitboxes) */}
        {!isUnlocked && (
          <>
            {/* J'ai renommé les classes ici pour correspondre à notre DA : 
                knocker-hitbox + position */}
            <div className="knocker-hitbox left" onClick={handleKnock}></div>
            <div className="knocker-hitbox right" onClick={handleKnock}></div>
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