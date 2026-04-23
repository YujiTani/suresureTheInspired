import type {
  Card,
  Player,
  Enemy,
  EnemyAction,
  CombatantState,
  PlayerBattleState,
  EnemyBattleState,
  BattleState,
  TurnPhase,
  StatusEffect,
} from './types';

const INITIAL_ENERGY = 3;
const INITIAL_HAND_SIZE = 5;

// --- Utilities (Claude) ---

export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function dealDamage(target: CombatantState, damage: number): CombatantState {
  const shieldDamage = Math.min(target.shield, damage);
  const hpDamage = damage - shieldDamage;
  return {
    ...target,
    shield: target.shield - shieldDamage,
    currentHp: Math.max(0, target.currentHp - hpDamage),
  };
}

export function addShield(target: CombatantState, shield: number): CombatantState {
  return { ...target, shield: target.shield + shield };
}

export function healHp(target: CombatantState, amount: number, maxHp: number): CombatantState {
  return { ...target, currentHp: Math.min(maxHp, target.currentHp + amount) };
}

export function calculateDamage(baseDamage: number, attackerWeak: number, targetVulnerable: number): number {
  let currentDamage = baseDamage;
  if (attackerWeak >= 1) {
    currentDamage = Math.floor(currentDamage * 0.75);
  }

  if (targetVulnerable >= 1) {
    currentDamage = Math.floor(currentDamage * 1.5);
  }

  return currentDamage;
}

function applyEffectToPlayer(state: BattleState, effect: StatusEffect, value: number): BattleState {
  const p = state.playerState;
  switch (effect) {
    case 'HP':
      return value < 0
        ? { ...state, playerState: dealDamage(p, Math.abs(value)) as PlayerBattleState }
        : { ...state, playerState: healHp(p, value, state.player.maxHp) as PlayerBattleState };
    case 'Shield':
      return { ...state, playerState: addShield(p, value) as PlayerBattleState };
    case 'DeckDraw':
      return { ...state, playerState: drawCards(p, value) };
    case 'AttackPower':
      return { ...state, playerState: { ...p, attackPower: p.attackPower + value } };
    case 'DefensePower':
      return { ...state, playerState: { ...p, defensePower: p.defensePower + value } };
    case 'Ki':
      return { ...state, playerState: { ...p, ki: Math.max(0, p.ki + value) } };
    case 'Weak':
      return { ...state, playerState: { ...p, weak: Math.max(0, p.weak + value) } };
    case 'Vulnerable':
      return { ...state, playerState: { ...p, vulnerable: Math.max(0, p.vulnerable + value) } };
    case 'Phantom':
      return { ...state, playerState: { ...p, phantom: Math.max(0, p.phantom + value) } };
    case 'ActionCount':
      return { ...state, playerState: { ...p, actionCount: p.actionCount + value } };
    case 'DiscardDraw':
      return { ...state, playerState: { ...p, discardDrawDelta: p.discardDrawDelta + value } };
    default:
      return state;
  }
}

function applyEffectToEnemy(
  enemy: EnemyBattleState,
  effect: StatusEffect,
  value: number,
  attackerWeak: number
): EnemyBattleState {
  switch (effect) {
    case 'HP': {
      const dmg = calculateDamage(Math.abs(value), attackerWeak, enemy.vulnerable);
      return dealDamage(enemy, dmg) as EnemyBattleState;
    }
    case 'Weak':
      return { ...enemy, weak: Math.max(0, enemy.weak + value) };
    case 'Vulnerable':
      return { ...enemy, vulnerable: Math.max(0, enemy.vulnerable + value) };
    default:
      return enemy;
  }
}

function applyEffectToTarget(
  state: BattleState,
  effect: StatusEffect,
  value: number,
  target: Card['target'],
  targetEnemyIndex?: number
): BattleState {
  const attackerWeak = state.playerState.weak;
  switch (target) {
    case 'Player':
      return applyEffectToPlayer(state, effect, value);
    case 'All':
      return {
        ...state,
        enemies: state.enemies.map((e) => applyEffectToEnemy(e, effect, value, attackerWeak)),
      };
    case 'Random': {
      const idx = Math.floor(Math.random() * state.enemies.length);
      return {
        ...state,
        enemies: state.enemies.map((e, i) =>
          i === idx ? applyEffectToEnemy(e, effect, value, attackerWeak) : e
        ),
      };
    }
    case 'Single':
    default:
      if (targetEnemyIndex === undefined) return state;
      return {
        ...state,
        enemies: state.enemies.map((e, i) =>
          i === targetEnemyIndex ? applyEffectToEnemy(e, effect, value, attackerWeak) : e
        ),
      };
  }
}

// --- Battle Init (Claude) ---

export function initBattle(player: Player, playerDeck: Card[], enemies: Enemy[]): BattleState {
  const shuffledDeck = shuffle(playerDeck);
  const hand = shuffledDeck.slice(0, INITIAL_HAND_SIZE);
  const deck = shuffledDeck.slice(INITIAL_HAND_SIZE);

  const playerState: PlayerBattleState = {
    currentHp: player.maxHp,
    shield: 0,
    currentEnergy: INITIAL_ENERGY,
    hand,
    deck,
    discardPile: [],
    attackPower: 0,
    defensePower: 0,
    ki: 0,
    weak: 0,
    vulnerable: 0,
    phantom: 0,
    actionCount: 0,
    discardDrawDelta: 0,
  };

  const enemyStates: EnemyBattleState[] = enemies.map((enemy) => ({
    enemy,
    currentHp: enemy.maxHp,
    shield: 0,
    nextAction: enemy.enemyActions[0] ?? null,
    weak: 0,
    vulnerable: 0,
  }));

  return {
    player,
    playerState,
    enemies: enemyStates,
    turn: 1,
    phase: 'PlayerTurn',
  };
}

// --- Card Operations ---

// TODO(human): デッキからcount枚引く。デッキが空なら捨て札をシャッフルしてデッキに戻す。
export function drawCards(playerState: PlayerBattleState, count: number): PlayerBattleState {
  let { hand, deck, discardPile } = playerState;
  const drawCount = Math.min(count, playerState.deck.length)
  hand = [...hand, ...deck.slice(0, drawCount)];
  deck = playerState.deck.slice(drawCount);

  if (drawCount < count) {
    const newDeck = shuffle(discardPile);
    deck = newDeck;
    discardPile = [];
    const additionalDrawCount = Math.min(count - drawCount, deck.length);
    hand = [...hand, ...deck.slice(0, additionalDrawCount)];
    deck = deck.slice(additionalDrawCount);
  }

  return { ...playerState, hand, deck, discardPile }
}

export function playCard(state: BattleState, handIndex: number, targetEnemyIndex?: number): BattleState {
  const card = state.playerState.hand[handIndex];

  if (state.playerState.currentEnergy < card.cost) {
    return state;
  }

  const newState = applyCardEffects(state, card, targetEnemyIndex);

  const result = checkBattleResult(newState);
  if (result === "Victory" || result === "Defeat") {
    return { ...newState, phase: result };
  }

  return {
    ...newState,
    playerState: {
      ...newState.playerState,
      currentEnergy: newState.playerState.currentEnergy - card.cost,
      hand: newState.playerState.hand.filter((_, index) => index !== handIndex),
      discardPile: [...newState.playerState.discardPile, card],
    },
  }
}

export function applyCardEffects(state: BattleState, card: Card, targetEnemyIndex?: number): BattleState {
  let newState = state;

  for (const [effect, value] of Object.entries(card.selfEffects)) {
    newState = applyEffectToPlayer(newState, effect as StatusEffect, value);
  }

  const hits = card.hitCount ?? 1;
  for (let i = 0; i < hits; i++) {
    for (const [effect, value] of Object.entries(card.targetEffects)) {
      newState = applyEffectToTarget(newState, effect as StatusEffect, value, card.target, targetEnemyIndex);
    }
  }

  return newState;
}

// --- Turn Processing ---

export function startPlayerTurn(state: BattleState): BattleState {
  const drawCardCount = Math.max(0, INITIAL_HAND_SIZE + state.playerState.actionCount + state.playerState.discardDrawDelta);

  return {
    ...state,
    playerState: {
      ...drawCards(state.playerState, drawCardCount),
      shield: 0,
      currentEnergy: INITIAL_ENERGY,
      actionCount: 0,
      discardDrawDelta: 0,
    },
  }
}

// TODO(human): プレイヤーターン終了処理
// ① 手札を全て捨て札へ移す
// ② phase を 'EnemyTurn' に変更
export function endPlayerTurn(state: BattleState): BattleState {
  return {
    ...state,
    playerState: {
      ...state.playerState,
      hand: [],
      discardPile: [...state.playerState.discardPile, ...state.playerState.hand],
    },
    phase: 'EnemyTurn',
  }
}

export function executeEnemyTurn(state: BattleState): BattleState {
  let currentState = state;

  for (const enemyState of currentState.enemies) {
    if (enemyState.nextAction === null) continue;

    const action = enemyState.nextAction;

    switch (action.type) {
      case "Attack":
      case "QuickAttack":
        currentState = { ...currentState, playerState: dealDamage(currentState.playerState, action.value) as PlayerBattleState };
        break;

      case "Buff":
        currentState = {
          ...currentState,
          enemies: currentState.enemies.map((enemy) => {
            if (enemy === enemyState) {
              return addShield(enemy, action.value) as EnemyBattleState;
            }
            return enemy;
          }),
        };
        break;
    }

    const result = checkBattleResult(currentState);
    if (result === "Victory" || result === "Defeat") {
      return { ...currentState, phase: result };
    }

    // 次の行動を決定する（selectNextEnemyAction を使う）
    currentState = {
      ...currentState,
      enemies: currentState.enemies.map((e) =>
        e === enemyState
          ? { ...e, nextAction: selectNextEnemyAction(e.enemy) }
          : e
      ),
    };
  }

  return { ...currentState, phase: 'PlayerTurn', turn: currentState.turn + 1 };
}

export function selectNextEnemyAction(enemy: Enemy): EnemyAction {
  const roll = Math.random();
  let cumulative = 0;

  for (const action of enemy.enemyActions) {
    cumulative += action.probability;
    if (roll < cumulative) {
      return action;
    }
  }

  return enemy.enemyActions[0]
}

// --- Game State Check ---

// TODO(human): バトル結果を判定する
// 全ての敵の currentHp が 0 → 'Victory'
// プレイヤーの currentHp が 0 → 'Defeat'
// それ以外 → 現在の phase をそのまま返す
export function checkBattleResult(state: BattleState): TurnPhase {
  if (state.enemies.every(enemy => enemy.currentHp <= 0)) {
    return 'Victory';
  }

  if (state.playerState.currentHp <= 0) {
    return 'Defeat';
  }

  return state.phase;
}
