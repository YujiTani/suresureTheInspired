import { useState } from 'react';
import { STATUS_EFFECT_META } from '../data/statusEffectMeta';

interface Props {
  metaKey: string;
  value: number;
}

export function StatusBadge({ metaKey, value }: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const meta = STATUS_EFFECT_META[metaKey];
  if (!meta) return null;
  const { Icon } = meta;

  return (
    <div
      className="status-badge"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {isVisible && (
        <div className="status-tooltip">
          <div className="status-tooltip-title">{meta.label}</div>
          <div className="status-tooltip-desc">{meta.description}</div>
        </div>
      )}
      <Icon size={28} />
      <span className="status-badge-value">{value}</span>
    </div>
  );
}
