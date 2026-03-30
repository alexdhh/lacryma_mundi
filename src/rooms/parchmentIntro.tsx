import { useState, useEffect } from 'react';
import parchmentImg from '../assets/lm_parchemin.png'; 

interface ParchmentIntroProps {
  onIntroFinished: () => void;
}

const introScript = [
  "« Tu as tout perdu, Chevalier... Ton nom, tes terres, et même l'éclat de ton armure. »",
  "« Mais il te reste ton épée, et ce serment que tu as fait devant sa tombe. »",
  "« La Lacryma Mundi n'est pas un trésor pour les rois... c'est le dernier souffle d'une âme pure. La tienne peut-être. »",
  "« Elle est là, au plus profond de la Basilique des Mille Soupirs. Elle t'appelle à travers la pierre... Ramène la Larme, et trouve enfin le repos. »"
];

const useTypewriter = (text: string, speed: number = 20) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    setDisplayText(''); 
    let charIndex = 0;
    const intervalId = setInterval(() => {
      if (charIndex < text.length) {
        setDisplayText((prev) => prev + text.charAt(charIndex));
        charIndex++;
      } else {
        clearInterval(intervalId);
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed]);

  return displayText;
};

export default function ParchmentIntro({ onIntroFinished }: ParchmentIntroProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const typedText = useTypewriter(introScript[currentTextIndex], 25);

  const handleParchmentClick = () => {
    if (currentTextIndex < introScript.length - 1) {
      setCurrentTextIndex(prev => prev + 1);
    } else {
      onIntroFinished();
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
        alt="Histoire" 
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

      {/* ✅ Bords ultra resserrés (38%) pour que rien ne dépasse ✅ */}
      <div 
        style={{
          position: 'absolute',
          top: '25%',  
          bottom: '25%',
          left: '38%', /* <-- Marge augmentée pour écraser le texte */
          right: '38%', /* <-- Marge augmentée pour écraser le texte */
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        {/* ✅ Titre avec la NOUVELLE police Uncial Antiqua ✅ */}
        <h1 style={{
          fontFamily: "'Uncial Antiqua', serif", /* <-- Changé ici ! */
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

        {/* ✅ Paragraphe normal ✅ */}
        <p style={{ 
          fontFamily: "'Uncial Antiqua', serif", 
          fontSize: '1.8rem', /* Légèrement réduit pour bien tenir dans la nouvelle largeur */
          color: '#1a1a1a', 
          margin: 0,
          textShadow: 'none',
          lineHeight: '1.4'
        }}>
          {typedText}
        </p>
      </div>
    </div>
  );
}