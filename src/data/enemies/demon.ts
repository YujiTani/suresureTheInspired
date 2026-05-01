import type { Enemy } from '../../types';
import demonImg from '../../assets/enemy/art_enemy_boss01.png';

export const demon: Enemy = {
  name: '悪魔',
  maxHp: 100,
  img: demonImg,
  strength: 'Boss',
  actionPattern: 'rotation',
  enemyActions: [
    { type: 'SelfBuff',  value: 2, value2: 12, variance: 3, probability: 1, label: '魔力集束' },
    { type: 'Debuff',    value: 2,              probability: 1,              label: '呪縛' },
    { type: 'DrainDraw', value: 15, value2: 2,  variance: 3, probability: 1, label: '精神侵食' },
    { type: 'Attack',    value: 24,             variance: 3, probability: 1, label: '滅殺' },
  ],
  dropTable: [],
};
