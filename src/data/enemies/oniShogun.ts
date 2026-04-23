import type { Enemy } from '../../types';

export const oniShogun: Enemy = {
  name: '鬼将軍',
  maxHp: 120,
  illustrationUrl: null,
  strength: 'Elite',
  enemyActions: [
    { type: 'Attack',      value: 18, probability: 0.45 },
    { type: 'Buff',        value: 12, probability: 0.35 },
    { type: 'QuickAttack', value: 10, probability: 0.2  },
  ],
  dropTable: [],
};
