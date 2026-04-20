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

interface LmScenepProps {
  onEnterCrypt: () => void;
}

export default function LmScenep({ onEnterCrypt }: LmScenepProps) {
  const [currentView, setCurrentView] = useState('main');
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [isFloorNavHovered, setIsFloorNavHovered] = useState(false);
  const [isEnteringCrypt, setIsEnteringCrypt] = useState(false);
  
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const [showBloodChoice, setShowBloodChoice] = useState(false);

  // Effets visuels (On a complètement retiré les tremblements)
  const [screenEffect, setScreenEffect] = useState<string>('');

  // Inventaire
  const [hasPlume, setHasPlume] = useState(false); 
  const [hasWoodenHandle, setHasWoodenHandle] = useState(false);
  const [hasRuneStone, setHasRuneStone] = useState(false);
  const [hasIronKey, setHasIronKey] = useState(false);

  // Sceaux
  const [hasPastSeal, setHasPastSeal] = useState(false);
  const [hasPresentSeal, setHasPresentSeal] = useState(false);
  const [hasFutureSeal, setHasFutureSeal] = useState(false);

  // Déclencheurs d'effets (Flash de couleur par-dessus l'écran)
  const triggerFlash = (effectClass: string, duration = 1000) => {
    setScreenEffect(effectClass);
    setTimeout(() => setScreenEffect(''), duration);
  };

  // Timer ajusté à 6 secondes (6000 ms)
  useEffect(() => {
    if (dialog && !showBloodChoice) {
      const timer = setTimeout(() => setDialog(null), 6000);
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
    <div className="room-container pixel-art fade-in" style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#000' }}>
      
      {/* Calque d'effets lumineux (Poussière, Magie, Sang...) */}
      <div className={`overlay-effect ${screenEffect}`}></div>

      <img 
        src={
          currentView === 'main' ? bgMain :
          currentView === 'corridor' ? bgCorridor :
          currentView === 'archive' ? bgArchive :
          currentView === 'ladder' ? bgLadder :
          bgStatue 
        } 
        alt="Scenery" 
        style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} 
      />

      {/* ================= VUE PRINCIPALE ================= */}
      {currentView === 'main' && !isBookOpen && !dialog && (
        <>
          {/* OBJETS DE DÉCOR INTERACTIFS */}
          <div 
            onClick={() => {
              triggerFlash('flash-dust');
              setDialog({ title: "CANDLES", text: "Their flames flicker strangely, as if the room itself were breathing..." });
            }} 
            style={{ position: 'absolute', bottom: '25%', left: '8%', width: '8%', height: '15%', cursor: 'pointer', zIndex: 10 }} 
          />
          <div 
            onClick={() => {
              setDialog({ title: "LIBRARY", text: "Thousands of dusty volumes. Some are written in languages dead for millennia." });
            }} 
            style={{ position: 'absolute', top: '15%', left: '4%', width: '12%', height: '50%', cursor: 'pointer', zIndex: 10 }} 
          />

          {/* BUREAU & NAVIGATION */}
          <div 
            onClick={() => {
              setIsBookOpen(true);
            }} 
            style={{ position: 'absolute', bottom: '10%', left: '16%', width: '15%', height: '18%', cursor: 'pointer', zIndex: 10 }} 
          />
          <div onClick={() => setCurrentView('archive')} style={{ position: 'absolute', top: '25%', left: '18%', width: '12%', height: '45%', cursor: 'pointer', zIndex: 10 }} />
          <div
            onClick={() => {
              setIsFloorNavHovered(false);
              setCurrentView('corridor');
            }}
            onMouseEnter={() => setIsFloorNavHovered(true)}
            onMouseLeave={() => setIsFloorNavHovered(false)}
            style={{ position: 'absolute', bottom: '10%', left: '40%', width: '20%', height: '20%', cursor: 'pointer', zIndex: 10 }}
            title="Move forward into the room"
          />

          {isFloorNavHovered && (
            <div className="main-floor-advance-hint" aria-hidden="true">
              <span className="main-floor-advance-arrow">▲</span>
              <span className="main-floor-advance-text">Advance</span>
            </div>
          )}

          {/* PORTE EN BOIS (Passé) */}
          <div 
            onClick={() => {
              if (hasPastSeal) {
                setDialog({ title: "EARTH PASSAGE", text: "The Earth Passage is already open." });
              } else if (hasWoodenHandle) {
                triggerFlash('flash-dust-heavy', 1500); // Gros nuage de poussière
                setDialog({ title: "EARTH PASSAGE", text: "You insert the oak wooden handle. The door opens ajar in a cloud of dust...\nYou obtain the Seal of the Past!" });
                setHasPastSeal(true);
              } else {
                setDialog({ title: "EARTH PASSAGE", text: "This heavy wooden door has no handle. It is jammed." });
              }
            }}
            style={{ position: 'absolute', top: '40%', left: '61%', width: '6%', height: '35%', cursor: 'pointer', zIndex: 10 }}
          />

          {/* GRILLE DE FER (Présent) */}
          <div 
            onClick={() => {
              if (hasPresentSeal) {
                setDialog({ title: "IRON GATE", text: "The Iron Gate is already open." });
              } else if (hasIronKey) {
                triggerFlash('flash-spark'); // Étincelle métallique
                setDialog({ title: "IRON GATE", text: "The heavy key turns in the lock with a sharp screech...\nYou obtain the Seal of the Present!" });
                setHasPresentSeal(true);
              } else {
                setDialog({ title: "IRON GATE", text: "A solid iron gate. You need a key to pass." });
              }
            }}
            style={{ position: 'absolute', top: '35%', left: '71%', width: '8%', height: '45%', cursor: 'pointer', zIndex: 10 }}
          />

          {/* ARCHE RUNIQUE (Avenir) */}
          <div 
            onClick={() => {
              if (hasFutureSeal) {
                setDialog({ title: "SKY WAY", text: "The Sky Way is already open." });
              } else if (hasRuneStone) {
                triggerFlash('flash-magic'); // Éclat bleu
                setDialog({ title: "SKY WAY", text: "You insert the stone. The runes light up in a blue glow...\nYou obtain the Seal of the Future!" });
                setHasFutureSeal(true);
              } else {
                setDialog({ title: "SKY WAY", text: "An arch covered with dormant runes. A circular slot sits empty at its center." });
              }
            }}
            style={{ position: 'absolute', top: '15%', left: '83%', width: '15%', height: '75%', cursor: 'pointer', zIndex: 10 }}
          />

          {/* NEF SACRÉE (Sans tremblement, juste la magie) */}
          <div 
            onClick={() => {
              if (hasPastSeal && hasPresentSeal && hasFutureSeal) {
                if (isEnteringCrypt) return;
                setIsEnteringCrypt(true);
                triggerFlash('flash-magic');
                setDialog({ title: "SACRED NAVE", text: "The three Seals ignite! The great double door opens with a deep crash... A stairway into the crypts is revealed." });
                setTimeout(() => onEnterCrypt(), 2200);
              } else {
                setDialog({ title: "SACRED NAVE", text: "The Sacred Nave is sealed. You are missing Seals to open it." });
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
          <div 
            onClick={() => {
              triggerFlash('flash-dark'); // Ambience sombre en s'approchant
              setCurrentView('statue');
            }} 
            style={{ position: 'absolute', top: '45%', left: '68%', width: '15%', height: '45%', cursor: 'pointer', zIndex: 10 }} 
          />
        </>
      )}

      {/* ================= ARCHIVES (Bois) ================= */}
      {currentView === 'archive' && !dialog && (
        <div 
          onClick={() => {
            if (!hasWoodenHandle) {
              triggerFlash('flash-dust-heavy', 1500); 
              setDialog({ title: "FORGOTTEN ARCHIVES", text: "As you shift heavy grimoires, a thick cloud of dust rises...\nAt the bottom of a crate, you find an Oak Wooden Handle." });
              setHasWoodenHandle(true);
            } else {
              triggerFlash('flash-dust');
              setDialog({ title: "FORGOTTEN ARCHIVES", text: "There is nothing useful left here. Only old parchments eaten by moths." });
            }
          }}
          style={{ position: 'absolute', top: '60%', left: '43%', width: '12%', height: '12%', cursor: 'pointer', zIndex: 10 }}
          title="Inspect the wooden object"
        />
      )}

      {/* ================= ÉCHELLE (Rune) ================= */}
      {currentView === 'ladder' && !dialog && (
        <div 
          onClick={() => {
            if (!hasRuneStone) {
              triggerFlash('flash-magic'); 
              setDialog({ title: "FRAGILE LADDER", text: "The ladder creaks under your weight... Through the skylight, moonlight reveals an object.\nYou find a Bluish Rune Stone!" });
              setHasRuneStone(true);
            } else {
              setDialog({ title: "FRAGILE LADDER", text: "You already took the rune stone. Better climb down before the wood gives way." });
            }
          }}
          style={{ position: 'absolute', top: '22%', left: '57%', width: '8%', height: '16%', cursor: 'pointer', zIndex: 10 }}
          title="Take the rune stone"
        />
      )}

      {/* ================= STATUE (Fer) ================= */}
      {currentView === 'statue' && !dialog && !showBloodChoice && (
        <div 
          onClick={() => {
            if (!hasIronKey) {
              setDialog({ title: "MACABRE STATUE", text: "The statue seems almost alive... It grips an object in its right hand.\nA bloody inscription reads: \"Only blood shed in the present frees the iron.\"" });
              setShowBloodChoice(true);
            } else {
              setDialog({ title: "MACABRE STATUE", text: "The statue has released its grip. Its stone hand, stained with your blood, is now empty." });
            }
          }}
          style={{ position: 'absolute', top: '20%', left: '30%', width: '40%', height: '60%', cursor: 'pointer', zIndex: 10 }}
        />
      )}

      {/* BOUTON RECULER */}
      {currentView !== 'main' && !dialog && (
        <div onClick={goBack} style={{ position: 'absolute', bottom: '2%', left: '50%', transform: 'translateX(-50%)', width: '40%', height: '10%', cursor: 'pointer', zIndex: 20, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', paddingBottom: '20px' }}>
          <p style={{ color: '#fff', fontFamily: "'VT323', monospace", fontSize: '2rem', textShadow: '2px 2px 0 #000', margin: 0 }}>▼ GO BACK ▼</p>
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
                    triggerFlash('flash-blood'); // Gros Flash rouge
                    setDialog({ title: "SACRIFICE", text: "You drive the quill into your palm. The pain is sharp.\nAt the touch of blood, the statue loosens its fingers and drops a Heavy Iron Key." });
                    setHasIronKey(true);
                    setShowBloodChoice(false);
                  }}
                  style={{ padding: '8px 16px', fontSize: '1.3rem', fontFamily: "'VT323', monospace", cursor: 'pointer', backgroundColor: '#3a1c1c', color: '#ffaaaa', border: '1px solid #c43535' }}
                >
                  Prick yourself with the quill
                </button>
              ) : (
                <p style={{ color: '#888', fontStyle: 'italic', fontSize: '1.2rem', fontFamily: "'VT323', monospace", margin: 0 }}>(You would need a sharp object to spill your own blood...)</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* LE GRIMOIRE */}
      {isBookOpen && (
        <div onClick={() => setIsBookOpen(false)} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ position: 'relative', width: '95vw', maxWidth: '1400px', aspectRatio: '16/9', backgroundImage: `url(${bookImage})`, backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>
            
            {/* Hitbox de la plume AGRANDIE pour couvrir tout l'encrier */}
            <div 
              onClick={(e) => {
                e.stopPropagation(); 
                if (!hasPlume) {
                  triggerFlash('flash-item'); 
                  setDialog({ title: "DESK", text: "You take the sharpened quill. Its tip is incredibly sharp." });
                  setHasPlume(true);
                  setIsBookOpen(false); 
                } else {
                  setDialog({ title: "DESK", text: "The inkwell is empty. The ink dried out long ago." });
                }
              }}
              style={{ position: 'absolute', bottom: '10%', right: '10%', width: '12%', height: '50%', cursor: 'pointer', zIndex: 110 }}
            />

            {/* TEXTES DU LIVRE */}
            <div style={{ position: 'absolute', top: '20%', left: '28%', width: '19%', height: '55%', fontFamily: "'Uncial Antiqua', serif", color: '#000000', fontWeight: 'bold', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h2 style={{ fontSize: 'clamp(1.2rem, 2.2vw, 3rem)', color: '#4a154b', margin: '0 0 15px 0', lineHeight: '1.1' }}>LACRYMA MUNDI</h2>
              <p style={{ color: '#000000', fontSize: 'clamp(0.7rem, 1.1vw, 1.4rem)', lineHeight: '1.4', margin: '0 0 15px 0' }}>"Three paths open to the right of my silence."</p>
              <p style={{ color: '#000000', fontSize: 'clamp(0.7rem, 1.1vw, 1.4rem)', lineHeight: '1.4', margin: 0 }}>"Each guards a fragment of truth, but only Virtue will guide you."</p>
            </div>
            <div style={{ position: 'absolute', top: '20%', left: '53%', width: '19%', height: '55%', fontFamily: "'Uncial Antiqua', serif", color: '#000000', fontWeight: 'bold', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <p style={{ color: '#000000', fontSize: 'clamp(0.6rem, 1vw, 1.3rem)', lineHeight: '1.4', margin: '0 0 12px 0' }}>"The Earth Passage (<strong style={{ color: '#4a154b' }}>Wood</strong>) opens only through respect for the PAST."</p>
              <p style={{ color: '#000000', fontSize: 'clamp(0.6rem, 1vw, 1.3rem)', lineHeight: '1.4', margin: '0 0 12px 0' }}>"The Iron Gate (<strong style={{ color: '#4a154b' }}>Iron</strong>) yields only to the trial of the PRESENT."</p>
              <p style={{ color: '#000000', fontSize: 'clamp(0.6rem, 1vw, 1.3rem)', lineHeight: '1.4', margin: '0 0 12px 0' }}>"The Sky Way (<strong style={{ color: '#4a154b' }}>Rune</strong>) reveals itself only to one who sees the FUTURE."</p>
              <p style={{ color: '#000000', fontSize: 'clamp(0.6rem, 1vw, 1.3rem)', lineHeight: '1.4', margin: '15px 0 0 0', fontStyle: 'italic' }}>"Remember these three pillars, for they are the key to the Sacred Nave."</p>
            </div>
          </div>
          <p style={{ position: 'absolute', bottom: '20px', width: '100%', textAlign: 'center', color: '#fff', fontFamily: "'VT323', monospace", fontSize: '1.5rem', textShadow: '2px 2px 0 #000' }}>
            (Click outside the book to close it)
          </p>
        </div>
      )}
    </div>
  );
}