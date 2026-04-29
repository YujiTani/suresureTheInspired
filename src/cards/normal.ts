import type { Card } from '../types';

// モーダル選択肢専用カード（山札には入らない）
export const ukenagareshiVariants: Card[] = [6, 7, 8, 9].map((damage) => ({
  id: `P018-${damage}`,
  cost: 0,
  name: `受け流し(${damage})`,
  attribute: 'Attack' as const,
  selfEffects: { Shield: 9 - damage },
  targetEffects: { HP: -damage },
  img: null,
  rarity: 'Uncommon' as const,
  description: '相手の攻撃を受け流しつつダメージを与える',
  target: 'Single' as const,
  hitCount: 1,
}));
