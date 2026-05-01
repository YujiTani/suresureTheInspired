import type { Card } from '../types';
import { resolveCardArt } from './resolveCardArt';

const princessCardArtModules = import.meta.glob('../assets/cards/princess/*.{png,jpg,jpeg,webp,avif}', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

const p018Img = resolveCardArt(princessCardArtModules, 'P018');

// モーダル選択肢専用カード（山札には入らない）
export const ukenagareshiVariants: Card[] = [6, 7, 8, 9].map((damage) => {
  const shield = 9 - damage;
  return {
    id: `P018-${damage}`,
    cost: 0,
    name: `受け流し(${damage})`,
    attribute: 'Attack' as const,
    attackElement: 'slash' as const,
    selfEffects: { Shield: shield },
    targetEffects: { HP: -damage },
    img: p018Img,
    rarity: 'Uncommon' as const,
    description: shield > 0
      ? `ダメージ +${damage} / シールド +${shield}`
      : `ダメージ +${damage}`,
    target: 'Single' as const,
    hitCount: 1,
    cardArtPosition: null,
  };
});
