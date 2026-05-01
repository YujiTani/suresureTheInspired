import type { EnemyBattleState, EnemyStrength } from '../types';
import type { FloatItem } from './DamageNumber';
import { DamageNumber } from './DamageNumber';
import { StatusBadge } from './StatusBadge';
import enemyActionUiImg from '../assets/UIPirts/UI_enemyAction.png';
import battleStageBg from '../assets/backgrounds/battleStage_01.png';
import battleStageBossBg from '../assets/backgrounds/battleStage_boss_02.png';

interface Props {
  enemyState: EnemyBattleState;
  floats: FloatItem[];
  shaking: boolean;
  nodeType: EnemyStrength;
}

function buildIntentLabel(enemyState: EnemyBattleState): string {
  const { nextAction, enrageUsed, exhausted } = enemyState;
  if (exhausted) return 'ATTACK · 5';
  if (enrageUsed && !exhausted) return 'ATTACK · 5';
  if (!nextAction) return '—';

  const name = nextAction.label;

  switch (nextAction.type) {
    case 'Attack':
    case 'QuickAttack':
      return name ? `${name} · ${nextAction.value}` : `ATTACK · ${nextAction.value}`;
    case 'Buff':
      return name ? `${name} · 🛡${nextAction.value}` : `BUFF · +${nextAction.value}`;
    case 'SelfBuff':
      return name ? `${name} · ATK+${nextAction.value}` : 'BUFF';
    case 'Debuff':
      return name ? `${name} · 弱体+脆弱` : 'DEBUFF';
    case 'DrainDraw':
      return name ? `${name} · ${nextAction.value} ドロー↓` : `ATTACK · ${nextAction.value}`;
    case 'Taunt':
      return name ?? '？？？';
    case 'ShieldAttack':
      return name
        ? `${name} · ${nextAction.value2 ?? '?'} + 🛡${nextAction.value}`
        : `ATTACK · ${nextAction.value2 ?? '?'} + 🛡${nextAction.value}`;
    case 'DoubleAction':
      return name ?? '×2 ACTION';
    default:
      return name ?? nextAction.type;
  }
}

export function EnemyArea({ enemyState, floats, shaking, nodeType }: Props) {
  const { enemy, currentHp, shield, weak, vulnerable, enrageUsed } = enemyState;
  const hpPct = (currentHp / enemy.maxHp) * 100;
  const intentLabel = buildIntentLabel(enemyState);
  const currentImg = (enrageUsed && enemy.enrageImg) ? enemy.enrageImg : enemy.img;
  const stageBg = (nodeType === 'Boss' || nodeType === 'FinalBoss') ? battleStageBossBg : battleStageBg;

  return (
    <div className="enemy-area">
      <div className={`enemy-illu-wrap${shaking ? ' shaking' : ''}`}>
        <div className="enemy-illu">
          <img src={stageBg} className="enemy-stage-bg" alt="" />
        </div>
        {currentImg
          ? <img src={currentImg} alt={enemy.name} className="enemy-sprite" />
          : <div className="illu-placeholder">[ enemy illustration ]<br />{enemy.name}</div>
        }
        <div className="enemy-action-panel">
          <img src={enemyActionUiImg} className="enemy-action-bg" alt="" />
          <span className="enemy-action-text">{intentLabel}</span>
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
