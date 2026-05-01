import type { Card, Rarity } from '../types';
import frameRera from '../assets/frames/card_Frame_Rare.png';

// カードの属性をテキスト化する関数
export function cardTypeLabel(card: Card): 'ATTACK' | 'DEFENSE' | 'SKILL' | 'POWER' {
  const map = { Attack: 'ATTACK', Defense: 'DEFENSE', Skill: 'SKILL', Power: 'POWER' } as const;
  return map[card.attribute];
}

export function cardRarityClass(card: Card): 'rarity-common' | 'rarity-uncommon' | 'rarity-rare' | 'rarity-epic' {
  const map = {
    Common: 'rarity-common',
    Uncommon: 'rarity-uncommon',
    Rare: 'rarity-rare',
    Epic: 'rarity-epic',
  } as const;
  return map[card.rarity];
}

export function cardFrameImage(_rarity: Rarity): string {
  return frameRera;
}
