import type { Card } from '../types';

// --- Attack Cards ---

const strikeCard: Card = {
  id: 'P001',
  cost: 1,
  name: 'ストライク',
  attribute: 'Attack',
  selfEffects: {},
  targetEffects: { HP: -6 },
  illustrationUrl: null,
  rarity: 'Common',
  description: '敵に6ダメージを与える。',
  target: 'Single',
};

const heavyStrikeCard: Card = {
  id: 'P002',
  cost: 2,
  name: 'ヘビーストライク',
  attribute: 'Attack',
  selfEffects: {},
  targetEffects: { HP: -14 },
  illustrationUrl: null,
  rarity: 'Common',
  description: '敵に14ダメージを与える。',
  target: 'Single',
};

const quickStrikeCard: Card = {
  id: 'P003',
  cost: 0,
  name: 'クイックストライク',
  attribute: 'Attack',
  selfEffects: {},
  targetEffects: { HP: -3 },
  illustrationUrl: null,
  rarity: 'Common',
  description: 'コスト0。敵に3ダメージを与える。',
  target: 'Single',
};

const slashCard: Card = {
  id: 'P004',
  cost: 1,
  name: 'スラッシュ',
  attribute: 'Attack',
  selfEffects: {},
  targetEffects: { HP: -8 },
  illustrationUrl: null,
  rarity: 'Common',
  description: '敵に8ダメージを与える。',
  target: 'Single',
};

const doubleStrikeCard: Card = {
  id: 'P005',
  cost: 2,
  name: 'ダブルストライク',
  attribute: 'Attack',
  selfEffects: {},
  targetEffects: { HP: -10 },
  illustrationUrl: null,
  rarity: 'Common',
  description: '敵に5ダメージを2回与える。',
  target: 'Single',
  hitCount: 2,
};

// --- Defense Cards ---

const guardCard: Card = {
  id: 'P006',
  cost: 1,
  name: 'ガード',
  attribute: 'Defense',
  selfEffects: { Shield: 5 },
  targetEffects: {},
  illustrationUrl: null,
  rarity: 'Common',
  description: 'シールドを5獲得する。',
  target: 'Player',
};

const ironShieldCard: Card = {
  id: 'P007',
  cost: 2,
  name: 'アイアンシールド',
  attribute: 'Defense',
  selfEffects: { Shield: 12 },
  targetEffects: {},
  illustrationUrl: null,
  rarity: 'Common',
  description: 'シールドを12獲得する。',
  target: 'Player',
};

const dodgeCard: Card = {
  id: 'P008',
  cost: 1,
  name: 'ドッジ',
  attribute: 'Defense',
  selfEffects: { Shield: 4, ActionCount: 1 },
  targetEffects: {},
  illustrationUrl: null,
  rarity: 'Common',
  description: 'シールドを4獲得し、アクション+1。',
  target: 'Player',
};

const fortifyCard: Card = {
  id: 'P009',
  cost: 0,
  name: 'フォーティファイ',
  attribute: 'Defense',
  selfEffects: { Shield: 2 },
  targetEffects: {},
  illustrationUrl: null,
  rarity: 'Common',
  description: 'コスト0。シールドを2獲得する。',
  target: 'Player',
};

// --- Skill Cards ---

const insightCard: Card = {
  id: 'P010',
  cost: 1,
  name: 'インサイト',
  attribute: 'Skill',
  selfEffects: { DeckDraw: 2 },
  targetEffects: {},
  illustrationUrl: null,
  rarity: 'Common',
  description: 'カードを2枚引く。',
  target: 'Player',
};

// --- Drop Cards ---

const fusekirCard: Card = {
  id: 'P011',
  cost: 2,
  name: '布石',
  attribute: 'Attack',
  selfEffects: { DeckDraw: 1 },
  targetEffects: { HP: -10 },
  illustrationUrl: null,
  rarity: 'Uncommon',
  description: '敵に10ダメージを与え、カードを1枚引く。',
  target: 'Single',
};

const galeSlashCard: Card = {
  id: 'P012',
  cost: 3,
  name: 'ゲイルスラッシュ',
  attribute: 'Attack',
  selfEffects: {},
  targetEffects: { HP: -15 },
  illustrationUrl: null,
  rarity: 'Rare',
  description: '全ての敵に15ダメージを与える。',
  target: 'All',
};

const vierSchlagCard: Card = {
  id: 'P013',
  cost: 3,
  name: 'Vier Schlag',
  attribute: 'Attack',
  selfEffects: {},
  targetEffects: { HP: -6 },
  illustrationUrl: null,
  rarity: 'Rare',
  description: '敵に6ダメージを4回与える。',
  target: 'Single',
  hitCount: 4,
};

const towerShieldCard: Card = {
  id: 'P014',
  cost: 3,
  name: 'タワーシールド',
  attribute: 'Defense',
  selfEffects: { Shield: 30, DiscardDraw: -1 },
  targetEffects: {},
  illustrationUrl: null,
  rarity: 'Rare',
  description: 'シールドを30獲得する。次のターンのドローが1枚減る。',
  target: 'Player',
};

const wutCard: Card = {
  id: 'P015',
  cost: 2,
  name: 'Wut',
  attribute: 'Skill',
  selfEffects: { HP: -3, AttackPower: 1, DefensePower: -1 },
  targetEffects: {},
  illustrationUrl: null,
  rarity: 'Rare',
  description: '自分に3ダメージ。攻撃力+1、防御力-1。',
  target: 'Player',
};

const rinzenCard: Card = {
  id: 'P016',
  cost: 1,
  name: '凛然',
  attribute: 'Skill',
  selfEffects: { DefensePower: 1, Shield: 5 },
  targetEffects: { Weak: 1 },
  illustrationUrl: null,
  rarity: 'Uncommon',
  description: '防御力+1、シールド+5を得て、相手に脱力を1スタック付与する。',
  target: 'Single',
};

const eatTooMuchCard: Card = {
  id: 'P017',
  cost: 3,
  name: '食べすぎた...',
  attribute: 'Skill',
  selfEffects: { Vulnerable: 1, ActionCount: 3 },
  targetEffects: {},
  illustrationUrl: null,
  rarity: 'Uncommon',
  description: 'もう食べられません...',
  target: 'Player',
};

// 可変ダメージ/シールドの選択はゲームロジック側のハンドラーで処理
const ukenagareshiCard: Card = {
  id: 'P018',
  cost: 1,
  name: '受け流し',
  attribute: 'Attack',
  selfEffects: {},
  targetEffects: {},
  illustrationUrl: null,
  rarity: 'Uncommon',
  description: '6〜9のダメージをプレイヤーが選択する。(9 - 選択値) のシールドを得る。',
  target: 'Single',
  hitCount: 1,
};

const kachinanoCard: Card = {
  id: 'P019',
  cost: 2,
  name: '勝ち名乗り',
  attribute: 'Power',
  selfEffects: { AttackPower: 2 },
  targetEffects: {},
  illustrationUrl: null,
  rarity: 'Uncommon',
  description: '攻撃力を永続的に+2する。',
  target: 'Player',
};

const royalCrestCard: Card = {
  id: 'P020',
  cost: 2,
  name: '王家の紋章',
  attribute: 'Skill',
  selfEffects: {},
  targetEffects: { Vulnerable: 2 },
  illustrationUrl: null,
  rarity: 'Uncommon',
  description: '全ての敵に脆弱を2スタック付与する。',
  target: 'All',
  hitCount: 1,
};

export const princessCards: Card[] = [
  strikeCard,
  heavyStrikeCard,
  quickStrikeCard,
  slashCard,
  doubleStrikeCard,
  guardCard,
  ironShieldCard,
  dodgeCard,
  fortifyCard,
  insightCard,
  fusekirCard,
  galeSlashCard,
  vierSchlagCard,
  towerShieldCard,
  wutCard,
  rinzenCard,
  eatTooMuchCard,
  ukenagareshiCard,
  kachinanoCard,
  royalCrestCard,
];

export const princessStarterDeck: string[] = ['P001', 'P002', 'P003', 'P004', 'P005', 'P006', 'P007', 'P008', 'P009', 'P010'];

export const princessDropCards: string[] = ['P011', 'P012', 'P013', 'P014', 'P015', 'P016', 'P017', 'P018', 'P019', 'P020'];
