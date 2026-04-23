interface Props {
  turn: number;
  visible: boolean;
}

export function TurnBanner({ turn, visible }: Props) {
  return (
    <div className={`turn-banner${visible ? ' on' : ''}`}>
      TURN {turn}
    </div>
  );
}
