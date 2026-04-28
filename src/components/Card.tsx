import type { Card as CardType } from '../types';
import { cardTypeLabel, cardRarityClass, cardFrameImage, formatCardEffect } from '../utils/cardDisplay';

interface Props {
  card: CardType;
  disabled: boolean;
  played: boolean;
  style?: React.CSSProperties;
  onClick: () => void;
}

export function Card({ card, disabled, played, style, onClick }: Props) {
  const rarityClass = cardRarityClass(card);
  const typeLabel = cardTypeLabel(card);
  const effects = formatCardEffect(card);
  const frameImage = cardFrameImage(card.rarity);

  const classes = [
    'card',
    rarityClass,
    disabled && 'disabled',
    played && 'played',
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} style={style} onClick={disabled ? undefined : onClick}>
      <div className="card-illu">
        {card.illustrationUrl
          ? <img src={card.illustrationUrl} alt={card.name} className="card-illu-img" />
          : <div className="card-illu-motif">{typeLabel}</div>
        }
      </div>
      <img className="card-frame" src={frameImage} alt="" />
      <div className="card-cost">{card.cost}</div>
      <div className="card-title">{card.name}</div>
      <div className="card-text">
        {effects.map((line, i) => <div key={i}>{line}</div>)}
      </div>
      <div className={`card-type ${typeLabel.toLowerCase()}`}>{typeLabel}</div>
    </div>
  );
}
