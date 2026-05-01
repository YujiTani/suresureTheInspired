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
  LogEntry,
} from './types';

// =============================================================
// gameLogic.ts — 関数一覧
// -------------------------------------------------------------
// [Log]           addLog
// [Utilities]     shuffle / dealDamage / addShield / healHp / calculateDamage
// [Effect Apply]  applyEffectToPlayer / applyEffectToEnemy / applyEffectToTarget
// [Battle Init]   initBattle
// [Card Ops]      drawCards / playCard / applyCardEffects
// [Special Cards] applyYousenkaBeniIto / applyOboromiNoJutsu / applyKariNoYoru / applySpecialCardEffect
// [Turn]          startPlayerTurn / endPlayerTurn / executeEnemyTurn / selectNextEnemyAction
// [State Check]   checkBattleResult
// =============================================================

// --- Log ---

function addLog(state: BattleState, entry: Omit<LogEntry, 'turn'>): BattleState {
  return { ...state, log: [...state.log, { ...entry, turn: state.turn }] };
}

const INITIAL_ENERGY = 3;
const INITIAL_HAND_SIZE = 5;

const PLAYER_DIFF_LABELS: Partial<Record<keyof PlayerBattleState, string>> = {
  shield: 'Shield', ki: 'Ki', attackPower: 'ATK',
  defensePower: 'DEF', weak: 'Weak', vulnerable: 'Vuln', phantom: 'Phantom',
};

const ENEMY_DIFF_LABELS: Partial<Record<keyof EnemyBattleState, string>> = {
  weak: 'Weak', vulnerable: 'Vuln',
};

const PLAYER_DECAY_FIELDS: Array<keyof PlayerBattleState> = ['weak', 'vulnerable', 'phantom'];
const ENEMY_DECAY_FIELDS: Array<keyof EnemyBattleState> = ['weak', 'vulnerable'];

function buildDiffParts<T extends object>(
  before: T, after: T, labels: Partial<Record<keyof T, string>>
): string[] {
  const sign = (num: number) => num > 0 ? `+${num}` : `${num}`;
  return Object.entries(labels).flatMap(([key, label]) => {
    const beforeVal = (before as Record<string, unknown>)[key] as number;
    const afterVal = (after as Record<string, unknown>)[key] as number;
    return afterVal !== beforeVal ? [`${label} ${sign(afterVal - beforeVal)}`] : [];
  });
}

function decayStacks<T extends object>(state: T, fields: Array<keyof T>): T {
  return fields.reduce((updateState, currentField) => {
    return {
      ...updateState,
      [currentField]: Math.max(0, (updateState[currentField] as number) - 1)
    };
  }, state)
}

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

// --- Effect Apply ---

function tryDealDamageToPlayer(state: BattleState, damage: number): BattleState {
  if (state.playerState.phantom >= 1) {
    const phantomConsumedState = {
      ...state,
      playerState: { ...state.playerState, phantom: state.playerState.phantom - 1 },
    };
    const evaded = Math.random() < 0.5;
    if (evaded) {
      return addLog(phantomConsumedState, {
        event: 'DamageEvaded',
        message: `幻影で攻撃を回避した！ (ダメージ ${damage} 無効化)`,
      });
    }
    return { ...phantomConsumedState, playerState: dealDamage(phantomConsumedState.playerState, damage) as PlayerBattleState };
  }
  return { ...state, playerState: dealDamage(state.playerState, damage) as PlayerBattleState };
}

export function applyEffectToPlayer(state: BattleState, effect: StatusEffect, value: number): BattleState {
  const playerState = state.playerState;
  switch (effect) {
    case 'HP':
      return value < 0
        ? { ...state, playerState: dealDamage(playerState, Math.abs(value)) as PlayerBattleState }
        : { ...state, playerState: healHp(playerState, value, state.player.maxHp) as PlayerBattleState };
    case 'Shield':
      return { ...state, playerState: addShield(playerState, value + playerState.defensePower) as PlayerBattleState };
    case 'DeckDraw':
      return { ...state, playerState: drawCards(playerState, value) };
    case 'AttackPower':
      return { ...state, playerState: { ...playerState, attackPower: playerState.attackPower + value } };
    case 'DefensePower':
      return { ...state, playerState: { ...playerState, defensePower: playerState.defensePower + value } };
    case 'Ki':
      return { ...state, playerState: { ...playerState, ki: Math.max(0, playerState.ki + value) } };
    case 'Weak':
      return { ...state, playerState: { ...playerState, weak: Math.max(0, playerState.weak + value) } };
    case 'Vulnerable':
      return { ...state, playerState: { ...playerState, vulnerable: Math.max(0, playerState.vulnerable + value) } };
    case 'Phantom':
      return { ...state, playerState: { ...playerState, phantom: Math.max(0, playerState.phantom + value) } };
    case 'ActionCount':
      return { ...state, playerState: { ...playerState, bonusEnergy: playerState.bonusEnergy + value } };
    case 'DiscardDraw':
      return { ...state, playerState: { ...playerState, bonusDraw: playerState.bonusDraw + value } };
    default:
      return state;
  }
}

function applyEffectToEnemy(
  enemy: EnemyBattleState,
  effect: StatusEffect,
  value: number,
  attackerWeak: number,
  attackerAttackPower: number
): EnemyBattleState {
  switch (effect) {
    case 'HP': {
      const dmg = calculateDamage(Math.abs(value) + attackerAttackPower, attackerWeak, enemy.vulnerable);
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

export function applyEffectToTarget(
  state: BattleState,
  effect: StatusEffect,
  value: number,
  target: Card['target'],
  targetEnemyIndex?: number
): BattleState {
  const attackerWeak = state.playerState.weak;
  const attackerAttackPower = state.playerState.attackPower;

  switch (target) {
    case 'Player':
      return applyEffectToPlayer(state, effect, value);
    case 'All':
      const newState = addLog(state, { event: "DamageDealt", message: `全ての敵に ${effect} ${value} を適用`, debug: true })
      return {
        ...newState,
        enemies: state.enemies.map((enemy) => applyEffectToEnemy(enemy, effect, value, attackerWeak, attackerAttackPower)),
      };
    case 'Random': {
      const idx = Math.floor(Math.random() * state.enemies.length);
      return {
        ...state,
        enemies: state.enemies.map((enemy, index) =>
          index === idx ? applyEffectToEnemy(enemy, effect, value, attackerWeak, attackerAttackPower) : enemy
        ),
      };
    }
    case 'Single':
    default:
      if (targetEnemyIndex === undefined) return state;
      return {
        ...state,
        enemies: state.enemies.map((enemy, index) =>
          index === targetEnemyIndex ? applyEffectToEnemy(enemy, effect, value, attackerWeak, attackerAttackPower) : enemy
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
    bonusEnergy: 0,
    bonusDraw: 0,
    activePowers: [],
  };

  const enemyStates: EnemyBattleState[] = enemies.map((enemy) => {
    const initialState: EnemyBattleState = {
      enemy,
      currentHp: enemy.maxHp,
      shield: 0,
      nextAction: null,
      weak: 0,
      vulnerable: 0,
      attackPower: 0,
      rotationIndex: 0,
      enrageUsed: false,
      exhausted: false,
    };
    const { action, stateUpdates } = selectNextEnemyAction(initialState, 1);
    return { ...initialState, nextAction: action, ...stateUpdates };
  });

  return {
    player,
    playerState,
    enemies: enemyStates,
    turn: 1,
    phase: 'PlayerTurn',
    log: [],
  };
}

// --- Card Operations ---
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

  let newState = applyCardEffects(state, card, targetEnemyIndex);

  const dmgDealt = state.enemies.map((enemy, index) => enemy.currentHp - newState.enemies[index].currentHp);
  const totalDmg = dmgDealt.reduce((sum, damage) => sum + damage, 0);

  const effectParts: string[] = [];
  if (totalDmg > 0) effectParts.push(`Attack ${totalDmg}`);
  effectParts.push(...buildDiffParts(state.playerState, newState.playerState, PLAYER_DIFF_LABELS));
  state.enemies.forEach((before, i) => {
    buildDiffParts(before, newState.enemies[i], ENEMY_DIFF_LABELS)
      .forEach(part => effectParts.push(`${before.enemy.name} ${part}`));
  });

  const effectSummary = effectParts.length > 0 ? ` → ${effectParts.join(', ')}` : '';
  newState = addLog(newState, {
    event: 'CardPlay',
    message: `「${card.name}」をプレイ (コスト:${card.cost})${effectSummary}`,
  });

  dmgDealt.forEach((dmg, i) => {
    if (dmg > 0) {
      const shieldAbsorbed = state.enemies[i].shield - newState.enemies[i].shield;
      const incoming = dmg + shieldAbsorbed;
      newState = addLog(newState, {
        event: 'DamageDealt',
        message: `${state.enemies[i].enemy.name} に 攻撃 ${incoming} → シールド ${shieldAbsorbed} 軽減 / HP -${dmg} (残HP: ${newState.enemies[i].currentHp})`,
      });
    }
  });

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

// --- Special Card Handlers ---
function applyYousenkaBeniIto(state: BattleState, targetEnemyIndex?: number): BattleState {
  return applyEffectToTarget(state, "HP", -(10 + state.playerState.ki * 1), "Single", targetEnemyIndex);
}

function applyOboromiNoJutsu(state: BattleState): BattleState {
  // 気の蓄積がない場合は何もしない
  if (state.playerState.ki <= 0) return state;

  const phantomStack = state.playerState.ki;
  return { ...state, playerState: { ...state.playerState, ki: 0, phantom: state.playerState.phantom + phantomStack, attackPower: state.playerState.attackPower + 1 } }
}

function applyKariNoYoru(state: BattleState): BattleState {
  if (state.playerState.activePowers.includes('K011')) return state;
  return {
    ...state,
    playerState: { ...state.playerState, activePowers: [...state.playerState.activePowers, 'K011'] },
  };
}

function applySpecialCardEffect(
  state: BattleState,
  card: Card,
  targetEnemyIndex?: number,
): BattleState | null {
  const loggedState = addLog(state, { event: 'CardPlay', message: `[特殊ハンドラー] ${card.id} ${card.name}`, debug: true });
  switch (card.id) {
    case 'K004': return applyYousenkaBeniIto(loggedState, targetEnemyIndex);
    case 'K010': return applyOboromiNoJutsu(loggedState);
    case 'K011': return applyKariNoYoru(loggedState);
    default: return null;
  }
}

export function applyCardEffects(state: BattleState, card: Card, targetEnemyIndex?: number): BattleState {
  const special = applySpecialCardEffect(state, card, targetEnemyIndex);
  if (special !== null) return special;

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
  const playerState = state.playerState;
  const drawCardCount = Math.max(0, INITIAL_HAND_SIZE + playerState.bonusDraw);
  const activePowers = playerState.activePowers;

  let newState = addLog(state, {
    event: 'TurnStart',
    message: `ターン ${state.turn} 開始 (ki:${playerState.ki} attackPower:${playerState.attackPower} shield:${playerState.shield})`,
  });

  let turnStartState: BattleState = {
    ...newState,
    playerState: {
      ...drawCards(playerState, drawCardCount),
      shield: 0,
      currentEnergy: INITIAL_ENERGY + playerState.bonusEnergy,
      bonusEnergy: 0,
      bonusDraw: 0,
    },
  };

  if (playerState.ki >= 30 && activePowers.includes("K011")) {
    turnStartState = applyEffectToPlayer(turnStartState, "Shield", 5);
    turnStartState = applyEffectToPlayer(turnStartState, "AttackPower", 5);
    turnStartState = { ...turnStartState, playerState: { ...turnStartState.playerState, currentEnergy: turnStartState.playerState.currentEnergy + 2 } }
  }

  return turnStartState;
}

export function endPlayerTurn(state: BattleState): BattleState {
  const decayed = decayStacks(state.playerState, PLAYER_DECAY_FIELDS);
  const diffParts = buildDiffParts(state.playerState, decayed, PLAYER_DIFF_LABELS);

  let newState = diffParts.length > 0
    ? addLog(state, { event: 'TurnEnd', message: `デバフ減衰: ${diffParts.join(', ')}`, debug: true })
    : state;

  return {
    ...newState,
    playerState: {
      ...decayed,
      hand: [],
      discardPile: [...decayed.discardPile, ...state.playerState.hand],
    },
    phase: 'EnemyTurn',
  };
}

export function executeEnemyTurn(state: BattleState): BattleState {
  let currentState = {
    ...state,
    enemies: state.enemies.map(enemyState => ({ ...enemyState, shield: 0 })),
  };

  for (let enemyIndex = 0; enemyIndex < currentState.enemies.length; enemyIndex++) {
    const enemyState = currentState.enemies[enemyIndex];
    if (enemyState.nextAction === null) continue;

    const action = enemyState.nextAction;

    currentState = addLog(currentState, {
      event: 'EnemyAction',
      message: `${enemyState.enemy.name} が ${action.type}(${action.value}) を選択`,
    });

    currentState = applySingleEnemyAction(currentState, enemyIndex, action);

    const result = checkBattleResult(currentState);
    if (result === "Victory" || result === "Defeat") {
      return { ...currentState, phase: result };
    }

    // 次の行動を決定する
    const { action: nextAction, stateUpdates } = selectNextEnemyAction(
      currentState.enemies[enemyIndex],
      currentState.turn
    );
    currentState = {
      ...currentState,
      enemies: currentState.enemies.map((currentEnemy, index) =>
        index === enemyIndex
          ? { ...currentEnemy, nextAction, ...stateUpdates }
          : currentEnemy
      ),
    };
  }

  const beforeEnemies = currentState.enemies;
  currentState = {
    ...currentState,
    enemies: currentState.enemies.map(enemyState => decayStacks(enemyState, ENEMY_DECAY_FIELDS)),
  };
  beforeEnemies.forEach((before, index) => {
    const after = currentState.enemies[index];
    const diffParts = buildDiffParts(before, after, ENEMY_DIFF_LABELS);
    if (diffParts.length > 0) {
      currentState = addLog(currentState, {
        event: 'TurnEnd',
        message: `${before.enemy.name} デバフ減衰: ${diffParts.join(', ')}`,
        debug: true,
      });
    }
  });

  return { ...currentState, phase: 'PlayerTurn', turn: currentState.turn + 1 };
}

function applyVariance(action: EnemyAction): EnemyAction {
  if (!action.variance) return action;
  const roll = Math.floor(Math.random() * (action.variance * 2 + 1)) - action.variance;
  return { ...action, value: action.value + roll };
}

function applySingleEnemyAction(state: BattleState, enemyIndex: number, action: EnemyAction): BattleState {
  const enemyState = state.enemies[enemyIndex];
  const enemyAttackPower = enemyState.attackPower ?? 0;

  switch (action.type) {
    case 'Attack':
    case 'QuickAttack': {
      const finalDamage = calculateDamage(action.value + enemyAttackPower, enemyState.weak, state.playerState.vulnerable);
      const prevHp = state.playerState.currentHp;
      const prevShield = state.playerState.shield;
      let next = tryDealDamageToPlayer(state, finalDamage);
      const shieldAbsorbed = prevShield - next.playerState.shield;
      const hpDmg = prevHp - next.playerState.currentHp;
      return addLog(next, {
        event: 'DamageDealt',
        message: `攻撃 ${action.value}→${finalDamage} → シールド ${shieldAbsorbed} 軽減 / HP -${hpDmg} (残HP: ${next.playerState.currentHp})`,
      });
    }
    case 'Buff': {
      const next = {
        ...state,
        enemies: state.enemies.map((enemy, index) =>
          index === enemyIndex ? addShield(enemy, action.value) as EnemyBattleState : enemy
        ),
      };
      return addLog(next, { event: 'ShieldGained', message: `${enemyState.enemy.name} がシールド +${action.value} 獲得` });
    }
    case 'Debuff': {
      const stacks = Math.ceil(Math.random() * action.value);
      let next = applyEffectToPlayer(state, 'Weak', stacks);
      next = applyEffectToPlayer(next, 'Vulnerable', stacks);
      return addLog(next, { event: 'EnemyAction', message: `${enemyState.enemy.name} が Weak+${stacks} / Vulnerable+${stacks} を付与` });
    }
    case 'SelfBuff': {
      const next = {
        ...state,
        enemies: state.enemies.map((enemy, index) =>
          index === enemyIndex
            ? { ...enemy, attackPower: (enemy.attackPower ?? 0) + action.value } as EnemyBattleState
            : enemy
        ),
      };
      const logged = addLog(next, { event: 'EnemyAction', message: `${enemyState.enemy.name} が攻撃力 +${action.value}（合計: ${(enemyAttackPower + action.value)}）` });
      if (!action.value2) return logged;
      const finalDamage = calculateDamage(action.value2, enemyState.weak, state.playerState.vulnerable);
      const prevHp = logged.playerState.currentHp;
      const prevShield = logged.playerState.shield;
      let attacked = tryDealDamageToPlayer(logged, finalDamage);
      const shieldAbsorbed = prevShield - attacked.playerState.shield;
      const hpDmg = prevHp - attacked.playerState.currentHp;
      return addLog(attacked, { event: 'DamageDealt', message: `攻撃 ${action.value2} → シールド ${shieldAbsorbed} 軽減 / HP -${hpDmg} (残HP: ${attacked.playerState.currentHp})` });
    }
    case 'DrainDraw': {
      const finalDamage = calculateDamage(action.value + enemyAttackPower, enemyState.weak, state.playerState.vulnerable);
      let next = tryDealDamageToPlayer(state, finalDamage);
      const drawReduction = action.value2 ?? 2;
      next = {
        ...next,
        playerState: { ...next.playerState, bonusDraw: next.playerState.bonusDraw - drawReduction },
      };
      return addLog(next, { event: 'DamageDealt', message: `${enemyState.enemy.name} の呪い: ${action.value}→${finalDamage}ダメージ + 次ターンドロー-${drawReduction}` });
    }
    case 'Taunt':
      return addLog(state, { event: 'EnemyAction', message: `${enemyState.enemy.name} があっかんべーをした！` });
    case 'ShieldAttack': {
      const shielded = {
        ...state,
        enemies: state.enemies.map((enemy, index) =>
          index === enemyIndex ? addShield(enemy, action.value) as EnemyBattleState : enemy
        ),
      };
      const logged = addLog(shielded, { event: 'ShieldGained', message: `${enemyState.enemy.name} がシールド +${action.value} 獲得` });
      if (!action.value2) return logged;
      const finalDamage = calculateDamage(action.value2 + enemyAttackPower, enemyState.weak, state.playerState.vulnerable);
      const prevHp = logged.playerState.currentHp;
      const prevShield = logged.playerState.shield;
      let attacked = tryDealDamageToPlayer(logged, finalDamage);
      const shieldAbsorbed = prevShield - attacked.playerState.shield;
      const hpDmg = prevHp - attacked.playerState.currentHp;
      return addLog(attacked, { event: 'DamageDealt', message: `攻撃 ${action.value2}→${finalDamage} → シールド ${shieldAbsorbed} 軽減 / HP -${hpDmg} (残HP: ${attacked.playerState.currentHp})` });
    }
    case 'DoubleAction': {
      const candidates = enemyState.enemy.enemyActions.filter(candidateAction => candidateAction.type !== 'DoubleAction');
      if (candidates.length === 0) return state;
      const pickRandom = () => {
        const roll = Math.random();
        let cumulative = 0;
        for (const candidateAction of candidates) {
          cumulative += candidateAction.probability;
          if (roll < cumulative) return applyVariance(candidateAction);
        }
        return applyVariance(candidates[0]);
      };
      let next = applySingleEnemyAction(state, enemyIndex, pickRandom());
      if (checkBattleResult(next) !== 'PlayerTurn') return next;
      return applySingleEnemyAction(next, enemyIndex, pickRandom());
    }
    default:
      return state;
  }
}

type NextActionResult = { action: EnemyAction; stateUpdates: Partial<EnemyBattleState> };

export function selectNextEnemyAction(enemyState: EnemyBattleState, turn: number): NextActionResult {
  const { enemy } = enemyState;

  if (enemyState.exhausted) {
    return { action: { type: 'Attack', value: 5, probability: 1 }, stateUpdates: {} };
  }

  if (enemyState.enrageUsed) {
    return { action: { type: 'Attack', value: 5, probability: 1 }, stateUpdates: { exhausted: true } };
  }

  if (enemy.enrage) {
    const { hpThreshold, turnThreshold } = enemy.enrage;
    if (enemyState.currentHp <= hpThreshold || turn >= turnThreshold) {
      return { action: { type: 'Attack', value: 100, probability: 1 }, stateUpdates: { enrageUsed: true } };
    }
  }

  if (enemy.actionPattern === 'rotation') {
    const baseAction = enemy.enemyActions[enemyState.rotationIndex % enemy.enemyActions.length];
    const nextRotationIndex = (enemyState.rotationIndex + 1) % enemy.enemyActions.length;
    return { action: applyVariance(baseAction), stateUpdates: { rotationIndex: nextRotationIndex } };
  }

  const roll = Math.random();
  let cumulative = 0;
  for (const action of enemy.enemyActions) {
    cumulative += action.probability;
    if (roll < cumulative) {
      return { action: applyVariance(action), stateUpdates: {} };
    }
  }
  return { action: applyVariance(enemy.enemyActions[0]), stateUpdates: {} };
}

// --- Game State Check ---
export function checkBattleResult(state: BattleState): TurnPhase {
  if (state.enemies.every(enemy => enemy.currentHp <= 0)) {
    return 'Victory';
  }

  if (state.playerState.currentHp <= 0) {
    return 'Defeat';
  }

  return state.phase;
}

