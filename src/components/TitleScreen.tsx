import { useEffect, useMemo } from 'react';
import titleBg from '../assets/backgrounds/title-bg.png';

const EMBER_COLORS = [
  '#f0d488', // bright gold
  '#c9a35a', // deep gold
  '#ffe87a', // pale yellow
  '#ff9a3c', // orange ember
  '#ff6b6b', // crimson spark
  '#ffffff',  // white flash
  '#ffd6a5', // peach glow
];

interface EmberParticle {
  id: number;
  x: string;
  size: string;
  duration: string;
  delay: string;
  drift: string;
  height: string;
  color: string;
}

function generateEmbers(count: number): EmberParticle[] {
  return Array.from({ length: count }, (_, index) => {
    const isSpark = Math.random() < 0.6;
    return {
      id: index,
      x: `${Math.random() * 100}%`,
      size: isSpark ? `${1.5 + Math.random() * 1.5}px` : `${3 + Math.random() * 3}px`,
      duration: isSpark ? `${2 + Math.random() * 3}s` : `${8 + Math.random() * 6}s`,
      delay: `${Math.random() * 8}s`,
      drift: `${(Math.random() - 0.5) * (isSpark ? 40 : 100)}px`,
      height: `-${20 + Math.random() * 80}vh`,
      color: EMBER_COLORS[Math.floor(Math.random() * EMBER_COLORS.length)],
    };
  });
}

interface TitleScreenProps {
  onStart: () => void;
}

export function TitleScreen({ onStart }: TitleScreenProps) {
  const embers = useMemo(() => generateEmbers(100), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        onStart();
      }
    }
    addEventListener('keydown', handleKeyDown);

    return () => {
      removeEventListener('keydown', handleKeyDown);
    }
  }, [onStart]);

  return (
    <div className="title-screen">
      <img className="title-bg" src={titleBg} alt="" />
      <div className="title-overlay" />
      <div className="title-embers">
        {embers.map(ember => (
          <div
            key={ember.id}
            className="title-ember"
            style={
              {
                '--ember-x': ember.x,
                '--ember-size': ember.size,
                '--ember-duration': ember.duration,
                '--ember-delay': ember.delay,
                '--ember-drift': ember.drift,
                '--ember-height': ember.height,
                '--ember-color': ember.color,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
      <div className="title-content">
        <button className="title-start-btn" onClick={onStart}>
          GAME START
        </button>
      </div>
    </div>
  );
}
