// src/rooms/lm_crypt.tsx
import { useState, useEffect } from 'react';
import bgCrypt from '../assets/lm_crypt.png'; 

interface DialogState {
  title: string;
  text: string;
}

interface LmCryptProps {
  onBack: () => void; // Prop pour revenir à la Nef (LmScenep)
}

export default function LmCrypt({ onBack }: LmCryptProps) {
  const [dialog, setDialog] = useState<DialogState | null>({
    title: "DESCENTE AUX CRYPTES",
    text: "L'air devient glacial. Un escalier en colimaçon s'enfonce dans les ténèbres..."
  });

  // Timer ajusté à 6 secondes (6000 ms) pour la boîte de dialogue
  useEffect(() => {
    if (dialog) {
      const timer = setTimeout(() => setDialog(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [dialog]);

  const closeDialog = () => {
    setDialog(null);
  };

  return (
    <div className="room-container pixel-art fade-in" style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#000' }}>
      
      {/* Image de Fond */}
      <img 
        src={bgCrypt} 
        alt="Descente aux cryptes" 
        style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} 
      />

      {/* ================= INTERACTIONS ================= */}
      {!dialog && (
        <>
          {/* Interaction pour descendre plus bas (Zone sombre des marches) */}
          <div 
            onClick={() => {
              setDialog({ title: "PROFONDEURS", text: "Les marches sont glissantes. Vous sentez une présence oppressante plus bas..." });
            }}
            style={{ position: 'absolute', bottom: '15%', left: '40%', width: '20%', height: '30%', cursor: 'pointer', zIndex: 10 }}
            title="Descendre plus profondément"
          />

          {/* BOUTON RECULER (Retour à LmScenep) */}
          <div onClick={onBack} style={{ position: 'absolute', bottom: '2%', left: '50%', transform: 'translateX(-50%)', width: '40%', height: '10%', cursor: 'pointer', zIndex: 20, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', paddingBottom: '20px' }}>
            <p style={{ color: '#fff', fontFamily: "'VT323', monospace", fontSize: '2rem', textShadow: '2px 2px 0 #000', margin: 0 }}>▼ RECULER ▼</p>
          </div>
        </>
      )}

      {/* BOÎTE DE DIALOGUE (Design Global) */}
      {dialog && (
        <div className="room1-message-box" style={{ position: 'absolute', bottom: '8%', left: '50%', transform: 'translateX(-50%)', width: '80%', padding: '20px 30px', backgroundColor: '#16111a', border: '2px solid #3c2547', boxShadow: '0 0 15px rgba(0,0,0,0.8)', zIndex: 200, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <button className="close-btn" onClick={closeDialog} style={{ position: 'absolute', top: '10px', right: '15px', color: '#888', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'monospace', fontSize: '1.2rem' }}>X</button>
          <h3 style={{ color: '#c43535', fontFamily: "'VT323', monospace", fontSize: '1.8rem', margin: '0 0 15px 0', letterSpacing: '2px' }}>{dialog.title}</h3>
          <p style={{ color: '#e8dbcd', fontFamily: "'VT323', monospace", fontSize: '1.5rem', lineHeight: '1.5', textAlign: 'center', margin: '0 0 10px 0', whiteSpace: 'pre-line' }}>« {dialog.text} »</p>
        </div>
      )}
    </div>
  );
}