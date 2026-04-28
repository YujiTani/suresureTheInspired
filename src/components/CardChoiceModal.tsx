import { useEffect } from 'react';
import type { Card } from '../types';
import { Card as CardComponent } from './Card';

interface Props {
  cards: Card[];
  title: string;
  onSelect: (chosenCard: Card) => void;
  onCancel: () => void;
}

export function CardChoiceModal({ cards, title, onSelect, onCancel }: Props) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onCancel();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  const sharedDescription = cards[0]?.description ?? '';

  return (
    <div className="card-choice-overlay" onClick={onCancel}>
      <div className="card-choice-panel" onClick={(event) => event.stopPropagation()}>
        <div className="card-choice-title">{title}</div>
        <p className="card-choice-description">{sharedDescription}</p>
        <div className="card-choice-list">
          {cards.map((card) => (
            <CardComponent
              key={card.id}
              card={card}
              disabled={false}
              played={false}
              onClick={() => onSelect(card)}
            />
          ))}
        </div>
        <div className="card-choice-hint">ESC でキャンセル</div>
      </div>
    </div>
  );
}
