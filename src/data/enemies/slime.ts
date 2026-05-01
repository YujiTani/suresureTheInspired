import type { Enemy } from '../../types';
import slimeImg from '../../assets/enemy/art_enemy_01.png';

export const slime: Enemy = {
  name: 'スライム',
  maxHp: 40,
  img: slimeImg,
  strength: 'Weak',
  enemyActions: [
    { type: 'Attack', value: 8, probability: 0.7, label: '体当たり' },
    { type: 'Buff',   value: 5, probability: 0.3, label: '硬化' },
  ],
  dropTable: [],
};
