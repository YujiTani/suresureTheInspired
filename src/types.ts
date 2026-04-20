export type Attribute = 'Attack' | 'Defense' | 'Skill';
export type TargetType = 'Single' | 'All' | 'Random';
export type StatusEffect = 'HP' | 'AttackPower' | 'DefensePower' | 'DeckDraw' | 'DiscardDraw' | 'ActionCount';
export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic';
export type TurnPhase = 'PlayerTurn' | 'EnemyTurn' | 'Victory' | 'Defeat';
export type EnemyStrength = 'Weak' | 'Strong' | 'Elite' | 'Boss' | 'FinalBoss';
export type EnemyActionType = 'Attack' | 'QuickAttack' | 'Buff' | 'Debuff' | 'Heal' | 'Summon';
export type DropType = 'Card' | 'Item' | 'Gold';

export interface Card {
  cost: number;
  name: string;
  attribute: Attribute;
  effects: Partial<Record<StatusEffect, number>>;
  illustrationUrl: string | null;
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
  illustrationUrl: string | null;
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
  illustrationUrl: string | null;
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
}

export interface EnemyBattleState extends CombatantState {
  enemy: Enemy;
  nextAction: EnemyAction | null;
}

export interface BattleState {
  player: Player;
  playerState: PlayerBattleState;
  enemies: EnemyBattleState[];
  turn: number;
  phase: TurnPhase;
}

export interface RunState {
  player: Player;
  currentHp: number;
  currentFloor: number;
  gold: number;
  deck: Card[];
}
