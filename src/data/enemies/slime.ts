import type { Enemy } from '../../types';

export const slime: Enemy = {
  name: 'スライム',
  maxHp: 40,
  img: null,
  strength: 'Weak',
  enemyActions: [
    { type: 'Attack', value: 6, probability: 0.7 },
    { type: 'Buff',   value: 5, probability: 0.3 },
  ],
  dropTable: [],
};
