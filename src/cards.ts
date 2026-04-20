/// <reference path="./types.ts" />

// --- Attack Cards (5) ---

const strikeCard: Card = {
  cost: 1,
  name: 'ストライク',
  attribute: 'Attack',
  effects: { HP: -6 },
  illustrationUrl: null,
  rarity: 'Common',
  description: '敵に6ダメージを与える。',
  target: 'Single',
};

const heavyStrikeCard: Card = {
  cost: 2,
  name: 'ヘビーストライク',
  attribute: 'Attack',
  effects: { HP: -14 },
  illustrationUrl: null,
  rarity: 'Common',
  description: '敵に14ダメージを与える。',
  target: 'Single',
};

const quickStrikeCard: Card = {
  cost: 0,
  name: 'クイックストライク',
  attribute: 'Attack',
  effects: { HP: -3 },
  illustrationUrl: null,
  rarity: 'Common',
  description: 'コスト0。敵に3ダメージを与える。',
  target: 'Single',
};

const slashCard: Card = {
  cost: 1,
  name: 'スラッシュ',
  attribute: 'Attack',
  effects: { HP: -8 },
  illustrationUrl: null,
  rarity: 'Common',
  description: '敵に8ダメージを与える。',
  target: 'Single',
};

const doubleStrikeCard: Card = {
  cost: 2,
  name: 'ダブルストライク',
  attribute: 'Attack',
  effects: { HP: -10 },
  illustrationUrl: null,
  rarity: 'Common',
  description: '敵に5ダメージを2回与える。',
  target: 'Single',
  hitCount: 2,
};

// --- Defense Cards (4) ---

const guardCard: Card = {
  cost: 1,
  name: 'ガード',
  attribute: 'Defense',
  effects: { HP: 5 },
  illustrationUrl: null,
  rarity: 'Common',
  description: 'シールドを5獲得する。',
  target: 'Single',
};

const ironShieldCard: Card = {
  cost: 2,
  name: 'アイアンシールド',
  attribute: 'Defense',
  effects: { HP: 12 },
  illustrationUrl: null,
  rarity: 'Common',
  description: 'シールドを12獲得する。',
  target: 'Single',
};

const dodgeCard: Card = {
  cost: 1,
  name: 'ドッジ',
  attribute: 'Defense',
  effects: { HP: 4, ActionCount: 1 },
  illustrationUrl: null,
  rarity: 'Common',
  description: 'シールドを4獲得し、アクション+1。',
  target: 'Single',
};

const fortifyCard: Card = {
  cost: 0,
  name: 'フォーティファイ',
  attribute: 'Defense',
  effects: { HP: 2 },
  illustrationUrl: null,
  rarity: 'Common',
  description: 'コスト0。シールドを2獲得する。',
  target: 'Single',
};

// --- Skill Cards (1) ---

const insightCard: Card = {
  cost: 1,
  name: 'インサイト',
  attribute: 'Skill',
  effects: { DeckDraw: 2 },
  illustrationUrl: null,
  rarity: 'Common',
  description: 'カードを2枚引く。',
  target: 'Single',
};

// --- Drop Cards (5) ---

const fusekirCard: Card = {
  cost: 2,
  name: '布石',
  attribute: 'Attack',
  effects: { HP: -10, DeckDraw: 1 },
  illustrationUrl: null,
  rarity: 'Uncommon',
  description: '敵に10ダメージを与え、カードを1枚引く。',
  target: 'Single',
};

const galeSlashCard: Card = {
  cost: 3,
  name: 'ゲイルスラッシュ',
  attribute: 'Attack',
  effects: { HP: -15 },
  illustrationUrl: null,
  rarity: 'Rare',
  description: '全ての敵に15ダメージを与える。',
  target: 'All',
};

const vierSchlagCard: Card = {
  cost: 3,
  name: 'Vier Schlag',
  attribute: 'Attack',
  effects: { HP: -6 },
  illustrationUrl: null,
  rarity: 'Rare',
  description: '敵に6ダメージを4回与える。',
  target: 'Single',
  hitCount: 4,
};

const towerShieldCard: Card = {
  cost: 3,
  name: 'タワーシールド',
  attribute: 'Defense',
  effects: { HP: 30, DiscardDraw: -1 },
  illustrationUrl: null,
  rarity: 'Rare',
  description: 'シールドを30獲得する。次のターンのドローが1枚減る。',
  target: 'Single',
};

const wutCard: Card = {
  cost: 2,
  name: 'Wut',
  attribute: 'Skill',
  effects: { HP: -3, AttackPower: 1, DefensePower: -1 },
  illustrationUrl: null,
  rarity: 'Rare',
  description: '自分に3ダメージ。攻撃力+1、防御力-1。',
  target: 'Single',
};

// --- Exports ---

export const starterDeck: Card[] = [
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
];

export const dropCards: Card[] = [
  fusekirCard,
  galeSlashCard,
  vierSchlagCard,
  towerShieldCard,
  wutCard,
];

export const allCards: Card[] = [...starterDeck, ...dropCards];
