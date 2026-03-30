import { useState } from 'react';
import bgImage from '../assets/lm_scenep.png'; 
import bookImage from '../assets/lm_scene4.png'; 

export default function LmScenep() {
  const [isBookOpen, setIsBookOpen] = useState(false);

  return (
    <div className="room-container fade-in" style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      
      {/* 1. IMAGE DE FOND DE LA SALLE */}
      <img 
        src={bgImage} 
        alt="Salle principale" 
        style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} 
      />

      {/* 2. LA ZONE CLIQUABLE SUR LE BUREAU (La hitbox) */}
      {!isBookOpen && (
        <div 
          onClick={() => setIsBookOpen(true)}
          style={{
            position: 'absolute',
            bottom: '15%',
            left: '18%',
            width: '20%',
            height: '25%',
            cursor: 'pointer',
            zIndex: 10,
          }}
          title="Examiner le grimoire"
        ></div>
      )}

      {/* 3. L'INTERFACE DU LIVRE EN GROS PLAN (lm_scene4) */}
      {isBookOpen && (
        <div 
          style={{
            position: 'absolute',
            top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.8)', 
            zIndex: 100,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer' 
          }}
          onClick={() => setIsBookOpen(false)}
        >
          <div 
            style={{ 
              position: 'relative', 
              width: '80%', 
              maxWidth: '1000px', 
              aspectRatio: '16/9' 
            }}
            onClick={(e) => e.stopPropagation()} 
          >
            {/* Image du livre vierge */}
            <img src={bookImage} alt="Grimoire" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

            {/* Texte sur la page de GAUCHE */}
            <div style={{
              position: 'absolute', top: '20%', left: '22%', width: '25%', height: '60%',
              fontFamily: "'Uncial Antiqua', serif",
              color: '#3a2a1a', 
              textAlign: 'center',
              display: 'flex', flexDirection: 'column', justifyContent: 'center'
            }}>
              <h2 style={{ fontSize: '2rem', color: '#8a2be2', margin: '0 0 1rem 0' }}>Lacryma Mundi</h2>
              <p style={{ fontSize: '1.2rem', lineHeight: '1.4' }}>
                "Trois voies s'ouvrent à droite de mon silence. Chacune garde un fragment de la vérité, mais seule la Vertu vous guidera."
              </p>
            </div>

            {/* Texte sur la page de DROITE */}
            <div style={{
              position: 'absolute', top: '20%', right: '23%', width: '25%', height: '60%',
              fontFamily: "'Uncial Antiqua', serif",
              color: '#3a2a1a',
              textAlign: 'center',
              display: 'flex', flexDirection: 'column', justifyContent: 'center'
            }}>
              <p style={{ fontSize: '1.2rem', lineHeight: '1.5' }}>
                <strong style={{ color: '#8a2be2' }}>Bois :</strong> Le respect du PASSÉ.<br/><br/>
                <strong style={{ color: '#8a2be2' }}>Fer :</strong> L'épreuve du PRÉSENT.<br/><br/>
                <strong style={{ color: '#8a2be2' }}>Rune :</strong> La vision de l'AVENIR.
              </p>
              <p style={{ fontSize: '1rem', marginTop: '1rem', fontStyle: 'italic' }}>
                Rappelez-vous ces piliers pour la Nef sacrée.
              </p>
            </div>
            
            {/* Instruction pour fermer */}
            <p style={{ 
              position: 'absolute', bottom: '-40px', width: '100%', 
              textAlign: 'center', color: '#fff', fontFamily: "'VT323', monospace", fontSize: '1.5rem' 
            }}>
              (Cliquez en dehors du livre pour le fermer)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}