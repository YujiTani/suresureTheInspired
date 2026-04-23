import { useState } from 'react';
import type { Card, Player } from './types';
import { BattleScreen } from './components/BattleScreen';
import { princessCards, princessStarterDeck } from './cards/princess';
import { kunoichiCards, kunoichiStarterDeck } from './cards/kunoichi';
import { enemies } from './data/sampleEnemies';
import './styles/battle.css';

type CharaKey = 'princess' | 'kunoichi';
type EnemyKey = keyof typeof enemies;

const CHARACTERS: Record<CharaKey, { player: Player; cards: Card[]; deck: string[] }> = {
  princess: {
    player: { name: '王女', maxHp: 80, startDeckNo: 1, illustrationUrl: null },
    cards: princessCards,
    deck: princessStarterDeck,
  },
  kunoichi: {
    player: { name: 'くのいち', maxHp: 70, startDeckNo: 2, illustrationUrl: null },
    cards: kunoichiCards,
    deck: kunoichiStarterDeck,
  },
};

function resolveDeck(deckIds: string[], cards: Card[]): Card[] {
  return deckIds.map(id => cards.find(c => c.id === id)!).filter(Boolean);
}

const ENEMY_LABELS: Record<EnemyKey, string> = {
  slime:     'スライム（易）',
  goblin:    'ゴブリン剣士（中）',
  oniShogun: '鬼将軍（難）',
};

export function App() {
  const [chara, setChara] = useState<CharaKey>('princess');
  const [enemyKey, setEnemyKey] = useState<EnemyKey>('slime');
  const { player, cards, deck } = CHARACTERS[chara];

  return (
    <>
      <header className="game-header">
        <span className="logo">▸ INSPIRED BY THE SPIRE</span>
        {(['princess', 'kunoichi'] as CharaKey[]).map(key => (
          <button
            key={key}
            className={`chara-btn${chara === key ? ' active' : ''}`}
            onClick={() => setChara(key)}
          >
            {CHARACTERS[key].player.name}
          </button>
        ))}
        <span className="reset-note" style={{ margin: '0 12px' }}>vs</span>
        {(Object.keys(enemies) as EnemyKey[]).map(key => (
          <button
            key={key}
            className={`chara-btn${enemyKey === key ? ' active' : ''}`}
            onClick={() => setEnemyKey(key)}
          >
            {ENEMY_LABELS[key]}
          </button>
        ))}
        <span className="reset-note">（切替でリセット）</span>
      </header>

      <BattleScreen
        key={`${chara}-${enemyKey}`}
        player={player}
        deck={resolveDeck(deck, cards)}
        enemies={[enemies[enemyKey]]}
      />
    </>
  );
}
