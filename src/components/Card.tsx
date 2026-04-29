import type { Card as CardType } from '../types';
import { cardTypeLabel, cardRarityClass, cardFrameImage, formatCardEffect } from '../utils/cardDisplay';

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
 * カードのレイアウトとスタイルを定義し、カードのイラスト、コスト、フレーム、カテゴリ、テキストを表示します。
 * カードの状態（使用不可、プレイ済み）に応じてクラスを適用し、クリックイベントを処理します。
 * カードのイラストがない場合は、カードのタイプを示すモチーフを表示します。
 * カードのテキストは、カードの効果をフォーマットして表示します。
 */
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
      <div className="card-text-wrapper" >
        <div className='card-header'>
          <div className="card-cost">{card.cost}</div>
          <div className={`card-category ${typeLabel.toLowerCase()}`}>{typeLabel}</div>
        </div>
        <div className="card-text-panel">
          <div className="card-title">{card.name}</div>
          <div className="card-text">
            {effects.map((line, index) => <div key={index}>{line}</div>)}
          </div>
        </div>
      </div>
      <img className="card-frame" src={frameImage} alt={`${card.rarity} frame`} />
      <img className="card-illustration" src={card.illustration} alt={card.name} />
    </div>
  );
}
