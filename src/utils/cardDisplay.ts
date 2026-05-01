import type { Card, Rarity } from '../types';
import frameCommon from '../assets/frames/card_Frame_Comon.png';
import frameUncommon from '../assets/frames/card_Frame_UnComon.png';
import frameRare from '../assets/frames/card_Frame_Rare.png';

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

export function cardFrameImage(rarity: Rarity): string {
  switch (rarity) {
    case 'Common': return frameCommon;
    case 'Uncommon': return frameUncommon;
    case 'Rare':
    case 'Epic':
      return frameRare;
  }
}
