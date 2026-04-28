import { useState, useRef } from 'react';
import type { BattleState, Card, Enemy, Player } from '../types';
import { useDebugApi } from '../hooks/useDebugApi';
import { initBattle, playCard, endPlayerTurn, executeEnemyTurn, startPlayerTurn } from '../gameLogic';
import { EnemyArea } from './EnemyArea';
import { PlayerBar } from './PlayerBar';
import { CardArea } from './CardArea';
import { TurnBanner } from './TurnBanner';
import { LogPanel } from './LogPanel';
import type { FloatItem } from './DamageNumber';

interface Props {
  player: Player;
  deck: Card[];
  enemies: Enemy[];
}

function formatIntent(enemyState: BattleState['enemies'][number] | undefined): string {
  if (!enemyState?.nextAction) return '不明';
  const act = enemyState.nextAction;
  if (act.type === 'Attack' || act.type === 'QuickAttack') return `斬撃 ${act.value}`;
  if (act.type === 'Buff') return `強化 +${act.value}`;
  if (act.type === 'Debuff') return `弱体 ${act.value}`;
  if (act.type === 'Heal') return `回復 ${act.value}`;
  if (act.type === 'Summon') return '召喚';
  return act.type;
}

export function BattleScreen({ player, deck, enemies }: Props) {
  const [state, setState] = useState<BattleState>(() => initBattle(player, deck, enemies));
  const [floats, setFloats] = useState<FloatItem[]>([]);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [bannerTurn, setBannerTurn] = useState(1);
  const [logVisible, setLogVisible] = useState(true);
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
    const card = state.playerState.hand[handIndex];
    if (state.playerState.currentEnergy < card.cost) return;

    const prevHp = state.enemies.map(e => e.currentHp);
    const nextState = playCard(state, handIndex, 0);
    setState(nextState);
    addDamageFloats(nextState, prevHp);
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

  const { playerState, enemies: enemyStates, phase } = state;

  return (
    <div className="battle-screen">
      <div className="battle-bg" />
      <div className="moon" />
      <div className="ornate-frame" />

      <div className="battle-top-ui">
        <div className="game-title">Suresure The Inspired</div>
        <div className="control-buttons">
          <button className="icon-btn" onClick={() => setLogVisible(v => !v)}>{logVisible ? 'Log 非表示' : 'Log 表示'}</button>
        </div>
      </div>

      <div className="next-intent-banner">
        <span className="next-label">次の行動</span>
        <span className="next-value">{formatIntent(enemyStates[0])}</span>
      </div>

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

      {(phase === 'Victory' || phase === 'Defeat') && (
        <div className="phase-overlay">
          <div className={`phase-text ${phase.toLowerCase()}`}>
            {phase === 'Victory' ? 'Victory !' : 'Defeat ...'}
          </div>
        </div>
      )}
    </div>
  );
}
