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
  
  // Retour au simple message texte
  const [message, setMessage] = useState<string | null>("Two heavy knockers stand before you...");

  // Disparition du texte après 6 secondes
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleKnock = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (knockCount >= 3 || isUnlocked) return;

    const newCount = knockCount + 1;
    setKnockCount(newCount);

    if (newCount === 1) {
      setMessage("BAM... A dull echo answers.");
    }
    if (newCount === 2) {
      setMessage("BAM... BAM... The stone trembles slightly.");
    }
    if (newCount === 3) {
      setMessage("BAM... BAM... BAM... A heavy silence settles in...");
      setIsWaiting(true);
    }
  };

  useEffect(() => {
    if (knockCount === 3) {
      const timer = setTimeout(() => {
        setIsUnlocked(true);
        setIsWaiting(false);
        setMessage("A heavy internal mechanism awakens. The door yields...");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [knockCount]);

  const handleDoorAttempt = () => {
    if (isUnlocked) {
      onEnter();
    } else if (!isWaiting) {
      setMessage("The door is barred from within. Pulling is useless.");
    }
  };

  return (
    <div className="door-scene-container pixel-art fade-in" style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#000' }}>
      
      <div className={`door-wrapper ${isUnlocked ? 'unlocked' : ''}`} style={{ width: '100%', height: '100%', position: 'absolute' }}>
        <img 
          src={doorBg} 
          alt="Closed doors" 
          className="door-image" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        
        {/* Hitbox pour ouvrir la porte une fois déverrouillée */}
        <div 
          className="door-interaction-hitbox" 
          onClick={handleDoorAttempt}
          style={{ position: 'absolute', top: '20%', left: '40%', width: '20%', height: '60%', cursor: isUnlocked ? 'pointer' : 'default', zIndex: 10 }}
        ></div>

        {/* Hitboxes ajustées PILE sur les anneaux (heurtoirs) */}
        {!isUnlocked && (
          <>
            <div className="knocker-hitbox left" onClick={handleKnock} style={{ position: 'absolute', top: '56%', left: '45%', width: '4%', height: '6%', cursor: 'pointer', zIndex: 20 }} title="Knock the left knocker"></div>
            <div className="knocker-hitbox right" onClick={handleKnock} style={{ position: 'absolute', top: '56%', left: '51%', width: '4%', height: '6%', cursor: 'pointer', zIndex: 20 }} title="Knock the right knocker"></div>
          </>
        )}
      </div>

      {/* TEXTE SIMPLE EN BAS */}
      {message && (
        <p style={{ 
          position: 'absolute', bottom: '10%', width: '100%', 
          textAlign: 'center', color: '#fff', fontFamily: "'VT323', monospace", 
          fontSize: '2rem', zIndex: 200, pointerEvents: 'none', padding: '0 20px',
          textShadow: '3px 3px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000' 
        }}>
          {message}
        </p>
      )}
    </div>
  );
}