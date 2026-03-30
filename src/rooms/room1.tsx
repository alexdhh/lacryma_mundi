import { useState, useEffect } from 'react';
import bgImage from '../assets/lm_scene3.png'; // Vérifie bien .jpg ou .png

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
  const [isDoorOpen, setIsDoorOpen] = useState<boolean>(false);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [dialog, setDialog] = useState<DialogState | null>(null);

  useEffect(() => {
    if (dialog) {
      const timer = setTimeout(() => setDialog(null), 8000);
      return () => clearTimeout(timer);
    }
  }, [dialog]);

  const handleGargoyleClick = (id: GargoyleId) => {
    if (isDoorOpen) return; // Si la porte s'ouvre déjà, on bloque les clics
    setDialog(null);

    if (activeGargoyles.includes(id)) {
      setActiveGargoyles(prev => prev.filter(g => g !== id));
      return;
    }

    if (activeGargoyles.length < 3) {
      const newActive = [...activeGargoyles, id];
      setActiveGargoyles(newActive);

      // --- VÉRIFICATION DE LA SÉQUENCE ---
      if (newActive.length === 3) {
        const isCorrect = [...newActive].sort().join() === [...CORRECT_SEQUENCE].sort().join();
        
        if (isCorrect) {
          // VICTOIRE ! On déclenche le tremblement de terre et on ouvre la porte
          setIsDoorOpen(true);
          setIsShaking(true);
          setDialog({ 
            title: "Mécanisme Déverrouillé", 
            text: "Un grondement sourd fait trembler les murs... Les lourdes portes s'ouvrent d'elles-mêmes !" 
          });

          // Le tremblement s'arrête après 1.5 secondes
          setTimeout(() => setIsShaking(false), 1500);

          // On passe à la salle suivante après 4.5 secondes (pour laisser lire)
          setTimeout(() => onSolve(), 4500);

        } else {
          // ERREUR
          setDialog({ title: "Erreur", text: "Un souffle glacé éteint les regards... Essayez encore." });
          setTimeout(() => setActiveGargoyles([]), 1500);
        }
      }
    }
  };

  return (
    <div className="room1-scene-container pixel-art">
      {/* On ajoute la classe "shake" si isShaking est true ! */}
      <div className={`room1-wrapper ${isShaking ? 'shake-screen' : ''}`} style={{ backgroundImage: `url(${bgImage})` }}>
        
        {/* Hitboxes interactives */}
        <div className="hitbox grimoire-hitbox" onClick={() => setDialog({ title: "Grimoire", text: "« Seuls le Dévoreur, l'Aveugle et le Cornu feront verser la Larme. »" })}></div>
        <div className="hitbox door-hitbox" onClick={() => !isDoorOpen && setDialog({ title: "Porte", text: "Scellée par une magie ancienne." })}></div>

        {/* Les 5 Gargouilles */}
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