import type { Enemy } from '../../types';

export const goblin: Enemy = {
  name: 'ゴブリン剣士',
  maxHp: 65,
  img: null,
  strength: 'Strong',
  enemyActions: [
    { type: 'Attack',      value: 10, probability: 0.4 },
    { type: 'QuickAttack', value: 7,  probability: 0.4 },
    { type: 'Buff',        value: 6,  probability: 0.2 },
  ],
  dropTable: [],
};
