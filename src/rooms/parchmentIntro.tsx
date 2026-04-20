// src/rooms/parchmentIntro.tsx
import { useState, useEffect, useRef } from 'react';
import parchmentImg from '../assets/lm_parchemin.png'; 

interface ParchmentIntroProps {
  onIntroFinished: () => void;
}

const introScript = [
  "\"You have lost everything, Knight... your name, your lands, even the shine of your armor.\"",
  "\"But your sword remains, and the oath you swore before her tomb.\"",
  "\"Lacryma Mundi is no treasure for kings... it is the final breath of a pure soul. Perhaps yours.\"",
  "\"It lies there, deep within the Basilica of a Thousand Sighs. It calls to you through stone... Bring back the Tear, and at last find rest.\""
];

// Hook modifié pour gérer l'état "en cours d'écriture" et le "skip"
const useTypewriter = (text: string, speed: number = 20) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    setDisplayText(''); 
    setIsTyping(true);
    let charIndex = 0;

    // On nettoie l'ancien intervalle au cas où
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = window.setInterval(() => {
      if (charIndex < text.length) {
        setDisplayText(text.slice(0, charIndex + 1));
        charIndex++;
      } else {
        setIsTyping(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, speed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, speed]);

  // Fonction pour tout afficher d'un coup
  const skip = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDisplayText(text);
    setIsTyping(false);
  };

  return { displayText, isTyping, skip };
};

export default function ParchmentIntro({ onIntroFinished }: ParchmentIntroProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  
  // On récupère les nouvelles variables du hook
  const { displayText: typedText, isTyping, skip } = useTypewriter(introScript[currentTextIndex], 25);

  const handleParchmentClick = () => {
    if (isTyping) {
      // Si on est en train d'écrire, on affiche tout instantanément
      skip();
    } else {
      // Si le texte est déjà complètement affiché, on passe au suivant
      if (currentTextIndex < introScript.length - 1) {
        setCurrentTextIndex(prev => prev + 1);
      } else {
        onIntroFinished();
      }
    }
  };

  return (
    <div 
      className="parchment-intro-container pixel-art fade-in" 
      onClick={handleParchmentClick}
      style={{ 
        position: 'relative', 
        width: '100vw', 
        height: '100vh', 
        cursor: 'pointer',
        overflow: 'hidden'
      }}
    >
      <img 
        src={parchmentImg} 
        alt="Story" 
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover', 
          zIndex: 1 
        }} 
      />

      <div 
        style={{
          position: 'absolute',
          top: '25%',  
          bottom: '25%',
          left: '38%', 
          right: '38%', 
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        <h1 style={{
          fontFamily: "'Uncial Antiqua', serif",
          fontSize: '3.5rem',
          color: '#a83232', 
          marginBottom: '2rem', 
          textTransform: 'uppercase',
          letterSpacing: '2px',
          textShadow: 'none',
          marginTop: 0
        }}>
          LACRYMA MUNDI
        </h1>

        <p style={{ 
          fontFamily: "'Uncial Antiqua', serif", 
          fontSize: '1.8rem', 
          color: '#1a1a1a', 
          margin: 0,
          textShadow: 'none',
          lineHeight: '1.4',
          minHeight: '150px' /* Garde une hauteur fixe pour éviter que le texte ne "saute" */
        }}>
          {typedText}
        </p>

        {/* Petit indicateur visuel (optionnel) pour faire comprendre au joueur qu'il peut cliquer */}
        {!isTyping && (
          <span style={{ 
            marginTop: '20px', 
            fontSize: '1.5rem', 
            color: '#a83232',
            animation: 'pulse 1.5s infinite' 
          }}>
            ▼
          </span>
        )}
      </div>
    </div>
  );
}