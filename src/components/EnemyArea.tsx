import type { EnemyBattleState } from '../types';
import type { FloatItem } from './DamageNumber';
import { DamageNumber } from './DamageNumber';

interface Props {
  enemyState: EnemyBattleState;
  floats: FloatItem[];
  shaking: boolean;
}

export function EnemyArea({ enemyState, floats, shaking }: Props) {
  const { enemy, currentHp, shield, nextAction, weak, vulnerable } = enemyState;
  const hpPct = (currentHp / enemy.maxHp) * 100;

  const intentLabel = nextAction
    ? nextAction.type === 'Attack' || nextAction.type === 'QuickAttack'
      ? `斬撃 ${nextAction.value}`
      : nextAction.type === 'Buff'
        ? `強化 +${nextAction.value}`
        : nextAction.type
    : '不明';

  return (
    <div className="enemy-area">
      <div className={`enemy-illu-wrap${shaking ? ' shaking' : ''}`}>
        <div className="enemy-illu" />
        <DamageNumber items={floats} />
      </div>

      <div className="enemy-head">
        <div className="enemy-name">{enemy.name}</div>

        <div className="hp-wrap">
          <div className="hp-bar">
            <div className="hp-fill" style={{ width: `${hpPct}%` }} />
          </div>
          <span className="hp-text">{currentHp} / {enemy.maxHp}</span>
        </div>

        <div className="intent">
          <span className="intent-text">次: {intentLabel}</span>
          {shield > 0 && <span className="status-badge">防御 {shield}</span>}
          {weak > 0 && <span className="status-badge debuff">弱体 {weak}</span>}
          {vulnerable > 0 && <span className="status-badge debuff">脆弱 {vulnerable}</span>}
        </div>
      </div>
    </div>
  );
}
