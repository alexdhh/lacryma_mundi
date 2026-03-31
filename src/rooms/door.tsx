// src/rooms/Door.tsx
import { useState, useEffect } from 'react';
import doorBg from '../assets/lm_scene2.png';

interface DialogState {
  title: string;
  text: string;
}

interface DoorProps {
  onEnter: () => void;
}

export default function Door({ onEnter }: DoorProps) {
  const [knockCount, setKnockCount] = useState(0);
  const [isWaiting, setIsWaiting] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  
  // ✅ On utilise maintenant le même système de dialogue que room1
  const [dialog, setDialog] = useState<DialogState | null>({
    title: "La Grande Porte",
    text: "Deux lourds heurtoirs vous font face..."
  });

  // Auto-fermeture de la boîte de dialogue après 8 secondes (comme dans room1)
  useEffect(() => {
    if (dialog) {
      const timer = setTimeout(() => setDialog(null), 8000);
      return () => clearTimeout(timer);
    }
  }, [dialog]);

  // Gère le clic sur un heurtoir
  const handleKnock = (e: React.MouseEvent) => {
    e.stopPropagation(); // Empêche le clic de se propager à la porte derrière
    
    // Si on a déjà cliqué 3 fois ou que la porte est ouverte, on ignore les clics
    if (knockCount >= 3 || isUnlocked) return;

    const newCount = knockCount + 1;
    setKnockCount(newCount);

    if (newCount === 1) setDialog({ title: "Heurtoir", text: "BAM... Un écho sourd résonne." });
    if (newCount === 2) setDialog({ title: "Heurtoir", text: "BAM... La pierre tremble légèrement." });
    if (newCount === 3) {
      setDialog({ title: "Heurtoir", text: "BAM... Un silence pesant s'installe..." });
      setIsWaiting(true);
    }
  };

  // Minuteur de 3 secondes déclenché après le 3ème coup
  useEffect(() => {
    if (knockCount === 3) {
      const timer = setTimeout(() => {
        setIsUnlocked(true);
        setIsWaiting(false);
        setDialog({ title: "Mécanisme Déverrouillé", text: "Un lourd mécanisme se déverrouille. La porte cède..." });
      }, 3000); // 3000 millisecondes = 3 secondes

      // Nettoyage du timer si le composant est démonté avant la fin des 3s
      return () => clearTimeout(timer);
    }
  }, [knockCount]);

  // Gère le clic pour tenter d'ouvrir la porte
  const handleDoorAttempt = () => {
    if (isUnlocked) {
      onEnter(); // Passe à la salle suivante !
    } else if (!isWaiting) {
      setDialog({ title: "Porte Scellée", text: "La porte est fermée de l'intérieur. Tirer ne sert à rien." });
    }
  };

  return (
    <div className="door-scene-container pixel-art">
      <div className={`door-wrapper ${isUnlocked ? 'unlocked' : ''}`}>
        
        <img 
          src={doorBg} 
          alt="Portes fermées" 
          className="door-image" 
        />
        
        <div 
          className="door-interaction-hitbox" 
          onClick={handleDoorAttempt}
        ></div>

        {!isUnlocked && (
          <>
            <div className="knocker-hitbox left" onClick={handleKnock}></div>
            <div className="knocker-hitbox right" onClick={handleKnock}></div>
          </>
        )}
      </div>

      {/* ✅ NOUVELLE BOÎTE DE DIALOGUE (Même style que Room1) */}
      {dialog && (
        <div className="room1-message-box">
          <button className="close-btn" onClick={() => setDialog(null)}>×</button>
          <h3>{dialog.title}</h3>
          <p>{dialog.text}</p>
        </div>
      )}
    </div>
  );
}