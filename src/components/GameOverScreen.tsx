interface Props {
  floorReached: number;
  onRestart: () => void;
}

export function GameOverScreen({ floorReached, onRestart }: Props) {
  return (
    <div className="gameover-screen">
      <div className="gameover-title">GAME OVER</div>
      <div className="gameover-floor">Floor {floorReached} で力尽きた…</div>
      <button className="gameover-restart-btn" onClick={onRestart}>
        もう一度挑戦する
      </button>
    </div>
  );
}
