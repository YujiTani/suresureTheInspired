import type { Card as CardType, Rarity } from '../types';
import { cardTypeLabel, cardRarityClass, formatCardEffect } from '../utils/cardDisplay';

interface FrameProps {
  rarity: Rarity;
}

function CardFrame({ rarity }: FrameProps) {
  const densityMap: Record<Rarity, number> = { Common: 1, Uncommon: 2, Rare: 3, Epic: 4 };
  const density = densityMap[rarity] ?? 1;
  const isEpic = rarity === 'Epic';

  const corners = [
    { x: 4,   y: 4,   rot: 0 },
    { x: 256, y: 4,   rot: 90 },
    { x: 256, y: 386, rot: 180 },
    { x: 4,   y: 386, rot: 270 },
  ];

  const vineYPositions = [90, 130, 170, 210, 250, 290];

  return (
    <svg viewBox="0 0 260 390" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`gold-${rarity}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity=".95"/>
          <stop offset=".5" stopColor="currentColor" stopOpacity=".7"/>
          <stop offset="1" stopColor="currentColor" stopOpacity=".95"/>
        </linearGradient>
        {isEpic && (
          <radialGradient id="epicHalo">
            <stop offset="0" stopColor="#f3bcff" stopOpacity=".9"/>
            <stop offset=".6" stopColor="#d966ff" stopOpacity=".3"/>
            <stop offset="1" stopColor="#d966ff" stopOpacity="0"/>
          </radialGradient>
        )}
      </defs>

      {/* Outer border */}
      <rect className="stroke" x="4" y="4" width="252" height="382" fill="none" strokeWidth="1.2"/>
      <rect className="stroke" x="8" y="8" width="244" height="374" fill="none" strokeWidth=".5" opacity=".55"/>

      {/* Top crest */}
      <g className="stroke" fill="none" strokeWidth="1" strokeLinecap="round">
        <path d="M130 4 L 130 14" strokeWidth=".6"/>
        <path className="fill" stroke="none" d="M130 16 q -4 -4 0 -8 q 4 4 0 8 z"/>
        <path d="M100 8 Q 130 -2 160 8"/>
        <path d="M90 12 Q 130 2 170 12" opacity=".7"/>
        <path d="M108 9 q -2 -4 -6 -5 q 0 5 6 5 z"  className="fill" stroke="none" opacity=".8"/>
        <path d="M118 8 q -2 -4 -6 -4 q 0 4 6 4 z"  className="fill" stroke="none" opacity=".8"/>
        <path d="M126 7 q -2 -4 -5 -4 q 0 4 5 4 z"  className="fill" stroke="none" opacity=".75"/>
        <path d="M152 9 q 2 -4 6 -5 q 0 5 -6 5 z"   className="fill" stroke="none" opacity=".8"/>
        <path d="M142 8 q 2 -4 6 -4 q 0 4 -6 4 z"   className="fill" stroke="none" opacity=".8"/>
        <path d="M134 7 q 2 -4 5 -4 q 0 4 -5 4 z"   className="fill" stroke="none" opacity=".75"/>
        <circle cx="130" cy="10" r={density >= 3 ? 3 : 2} className="fill" stroke="none"/>
        {density >= 3 && <circle cx="130" cy="10" r="5" fill="none" strokeWidth=".4" opacity=".6"/>}
        {density >= 4 && <circle cx="130" cy="10" r="8" fill="none" strokeWidth=".3" opacity=".4"/>}
      </g>

      {/* Four corner flourishes */}
      {corners.map((corner, index) => (
        <g key={index} transform={`translate(${corner.x} ${corner.y}) rotate(${corner.rot})`}>
          <g className="stroke" fill="none" strokeWidth="1" strokeLinecap="round">
            <path d="M0 30 C 3 15, 15 3, 30 0"/>
            <path d="M6 36 C 9 21, 21 9, 36 6" opacity=".6" strokeWidth=".7"/>
            <path d="M0 46 q 14 -4 20 -14 q 6 -10 20 -14" opacity=".6" strokeWidth=".7"/>
            <path d="M14 14 q 6 -2 10 2 q 4 4 2 10 q -4 -2 -8 -6 q -4 -4 -4 -6 z" className="fill" stroke="none" opacity=".55"/>
            <path d="M28 8 q 2 -2 5 0 q -1 4 -5 4 q 0 -2 0 -4 z" className="fill" stroke="none" opacity=".6"/>
            <path d="M8 28 q -2 2 0 5 q 4 -1 4 -5 q -2 0 -4 0 z"  className="fill" stroke="none" opacity=".6"/>
            <circle cx="30" cy="30" r="1.4" className="fill" stroke="none"/>
            {density >= 2 && <circle cx="22" cy="22" r=".9" className="fill" stroke="none" opacity=".7"/>}
            {density >= 2 && <circle cx="16" cy="16" r=".7" className="fill" stroke="none" opacity=".6"/>}
            {density >= 3 && (
              <>
                <path d="M12 24 q 4 0 6 4" strokeWidth=".5" opacity=".6"/>
                <path d="M24 12 q 0 4 4 6" strokeWidth=".5" opacity=".6"/>
              </>
            )}
            {density >= 4 && (
              <>
                <path d="M4 40 q 10 -2 14 -10 q 4 -8 10 -8" strokeWidth=".5" opacity=".55"/>
                <circle cx="40" cy="4" r=".6" className="fill" stroke="none" opacity=".6"/>
                <circle cx="4" cy="40" r=".6" className="fill" stroke="none" opacity=".6"/>
              </>
            )}
          </g>
        </g>
      ))}

      {/* Side vine panels (uncommon+) */}
      {density >= 2 && (
        <>
          <g className="stroke" fill="none" strokeWidth=".8" strokeLinecap="round">
            <path d="M6 80 Q 2 140 6 200 Q 10 260 6 320" opacity=".55"/>
            {vineYPositions.map((y, i) => (
              <g key={i}>
                <path d={`M6 ${y} q -4 -4 -2 -10 q 6 -2 8 4 q -2 6 -6 6 z`} className="fill" stroke="none" opacity=".55"/>
                <circle cx="6" cy={y + 10} r=".8" className="fill" stroke="none" opacity=".7"/>
              </g>
            ))}
          </g>
          <g className="stroke" fill="none" strokeWidth=".8" strokeLinecap="round">
            <path d="M254 80 Q 258 140 254 200 Q 250 260 254 320" opacity=".55"/>
            {vineYPositions.map((y, i) => (
              <g key={i}>
                <path d={`M254 ${y} q 4 -4 2 -10 q -6 -2 -8 4 q 2 6 6 6 z`} className="fill" stroke="none" opacity=".55"/>
                <circle cx="254" cy={y + 10} r=".8" className="fill" stroke="none" opacity=".7"/>
              </g>
            ))}
          </g>
        </>
      )}

      {/* Dividers around illustration */}
      <g className="stroke" strokeWidth=".6" opacity=".6">
        <line x1="24" y1="226" x2="236" y2="226"/>
        <line x1="24" y1="232" x2="236" y2="232" opacity=".3"/>
        <circle cx="24"  cy="229" r="1.2" className="fill" stroke="none"/>
        <circle cx="236" cy="229" r="1.2" className="fill" stroke="none"/>
        <circle cx="130" cy="229" r="1.6" className="fill" stroke="none"/>
        {density >= 3 && (
          <>
            <path d="M90 229 l 4 -3 l 4 3 l -4 3 z"  className="fill" stroke="none" opacity=".7"/>
            <path d="M162 229 l 4 -3 l 4 3 l -4 3 z" className="fill" stroke="none" opacity=".7"/>
          </>
        )}
      </g>

      {/* Bottom crest */}
      <g className="stroke" fill="none" strokeWidth="1" strokeLinecap="round">
        <path d="M100 386 Q 130 378 160 386" opacity=".7"/>
        <path d="M90 382 Q 130 372 170 382" opacity=".5" strokeWidth=".6"/>
        <path d="M130 378 l 5 -4 l -5 -4 l -5 4 z" className="fill" stroke="none"/>
        {density >= 3 && (
          <>
            <circle cx="130" cy="374" r="1.5" className="fill" stroke="none" opacity=".8"/>
            <path d="M110 378 q 4 -4 8 0" strokeWidth=".5" opacity=".5"/>
            <path d="M142 378 q 4 4 8 0" strokeWidth=".5" opacity=".5"/>
          </>
        )}
      </g>

      {/* Epic extras */}
      {isEpic && (
        <>
          <circle cx="130" cy="195" r="70" fill="url(#epicHalo)" opacity=".25"/>
          <g className="stroke" fill="none" strokeWidth=".6" opacity=".6">
            <path d="M22 120 q 10 -8 20 0 q 10 8 20 0"/>
            <path d="M238 120 q -10 -8 -20 0 q -10 8 -20 0"/>
            <path d="M22 270 q 10 8 20 0 q 10 -8 20 0"/>
            <path d="M238 270 q -10 8 -20 0 q -10 -8 -20 0"/>
          </g>
        </>
      )}
    </svg>
  );
}

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

  const classes = [
    'card',
    rarityClass,
    disabled && 'disabled',
    played && 'played',
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} style={style} onClick={disabled ? undefined : onClick}>
      <div className="card-inner" />
      <div className="frame">
        <CardFrame rarity={card.rarity} />
      </div>
      <div className="card-cost">{card.cost}</div>
      <div className="card-title">{card.name}</div>
      <div className="card-illu">
        <div className="card-illu-stripes" />
        <div className="card-illu-motif">{typeLabel}</div>
      </div>
      <div className="card-text">
        {effects.map((line, i) => <div key={i}>{line}</div>)}
      </div>
      <div className={`card-type ${typeLabel.toLowerCase()}`}>{typeLabel}</div>
    </div>
  );
}
