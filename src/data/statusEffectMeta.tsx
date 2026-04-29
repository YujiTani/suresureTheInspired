import type { FC } from 'react';
import {
  KiIcon,
  PhantomIcon,
  WeakIcon,
  VulnerableIcon,
  BonusEnergyIcon,
  BonusDrawIcon,
} from '../components/icons/StatusIcons';

export interface StatusEffectMeta {
  label: string;
  description: string;
  Icon: FC<{ size?: number }>;
}

export const STATUS_EFFECT_META: Record<string, StatusEffectMeta> = {
  Ki: {
    label: '気',
    description: '練り上げた気で一部のスキルの効果を強化する。\nターンをまたいで持続する。',
    Icon: KiIcon,
  },
  BonusEnergy: {
    label: '追加エネルギー',
    description: '次のターン開始時、追加でエネルギーを得る。',
    Icon: BonusEnergyIcon,
  },
  BonusDraw: {
    label: '追加ドロー',
    description: '次のターン開始時、追加でカードを引く。',
    Icon: BonusDrawIcon,
  },
  Phantom: {
    label: '分身',
    description: '分身が身代わりになる。\n攻撃を受けそうな時、スタックを消費し50%の確率で回避する。ダメージ判定ごとにスタックを消費する。',
    Icon: PhantomIcon,
  },
  Weak: {
    label: '弱体',
    description: '攻撃力が低下した状態。\n与えるダメージが７５％に減少する。',
    Icon: WeakIcon,
  },
  Vulnerable: {
    label: '脆弱',
    description: '防御力が低下した状態。\n受けるダメージが1.5倍に増加する。',
    Icon: VulnerableIcon,
  },
};
