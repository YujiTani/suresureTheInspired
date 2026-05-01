import type { Enemy } from '../../types';

export const oniShogun: Enemy = {
  name: '鬼将軍',
  maxHp: 120,
  img: null,
  strength: 'Elite',
  enemyActions: [
    { type: 'Attack',      value: 18, probability: 0.45, label: '鬼斬' },
    { type: 'Buff',        value: 12, probability: 0.35, label: '鉄壁' },
    { type: 'QuickAttack', value: 10, probability: 0.2,  label: '居合' },
  ],
  dropTable: [],
};
