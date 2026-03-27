import { useState, useEffect } from 'react';
import bgImage from '../assets/lm_scene3.png';

type GargoyleId = 0 | 1 | 2 | 3 | 4;

interface DialogState {
  title: string;
  text: string;
}

interface Room1Props {
  onSolve: () => void;
}

const CORRECT_SEQUENCE: GargoyleId[] = [2, 3, 4]; // Cornu, Dévoreur, Aveugle

export default function Room1({ onSolve }: Room1Props) {
  const [activeGargoyles, setActiveGargoyles] = useState<GargoyleId[]>([]);
  const [isLacrymaLit, setIsLacrymaLit] = useState<boolean>(false);
  const [isDoorOpen, setIsDoorOpen] = useState<boolean>(false);
  const [dialog, setDialog] = useState<DialogState | null>(null);

  useEffect(() => {
    if (dialog) {
      const timer = setTimeout(() => setDialog(null), 8000);
      return () => clearTimeout(timer);
    }
  }, [dialog]);

  const handleGargoyleClick = (id: GargoyleId) => {
    if (isDoorOpen) return;
    setDialog(null);

    if (activeGargoyles.includes(id)) {
      setActiveGargoyles(prev => prev.filter(g => g !== id));
      return;
    }

    if (activeGargoyles.length < 3) {
      const newActive = [...activeGargoyles, id];
      setActiveGargoyles(newActive);

      if (newActive.length === 3) {
        const isCorrect = [...newActive].sort().join() === [...CORRECT_SEQUENCE].sort().join();
        if (isCorrect) {
          setIsLacrymaLit(true);
          setDialog({ title: "Révélation", text: "La Larme sculptée s'illumine... Elle semble attendre votre contact." });
        } else {
          setDialog({ title: "Erreur", text: "Un souffle glacé éteint les regards... Essayez encore." });
          setTimeout(() => setActiveGargoyles([]), 1500);
        }
      }
    }
  };

  const handleLacrymaClick = () => {
    if (isLacrymaLit && !isDoorOpen) {
      setIsDoorOpen(true);
      setDialog({ title: "Passage Déverrouillé", text: "En touchant la Larme, un mécanisme millénaire s'active. La porte s'ouvre..." });
      setTimeout(() => onSolve(), 4000);
    } else if (!isLacrymaLit) {
      setDialog({ title: "La Larme du Monde", text: "Une sculpture de pierre inerte. Quelque chose manque pour l'éveiller." });
    }
  };

  return (
    <div className="room1-scene-container pixel-art">
      <div className="room1-wrapper" style={{ backgroundImage: `url(${bgImage})` }}>
        
        {/* Hitboxes interactives */}
        <div className="hitbox grimoire-hitbox" onClick={() => setDialog({ title: "Grimoire", text: "« Seuls le Dévoreur, l'Aveugle et le Cornu feront verser la Larme. »" })}></div>
        <div className="hitbox door-hitbox" onClick={() => !isDoorOpen && setDialog({ title: "Porte", text: "Scellée par une magie ancienne." })}></div>
        
        {/* --- LA LARME --- */}
        <div 
          className={`hitbox lacryma-hitbox ${isLacrymaLit ? 'lit' : ''}`} 
          onClick={handleLacrymaClick} // <-- VÉRIFIE QUE CETTE LIGNE EST BIEN LÀ
>
        {/* Vide pour l'instant puisqu'on a enlevé le sprite */}
        </div>

        {[0, 1, 2, 3, 4].map((id) => (
          <div key={id} className={`hitbox gargoyle-hitbox g${id}`} onClick={() => handleGargoyleClick(id as GargoyleId)}>
            <div className={`gargoyle-eye ${activeGargoyles.includes(id as GargoyleId) ? 'active' : ''}`}></div>
          </div>
        ))}

        {/* Dialogue */}
        {dialog && (
          <div className="room1-message-box">
            <button className="close-btn" onClick={() => setDialog(null)}>×</button>
            <h3>{dialog.title}</h3>
            <p>{dialog.text}</p>
          </div>
        )}
      </div>
    </div>
  );
}