import type { PlayerBattleState, Player } from '../types';

interface Props {
  player: Player;
  playerState: PlayerBattleState;
}

interface BuffEntry {
  label: string;
  value: number;
}

export function PlayerBar({ player, playerState }: Props) {
  const { currentHp, shield, currentEnergy, attackPower, defensePower, ki, weak, vulnerable, phantom, actionCount, discardDrawDelta } = playerState;

  const buffs: BuffEntry[] = [
    attackPower !== 0    && { label: `ATK+${attackPower}`,    value: attackPower },
    defensePower !== 0   && { label: `DEF+${defensePower}`,   value: defensePower },
    ki > 0               && { label: `気 ${ki}`,               value: ki },
    weak > 0             && { label: `弱体 ${weak}`,           value: weak },
    vulnerable > 0       && { label: `脆弱 ${vulnerable}`,    value: vulnerable },
    phantom > 0          && { label: `分身 ${phantom}`,        value: phantom },
    actionCount > 0      && { label: `行動+${actionCount}`,    value: actionCount },
    discardDrawDelta !== 0 && { label: `捨ドロー${discardDrawDelta > 0 ? '+' : ''}${discardDrawDelta}`, value: discardDrawDelta },
  ].filter((buff): buff is BuffEntry => Boolean(buff));

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

      {buffs.length > 0 && (
        <div className="stats-right">
          <div className="buff-cap">Blessings &amp; Hexes</div>
          <div className="buff-grid">
            {buffs.map((buff, index) => (
              <div key={index} className="buff-badge">{buff.label}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
