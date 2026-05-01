import type { Card, EffectCategory, EffectStep, StatusEffect } from '../types';

/**
 * 1つの StatusEffect を EffectCategory に変換する。
 *
 * HP ダメージのみカードのコンテキスト（target / hitCount / value）で分岐する。
 * それ以外は effectKey だけで決まる。
 *
 * TODO(human): HP ダメージの境界値（LIGHT_DAMAGE_MAX / HEAVY_DAMAGE_MIN）を決めてください。
 *   - LIGHT_DAMAGE_MAX 以下 → 'lightSlash'  例: P003 クイックストライク HP-3
 *   - HEAVY_DAMAGE_MIN 以上 → 'heavySlash'  例: P002 ヘビーストライク HP-14
 *   - その間              → 'slash'         例: P001 ストライク HP-6
 *   カード一覧は src/cards/princess.ts / kunoichi.ts を参照してください。
 */
const LIGHT_DAMAGE_MAX = 6;
const HEAVY_DAMAGE_MIN = 20;

export function statusToCategory(
  effectKey: StatusEffect,
  value: number,
  card: Card,
): EffectCategory {
  switch (effectKey) {
    case 'HP':
      if (value >= 0) return 'buff'; // 回復効果
      if (card.target === 'All') return 'aoe';
      if ((card.hitCount ?? 1) >= 2) return 'multiSlash';
      const damage = Math.abs(value);
      if (damage <= LIGHT_DAMAGE_MAX) return 'lightSlash';
      if (damage >= HEAVY_DAMAGE_MIN) return 'heavySlash';
      return 'slash';
    case 'Shield':
      return 'shield';
    case 'Weak':
    case 'Vulnerable':
      return 'debuff';
    case 'AttackPower':
    case 'DefensePower':
    case 'Ki':
    case 'Phantom':
    case 'DeckDraw':
    case 'ActionCount':
    case 'DiscardDraw':
      return 'buff';
    default: {
      const _unreachable: never = effectKey;
      throw new Error(`statusToCategory: unhandled StatusEffect "${_unreachable}"`);
    }
  }
}

/**
 * カード1枚を EffectStep の配列に展開する。
 *
 * selfEffects → applyTo: 'player' のステップ列
 * targetEffects → applyTo: 'target' のステップ列（hitCount 分繰り返し）
 * card.effectCategory が指定されている場合は全ステップの category を上書き。
 */
export function getCardEffectSteps(card: Card): EffectStep[] {
  const steps: EffectStep[] = [];

  for (const [key, value] of Object.entries(card.selfEffects)) {
    const effectKey = key as StatusEffect;
    steps.push({
      category: statusToCategory(effectKey, value, card),
      effectKey,
      value,
      applyTo: 'player',
    });
  }

  const hits = card.hitCount ?? 1;
  for (let i = 0; i < hits; i++) {
    for (const [key, value] of Object.entries(card.targetEffects)) {
      const effectKey = key as StatusEffect;
      steps.push({
        category: statusToCategory(effectKey, value, card),
        effectKey,
        value,
        applyTo: 'target',
      });
    }
  }

  return steps;
}

/** card.effectCategory が指定されていればそれを、なければ先頭ステップのカテゴリを返す（特殊カード用）。 */
export function resolveEffectCategory(card: Card): EffectCategory {
  if (card.effectCategory) return card.effectCategory;
  const steps = getCardEffectSteps(card);
  return steps.length > 0 ? steps[0].category : 'slash';
}
