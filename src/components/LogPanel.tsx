import { useEffect, useRef } from 'react';
import type { LogEntry, LogEventType } from '../types';

interface Props {
  log: LogEntry[];
}

const EVENT_COLOR: Record<LogEventType, string> = {
  CardPlay: '#f6e5b5',
  DamageDealt: '#ff8f84',
  DamageEvaded: '#bca5ff',
  ShieldGained: '#8cbfe6',
  EnemyAction: '#e7b36d',
  TurnStart: '#99d39c',
  TurnEnd: '#8f889f',
};

export function LogPanel({ log }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [log]);

  return (
    <div className="log-panel">
      <div className="log-panel-title">戦闘ログ</div>
      <div className="log-panel-entries">
        {log.map((entry, index) => (
          <div key={index} className="log-entry" style={{ color: EVENT_COLOR[entry.event] }}>
            {entry.message}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
