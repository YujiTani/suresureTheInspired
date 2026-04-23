import type { Enemy } from '../types';

export const enemies: Record<string, Enemy> = {
  slime: {
    name: 'スライム',
    maxHp: 40,
    illustrationUrl: null,
    strength: 'Weak',
    enemyActions: [
      { type: 'Attack',      value: 6,  probability: 0.7 },
      { type: 'Buff',        value: 5,  probability: 0.3 },
    ],
    dropTable: [],
  },

  goblin: {
    name: 'ゴブリン剣士',
    maxHp: 65,
    illustrationUrl: null,
    strength: 'Strong',
    enemyActions: [
      { type: 'Attack',      value: 10, probability: 0.4 },
      { type: 'QuickAttack', value: 7,  probability: 0.4 },
      { type: 'Buff',        value: 6,  probability: 0.2 },
    ],
    dropTable: [],
  },

  oniShogun: {
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
  },
};

// 後方互換用
export const sampleEnemies: Enemy[] = [enemies.slime];
