type Attribute = 'Attack' | 'Defense' | 'Skill';
type TargetType = 'Single' | 'All' | 'Random';
type StatusEffect = 'HP' | 'AttackPower' | 'DefensePower' | 'DeckDraw' | 'DiscardDraw' | 'ActionCount';
type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic';
type TurnPhase = 'PlayerTurn' | 'EnemyTurn' | 'Victory' | 'Defeat';
type EnemyStrength = 'Weak' | 'Strong' | 'Elite' | 'Boss' | 'FinalBoss';
type EnemyActionType = 'Attack' | 'QuickAttack' | 'Buff' | 'Debuff' | 'Heal' | 'Summon';
type DropType = 'Card' | 'Item' | 'Gold';

interface Card {
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

interface Player {
  name: string;
  maxHp: number;
  startDeckNo: number;
  illustrationUrl: string | null;
}

interface EnemyAction {
  type: EnemyActionType;
  value: number;
  probability: number;
}

interface DropTableEntry {
  type: DropType;
  name: string;
  rarity: Rarity;
  probability: number;
}

interface Enemy {
  name: string;
  maxHp: number;
  illustrationUrl: string | null;
  strength: EnemyStrength;
  enemyActions: EnemyAction[];
  dropTable: DropTableEntry[];
}

interface CombatantState {
  currentHp: number;
  shield: number;
}

interface PlayerBattleState extends CombatantState {
  currentEnergy: number;
  hand: Card[];
  deck: Card[];
  discardPile: Card[];
  attackPower: number;
  defensePower: number;
}

interface EnemyBattleState extends CombatantState {
  enemy: Enemy;
  nextAction: EnemyAction | null;
}

interface BattleState {
  player: Player;
  playerState: PlayerBattleState;
  enemies: EnemyBattleState[];
  turn: number;
  phase: TurnPhase;
}

interface RunState {
  player: Player;
  currentHp: number;
  currentFloor: number;
  gold: number;
  deck: Card[];
}
