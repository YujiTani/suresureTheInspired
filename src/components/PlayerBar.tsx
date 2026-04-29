import type { PlayerBattleState, Player } from '../types';
import { StatusBadge } from './StatusBadge';

interface Props {
  player: Player;
  playerState: PlayerBattleState;
}

export function PlayerBar({ player, playerState }: Props) {
  const { currentHp, shield, currentEnergy, attackPower, defensePower, ki, weak, vulnerable, phantom, bonusEnergy, bonusDraw } = playerState;

  return (
    <div className="player-bar">
      <div className="stats-left">
        <div className="stat">
          <div className="stat-glyph" style={{ color: '#e05a48', fontSize: 22 }}>♥</div>
          <div>
            <div className="stat-label">HP</div>
            <div className="stat-value">
              {currentHp}<span className="slash">/</span>{player.maxHp}
            </div>
          </div>
        </div>

        <div className="stat">
          <div className="stat-glyph" style={{ color: '#a8c5da', fontSize: 20 }}>🛡</div>
          <div>
            <div className="stat-label">シールド</div>
            <div className="stat-value">{shield}</div>
          </div>
        </div>

        <div className="stat">
          <div className="stat-glyph" style={{ color: '#f39c12', fontSize: 20 }}>⚡</div>
          <div>
            <div className="stat-label">エネルギー</div>
            <div className="stat-value" style={{ color: '#f39c12' }}>
              {currentEnergy}<span className="slash">/</span>3
            </div>
          </div>
        </div>
      </div>

      <div className="stats-right">
        {(attackPower !== 0 || defensePower !== 0) && (
          <div className="buff-grid">
            {attackPower !== 0 && <div className="buff-badge">{`ATK+${attackPower}`}</div>}
            {defensePower !== 0 && <div className="buff-badge">{`DEF+${defensePower}`}</div>}
          </div>
        )}

        {(ki > 0 || bonusEnergy > 0 || bonusDraw > 0 || weak > 0 || vulnerable > 0 || phantom > 0) && (
          <div className="status-grid">
            {ki > 0 && <StatusBadge metaKey="Ki" value={ki} />}
            {bonusEnergy > 0 && <StatusBadge metaKey="BonusEnergy" value={bonusEnergy} />}
            {bonusDraw > 0 && <StatusBadge metaKey="BonusDraw" value={bonusDraw} />}
            {weak > 0 && <StatusBadge metaKey="Weak" value={weak} />}
            {vulnerable > 0 && <StatusBadge metaKey="Vulnerable" value={vulnerable} />}
            {phantom > 0 && <StatusBadge metaKey="Phantom" value={phantom} />}
          </div>
        )}
      </div>
    </div>
  );
}
