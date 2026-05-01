interface FloatItem {
  id: number;
  text: string;
  color?: 'red' | 'blue';
}

interface Props {
  items: FloatItem[];
}

export function DamageNumber({ items }: Props) {
  return (
    <>
      {items.map(f => (
        <div key={f.id} className={`float-dmg${f.color ? ` float-dmg--${f.color}` : ''}`}>{f.text}</div>
      ))}
    </>
  );
}

export type { FloatItem };
