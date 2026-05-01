import { useEffect, useRef } from 'react';
import type { LogEntry, LogEventType } from '../types';

interface Props {
  log: LogEntry[];
  showDebug?: boolean;
}

const EVENT_COLOR: Record<LogEventType, string> = {
  CardPlay: 'var(--gold-soft)',
  DamageDealt: 'var(--red-glow)',
  DamageEvaded: 'var(--purple)',
  ShieldGained: 'var(--blue)',
  EnemyAction: 'var(--amber)',
  TurnStart: 'var(--green)',
  TurnEnd: 'var(--ink-mute)',
};

export function LogPanel({ log }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [log]);

  return (
    <div className="log-panel">
      <div className="log-panel-title">BATTLE LOG</div>
      <div className="log-panel-entries">
        {log.map((entry, index) => (
          <div key={index} style={{ color: EVENT_COLOR[entry.event] }}>
            {entry.message}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
