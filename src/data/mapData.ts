import type { MapNode } from '../types';

const BOSS_POOL: Array<{ enemyKey: string; label: string }> = [
  { enemyKey: 'demon', label: '悪魔' },
  { enemyKey: 'angel', label: '天使' },
];

export function resolveMapNodes(): MapNode[] {
  const boss = BOSS_POOL[Math.floor(Math.random() * BOSS_POOL.length)];
  return [
    { floor: 1, enemyKey: 'slime',    label: 'スライム',   nodeType: 'Weak'   },
    { floor: 2, enemyKey: 'goblin',   label: '赤フード',     nodeType: 'Strong' },
    { floor: 3, enemyKey: boss.enemyKey, label: boss.label, nodeType: 'Boss'  },
  ];
}
