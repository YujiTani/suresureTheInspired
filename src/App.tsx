import { useState } from 'react';
import type { Card, Player } from './types';
import { BattleScreen } from './components/BattleScreen';
import { princessCards, princessStarterDeck } from './cards/princess';
import { kunoichiCards, kunoichiStarterDeck } from './cards/kunoichi';
import { sampleEnemies } from './data/sampleEnemies';
import './styles/battle.css';

type CharaKey = 'princess' | 'kunoichi';

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

export function App() {
  const [chara, setChara] = useState<CharaKey>('princess');
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
        <span className="reset-note">（切替でリセット）</span>
      </header>

      <BattleScreen
        key={chara}
        player={player}
        deck={resolveDeck(deck, cards)}
        enemies={sampleEnemies}
      />
    </>
  );
}
