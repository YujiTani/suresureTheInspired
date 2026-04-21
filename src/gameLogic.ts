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

// --- Battle Init (Claude) ---

export function initBattle(player: Player, playerDeck: Card[], enemies: Enemy[]): BattleState {
  const shuffledDeck = shuffle(playerDeck);
  const hand = shuffledDeck.slice(0, INITIAL_HAND_SIZE);
  const deck = shuffledDeck.slice(INITIAL_HAND_SIZE);

  const playerState: PlayerBattleState = {
    currentHp: 0,
    shield: 0,
    currentEnergy: INITIAL_ENERGY,
    hand,
    deck,
    discardPile: [],
    attackPower: 0,
    defensePower: 0,
  };

  const enemyStates: EnemyBattleState[] = enemies.map((enemy) => ({
    enemy,
    currentHp: enemy.maxHp,
    shield: 0,
    nextAction: enemy.enemyActions[0] ?? null,
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

// TODO(human): 手札の handIndex 番目のカードを使用する。
// ① エネルギーが足りなければ何もしない
// ② applyCardEffects() で効果を適用
// ③ 使ったカードを手札から捨て札へ移す
export function playCard(state: BattleState, handIndex: number, targetEnemyIndex?: number): BattleState {
  const card = state.playerState.hand[handIndex];

  if (state.playerState.currentEnergy < card.cost) {
    return state;
  }

  const newState = applyCardEffects(state, card, targetEnemyIndex);

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

// TODO(human): card の effects を全て適用する。
// Attack属性でHPがマイナス → dealDamage() でターゲット敵へ
// Defense属性でHPがプラス → addShield() でプレイヤーへ
// DeckDraw → drawCards() でプレイヤーに追加ドロー
// AttackPower/DefensePower → playerState.attackPower/defensePower を更新
// hitCount がある場合は damage を hitCount 回適用する
export function applyCardEffects(state: BattleState, card: Card, targetEnemyIndex?: number): BattleState {
  switch (card.attribute) {
    case 'Attack':
      for (const [effect, value] of Object.entries(card.effects)) {
        if (effect === "HP") {
          if (targetEnemyIndex === undefined) {
            let newEnemies: EnemyBattleState[] = [];

            switch (card.target) {
              case "All":
                newEnemies = state.enemies.map((enemy) => {
                  return dealDamage(enemy, Math.abs(value));
                }
                return { ...state, enemies: newEnemies };

              case "Random":
                const randomIndex = Math.floor(Math.random() * state.enemies.length);
                newEnemies = state.enemies.map((enemy, index) => {
                  if (index === randomIndex) {
                    return dealDamage(enemy, Math.abs(value));
                  } else {
                    return enemy;
                  }
                }
                return { ...state, enemies: newEnemies };
            }
          } else {
            const newEnemies = state.enemies.map((enemy, index) => {
              if (index === targetEnemyIndex) {
                return dealDamage(enemy, Math.abs(value));
              } else {
                return enemy;
              }
            });
            return { ...state, enemies: newEnemies };
          }
          break;
    case 'Defense':
      let currentState = state;
      for (const [effect, value] of Object.entries(card.effects)) {
        if (effect === "HP") {
          currentState = { ...currentState, playerState: addShield(currentState.playerState, value) as PlayerBattleState };
        } else if (effect === "DeckDraw") {
          currentState = { ...currentState, playerState: drawCards(currentState.playerState, value) };
        } else if (effect === "AttackPower") {
          const newPlayerState = {
            ...currentState.playerState,
            attackPower: currentState.playerState.attackPower + value,
          };
          currentState = { ...currentState, playerState: newPlayerState as PlayerBattleState };
        } else if (effect === "DefensePower") {
          const newPlayerState = {
            ...currentState.playerState,
            defensePower: currentState.playerState.defensePower + value,
          }

          currentState = { ...currentState, playerState: newPlayerState as PlayerBattleState };
        }
      }
      return currentState;
    case 'Skill':
      break;
  }
  return state;
}

// --- Turn Processing ---

// TODO(human): プレイヤーターン開始処理
// ① playerState.shield を 0 にリセット
// ② drawCards() で5枚引く
// ③ currentEnergy を INITIAL_ENERGY にリセット
export function startPlayerTurn(state: BattleState): BattleState {
  return {
    ...state,
    playerState: {
      ...drawCards(state.playerState, INITIAL_HAND_SIZE),
      shield: 0,
      currentEnergy: INITIAL_ENERGY,
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

// TODO(human): 各敵の nextAction を実行し、次の行動を selectNextEnemyAction() で決める
export function executeEnemyTurn(state: BattleState): BattleState {
  throw new Error('Not implemented');
}

// TODO(human): probability に従って敵の次の行動をランダム抽選する
// ヒント: Math.random() と probability の合計で区間を作る（ルーレット選択）
export function selectNextEnemyAction(enemy: Enemy): EnemyAction {
  throw new Error('Not implemented');
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
