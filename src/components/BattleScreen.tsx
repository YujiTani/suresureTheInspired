import { useState, useRef, useEffect } from 'react';
import type { BattleState, Card, Enemy, EnemyStrength, Player } from '../types';
import { useDebugApi } from '../hooks/useDebugApi';
import { initBattle, playCard, endPlayerTurn, executeEnemyTurn, startPlayerTurn, applyEffectToPlayer, applyEffectToTarget, checkBattleResult } from '../gameLogic';
import { getCardEffectSteps, resolveEffectCategory } from '../utils/effectCategory';
import { playSE, playEnemyAttackSE } from '../utils/playSE';
import { DamageNumber } from './DamageNumber';
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
  nodeType: EnemyStrength;
  onVictory?: (remainingHp: number) => void;
  onDefeat?: () => void;
  bgmEnabled: boolean;
  bgmVolume: number;
  onToggleBgm: () => void;
  onChangeBgmVolume: (volume: number) => void;
  seEnabled: boolean;
  seVolume: number;
  onToggleSe: () => void;
  onChangeSEVolume: (volume: number) => void;
}

export function BattleScreen({ player, deck, enemies, startHp, nodeType, onVictory, onDefeat, bgmEnabled, bgmVolume, onToggleBgm, onChangeBgmVolume, seEnabled, seVolume, onToggleSe, onChangeSEVolume }: Props) {
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
  const [playerFloats, setPlayerFloats] = useState<FloatItem[]>([]);
  const [screenShaking, setScreenShaking] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [bannerTurn, setBannerTurn] = useState(1);
  const [logVisible, setLogVisible] = useState(false);
  const [pendingHandIndex, setPendingHandIndex] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const floatCounter = useRef(0);
  const playerFloatCounter = useRef(0);
  useDebugApi(setState);

  const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));
  const SPECIAL_CARD_IDS = new Set(['K004', 'K010', 'K011']);

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

  async function handleCardClick(handIndex: number) {
    if (state.phase !== 'PlayerTurn' || isAnimating) return;
    if (pendingHandIndex !== null) return;
    const card = state.playerState.hand[handIndex];
    if (state.playerState.currentEnergy < card.cost) return;

    if (card.id === 'P018') {
      setPendingHandIndex(handIndex);
      return;
    }

    setIsAnimating(true);

    if (SPECIAL_CARD_IDS.has(card.id)) {
      playSE(resolveEffectCategory(card));
      const prevHp = state.enemies.map(enemy => enemy.currentHp);
      const nextState = playCard(state, handIndex, 0);
      setState(nextState);
      addDamageFloats(nextState, prevHp);
      setIsAnimating(false);
      return;
    }

    // エネルギー消費・手札から除去を即時反映
    let currentState: BattleState = {
      ...state,
      playerState: {
        ...state.playerState,
        currentEnergy: state.playerState.currentEnergy - card.cost,
        hand: state.playerState.hand.filter((_, index) => index !== handIndex),
      },
    };
    setState(currentState);

    const prevHp = currentState.enemies.map(enemy => enemy.currentHp);

    for (const step of getCardEffectSteps(card)) {
      if (step.applyTo === 'player') {
        currentState = applyEffectToPlayer(currentState, step.effectKey, step.value);
      } else {
        currentState = applyEffectToTarget(currentState, step.effectKey, step.value, card.target, 0);
      }
      playSE(step.category);
      setState(currentState);
      await delay(300);
    }

    currentState = {
      ...currentState,
      phase: checkBattleResult(currentState),
      playerState: {
        ...currentState.playerState,
        discardPile: [...currentState.playerState.discardPile, card],
      },
    };

    setState(currentState);
    addDamageFloats(currentState, prevHp);
    setIsAnimating(false);
  }

  function handleCardChoice(chosenCard: Card) {
    if (pendingHandIndex === null) return;
    if (isAnimating) return;
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

  function addPlayerDamageFloats(prevHp: number, prevShield: number, nextState: BattleState) {
    const hpLost = prevHp - nextState.playerState.currentHp;
    const shieldLost = prevShield - nextState.playerState.shield;
    const newItems: FloatItem[] = [];
    if (hpLost > 0) {
      newItems.push({ id: ++playerFloatCounter.current, text: `-${hpLost}`, color: 'red' });
    } else if (shieldLost > 0) {
      newItems.push({ id: ++playerFloatCounter.current, text: `-${shieldLost}`, color: 'blue' });
    }
    if (newItems.length === 0) return;
    setPlayerFloats(prev => [...prev, ...newItems]);
    const ids = newItems.map(x => x.id);
    setTimeout(() => setPlayerFloats(prev => prev.filter(x => !ids.includes(x.id))), 1000);
  }

  function handleEndTurn() {
    if (isAnimating) return;

    const prevPlayerHp = state.playerState.currentHp;
    const prevPlayerShield = state.playerState.shield;
    const enemyAction = state.enemies[0]?.nextAction;
    const isAttackAction = enemyAction?.type === 'Attack' ||
      enemyAction?.type === 'QuickAttack' ||
      enemyAction?.type === 'DrainDraw' ||
      enemyAction?.type === 'ShieldAttack' ||
      enemyAction?.type === 'DoubleAction';

    let nextState = endPlayerTurn(state);
    nextState = executeEnemyTurn(nextState);
    const stateAfterEnemy = nextState;
    if (nextState.phase === 'PlayerTurn') nextState = startPlayerTurn(nextState);
    setState(nextState);

    if (isAttackAction) {
      playEnemyAttackSE();
      setScreenShaking(true);
      setTimeout(() => setScreenShaking(false), 400);
    }

    addPlayerDamageFloats(prevPlayerHp, prevPlayerShield, stateAfterEnemy);

    setBannerTurn(nextState.turn);
    setBannerVisible(true);
    setTimeout(() => setBannerVisible(false), 1400);
  }

  const { playerState, enemies: enemyStates, phase, turn } = state;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // E キーでターン終了
      if (e.key === 'e' || e.key === 'E') {
        handleEndTurn();
      }

      // spaceでカード使用
      if (e.key === ' ' && phase === 'PlayerTurn') {
        e.preventDefault();
        if (playerState.hand.length > 0) {
          handleCardClick(0);
        }
      }

      // tabキーでログ表示切替
      if (e.key === 'Tab') {
        e.preventDefault();
        setLogVisible(v => !v);
      }
    }
    addEventListener('keydown', handleKeyDown);

    return () => {
      removeEventListener('keydown', handleKeyDown);
    }
  }, [phase, playerState.hand, handleEndTurn, handleCardClick, setLogVisible, setPendingHandIndex]);


  return (
    <div className={`battle-screen${screenShaking ? ' player-hit' : ''}`}>
      {enemyStates[0] && (
        <EnemyArea
          enemyState={enemyStates[0]}
          floats={floats}
          shaking={false}
          nodeType={nodeType}
        />
      )}

      <PlayerBar player={player} playerState={playerState} />
      <div className="player-float-layer">
        <DamageNumber items={playerFloats} />
      </div>

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
        <button className="log-toggle-btn" onClick={onToggleBgm}>{bgmEnabled ? 'BGM ON' : 'BGM OFF'}</button>
        <input type="range" min={0} max={100} value={Math.round(bgmVolume * 100)} onChange={e => onChangeBgmVolume(Number(e.target.value) / 100)} />
        <button className="log-toggle-btn" onClick={onToggleSe}>{seEnabled ? 'SE ON' : 'SE OFF'}</button>
        <input type="range" min={0} max={100} value={Math.round(seVolume * 100)} onChange={e => onChangeSEVolume(Number(e.target.value) / 100)} />
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
