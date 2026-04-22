import type { Card } from '../types';

// --- Attack Cards ---

const suri_giriCard: Card = {
  id: 'K001',
  cost: 1,
  name: '擦り斬り',
  attribute: 'Attack',
  selfEffects: {},
  targetEffects: { HP: -6 },
  illustrationUrl: null,
  rarity: 'Common',
  description: '忍刀で敵を素早く斬りつける。6ダメージを与える。',
  target: 'Single',
};

const sune_giriCard: Card = {
  id: 'K002',
  cost: 1,
  name: '脛斬り',
  attribute: 'Attack',
  selfEffects: {},
  targetEffects: { HP: -5, Weak: 1 },
  illustrationUrl: null,
  rarity: 'Common',
  description: '脛を斬りつけ5ダメージ。脱力を1付与する（攻撃力25%低下）。',
  target: 'Single',
};

const makibishiCard: Card = {
  id: 'K003',
  cost: 0,
  name: 'まきびし',
  attribute: 'Attack',
  selfEffects: { Shield: 4 },
  targetEffects: { HP: -3 },
  illustrationUrl: null,
  rarity: 'Common',
  description: 'コスト0。全ての敵に3ダメージ。シールドを4獲得する。',
  target: 'All',
};

// Ki スタック×1の追加ダメージはゲームロジック側のハンドラーで処理
const yousenkaKouitoCard: Card = {
  id: 'K004',
  cost: 2,
  name: '妖仙火 紅糸',
  attribute: 'Attack',
  selfEffects: {},
  targetEffects: { HP: -10 },
  illustrationUrl: null,
  rarity: 'Common',
  description: '気を媒介に放つ炎。10ダメージ＋溜めた気の数だけ追加ダメージ（気は消費しない）。',
  target: 'Single',
};

// --- Skill Cards ---

const renkiCard: Card = {
  id: 'K005',
  cost: 3,
  name: '練気',
  attribute: 'Skill',
  selfEffects: { Ki: 8 },
  targetEffects: {},
  illustrationUrl: null,
  rarity: 'Common',
  description: '静かに気を練り上げる。気を8スタック獲得する。',
  target: 'Player',
};

const kawariminoCard: Card = {
  id: 'K006',
  cost: 1,
  name: '変わり身',
  attribute: 'Skill',
  selfEffects: { Shield: 5, Phantom: 1 },
  targetEffects: {},
  illustrationUrl: null,
  rarity: 'Common',
  description: 'シールドを5獲得し、残像を1スタック生成する。残像1につき攻撃を50%の確率で回避（毎ターン1消費）。',
  target: 'Player',
};

const bougokiCard: Card = {
  id: 'K007',
  cost: 1,
  name: '防御',
  attribute: 'Defense',
  selfEffects: { Shield: 5 },
  targetEffects: {},
  illustrationUrl: null,
  rarity: 'Common',
  description: '身を固め、シールドを5獲得する。',
  target: 'Player',
};

const shuntenshinCard: Card = {
  id: 'K008',
  cost: 1,
  name: '瞬転身',
  attribute: 'Skill',
  selfEffects: { DeckDraw: 1, Ki: 1 },
  targetEffects: {},
  illustrationUrl: null,
  rarity: 'Common',
  description: '瞬時に体を転がし状況を読む。カードを1枚引き、気を1スタック獲得する。',
  target: 'Player',
};

const kabeHaritsukirCard: Card = {
  id: 'K009',
  cost: 1,
  name: '壁張り付きの術',
  attribute: 'Skill',
  selfEffects: { Shield: 4, Ki: 1 },
  targetEffects: {},
  illustrationUrl: null,
  rarity: 'Common',
  description: '壁に張り付いて、攻撃を受けにくくする。シールドを4獲得し、気を1スタック獲得する。',
  target: 'Player',
};

// --- Power Cards ---

const oboroshinoJutsuCard: Card = {
  id: 'K010',
  cost: 3,
  name: '朧身の術',
  attribute: 'Power',
  selfEffects: { AttackPower: 1 },
  targetEffects: {},
  illustrationUrl: null,
  rarity: 'Uncommon',
  description: '気を霊気に変換する。溜めた気スタックをすべて消費し、同数の残像（Phantom）をスタックする。さらに攻撃力を1永続強化する。',
  target: 'Player',
};

// --- Drop Cards ---

const kariNoYoruCard: Card = {
  id: 'K011',
  cost: 1,
  name: '狩の夜',
  attribute: 'Power',
  selfEffects: {},
  targetEffects: {},
  illustrationUrl: null,
  rarity: 'Rare',
  description: '【狩の夜】を付与する。狩の夜：プレイヤーターン開始時、気スタックが30以上の場合、毎ターン シールド+5・攻撃力+5・エネルギー+2 を得る。',
  target: 'Player',
};

const midarekuNaiCard: Card = {
  id: 'K012',
  cost: 2,
  name: '乱れ苦無',
  attribute: 'Attack',
  selfEffects: {},
  targetEffects: { HP: -10 },
  illustrationUrl: null,
  rarity: 'Uncommon',
  description: '無数の苦無を乱れ投げる。全ての敵に10ダメージを与える。',
  target: 'All',
};

const shienmNoHebiCard: Card = {
  id: 'K013',
  cost: 2,
  name: '紫煙の蛇',
  attribute: 'Skill',
  selfEffects: { Ki: -3 },
  targetEffects: { Weak: 3, Vulnerable: 3 },
  illustrationUrl: null,
  rarity: 'Uncommon',
  description: '敵全体に襲いかかる蛇のような毒ガスを放つ術。気を3消費し、全ての敵に脱力×3・弱体×3を付与する（弱体：受けるダメージが1.5倍になる）。',
  target: 'All',
};

const zanzoKenCard: Card = {
  id: 'K014',
  cost: 1,
  name: '残像剣',
  attribute: 'Attack',
  selfEffects: { Phantom: 1 },
  targetEffects: { HP: -6 },
  illustrationUrl: null,
  rarity: 'Common',
  description: '目にも止まらぬ速さで斬りつける。6ダメージを与え、残像を1スタック生成する。',
  target: 'Single',
};

const kageroMaiCard: Card = {
  id: 'K015',
  cost: 3,
  name: '影狼舞い',
  attribute: 'Skill',
  selfEffects: { Phantom: 1, Shield: 10, Ki: 2 },
  targetEffects: {},
  illustrationUrl: null,
  rarity: 'Uncommon',
  description: '闇に紛れ気配を消す...シールドを10獲得し、残像を1スタック生成し、気を2スタック獲得する。',
  target: 'Player',
};

export const kunoichiCards: Card[] = [
  suri_giriCard,
  sune_giriCard,
  makibishiCard,
  yousenkaKouitoCard,
  renkiCard,
  kawariminoCard,
  bougokiCard,
  shuntenshinCard,
  kabeHaritsukirCard,
  oboroshinoJutsuCard,
  kariNoYoruCard,
  midarekuNaiCard,
  shienmNoHebiCard,
  zanzoKenCard,
  kageroMaiCard,
];

export const kunoichiStarterDeck: string[] = ['K001', 'K002', 'K003', 'K004', 'K005', 'K006', 'K007', 'K008', 'K009', 'K010'];

export const kunoichiDropCards: string[] = ['K011', 'K012', 'K013', 'K014', 'K015'];
