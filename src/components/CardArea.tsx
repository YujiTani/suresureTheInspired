import type { Card as CardType } from '../types';
import { Card } from './Card';

interface Props {
  hand: CardType[];
  deckCount: number;
  discardCount: number;
  currentEnergy: number;
  playedIndex: number | null;
  phase: string;
  onCardClick: (index: number) => void;
  onEndTurn: () => void;
}

export function CardArea({ hand, deckCount, discardCount, currentEnergy, playedIndex, phase, onCardClick, onEndTurn }: Props) {
  const total = hand.length;

  return (
    <div className="card-area">
      <div className="pile draw-pile">
        <div className="pile-icon">📋</div>
        <div className="pile-label">Draw</div>
        <div className="pile-count">{deckCount}</div>
      </div>

      <div className="pile discard-pile">
        <div className="pile-icon">⚰</div>
        <div className="pile-label">Discard</div>
        <div className="pile-count">{discardCount}</div>
      </div>

      <div className="hand">
        {hand.map((card, i) => {
          const spread = total <= 1 ? 0 : (i - (total - 1) / 2) / (total - 1);
          const rot = spread * 10;
          const lift = Math.abs(spread) * 28;
          return (
            <Card
              key={`${card.id}-${i}`}
              card={card}
              disabled={phase !== 'PlayerTurn' || currentEnergy < card.cost}
              played={playedIndex === i}
              style={{ transform: `translateY(${lift}px) rotate(${rot}deg)` }}
              onClick={() => onCardClick(i)}
            />
          );
        })}
      </div>

      {phase === 'PlayerTurn' && (
        <button className="end-turn-btn" onClick={onEndTurn}>
          Turn End
        </button>
      )}
    </div>
  );
}
