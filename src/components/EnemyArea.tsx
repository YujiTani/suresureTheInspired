import type { EnemyBattleState } from '../types';
import type { FloatItem } from './DamageNumber';
import { DamageNumber } from './DamageNumber';
import { StatusBadge } from './StatusBadge';

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
      ? `ATTACK · ${nextAction.value}`
      : nextAction.type === 'Buff'
      ? `BUFF · +${nextAction.value}`
      : nextAction.type
    : '—';

  return (
    <div className="enemy-area">
      <div className={`enemy-illu-wrap${shaking ? ' shaking' : ''}`}>
        <div className="enemy-illu">
          <div className="illu-placeholder">
            [ enemy illustration ]<br />
            {enemy.name}
          </div>
        </div>
        <DamageNumber items={floats} />
      </div>

      <div className="enemy-head">
        <div className="nameplate-rule">
          <div className="nameplate-line" />
          ◆
          <div className="nameplate-line right" />
        </div>
        <div className="enemy-name">{enemy.name}</div>
        <div className="nameplate-rule">
          <div className="nameplate-line" />
          ◆
          <div className="nameplate-line right" />
        </div>

        <div className="hp-wrap">
          <span className="hp-label">HP</span>
          <div className="hp-bar">
            <div className="hp-fill" style={{ width: `${hpPct}%` }} />
          </div>
          <span className="hp-text">{currentHp} / {enemy.maxHp}</span>
        </div>

        {shield > 0 && (
          <div className="intent">
            <span className="intent-text">🛡 {shield}</span>
          </div>
        )}

        <div className="intent">
          <span className="intent-text">{intentLabel}</span>
        </div>

        {(weak > 0 || vulnerable > 0) && (
          <div className="enemy-status">
            {weak > 0 && <StatusBadge metaKey="Weak" value={weak} />}
            {vulnerable > 0 && <StatusBadge metaKey="Vulnerable" value={vulnerable} />}
          </div>
        )}
      </div>
    </div>
  );
}
