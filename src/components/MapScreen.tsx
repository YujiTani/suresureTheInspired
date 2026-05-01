import { useEffect } from 'react';
import type { MapNode, RunState } from '../types';

interface Props {
  runState: RunState;
  mapNodes: MapNode[];
  onEnterBattle: (node: MapNode) => void;
  bgmEnabled: boolean;
  bgmVolume: number;
  onToggleBgm: () => void;
  onChangeBgmVolume: (volume: number) => void;
  seEnabled: boolean;
  seVolume: number;
  onToggleSe: () => void;
  onChangeSEVolume: (volume: number) => void;
}

const NODE_TYPE_LABEL: Record<string, string> = {
  Weak:      '⚔ 雑魚',
  Strong:    '⚔ 強敵',
  Elite:     '⚔ エリート',
  Boss:      '💀 ボス',
  FinalBoss: '👹 最終ボス',
};

export function MapScreen({ runState, mapNodes, onEnterBattle, bgmEnabled, bgmVolume, onToggleBgm, onChangeBgmVolume, seEnabled, seVolume, onToggleSe, onChangeSEVolume }: Props) {
  const { currentFloor, currentHp, player, gold } = runState;
  const nextNode = mapNodes.find(node => node.floor === currentFloor + 1) ?? null;
  const isCleared = currentFloor >= mapNodes[mapNodes.length - 1].floor;

  useEffect(() => {
    if (!nextNode || isCleared) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') onEnterBattle(nextNode);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextNode, isCleared, onEnterBattle]);

  return (
    <div className="map-screen">
      <div className="map-header">
        <span className="map-title">MAP</span>
        <div className="audio-control audio-control--map">
          <button className="log-toggle-btn" onClick={onToggleBgm}>{bgmEnabled ? 'BGM ON' : 'BGM OFF'}</button>
          <input type="range" min={0} max={100} value={Math.round(bgmVolume * 100)} onChange={e => onChangeBgmVolume(Number(e.target.value) / 100)} />
          <button className="log-toggle-btn" onClick={onToggleSe}>{seEnabled ? 'SE ON' : 'SE OFF'}</button>
          <input type="range" min={0} max={100} value={Math.round(seVolume * 100)} onChange={e => onChangeSEVolume(Number(e.target.value) / 100)} />
        </div>
        <div className="map-player-status">
          <span>HP: {currentHp} / {player.maxHp}</span>
          <span>Gold: {gold}</span>
          <span>Floor: {currentFloor}</span>
        </div>
      </div>

      <div className="map-nodes">
        {mapNodes.map(node => {
          const status =
            node.floor < currentFloor + 1  ? 'cleared' :
            node.floor === currentFloor + 1 ? 'next'    : 'future';

          return (
            <div key={node.floor} className={`map-node map-node--${status}`}>
              <div className="map-node-floor">Floor {node.floor}</div>
              <div className="map-node-type">{NODE_TYPE_LABEL[node.nodeType]}</div>
              <div className="map-node-label">{node.label}</div>
              {status === 'cleared' && <div className="map-node-badge">✓</div>}
            </div>
          );
        })}
      </div>

      <div className="map-actions">
        {isCleared ? (
          <div className="map-cleared-text">— 全フロアクリア —</div>
        ) : nextNode ? (
          <button
            className="map-enter-btn"
            onClick={() => onEnterBattle(nextNode)}
          >
            Floor {nextNode.floor}「{nextNode.label}」へ進む
          </button>
        ) : null}
      </div>
    </div>
  );
}
