import { useState, useMemo } from 'react';
import type { Card, Attribute } from '../types';

const EMBER_COLORS = [
  '#f0d488', '#c9a35a', '#ffe87a',
  '#ff9a3c', '#ff6b6b', '#ffffff', '#ffd6a5',
];

interface EmberParticle {
  id: number;
  x: string;
  size: string;
  duration: string;
  delay: string;
  drift: string;
  height: string;
  color: string;
}

function generateEmbers(count: number): EmberParticle[] {
  return Array.from({ length: count }, (_, index) => {
    const isSpark = Math.random() < 0.6;
    return {
      id: index,
      x: `${Math.random() * 100}%`,
      size: isSpark ? `${1.5 + Math.random() * 1.5}px` : `${3 + Math.random() * 3}px`,
      duration: isSpark ? `${2 + Math.random() * 3}s` : `${8 + Math.random() * 6}s`,
      delay: `${Math.random() * 8}s`,
      drift: `${(Math.random() - 0.5) * (isSpark ? 40 : 100)}px`,
      height: `-${20 + Math.random() * 80}vh`,
      color: EMBER_COLORS[Math.floor(Math.random() * EMBER_COLORS.length)],
    };
  });
}

const ATTR_ABBR: Record<Attribute, string> = {
  Attack: 'ATK',
  Defense: 'DEF',
  Skill: 'SKL',
  Power: 'PWR',
};

function calcDeckStats(deck: Card[]) {
  const attributeCounts: Record<Attribute, number> = {
    Attack: 0, Defense: 0, Skill: 0, Power: 0,
  };
  let totalCost = 0;
  for (const card of deck) {
    attributeCounts[card.attribute] += 1;
    totalCost += card.cost;
  }
  const avgCost = (totalCost / deck.length).toFixed(1);
  return { attributeCounts, avgCost };
}

export interface CharaOption {
  key: string;
  name: string;
  archetype: string;
  tagline: string;
  maxHp: number;
  illustrationUrl: string | null;
  starterDeck: Card[];
}

interface CharacterSelectScreenProps {
  characters: CharaOption[];
  initialSelected: string;
  onConfirm: (key: string) => void;
  onBack: () => void;
}

export function CharacterSelectScreen({
  characters,
  initialSelected,
  onConfirm,
  onBack,
}: CharacterSelectScreenProps) {
  const [selected, setSelected] = useState(initialSelected);
  const embers = useMemo(() => generateEmbers(80), []);

  function handleCharacterClick(key: string) {
    if (selected === key) {
      onConfirm(key);
    } else {
      setSelected(key);
    }
  }

  // TODO(human): useEffect でキーボードハンドラを登録してください
  //   - ArrowLeft  → characters[0].key を選択
  //   - ArrowRight → characters[1].key を選択
  //   - Enter      → onConfirm(selected)
  //   - Escape     → onBack()
  //   ※ クリーンアップ関数で removeEventListener を忘れずに
  //   ヒント: useEffect の依存配列は [selected, onConfirm, onBack, characters]

  const selectedChara = characters.find(chara => chara.key === selected)!;
  const { attributeCounts, avgCost } = calcDeckStats(selectedChara.starterDeck);

  return (
    <div className="cs-screen">
      <button className="cs-back-btn" onClick={onBack}>← BACK</button>
      <div className="cs-embers">
        {embers.map(ember => (
          <div
            key={ember.id}
            className="title-ember"
            style={
              {
                '--ember-x': ember.x,
                '--ember-size': ember.size,
                '--ember-duration': ember.duration,
                '--ember-delay': ember.delay,
                '--ember-drift': ember.drift,
                '--ember-height': ember.height,
                '--ember-color': ember.color,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
      <div className="cs-header">CHARACTER SELECT</div>
      <div className="cs-stage">
        {characters.map(chara => (
          <div
            key={chara.key}
            className={`cs-chara ${selected === chara.key ? 'selected' : 'unselected'}`}
            onClick={() => handleCharacterClick(chara.key)}
          >
            <div className="cs-halo" />
            {chara.illustrationUrl && (
              <img
                className="cs-chara-img"
                src={chara.illustrationUrl}
                alt={chara.name}
              />
            )}
            <div className="cs-chara-info">
              <div className="cs-chara-name">{chara.name}</div>
              <div className="cs-archetype">{chara.archetype}</div>
              <div className="cs-tagline">{chara.tagline}</div>
              <div className="cs-chara-hp">HP {chara.maxHp}</div>
            </div>
          </div>
        ))}
      </div>
      <aside className="cs-deck-panel">
        <div className="cs-deck-title">STARTER DECK</div>
        <div className="cs-deck-stats">
          {(Object.entries(attributeCounts) as [Attribute, number][])
            .filter(([, count]) => count > 0)
            .map(([attr, count]) => (
              <span key={attr} className={`cs-deck-stat-badge cs-attr-${attr.toLowerCase()}`}>
                {ATTR_ABBR[attr]}×{count}
              </span>
            ))}
          <span className="cs-deck-avg">AVG {avgCost}</span>
        </div>
        <ul className="cs-deck-list">
          {selectedChara.starterDeck.map((card, index) => (
            <li key={`${card.id}-${index}`} className="cs-deck-row">
              <span className="cs-deck-cost">{card.cost}</span>
              <span className="cs-deck-name">{card.name}</span>
              <span className={`cs-deck-attr-bar cs-attr-${card.attribute.toLowerCase()}`} />
            </li>
          ))}
        </ul>
      </aside>
      <div className="cs-hint">クリックで選択 • もう一度クリックで決定 • ← → Enter</div>
    </div>
  );
}
