interface FloatItem {
  id: number;
  text: string;
}

interface Props {
  items: FloatItem[];
}

export function DamageNumber({ items }: Props) {
  return (
    <>
      {items.map(f => (
        <div key={f.id} className="float-dmg">{f.text}</div>
      ))}
    </>
  );
}

export type { FloatItem };
