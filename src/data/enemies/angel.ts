import type { Enemy } from '../../types';
import angelImg from '../../assets/enemy/art_enemy_boss02.png';
import angelEnrageImg from '../../assets/enemy/art_enemy_boss02_enraig.png';

export const angel: Enemy = {
  name: '天使',
  maxHp: 200,
  img: angelImg,
  enrageImg: angelEnrageImg,
  strength: 'Boss',
  enrage: { hpThreshold: 20, turnThreshold: 16 },
  enemyActions: [
    { type: 'Attack',       value: 8,  variance: 4, probability: 0.25, label: '聖光弾' },
    { type: 'Debuff',       value: 2,               probability: 0.15, label: '裁きの宣告' },
    { type: 'Taunt',        value: 0,               probability: 0.15, label: '嘲笑' },
    { type: 'ShieldAttack', value: 8,  value2: 10,  probability: 0.25, label: '聖盾撃' },
    { type: 'DoubleAction', value: 0,               probability: 0.20, label: '天使の連撃' },
  ],
  dropTable: [],
};
