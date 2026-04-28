interface Props {
  turn: number;
  visible: boolean;
}

export function TurnBanner({ turn, visible }: Props) {
  return (
    <div className={`turn-banner${visible ? ' on' : ''}`}>
      第 {turn} ターン
    </div>
  );
}
