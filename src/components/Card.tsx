import type { Card as CardType } from '../types';
import { cardTypeLabel, cardRarityClass, cardFrameImage } from '../utils/cardDisplay';

interface Props {
  card: CardType;
  disabled: boolean;
  played: boolean;
  style?: React.CSSProperties;
  onClick: () => void;
}

/**
 * カードコンポーネント
 * @param card カードデータ
 * @param disabled カードが使用不可かどうか
 * @param played カードがすでにプレイされたかどうか
 * @param style カスタムスタイル
 * @param onClick カードがクリックされたときのハンドラー
 * @return カードのJSX要素
 */
export function Card({ card, disabled, played, style, onClick }: Props) {
  const rarityClass = cardRarityClass(card);
  const typeLabel = cardTypeLabel(card);
  const frameImage = cardFrameImage(card.rarity);
  const cardArtPositionStyle = card.cardArtPosition
    ? { top: card.cardArtPosition.top, left: card.cardArtPosition.left }
    : undefined;

  const classes = [
    'card',
    rarityClass,
    disabled && 'disabled',
    played && 'played',
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} style={style} onClick={disabled ? undefined : onClick}>
      <div className="card-illu">
        {card.img
          ? <img className="card-illu-img" style={cardArtPositionStyle} src={card.img} alt={card.name} />
          : <div className="card-illu-motif">{typeLabel}</div>
        }
      </div>
      <img className="card-frame" src={frameImage} alt={`${card.rarity} frame`} />
      <div className="card-cost">{card.cost}</div>
      <div className="card-category-list">
        <div className={`card-category ${card.attribute.toLowerCase()} active`}>{typeLabel}</div>
      </div>
      <div className="card-text-panel">
        <div className="card-title">{card.name}</div>
        <div className="card-text">
          {card.description}
        </div>
      </div>
    </div>
  );
}
