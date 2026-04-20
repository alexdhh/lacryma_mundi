import { useEffect, useState } from 'react';
import bgLarme from '../assets/lm_larme.png';

interface DialogState {
  title: string;
  text: string;
}

interface LmLarmeProps {
  onReturnHome: () => void;
}

type DialsState = [number, number, number];

const PHASES = ['New Moon', 'First Quarter', 'Full Moon', 'Last Quarter'];

const mod4 = (value: number) => ((value % 4) + 4) % 4;

const toPhase = (value: number) => PHASES[mod4(value)];

export default function LmLarme({ onReturnHome }: LmLarmeProps) {
  const [dials, setDials] = useState<DialsState>([2, 1, 3]);
  const [tearRecovered, setTearRecovered] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [showEndText, setShowEndText] = useState(false);
  const [dialog, setDialog] = useState<DialogState | null>({
    title: 'ALTAR OF THE TEAR',
    text:
      'To release the Tear, the three astral dials must align in darkness: New Moon, New Moon, New Moon.\n'
      + 'Their fates are bound. Move one, and another changes with it.',
  });

  useEffect(() => {
    if (!dialog) return;

    const timer = setTimeout(() => {
      setDialog(null);
    }, 7000);

    return () => clearTimeout(timer);
  }, [dialog]);

  const closeDialog = () => {
    setDialog(null);
  };

  const showDialMessage = (dialName: string, phase: number, linkedEffect: string, nextState: DialsState) => {
    setDialog({
      title: `ASTROLABE - ${dialName}`,
      text:
        `The stone mechanism grinds heavily. It now marks ${toPhase(phase)} (${phase}). ${linkedEffect}\n`
        + `Current state -> Left: ${toPhase(nextState[0])} (${nextState[0]}), Center: ${toPhase(nextState[1])} (${nextState[1]}), Right: ${toPhase(nextState[2])} (${nextState[2]}).`,
    });
  };

  const applyDialMove = (dialIndex: 0 | 1 | 2) => {
    if (tearRecovered || isEnding) return;

    const [left, center, right] = dials;
    let next: DialsState = [left, center, right];

    if (dialIndex === 0) {
      next = [mod4(left + 1), mod4(center + 1), right];
      showDialMessage('LEFT', next[0], 'You hear the central dial turning with it...', next);
    }

    if (dialIndex === 1) {
      next = [left, mod4(center + 1), mod4(right - 1)];
      showDialMessage('CENTER', next[1], 'A dry chain rattles as the right dial shifts backward...', next);
    }

    if (dialIndex === 2) {
      next = [mod4(left + 2), center, mod4(right + 1)];
      showDialMessage('RIGHT', next[2], 'A hidden axle snaps into motion and the left dial jumps ahead...', next);
    }

    setDials(next);

    const isSolved = next.every((value) => value === 0);
    if (isSolved) {
      setTearRecovered(true);
      setDialog({
        title: 'LACRYMA MUNDI',
        text:
          'The three dials settle on New Moon. The altar cracks open, and the Lacryma Mundi rises in pale light.\n'
          + 'You recover the Tear.',
      });

      // End sequence: brief success message, then full black screen and END title.
      setTimeout(() => {
        setIsEnding(true);
      }, 1400);

      setTimeout(() => {
        setShowEndText(true);
      }, 3300);
    }
  };

  const inspectAltar = () => {
    if (tearRecovered) {
      setDialog({
        title: 'ALTAR OF THE TEAR',
        text: 'The seal is broken. The altar is open, and the Lacryma Mundi now rests in your hands.',
      });
      return;
    }

    setDialog({
      title: 'ALTAR OF THE TEAR',
      text:
        `The altar is sealed. The astral dials read: ${toPhase(dials[0])}, ${toPhase(dials[1])}, ${toPhase(dials[2])}.\n`
        + 'Only total darkness across all three can free the Tear.',
    });
  };

  return (
    <div className="room-container pixel-art fade-in" style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#000' }}>
      <img
        src={bgLarme}
        alt="Chamber of the Tear"
        style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}
      />

      <div className="larme-dial-hitbox larme-dial-hitbox-left" data-label="L" onClick={() => applyDialMove(0)} title="Rotate left astrolabe"></div>

      <div className="larme-dial-hitbox larme-dial-hitbox-center" data-label="C" onClick={() => applyDialMove(1)} title="Rotate center astrolabe"></div>

      <div className="larme-dial-hitbox larme-dial-hitbox-right" data-label="R" onClick={() => applyDialMove(2)} title="Rotate right astrolabe"></div>

      <div className="larme-altar-hitbox" onClick={inspectAltar} title="Inspect altar"></div>

      <div className="larme-lore-hitbox" onClick={() => setDialog({
        title: 'INSCRIPTION',
        text:
          'To release the Tear, the three astral dials must align in darkness.\n'
          + 'But their destinies are chained. Move one, and another is altered.',
      })} title="Read inscription"></div>

      {dialog && (
        <div className="room1-message-box" style={{ position: 'absolute', bottom: '8%', left: '50%', transform: 'translateX(-50%)', width: '80%', padding: '20px 30px', backgroundColor: '#16111a', border: '2px solid #3c2547', boxShadow: '0 0 15px rgba(0,0,0,0.8)', zIndex: 200, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <button className="close-btn" onClick={closeDialog} style={{ position: 'absolute', top: '10px', right: '15px', color: '#888', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'monospace', fontSize: '1.2rem' }}>X</button>
          <h3 style={{ color: '#c43535', fontFamily: "'VT323', monospace", fontSize: '1.8rem', margin: '0 0 15px 0', letterSpacing: '2px' }}>{dialog.title}</h3>
          <p style={{ color: '#e8dbcd', fontFamily: "'VT323', monospace", fontSize: '1.5rem', lineHeight: '1.5', textAlign: 'center', margin: '0 0 10px 0', whiteSpace: 'pre-line' }}>"{dialog.text}"</p>
        </div>
      )}

      <div className={`end-screen-overlay ${isEnding ? 'active' : ''}`}>
        <div className="end-screen-content">
          <h1 className={`end-screen-title ${showEndText ? 'show' : ''}`}>END</h1>
          {showEndText && (
            <button className="end-screen-btn" onClick={onReturnHome}>Return Home</button>
          )}
        </div>
      </div>
    </div>
  );
}
