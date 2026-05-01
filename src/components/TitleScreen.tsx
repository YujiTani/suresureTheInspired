import { useEffect, useMemo, useState } from 'react';
import { playUISE } from '../utils/playSE';
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
  bgmEnabled: boolean;
  bgmVolume: number;
  onToggleBgm: () => void;
  onChangeBgmVolume: (volume: number) => void;
  seEnabled: boolean;
  seVolume: number;
  onToggleSe: () => void;
  onChangeSEVolume: (volume: number) => void;
}

export function TitleScreen({ onStart, bgmEnabled, bgmVolume, onToggleBgm, onChangeBgmVolume, seEnabled, seVolume, onToggleSe, onChangeSEVolume }: TitleScreenProps) {
  const embers = useMemo(() => generateEmbers(100), []);
  const [fading, setFading] = useState(false);

  function handleStart() {
    if (fading) return;
    playUISE('gameStart');
    setFading(true);
    setTimeout(onStart, 1000);
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        handleStart();
      }
    }
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
  }, [fading, onStart]);

  return (
    <div className="title-screen">
      <div className={`screen-fade ${fading ? 'visible' : 'hidden'}`} />
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
        <button className="title-start-btn" onClick={handleStart}>
          GAME START
        </button>
        <div className="audio-control audio-control--title">
          <button className="log-toggle-btn" onClick={onToggleBgm}>{bgmEnabled ? 'BGM ON' : 'BGM OFF'}</button>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(bgmVolume * 100)}
            onChange={e => onChangeBgmVolume(Number(e.target.value) / 100)}
          />
          <button className="log-toggle-btn" onClick={onToggleSe}>{seEnabled ? 'SE ON' : 'SE OFF'}</button>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(seVolume * 100)}
            onChange={e => onChangeSEVolume(Number(e.target.value) / 100)}
          />
        </div>
      </div>
    </div >
  );
}
