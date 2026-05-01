export type LogEventType =
  | 'CardPlay'
  | 'DamageDealt'
  | 'DamageEvaded'
  | 'ShieldGained'
  | 'EnemyAction'
  | 'TurnStart'
  | 'TurnEnd';

export interface LogEntry {
  turn: number;
  event: LogEventType;
  message: string;
  debug?: boolean;
}

export type Attribute = 'Attack' | 'Defense' | 'Skill' | 'Power';
export type AttackElement = 'slash' | 'strike' | 'fire';
export type TargetType = 'Single' | 'All' | 'Random' | 'Player';
export type EffectCategory =
  | 'slash'
  | 'heavySlash'
  | 'lightSlash'
  | 'multiSlash'
  | 'aoe'
  | 'strike'
  | 'fire'
  | 'shield'
  | 'buff'
  | 'upStatus'
  | 'phantom'
  | 'debuff'
  | 'downStatus'
  | 'special';
export type StatusEffect = 'HP' | 'Shield' | 'AttackPower' | 'DefensePower' | 'DeckDraw' | 'DiscardDraw' | 'ActionCount' | 'Ki' | 'Weak' | 'Phantom' | 'Vulnerable';
export type buffStatusEffect = Exclude<StatusEffect, 'HP' | 'Shield' | 'Weak' | 'Vulnerable'>;
export type debuffStatusEffect = Extract<StatusEffect, 'Weak' | 'Vulnerable'>;
export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic';
export type TurnPhase = 'PlayerTurn' | 'EnemyTurn' | 'Victory' | 'Defeat';
export type EnemyStrength = 'Weak' | 'Strong' | 'Elite' | 'Boss' | 'FinalBoss';
export type GamePhase = 'Title' | 'CharacterSelect' | 'Map' | 'Battle' | 'Reward' | 'GameOver';
export type EnemyActionType = 'Attack' | 'QuickAttack' | 'Buff' | 'Debuff' | 'Heal' | 'Summon' | 'SelfBuff' | 'DrainDraw' | 'Taunt' | 'ShieldAttack' | 'DoubleAction';
export type DropType = 'Card' | 'Item' | 'Gold';

/**
 * カード1枚の効果を「1ステップ = 1エフェクト」に分解した単位。
 *
 * BattleScreen がこのステップを順番に処理することで、
 * 「攻撃ヒット → SE → 少し待つ → デバフ付与 → SE → …」という演出を実現する。
 *
 * @example
 * // K002 脛斬り（HP-5, Weak+1）は 2 ステップに展開される
 * [
 *   { category: 'slash',  effectKey: 'HP',   value: -5, applyTo: 'target' },
 *   { category: 'debuff', effectKey: 'Weak', value: 1,  applyTo: 'target' },
 * ]
 */
export interface EffectStep {
  /** 再生する SE カテゴリ（playSE に渡す） */
  category: EffectCategory;
  /** 適用する StatusEffect のキー */
  effectKey: StatusEffect;
  /** 効果量（ダメージは負値、回復・バフは正値） */
  value: number;
  /** 'player' = 自分に適用（selfEffects）、'target' = カードの target 先に適用（targetEffects） */
  applyTo: 'player' | 'target';
}

export interface Card {
  id: string;
  cost: number;
  name: string;
  attribute: Attribute;
  selfEffects: Partial<Record<StatusEffect, number>>;
  targetEffects: Partial<Record<StatusEffect, number>>;
  img: string | null;
  rarity: Rarity;
  description: string;
  target: TargetType;
  hitCount?: number;
  effectCategory?: EffectCategory;
  attackElement?: AttackElement;
  cardArtPosition?: {
    top: string;
    left: string;
  } | null;
  evolvedCard?: Card;
}

export interface Player {
  name: string;
  maxHp: number;
  startDeckNo: number;
  img: string | null;
}

export interface EnemyAction {
  type: EnemyActionType;
  value: number;
  value2?: number;    // DrainDraw=ドロー減少量, SelfBuff=ダメージ, ShieldAttack=ダメージ
  probability: number;
  variance?: number;  // ±ブレ幅（選択時にダメージへ適用）
  label?: string;     // 行動の表示名（例: "鎌斬り"）
}

export interface DropTableEntry {
  type: DropType;
  name: string;
  rarity: Rarity;
  probability: number;
}

export interface Enemy {
  name: string;
  maxHp: number;
  img: string | null;
  strength: EnemyStrength;
  enemyActions: EnemyAction[];
  dropTable: DropTableEntry[];
  actionPattern?: 'random' | 'rotation';
  enrage?: {
    hpThreshold: number;
    turnThreshold: number;
  };
  enrageImg?: string | null;
}

export interface CombatantState {
  currentHp: number;
  shield: number;
}

export interface PlayerBattleState extends CombatantState {
  currentEnergy: number;
  hand: Card[];
  deck: Card[];
  discardPile: Card[];
  attackPower: number;
  defensePower: number;
  ki: number;
  weak: number;
  vulnerable: number;
  phantom: number;
  bonusEnergy: number;
  bonusDraw: number;
  activePowers: string[];
}

export interface EnemyBattleState extends CombatantState {
  enemy: Enemy;
  nextAction: EnemyAction | null;
  weak: number;
  vulnerable: number;
  attackPower: number;
  rotationIndex: number;
  enrageUsed: boolean;
  exhausted: boolean;
}

export interface BattleState {
  player: Player;
  playerState: PlayerBattleState;
  enemies: EnemyBattleState[];
  turn: number;
  phase: TurnPhase;
  log: LogEntry[];
}

export interface RunState {
  player: Player;
  currentHp: number;
  currentFloor: number;
  gold: number;
  deck: Card[];
  mapNodes: MapNode[];
}

export interface MapNode {
  floor: number;
  enemyKey: string;
  label: string;
  nodeType: EnemyStrength;
}
