import type { Card, Rarity, StatusEffect } from '../types';
import frameRera  from '../assets/frames/card_frame_rera.png';
import bottomRera from '../assets/frames/card_bottom_rera.png';

function formatEffect(effect: StatusEffect, value: number): string {
  switch (effect) {
    case 'HP':         return value < 0 ? `${Math.abs(value)}ダメージ` : `HP+${value}`;
    case 'Shield':     return `シールド+${value}`;
    case 'AttackPower':  return `攻撃力${value > 0 ? '+' : ''}${value}`;
    case 'DefensePower': return `防御力${value > 0 ? '+' : ''}${value}`;
    case 'DeckDraw':   return `${value}ドロー`;
    case 'DiscardDraw':return `捨札ドロー${value > 0 ? '+' : ''}${value}`;
    case 'ActionCount':return `行動+${value}`;
    case 'Ki':         return `気${value > 0 ? '+' : ''}${value}`;
    case 'Weak':       return `弱体+${value}`;
    case 'Phantom':    return `分身+${value}`;
    case 'Vulnerable': return `脆弱+${value}`;
    default:           return '';
  }
}

export function formatCardEffect(card: Card): string[] {
  const lines: string[] = [];

  for (const [effect, value] of Object.entries(card.selfEffects) as [StatusEffect, number][]) {
    const label = formatEffect(effect, value);
    if (label) lines.push(`自: ${label}`);
  }

  for (const [effect, value] of Object.entries(card.targetEffects) as [StatusEffect, number][]) {
    let label = formatEffect(effect, value);
    if (effect === 'HP' && value < 0 && card.hitCount && card.hitCount > 1) {
      label += ` × ${card.hitCount}`;
    }
    if (label) lines.push(label);
  }

  return lines;
}

export function cardTypeLabel(card: Card): 'ATTACK' | 'DEFENSE' | 'SKILL' | 'POWER' {
  const map = { Attack: 'ATTACK', Defense: 'DEFENSE', Skill: 'SKILL', Power: 'POWER' } as const;
  return map[card.attribute];
}

export function cardRarityClass(card: Card): 'rarity-common' | 'rarity-uncommon' | 'rarity-rare' | 'rarity-epic' {
  const map = {
    Common:   'rarity-common',
    Uncommon: 'rarity-uncommon',
    Rare:     'rarity-rare',
    Epic:     'rarity-epic',
  } as const;
  return map[card.rarity];
}

export function cardFrameImage(_rarity: Rarity): string {
  return frameRera;
}

export function cardBottomOrnament(): string {
  return bottomRera;
}
