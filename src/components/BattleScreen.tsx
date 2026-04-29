import { useState, useRef } from 'react';
import type { BattleState, Card, Enemy, Player } from '../types';
import { useDebugApi } from '../hooks/useDebugApi';
import { initBattle, playCard, endPlayerTurn, executeEnemyTurn, startPlayerTurn } from '../gameLogic';
import { EnemyArea } from './EnemyArea';
import { PlayerBar } from './PlayerBar';
import { CardArea } from './CardArea';
import { TurnBanner } from './TurnBanner';
import { LogPanel } from './LogPanel';
import { CardChoiceModal } from './CardChoiceModal';
import { ukenagareshiVariants } from '../cards/normal';
import type { FloatItem } from './DamageNumber';

interface Props {
  player: Player;
  deck: Card[];
  enemies: Enemy[];
  startHp?: number;
  onVictory?: (remainingHp: number) => void;
  onDefeat?: () => void;
}

export function BattleScreen({ player, deck, enemies, startHp, onVictory, onDefeat }: Props) {
  const [state, setState] = useState<BattleState>(() => {
    const initial = initBattle(player, deck, enemies);
    if (startHp !== undefined && startHp <= 0) {
      throw new Error(`想定外のエラーが発生しました。 ${startHp} が 0 以下になっています`);
    }
    return {
      ...initial,
      playerState: {
        ...initial.playerState,
        currentHp: startHp ?? initial.playerState.currentHp,
      },
    };
  });
  const [floats, setFloats] = useState<FloatItem[]>([]);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [bannerTurn, setBannerTurn] = useState(1);
  const [logVisible, setLogVisible] = useState(false);
  const [pendingHandIndex, setPendingHandIndex] = useState<number | null>(null);
  const floatCounter = useRef(0);
  useDebugApi(setState);

  function addDamageFloats(nextState: BattleState, prevHp: number[]) {
    const damages = nextState.enemies.map((e, i) => prevHp[i] - e.currentHp);
    const newItems: FloatItem[] = damages
      .filter(d => d > 0)
      .map(d => ({ id: ++floatCounter.current, text: `-${d}` }));
    if (newItems.length === 0) return;
    setFloats(f => [...f, ...newItems]);
    const ids = newItems.map(x => x.id);
    setTimeout(() => setFloats(f => f.filter(x => !ids.includes(x.id))), 1000);
  }

  function handleCardClick(handIndex: number) {
    if (state.phase !== 'PlayerTurn') return;
    if (pendingHandIndex !== null) return;
    const card = state.playerState.hand[handIndex];
    if (state.playerState.currentEnergy < card.cost) return;

    if (card.id === 'P018') {
      setPendingHandIndex(handIndex);
      return;
    }

    const prevHp = state.enemies.map(enemy => enemy.currentHp);
    const nextState = playCard(state, handIndex, 0);
    setState(nextState);
    addDamageFloats(nextState, prevHp);
  }

  function handleCardChoice(chosenCard: Card) {
    if (pendingHandIndex === null) return;
    const handIndex = pendingHandIndex;
    setPendingHandIndex(null);

    const originalCard = state.playerState.hand[handIndex];
    const prevHp = state.enemies.map(enemy => enemy.currentHp);

    const stateWithChoice: BattleState = {
      ...state,
      playerState: {
        ...state.playerState,
        hand: state.playerState.hand.map((handCard, index) =>
          index === handIndex ? chosenCard : handCard
        ),
      },
    };
    const playedState = playCard(stateWithChoice, handIndex, 0);

    // Victory/Defeat 時は playCard が early return し discardPile に変種が積まれていないので復元不要
    const restoredState: BattleState = playedState.phase === 'PlayerTurn'
      ? {
        ...playedState,
        playerState: {
          ...playedState.playerState,
          discardPile: [...playedState.playerState.discardPile.slice(0, -1), originalCard],
        },
      }
      : playedState;

    setState(restoredState);
    addDamageFloats(restoredState, prevHp);
  }

  function handleEndTurn() {
    let s = endPlayerTurn(state);
    s = executeEnemyTurn(s);
    if (s.phase === 'PlayerTurn') s = startPlayerTurn(s);
    setState(s);

    setBannerTurn(s.turn);
    setBannerVisible(true);
    setTimeout(() => setBannerVisible(false), 1400);
  }

  const { playerState, enemies: enemyStates, phase, turn } = state;

  return (
    <div className="battle-screen">
      {enemyStates[0] && (
        <EnemyArea
          enemyState={enemyStates[0]}
          floats={floats}
          shaking={false}
        />
      )}

      <PlayerBar player={player} playerState={playerState} />

      <CardArea
        hand={playerState.hand}
        deckCount={playerState.deck.length}
        discardCount={playerState.discardPile.length}
        currentEnergy={playerState.currentEnergy}
        playedIndex={null}
        phase={phase}
        onCardClick={handleCardClick}
        onEndTurn={handleEndTurn}
      />

      <TurnBanner turn={bannerTurn} visible={bannerVisible} />
      {logVisible && <LogPanel log={state.log} />}

      <div style={{
        position: 'absolute', top: 48, right: 12, zIndex: 110,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <button className="log-toggle-btn" onClick={() => setLogVisible(v => !v)}>
          {logVisible ? 'LOG ▲' : 'LOG ▼'}
        </button>
        <span style={{ fontFamily: 'Cinzel, serif', fontSize: 10, color: '#6e6880', letterSpacing: '.3em' }}>
          TURN {turn}
        </span>
      </div>

      {pendingHandIndex !== null && (
        <CardChoiceModal
          cards={ukenagareshiVariants}
          title="受け流し"
          onSelect={handleCardChoice}
          onCancel={() => setPendingHandIndex(null)}
        />
      )}

      {(phase === 'Victory' || phase === 'Defeat') && (
        <div className="phase-overlay">
          <div className={`phase-text ${phase.toLowerCase()}`}>
            {phase === 'Victory' ? 'Victory !' : 'Defeat ...'}
          </div>
          <div className="phase-actions">
            {phase === 'Victory' && onVictory && (
              <button
                className="phase-btn victory-btn"
                onClick={() => onVictory(playerState.currentHp)}
              >
                マップへ戻る
              </button>
            )}
            {phase === 'Defeat' && onDefeat && (
              <button
                className="phase-btn defeat-btn"
                onClick={onDefeat}
              >
                タイトルへ戻る
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
