// src/rooms/Room1.tsx
import { useState } from 'react';

// 1. VOICI LA CORRECTION : On explique à TypeScript à quoi ressemble un objet du jeu
interface Artifact {
  id: string;
  name: string;
  type: 'beni' | 'maudit';
}

// 2. On applique ce "moule" (Artifact) à notre liste de départ
const initialItems: Artifact[] = [
  { id: '1', name: 'Calice Fêlé', type: 'maudit' },
  { id: '2', name: 'Larme de Saint', type: 'beni' },
  { id: '3', name: 'Dague Rituelle', type: 'maudit' },
];

export default function Room1({ onSolve }: { onSolve: () => void }) {
  // 3. On précise que nos zones vont contenir des tableaux d'Artifacts (<Artifact[]>)
  const [inventory, setInventory] = useState<Artifact[]>(initialItems);
  const [sacredZone, setSacredZone] = useState<Artifact[]>([]);
  const [cursedZone, setCursedZone] = useState<Artifact[]>([]);
  const [message, setMessage] = useState("Séparez le sacré du corrompu pour ouvrir la herse.");

  // 4. On remplace 'item: any' par 'item: Artifact'
  const handleDragStart = (e: React.DragEvent, item: Artifact, source: string) => {
    e.dataTransfer.setData('item', JSON.stringify(item));
    e.dataTransfer.setData('source', source);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDrop = (e: React.DragEvent, targetZone: string) => {
    e.preventDefault();
    const item = JSON.parse(e.dataTransfer.getData('item'));
    const source = e.dataTransfer.getData('source');

    if (source === 'inventory') setInventory(prev => prev.filter(i => i.id !== item.id));
    if (source === 'beni') setSacredZone(prev => prev.filter(i => i.id !== item.id));
    if (source === 'maudit') setCursedZone(prev => prev.filter(i => i.id !== item.id));

    if (targetZone === 'beni') setSacredZone(prev => [...prev, item]);
    if (targetZone === 'maudit') setCursedZone(prev => [...prev, item]);
    if (targetZone === 'inventory') setInventory(prev => [...prev, item]);
  };

  const checkWinCondition = () => {
    if (inventory.length > 0) {
      setMessage("Il reste des artefacts à trier...");
      return;
    }
    
    const hasError = sacredZone.some(i => i.type !== 'beni') || cursedZone.some(i => i.type !== 'maudit');
    
    if (hasError) {
      setMessage("Le mal se mêle au bien... Triez à nouveau !");
    } else {
      setMessage("La herse se lève dans un grincement sinistre...");
      setTimeout(onSolve, 2000); 
    }
  };

  return (
    <div className="room-container pixel-art">
      <h2>Le Porche des Damnés</h2>
      <p style={{ color: message.includes('mal') ? '#8b0000' : '#b0a0b0' }}>{message}</p>

      <div className="puzzle-area">
        <div 
          className="drop-zone sacred-zone"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'beni')}
        >
          <h3>Sanctuaire</h3>
          {sacredZone.map(item => (
            <div key={item.id} className="artifact" draggable onDragStart={(e) => handleDragStart(e, item, 'beni')}>
              {item.name}
            </div>
          ))}
        </div>

        <div 
          className="drop-zone cursed-zone"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'maudit')}
        >
          <h3>Abysse</h3>
          {cursedZone.map(item => (
            <div key={item.id} className="artifact" draggable onDragStart={(e) => handleDragStart(e, item, 'maudit')}>
              {item.name}
            </div>
          ))}
        </div>
      </div>

      <div 
        className="inventory"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, 'inventory')}
      >
        {inventory.map(item => (
          <div key={item.id} className="artifact" draggable onDragStart={(e) => handleDragStart(e, item, 'inventory')}>
            {item.name}
          </div>
        ))}
      </div>

      <button onClick={checkWinCondition} className="gothic-button-ornate" style={{ fontSize: '2rem', marginTop: '30px' }}>
        Valider l'Offrande
      </button>
    </div>
  );
}