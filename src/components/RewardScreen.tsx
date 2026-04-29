import type { Card as CardType } from '../types';
import { Card } from './Card';

interface Props {
  candidates: CardType[];
  onSelect: (card: CardType) => void;
  onSkip: () => void;
}

export function RewardScreen({ candidates, onSelect, onSkip }: Props) {
  return (
    <div className="reward-screen">
      <div className="reward-title">— 報酬 —</div>
      <div className="reward-subtitle">カードを1枚選んでデッキに加えよ</div>

      <div className="reward-cards">
        {candidates.map(card => (
          <Card
            key={card.id}
            card={card}
            disabled={false}
            played={false}
            onClick={() => onSelect(card)}
          />
        ))}
      </div>

      <button className="reward-skip-btn" onClick={onSkip}>
        スキップ
      </button>
    </div>
  );
}
