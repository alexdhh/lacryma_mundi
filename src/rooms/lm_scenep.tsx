// src/rooms/lm_scenep.tsx
import { useState, useEffect } from 'react';
import bgMain from '../assets/lm_scenep.png'; 
import bgCorridor from '../assets/lm_scenep2.png';
import bgArchive from '../assets/lm_archive.png';
import bgLadder from '../assets/lm_echelle.png';
import bgStatue from '../assets/lm_status.png';
import bookImage from '../assets/lm_scene4.png'; 

interface DialogState {
  title: string;
  text: string;
}

export default function LmScenep() {
  const [currentView, setCurrentView] = useState('main');
  const [isBookOpen, setIsBookOpen] = useState(false);
  
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const [showBloodChoice, setShowBloodChoice] = useState(false);

  // NOUVEAU: État pour les effets visuels
  const [screenEffect, setScreenEffect] = useState<string>('');

  const [hasPlume, setHasPlume] = useState(false); 
  const [hasWoodenHandle, setHasWoodenHandle] = useState(false);
  const [hasRuneStone, setHasRuneStone] = useState(false);
  const [hasIronKey, setHasIronKey] = useState(false);

  const [hasPastSeal, setHasPastSeal] = useState(false);
  const [hasPresentSeal, setHasPresentSeal] = useState(false);
  const [hasFutureSeal, setHasFutureSeal] = useState(false);

  // NOUVEAU: Fonction pour déclencher un effet (dure 1 seconde max)
  const triggerEffect = (effectClass: string) => {
    setScreenEffect(effectClass);
    setTimeout(() => setScreenEffect(''), 1000);
  };

  useEffect(() => {
    if (dialog && !showBloodChoice) {
      const timer = setTimeout(() => setDialog(null), 8000);
      return () => clearTimeout(timer);
    }
  }, [dialog, showBloodChoice]);

  const closeDialog = () => {
    setDialog(null);
    setShowBloodChoice(false);
  };

  const goBack = () => {
    if (currentView === 'archive' || currentView === 'corridor') setCurrentView('main');
    else if (currentView === 'ladder' || currentView === 'statue') setCurrentView('corridor');
    closeDialog();
  };

  return (
    // On ajoute la classe de secousse sur le conteneur global si besoin
    <div className={`room-container pixel-art fade-in ${screenEffect === 'shake-screen' ? 'shake-screen' : ''}`} style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      
      {/* NOUVEAU: Calque d'effet de couleur par-dessus l'écran */}
      <div className={`overlay-effect ${screenEffect !== 'shake-screen' ? screenEffect : ''}`}></div>

      <img 
        src={
          currentView === 'main' ? bgMain :
          currentView === 'corridor' ? bgCorridor :
          currentView === 'archive' ? bgArchive :
          currentView === 'ladder' ? bgLadder :
          bgStatue 
        } 
        alt="Décor" 
        style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} 
      />

      {/* ================= VUE PRINCIPALE ================= */}
      {currentView === 'main' && !isBookOpen && !dialog && (
        <>
          <div onClick={() => setIsBookOpen(true)} style={{ position: 'absolute', bottom: '10%', left: '16%', width: '15%', height: '18%', cursor: 'pointer', zIndex: 10 }} />
          <div onClick={() => setCurrentView('archive')} style={{ position: 'absolute', top: '25%', left: '18%', width: '12%', height: '45%', cursor: 'pointer', zIndex: 10 }} />
          <div onClick={() => setCurrentView('corridor')} style={{ position: 'absolute', bottom: '10%', left: '40%', width: '20%', height: '20%', cursor: 'pointer', zIndex: 10 }} />

          {/* PORTE EN BOIS (Passé) */}
          <div 
            onClick={() => {
              if (hasPastSeal) setDialog({ title: "PASSAGE DE TERRE", text: "Le Passage de Terre est déjà ouvert." });
              else if (hasWoodenHandle) {
                triggerEffect('shake-screen'); // Effet de lourdeur
                setDialog({ title: "PASSAGE DE TERRE", text: "Vous insérez la poignée en bois de chêne. La porte s'entrouvre...\nVous obtenez le Sceau du Passé !" });
                setHasPastSeal(true);
              } else setDialog({ title: "PASSAGE DE TERRE", text: "Cette lourde porte en bois n'a pas de poignée. Elle est bloquée." });
            }}
            style={{ position: 'absolute', top: '40%', left: '61%', width: '6%', height: '35%', cursor: 'pointer', zIndex: 10 }}
          />

          {/* GRILLE DE FER (Présent) */}
          <div 
            onClick={() => {
              if (hasPresentSeal) setDialog({ title: "GRILLE DE FER", text: "La Grille de Fer est déjà ouverte." });
              else if (hasIronKey) {
                triggerEffect('shake-screen'); // Effet de lourdeur métallique
                setDialog({ title: "GRILLE DE FER", text: "La lourde clé tourne dans la serrure dans un grincement aigu...\nVous obtenez le Sceau du Présent !" });
                setHasPresentSeal(true);
              } else setDialog({ title: "GRILLE DE FER", text: "Une solide grille de fer. Il vous faut une clé pour passer." });
            }}
            style={{ position: 'absolute', top: '35%', left: '71%', width: '8%', height: '45%', cursor: 'pointer', zIndex: 10 }}
          />

          {/* ARCHE RUNIQUE (Avenir) */}
          <div 
            onClick={() => {
              if (hasFutureSeal) setDialog({ title: "VOIE DU CIEL", text: "La Voie du Ciel est déjà ouverte." });
              else if (hasRuneStone) {
                triggerEffect('flash-magic'); // Effet magique bleu
                setDialog({ title: "VOIE DU CIEL", text: "Vous insérez la pierre. Les runes s'illuminent d'un éclat bleu...\nVous obtenez le Sceau de l'Avenir !" });
                setHasFutureSeal(true);
              } else setDialog({ title: "VOIE DU CIEL", text: "Une arche couverte de runes éteintes. Un emplacement circulaire est vide au centre." });
            }}
            style={{ position: 'absolute', top: '15%', left: '83%', width: '15%', height: '75%', cursor: 'pointer', zIndex: 10 }}
          />

          {/* NEF SACRÉE */}
          <div 
            onClick={() => {
              if (hasPastSeal && hasPresentSeal && hasFutureSeal) {
                triggerEffect('shake-screen'); // Grosse secousse finale
                setDialog({ title: "NEF SACRÉE", text: "Les trois Sceaux s'illuminent ! La grande double porte s'ouvre avec un fracas sourd... Vous pouvez passer à la suite !" });
              } else {
                setDialog({ title: "NEF SACRÉE", text: "La Nef sacrée est scellée. Il vous manque des Sceaux pour l'ouvrir." });
              }
            }}
            style={{ position: 'absolute', top: '35%', left: '45%', width: '10%', height: '30%', cursor: 'pointer', zIndex: 10 }}
          />
        </>
      )}

      {/* ================= COULOIR ================= */}
      {currentView === 'corridor' && !dialog && (
        <>
          <div onClick={() => setCurrentView('ladder')} style={{ position: 'absolute', top: '30%', left: '10%', width: '15%', height: '60%', cursor: 'pointer', zIndex: 10 }} />
          <div onClick={() => setCurrentView('statue')} style={{ position: 'absolute', top: '45%', left: '68%', width: '15%', height: '45%', cursor: 'pointer', zIndex: 10 }} />
        </>
      )}

      {/* ================= ARCHIVES (Bois) ================= */}
      {currentView === 'archive' && !dialog && (
        <div 
          onClick={() => {
            if (!hasWoodenHandle) {
              triggerEffect('flash-item'); // Flash doré pour l'objet
              setDialog({ title: "ARCHIVES OUBLIÉES", text: "Vous fouillez les parchemins narrant l'histoire des premiers rois...\nAu fond d'une caisse, vous trouvez une Poignée en Bois de Chêne." });
              setHasWoodenHandle(true);
            } else {
              setDialog({ title: "ARCHIVES OUBLIÉES", text: "Il n'y a plus rien d'utile ici, seulement de vieux parchemins illisibles." });
            }
          }}
          style={{ position: 'absolute', top: '40%', left: '40%', width: '20%', height: '40%', cursor: 'pointer', zIndex: 10 }}
        />
      )}

      {/* ================= ÉCHELLE (Rune) ================= */}
      {currentView === 'ladder' && !dialog && (
        <div 
          onClick={() => {
            if (!hasRuneStone) {
              triggerEffect('flash-magic'); // Flash magique
              setDialog({ title: "ÉCHELLE", text: "Vous grimpez tout en haut de l'échelle. À travers la petite lucarne, la lune éclaire un objet...\nVous trouvez une Pierre Runique Bleutée." });
              setHasRuneStone(true);
            } else {
              setDialog({ title: "ÉCHELLE", text: "Vous avez déjà récupéré la pierre runique. L'étagère est vide." });
            }
          }}
          style={{ position: 'absolute', top: '25%', left: '55%', width: '15%', height: '20%', cursor: 'pointer', zIndex: 10 }}
        />
      )}

      {/* ================= STATUE (Fer) ================= */}
      {currentView === 'statue' && !dialog && !showBloodChoice && (
        <div 
          onClick={() => {
            if (!hasIronKey) {
              setDialog({ title: "STATUE ENCAPUCHONNÉE", text: "La statue de pierre serre un objet dans sa main gauche.\nUne inscription à ses pieds indique : « Seul le sang versé au présent libère le fer »." });
              setShowBloodChoice(true);
            } else {
              setDialog({ title: "STATUE ENCAPUCHONNÉE", text: "La statue a déjà relâché la clé. Sa main de pierre est vide." });
            }
          }}
          style={{ position: 'absolute', top: '20%', left: '30%', width: '40%', height: '60%', cursor: 'pointer', zIndex: 10 }}
        />
      )}

      {/* BOUTON RECULER */}
      {currentView !== 'main' && !dialog && (
        <div onClick={goBack} style={{ position: 'absolute', bottom: '2%', left: '50%', transform: 'translateX(-50%)', width: '40%', height: '10%', cursor: 'pointer', zIndex: 20, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', paddingBottom: '20px' }}>
          <p style={{ color: '#fff', fontFamily: "'VT323', monospace", fontSize: '2rem', textShadow: '2px 2px 0 #000', margin: 0 }}>▼ RECULER ▼</p>
        </div>
      )}

      {/* BOÎTE DE DIALOGUE */}
      {dialog && (
        <div className="room1-message-box" style={{ position: 'absolute', bottom: '8%', left: '50%', transform: 'translateX(-50%)', width: '80%', padding: '20px 30px', backgroundColor: '#16111a', border: '2px solid #3c2547', boxShadow: '0 0 15px rgba(0,0,0,0.8)', zIndex: 200, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <button className="close-btn" onClick={closeDialog} style={{ position: 'absolute', top: '10px', right: '15px', color: '#888', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'monospace', fontSize: '1.2rem' }}>X</button>
          <h3 style={{ color: '#c43535', fontFamily: "'VT323', monospace", fontSize: '1.8rem', margin: '0 0 15px 0', letterSpacing: '2px' }}>{dialog.title}</h3>
          <p style={{ color: '#e8dbcd', fontFamily: "'VT323', monospace", fontSize: '1.5rem', lineHeight: '1.5', textAlign: 'center', margin: '0 0 10px 0', whiteSpace: 'pre-line' }}>« {dialog.text} »</p>

          {showBloodChoice && (
            <div style={{ marginTop: '15px', display: 'flex', gap: '20px' }}>
              {hasPlume ? (
                <button 
                  onClick={() => {
                    triggerEffect('flash-blood'); // Flash rouge intense
                    setDialog({ title: "STATUE ENCAPUCHONNÉE", text: "Vous utilisez la plume pour vous piquer le doigt. Quelques gouttes tombent...\nLa statue lâche une Lourde Clé en Fer." });
                    setHasIronKey(true);
                    setShowBloodChoice(false);
                  }}
                  style={{ padding: '8px 16px', fontSize: '1.3rem', fontFamily: "'VT323', monospace", cursor: 'pointer', backgroundColor: '#3a1c1c', color: '#ffaaaa', border: '1px solid #c43535' }}
                >
                  Se piquer avec la plume
                </button>
              ) : (
                <p style={{ color: '#888', fontStyle: 'italic', fontSize: '1.2rem', fontFamily: "'VT323', monospace", margin: 0 }}>(Il vous faudrait un objet pointu pour verser le sang...)</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* LE GRIMOIRE */}
      {isBookOpen && (
        <div onClick={() => setIsBookOpen(false)} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ position: 'relative', width: '95vw', maxWidth: '1400px', aspectRatio: '16/9', backgroundImage: `url(${bookImage})`, backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>
            
            {/* Plume restreinte à l'encrier */}
            <div 
              onClick={(e) => {
                e.stopPropagation(); 
                if (!hasPlume) {
                  triggerEffect('flash-item'); // Flash doré
                  setDialog({ title: "BUREAU", text: "Vous prenez la plume affûtée, encore humide d'encre sombre." });
                  setHasPlume(true);
                  setIsBookOpen(false); 
                } else {
                  setDialog({ title: "BUREAU", text: "L'encrier est désormais vide." });
                }
              }}
              style={{ position: 'absolute', bottom: '12%', right: '13%', width: '8%', height: '45%', cursor: 'pointer', zIndex: 110 }}
            />

            {/* TEXTES DU LIVRE */}
            <div style={{ position: 'absolute', top: '20%', left: '28%', width: '19%', height: '55%', fontFamily: "'Uncial Antiqua', serif", color: '#000000', fontWeight: 'bold', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h2 style={{ fontSize: 'clamp(1.2rem, 2.2vw, 3rem)', color: '#4a154b', margin: '0 0 15px 0', lineHeight: '1.1' }}>LACRYMA MUNDI</h2>
              <p style={{ color: '#000000', fontSize: 'clamp(0.7rem, 1.1vw, 1.4rem)', lineHeight: '1.4', margin: '0 0 15px 0' }}>"Trois voies s'ouvrent à droite de mon silence."</p>
              <p style={{ color: '#000000', fontSize: 'clamp(0.7rem, 1.1vw, 1.4rem)', lineHeight: '1.4', margin: 0 }}>"Chacune garde un fragment de la vérité, mais seule la Vertu vous guidera."</p>
            </div>
            <div style={{ position: 'absolute', top: '20%', left: '53%', width: '19%', height: '55%', fontFamily: "'Uncial Antiqua', serif", color: '#000000', fontWeight: 'bold', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <p style={{ color: '#000000', fontSize: 'clamp(0.6rem, 1vw, 1.3rem)', lineHeight: '1.4', margin: '0 0 12px 0' }}>"Le Passage de Terre (<strong style={{ color: '#4a154b' }}>Bois</strong>) ne s'ouvre que par le respect du PASSÉ."</p>
              <p style={{ color: '#000000', fontSize: 'clamp(0.6rem, 1vw, 1.3rem)', lineHeight: '1.4', margin: '0 0 12px 0' }}>"La Grille de Fer (<strong style={{ color: '#4a154b' }}>Fer</strong>) ne s'efface que devant l'épreuve du PRÉSENT."</p>
              <p style={{ color: '#000000', fontSize: 'clamp(0.6rem, 1vw, 1.3rem)', lineHeight: '1.4', margin: '0 0 12px 0' }}>"La Voie du Ciel (<strong style={{ color: '#4a154b' }}>Rune</strong>) ne se dévoile que pour celui qui voit l'AVENIR."</p>
              <p style={{ color: '#000000', fontSize: 'clamp(0.6rem, 1vw, 1.3rem)', lineHeight: '1.4', margin: '15px 0 0 0', fontStyle: 'italic' }}>"Rappelez-vous ces trois piliers, car ils sont la clé de la Nef sacrée."</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}