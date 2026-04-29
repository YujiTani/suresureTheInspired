import type { Card } from '../types';

// --- Attack Cards ---

const P001Card: Card = {
  id: 'P001',
  cost: 1,
  name: '飛び蹴り',
  attribute: 'Attack',
  selfEffects: {},
  targetEffects: { HP: -6 },
  img: null,
  rarity: 'Common',
  description: '敵に6ダメージを与える。',
  target: 'Single',
};

const P002Card: Card = {
  id: 'P002',
  cost: 2,
  name: 'ヘビースラッシュ',
  attribute: 'Attack',
  selfEffects: {},
  targetEffects: { HP: -14 },
  img: null,
  rarity: 'Common',
  description: '敵に14ダメージを与える。',
  target: 'Single',
};

const P003Card: Card = {
  id: 'P003',
  cost: 0,
  name: 'キック',
  attribute: 'Attack',
  selfEffects: {},
  targetEffects: { HP: -3 },
  img: null,
  rarity: 'Common',
  description: 'コスト0。敵に3ダメージを与える。',
  target: 'Single',
};

const P004Card: Card = {
  id: 'P004',
  cost: 1,
  name: '突き',
  attribute: 'Attack',
  selfEffects: {},
  targetEffects: { HP: -8 },
  img: null,
  rarity: 'Common',
  description: '敵に8ダメージを与える。',
  target: 'Single',
};

const P005Card: Card = {
  id: 'P005',
  cost: 2,
  name: 'ダブルスラッシュ',
  attribute: 'Attack',
  selfEffects: {},
  targetEffects: { HP: -5 },
  img: null,
  rarity: 'Common',
  description: '敵に5ダメージを2回与える。',
  target: 'Single',
  hitCount: 2,
};

// --- Defense Cards ---

const P006Card: Card = {
  id: 'P006',
  cost: 1,
  name: 'ガード',
  attribute: 'Defense',
  selfEffects: { Shield: 5 },
  targetEffects: {},
  img: null,
  rarity: 'Common',
  description: 'シールドを5獲得する。',
  target: 'Player',
};

const P007Card: Card = {
  id: 'P007',
  cost: 2,
  name: 'アイアンシールド',
  attribute: 'Defense',
  selfEffects: { Shield: 12 },
  targetEffects: {},
  img: null,
  rarity: 'Common',
  description: 'シールドを12獲得する。',
  target: 'Player',
};

const P008Card: Card = {
  id: 'P008',
  cost: 1,
  name: 'ドッジ',
  attribute: 'Defense',
  selfEffects: { Shield: 4, ActionCount: 1 },
  targetEffects: {},
  img: null,
  rarity: 'Common',
  description: 'シールドを4獲得し、アクション+1。',
  target: 'Player',
};

const P009Card: Card = {
  id: 'P009',
  cost: 0,
  name: 'フォーティファイ',
  attribute: 'Defense',
  selfEffects: { Shield: 2 },
  targetEffects: {},
  img: null,
  rarity: 'Common',
  description: 'コスト0。シールドを2獲得する。',
  target: 'Player',
};

// --- Skill Cards ---

const P010Card: Card = {
  id: 'P010',
  cost: 1,
  name: 'インサイト',
  attribute: 'Skill',
  selfEffects: { DeckDraw: 2 },
  targetEffects: {},
  img: null,
  rarity: 'Common',
  description: 'カードを2枚引く。',
  target: 'Player',
};

// --- Drop Cards ---

const P011Card: Card = {
  id: 'P011',
  cost: 2,
  name: '布石',
  attribute: 'Attack',
  selfEffects: { DeckDraw: 1 },
  targetEffects: { HP: -10 },
  img: null,
  rarity: 'Uncommon',
  description: '敵に10ダメージを与え、カードを1枚引く。',
  target: 'Single',
};

const P012Card: Card = {
  id: 'P012',
  cost: 3,
  name: 'ゲイルスラッシュ',
  attribute: 'Attack',
  selfEffects: {},
  targetEffects: { HP: -15 },
  img: null,
  rarity: 'Rare',
  description: '全ての敵に15ダメージを与える。',
  target: 'All',
};

const P013Card: Card = {
  id: 'P013',
  cost: 3,
  name: 'ヴィアシュラーク',
  attribute: 'Attack',
  selfEffects: {},
  targetEffects: { HP: -6 },
  img: null,
  rarity: 'Rare',
  description: '敵に6ダメージを4回与える。',
  target: 'Single',
  hitCount: 4,
};

const P014Card: Card = {
  id: 'P014',
  cost: 3,
  name: 'タワーシールド',
  attribute: 'Defense',
  selfEffects: { Shield: 30, DiscardDraw: -1 },
  targetEffects: {},
  img: null,
  rarity: 'Rare',
  description: 'シールドを30獲得する。次のターンのドローが1枚減る。',
  target: 'Player',
};

const P015Card: Card = {
  id: 'P015',
  cost: 2,
  name: '激昂',
  attribute: 'Skill',
  selfEffects: { HP: -3, AttackPower: 1, DefensePower: -1 },
  targetEffects: {},
  img: null,
  rarity: 'Rare',
  description: '自分に3ダメージ。攻撃力+1、防御力-1。',
  target: 'Player',
};

const P016Card: Card = {
  id: 'P016',
  cost: 1,
  name: '凛然',
  attribute: 'Skill',
  selfEffects: { DefensePower: 1, Shield: 5 },
  targetEffects: { Weak: 1 },
  img: null,
  rarity: 'Uncommon',
  description: '防御力+1、シールド+5を得て、相手に脱力を1スタック付与する。',
  target: 'Single',
};

const P017Card: Card = {
  id: 'P017',
  cost: 3,
  name: '食べすぎた...',
  attribute: 'Skill',
  selfEffects: { Vulnerable: 1, ActionCount: 3 },
  targetEffects: {},
  img: null,
  rarity: 'Uncommon',
  description: 'もう食べられません...',
  target: 'Player',
};

// 可変ダメージ/シールドの選択はゲームロジック側のハンドラーで処理
const P018Card: Card = {
  id: 'P018',
  cost: 1,
  name: '受け流し',
  attribute: 'Attack',
  selfEffects: {},
  targetEffects: {},
  img: null,
  rarity: 'Uncommon',
  description: '相手の攻撃を受け流しつつダメージを与える',
  target: 'Single',
  hitCount: 1,
};

const P019Card: Card = {
  id: 'P019',
  cost: 2,
  name: '勝ち名乗り',
  attribute: 'Power',
  selfEffects: { AttackPower: 2 },
  targetEffects: {},
  img: null,
  rarity: 'Uncommon',
  description: '攻撃力を永続的に+2する。',
  target: 'Player',
};

const P020Card: Card = {
  id: 'P020',
  cost: 2,
  name: '王家の紋章',
  attribute: 'Skill',
  selfEffects: {},
  targetEffects: { Vulnerable: 2 },
  img: null,
  rarity: 'Uncommon',
  description: '全ての敵に脆弱を2スタック付与する。',
  target: 'All',
  hitCount: 1,
};

export const princessCards: Card[] = [
  P001Card,
  P002Card,
  P003Card,
  P004Card,
  P005Card,
  P006Card,
  P007Card,
  P008Card,
  P009Card,
  P010Card,
  P011Card,
  P012Card,
  P013Card,
  P014Card,
  P015Card,
  P016Card,
  P017Card,
  P018Card,
  P019Card,
  P020Card,
].map((card) => ({
  ...card,
  cardArtPosition: null,
}));

export const princessStarterDeck: string[] = ['P001', 'P001', 'P001', 'P006', 'P006', 'P006', 'P005', 'P007', 'P008', 'P018'];

const princessBasicCardIds = new Set(['P001', 'P006']);
export const princessDropCards: string[] = princessCards
  .map((card) => card.id)
  .filter((id) => !princessBasicCardIds.has(id));
