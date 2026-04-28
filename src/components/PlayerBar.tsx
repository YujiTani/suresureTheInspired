import type { PlayerBattleState, Player } from '../types';

interface Props {
  player: Player;
  playerState: PlayerBattleState;
}

interface BuffEntry {
  label: string;
}

export function PlayerBar({ player, playerState }: Props) {
  const { currentHp, shield, currentEnergy, attackPower, defensePower, ki, weak, vulnerable, phantom, actionCount, discardDrawDelta } = playerState;

  const buffs: BuffEntry[] = [
    attackPower !== 0 && { label: `攻撃+${attackPower}` },
    defensePower !== 0 && { label: `防御+${defensePower}` },
    ki > 0 && { label: `神聖 ${ki}` },
    weak > 0 && { label: `弱体 ${weak}` },
    vulnerable > 0 && { label: `脆弱 ${vulnerable}` },
    phantom > 0 && { label: `幻影 ${phantom}` },
    actionCount > 0 && { label: `行動+${actionCount}` },
    discardDrawDelta !== 0 && { label: `捨札ドロー${discardDrawDelta > 0 ? '+' : ''}${discardDrawDelta}` },
  ].filter((buff): buff is BuffEntry => Boolean(buff));

  return (
    <div className="player-bar">
      <div className="player-nameplate">{player.name}</div>
      <div className="stats-left">
        <div className="stat">
          <div className="stat-label">HP</div>
          <div className="stat-value hp">{currentHp}<span className="slash">/</span>{player.maxHp}</div>
        </div>

        <div className="stat">
          <div className="stat-label">防御</div>
          <div className="stat-value">{shield}</div>
        </div>

        <div className="stat">
          <div className="stat-label">エネルギー</div>
          <div className="stat-value energy">{currentEnergy}<span className="slash">/</span>4</div>
        </div>
      </div>

      <div className="buff-grid">
        {buffs.map((buff, index) => (
          <div key={index} className="buff-badge">{buff.label}</div>
        ))}
      </div>
    </div>
  );
}
