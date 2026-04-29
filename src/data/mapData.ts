import type { MapNode } from '../types';

export const MAP_NODES: MapNode[] = [
  { floor: 1, enemyKey: 'slime',     label: 'スライム',   nodeType: 'Weak'  },
  { floor: 2, enemyKey: 'goblin',    label: 'ゴブリン剣士', nodeType: 'Strong' },
  { floor: 3, enemyKey: 'oniShogun', label: '鬼将軍',     nodeType: 'Boss'  },
];
