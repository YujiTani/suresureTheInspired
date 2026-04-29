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
export type TargetType = 'Single' | 'All' | 'Random' | 'Player';
export type StatusEffect = 'HP' | 'Shield' | 'AttackPower' | 'DefensePower' | 'DeckDraw' | 'DiscardDraw' | 'ActionCount' | 'Ki' | 'Weak' | 'Phantom' | 'Vulnerable';
export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic';
export type TurnPhase = 'PlayerTurn' | 'EnemyTurn' | 'Victory' | 'Defeat';
export type EnemyStrength = 'Weak' | 'Strong' | 'Elite' | 'Boss' | 'FinalBoss';
export type GamePhase = 'Title' | 'CharacterSelect' | 'Map' | 'Battle' | 'Reward' | 'GameOver';
export type EnemyActionType = 'Attack' | 'QuickAttack' | 'Buff' | 'Debuff' | 'Heal' | 'Summon';
export type DropType = 'Card' | 'Item' | 'Gold';

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
  probability: number;
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
}

export interface MapNode {
  floor: number;
  enemyKey: string;
  label: string;
  nodeType: EnemyStrength;
}
