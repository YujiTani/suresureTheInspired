import type { Enemy } from '../../types';
import goblinImg from '../../assets/enemy/art_enemy_02.png';

export const goblin: Enemy = {
  name: '赤フード',
  maxHp: 65,
  img: goblinImg,
  strength: 'Strong',
  enemyActions: [
    { type: 'Attack',      value: 10, variance: 2, probability: 0.3, label: '鎌斬り' },
    { type: 'QuickAttack', value: 7,  variance: 2, probability: 0.3, label: '素早い一閃' },
    { type: 'Buff',        value: 6,               probability: 0.2, label: '狼の構え' },
    { type: 'Attack',      value: 18, variance: 2, probability: 0.2, label: '血の大鎌' },
  ],
  dropTable: [],
};
