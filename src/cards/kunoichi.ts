import type { Card } from '../types';
import { resolveCardArt } from './resolveCardArt';

const kunoichiCardArtModules = import.meta.glob('../assets/cards/kunoichi/*.{png,jpg,jpeg,webp,avif}', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

// --- Attack Cards ---

const K001Card: Card = {
  id: 'K001',
  cost: 1,
  name: '擦り斬り',
  attribute: 'Attack',
  selfEffects: {},
  targetEffects: { HP: -6 },
  img: null,
  rarity: 'Common',
  description: '忍刀で敵を素早く斬りつける。6ダメージを与える。',
  target: 'Single',
};

const K002Card: Card = {
  id: 'K002',
  cost: 1,
  name: '脛斬り',
  attribute: 'Attack',
  selfEffects: {},
  targetEffects: { HP: -5, Weak: 1 },
  img: null,
  rarity: 'Common',
  description: '脛を斬りつけ5ダメージ。脱力を1付与する（攻撃力25%低下）。',
  target: 'Single',
};

const K003Card: Card = {
  id: 'K003',
  cost: 0,
  name: 'まきびし',
  attribute: 'Attack',
  selfEffects: { Shield: 4 },
  targetEffects: { HP: -3 },
  img: null,
  rarity: 'Common',
  description: 'コスト0。全ての敵に3ダメージ。シールドを4獲得する。',
  target: 'All',
};

// Ki スタック×1の追加ダメージはゲームロジック側のハンドラーで処理
const K004Card: Card = {
  id: 'K004',
  cost: 2,
  name: '妖仙火 紅糸',
  attribute: 'Attack',
  selfEffects: {},
  targetEffects: { HP: -10 },
  img: null,
  rarity: 'Common',
  description: '気を媒介に放つ炎。10ダメージ＋溜めた気の数だけ追加ダメージ（気は消費しない）。',
  target: 'Single',
};

// --- Skill Cards ---

const K005Card: Card = {
  id: 'K005',
  cost: 3,
  name: '練気',
  attribute: 'Skill',
  selfEffects: { Ki: 8 },
  targetEffects: {},
  img: null,
  rarity: 'Common',
  description: '静かに気を練り上げる。気を8スタック獲得する。',
  target: 'Player',
};

const K006Card: Card = {
  id: 'K006',
  cost: 1,
  name: '変わり身の術',
  attribute: 'Skill',
  selfEffects: { Shield: 5, Phantom: 1 },
  targetEffects: {},
  img: null,
  rarity: 'Common',
  description: 'シールドを5獲得し、残像を1スタック生成する。残像1につき攻撃を50%の確率で回避（毎ターン1消費）。',
  target: 'Player',
};

const K007Card: Card = {
  id: 'K007',
  cost: 1,
  name: '防御',
  attribute: 'Defense',
  selfEffects: { Shield: 5 },
  targetEffects: {},
  img: null,
  rarity: 'Common',
  description: '身を固め、シールドを5獲得する。',
  target: 'Player',
};

const K008Card: Card = {
  id: 'K008',
  cost: 1,
  name: '瞬転身',
  attribute: 'Skill',
  selfEffects: { DeckDraw: 1, Ki: 1 },
  targetEffects: {},
  img: null,
  rarity: 'Common',
  description: '瞬時に体を転がし状況を読む。カードを1枚引き、気を1スタック獲得する。',
  target: 'Player',
};

const K009Card: Card = {
  id: 'K009',
  cost: 1,
  name: '壁張り付きの術',
  attribute: 'Skill',
  selfEffects: { Shield: 4, Ki: 1 },
  targetEffects: {},
  img: null,
  rarity: 'Common',
  description: '壁に張り付いて、攻撃を受けにくくする。シールドを4獲得し、気を1スタック獲得する。',
  target: 'Player',
};

// --- Power Cards ---

const K010Card: Card = {
  id: 'K010',
  cost: 3,
  name: '朧身の術',
  attribute: 'Power',
  selfEffects: { AttackPower: 1 },
  targetEffects: {},
  img: null,
  rarity: 'Uncommon',
  description: '気を霊気に変換する。溜めた気スタックをすべて消費し、同数の残像（Phantom）をスタックする。さらに攻撃力を1永続強化する。',
  target: 'Player',
};

// --- Drop Cards ---

const K011Card: Card = {
  id: 'K011',
  cost: 1,
  name: '狩の夜',
  attribute: 'Power',
  selfEffects: {},
  targetEffects: {},
  img: null,
  rarity: 'Rare',
  description: '【狩の夜】を付与する。狩の夜：プレイヤーターン開始時、気スタックが30以上の場合、毎ターン シールド+5・攻撃力+5・エネルギー+2 を得る。',
  target: 'Player',
};

const K012Card: Card = {
  id: 'K012',
  cost: 2,
  name: '乱れ苦無',
  attribute: 'Attack',
  selfEffects: {},
  targetEffects: { HP: -10 },
  img: null,
  rarity: 'Uncommon',
  description: '無数の苦無を乱れ投げる。全ての敵に10ダメージを与える。',
  target: 'All',
};

const K013Card: Card = {
  id: 'K013',
  cost: 2,
  name: '紫煙の蛇',
  attribute: 'Skill',
  selfEffects: { Ki: -3 },
  targetEffects: { Weak: 3, Vulnerable: 3 },
  img: null,
  rarity: 'Uncommon',
  description: '敵全体に襲いかかる蛇のような毒ガスを放つ術。気を3消費し、全ての敵に脱力×3・弱体×3を付与する（弱体：受けるダメージが1.5倍になる）。',
  target: 'All',
};

const K014Card: Card = {
  id: 'K014',
  cost: 1,
  name: '残影剣',
  attribute: 'Attack',
  selfEffects: { Phantom: 1 },
  targetEffects: { HP: -6 },
  img: null,
  rarity: 'Common',
  description: '目にも止まらぬ速さで斬りつける。6ダメージを与え、残像を1スタック生成する。',
  target: 'Single',
};

const K015Card: Card = {
  id: 'K015',
  cost: 3,
  name: '影狼舞い',
  attribute: 'Skill',
  selfEffects: { Phantom: 1, Shield: 10, Ki: 2 },
  targetEffects: {},
  img: null,
  rarity: 'Uncommon',
  description: '闇に紛れ気配を消す...シールドを10獲得し、残像を1スタック生成し、気を2スタック獲得する。',
  target: 'Player',
};

export const kunoichiCards: Card[] = [
  K001Card,
  K002Card,
  K003Card,
  K004Card,
  K005Card,
  K006Card,
  K007Card,
  K008Card,
  K009Card,
  K010Card,
  K011Card,
  K012Card,
  K013Card,
  K014Card,
  K015Card,
].map((card) => ({
  ...card,
  img: resolveCardArt(kunoichiCardArtModules, card.id),
}));

export const kunoichiStarterDeck: string[] = ['K001', 'K001', 'K001', 'K007', 'K007', 'K007', 'K003', 'K004', 'K006', 'K009'];

const kunoichiBasicCardIds = new Set(['K001', 'K007']);
export const kunoichiDropCards: string[] = kunoichiCards
  .map((card) => card.id)
  .filter((id) => !kunoichiBasicCardIds.has(id));
