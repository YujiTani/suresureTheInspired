import { useEffect, useMemo, useRef, useState } from 'react';
import type { Card, Player, GamePhase, MapNode, RunState } from './types';
import { BattleScreen } from './components/BattleScreen';
import { MapScreen } from './components/MapScreen';
import { RewardScreen } from './components/RewardScreen';
import { GameOverScreen } from './components/GameOverScreen';
import { TitleScreen } from './components/TitleScreen';
import { CharacterSelectScreen } from './components/CharacterSelectScreen';
import type { CharaOption } from './components/CharacterSelectScreen';
import { princessCards, princessStarterDeck } from './cards/princess';
import { kunoichiCards, kunoichiStarterDeck } from './cards/kunoichi';
import princessImg from './assets/characters/princess.png';
import kunoichiImg from './assets/characters/kunoichi.png';
import * as enemies from './data/enemies';
import { MAP_NODES } from './data/mapData';
import { getRewardCandidates } from './utils/rewardPool';
import gardenBgm from './assets/audio/荊の庭.mp3';
import gardenBgm2 from './assets/audio/Erica.mp3'
import battleBgm from './assets/audio/Scramble_Line.mp3';
import battleBgm2 from './assets/audio/Thunderbolt.mp3';
import './styles/battle.css';

type CharaKey = 'princess' | 'kunoichi';
type EnemyKey = keyof typeof enemies;

const CHARACTERS: Record<CharaKey, { player: Player; cards: Card[]; deck: string[] }> = {
  princess: {
    player: { name: '王女', maxHp: 80, startDeckNo: 1, img: princessImg },
    cards: princessCards,
    deck: princessStarterDeck,
  },
  kunoichi: {
    player: { name: 'くのいち', maxHp: 70, startDeckNo: 2, img: kunoichiImg },
    cards: kunoichiCards,
    deck: kunoichiStarterDeck,
  },
};

function resolveDeck(deckIds: string[], cards: Card[]): Card[] {
  return deckIds.map(id => cards.find(card => card.id === id)!).filter(Boolean);
}

const CHARA_OPTIONS: CharaOption[] = [
  {
    key: 'princess',
    name: '王女',
    archetype: 'STANDARD',
    tagline: '剣と盾を使った攻守のバランスの良い戦闘スタイル',
    maxHp: 80,
    img: princessImg,
    starterDeck: resolveDeck(princessStarterDeck, princessCards),
  },
  {
    key: 'kunoichi',
    name: 'くのいち',
    archetype: 'TECHNICAL',
    tagline: '気と残像で翻弄するテクニカルな戦闘スタイル',
    maxHp: 70,
    img: kunoichiImg,
    starterDeck: resolveDeck(kunoichiStarterDeck, kunoichiCards),
  },
];

function initRunState(charaKey: CharaKey): RunState {
  const { player, cards, deck } = CHARACTERS[charaKey];
  return {
    player,
    currentHp: player.maxHp,
    currentFloor: 0,
    gold: 0,
    deck: resolveDeck(deck, cards),
  };
}

export function App() {
  const [gamePhase, setGamePhase] = useState<GamePhase>('Title');
  const [charaKey, setCharaKey] = useState<CharaKey>('princess');
  const [runState, setRunState] = useState<RunState>(() => initRunState('princess'));
  const [currentNode, setCurrentNode] = useState<MapNode | null>(null);
  const [rewardCandidates, setRewardCandidates] = useState<Card[]>([]);
  const [bgmEnabled, setBgmEnabled] = useState(false);
  const [bgmVolume, setBgmVolume] = useState(0.3);
  const fieldFadeIntervalRef = useRef<number | null>(null);
  const battleFadeIntervalRef = useRef<number | null>(null);

  const fieldAudio = useMemo(() => {
    const audios = [gardenBgm, gardenBgm2];
    const audio = new Audio(Math.random() < 0.5 ? audios[0] : audios[1]);
    audio.loop = true;
    audio.volume = 0;
    return audio;
  }, []);
  const battleAudio = useMemo(() => {
    const audio = new Audio(battleBgm2);
    audio.loop = true;
    audio.volume = 0;
    return audio;
  }, []);

  function runFade(audio: HTMLAudioElement, targetVolume: number, fadeIntervalRef: React.MutableRefObject<number | null>) {
    if (fadeIntervalRef.current !== null) {
      clearInterval(fadeIntervalRef.current);
    }
    const startVolume = audio.volume;
    const durationMs = 3000;
    const stepMs = 50;
    const steps = durationMs / stepMs;
    let stepCount = 0;

    fadeIntervalRef.current = window.setInterval(() => {
      stepCount += 1;
      const progress = Math.min(stepCount / steps, 1);
      audio.volume = startVolume + (targetVolume - startVolume) * progress;
      if (progress >= 1) {
        if (fadeIntervalRef.current !== null) {
          clearInterval(fadeIntervalRef.current);
        }
        fadeIntervalRef.current = null;
      }
    }, stepMs);
  }

  useEffect(() => {
    const inField = gamePhase === 'Title' || gamePhase === 'CharacterSelect' || gamePhase === 'Map';
    const inBattle = gamePhase === 'Battle' || gamePhase === 'Reward';

    if (!bgmEnabled) {
      if (fieldFadeIntervalRef.current !== null) clearInterval(fieldFadeIntervalRef.current);
      if (battleFadeIntervalRef.current !== null) clearInterval(battleFadeIntervalRef.current);
      fieldFadeIntervalRef.current = null;
      battleFadeIntervalRef.current = null;
      fieldAudio.volume = 0;
      battleAudio.volume = 0;
      fieldAudio.pause();
      battleAudio.pause();
      return;
    }

    fieldAudio.play().catch(() => undefined);
    battleAudio.play().catch(() => undefined);

    if (inField) {
      runFade(fieldAudio, bgmVolume, fieldFadeIntervalRef);
      runFade(battleAudio, 0, battleFadeIntervalRef);
    } else if (inBattle) {
      runFade(fieldAudio, 0, fieldFadeIntervalRef);
      runFade(battleAudio, bgmVolume, battleFadeIntervalRef);
    }
  }, [gamePhase, fieldAudio, battleAudio]);



  useEffect(() => {
    const inField = gamePhase === 'Title' || gamePhase === 'CharacterSelect' || gamePhase === 'Map';
    const inBattle = gamePhase === 'Battle' || gamePhase === 'Reward';

    if (fieldFadeIntervalRef.current !== null) clearInterval(fieldFadeIntervalRef.current);
    if (battleFadeIntervalRef.current !== null) clearInterval(battleFadeIntervalRef.current);
    fieldFadeIntervalRef.current = null;
    battleFadeIntervalRef.current = null;

    if (!bgmEnabled) {
      fieldAudio.volume = 0;
      battleAudio.volume = 0;
      fieldAudio.pause();
      battleAudio.pause();
      return;
    }

    fieldAudio.play().catch(() => undefined);
    battleAudio.play().catch(() => undefined);
    fieldAudio.volume = inField ? bgmVolume : 0;
    battleAudio.volume = inBattle ? bgmVolume : 0;
  }, [bgmEnabled, bgmVolume, gamePhase, fieldAudio, battleAudio]);

  useEffect(() => () => {
    if (fieldFadeIntervalRef.current !== null) clearInterval(fieldFadeIntervalRef.current);
    if (battleFadeIntervalRef.current !== null) clearInterval(battleFadeIntervalRef.current);
    fieldAudio.pause();
    battleAudio.pause();
  }, [fieldAudio, battleAudio]);

  function handleConfirmChara(key: string) {
    const resolvedKey = key as CharaKey;
    setCharaKey(resolvedKey);
    setRunState(initRunState(resolvedKey));
    setGamePhase('Map');
  }

  function handleEnterBattle(node: MapNode) {
    setCurrentNode(node);
    setGamePhase('Battle');
  }

  function handleVictory(remainingHp: number) {
    if (remainingHp <= 0) {
      throw new Error('想定外のエラー発生: 勝利後にHPが0以下になっています。');
    }
    setRunState(prev => ({
      ...prev,
      currentHp: Math.min(prev.player.maxHp, Math.floor(remainingHp * 1.1)),
    }));
    setRewardCandidates(getRewardCandidates(CHARACTERS[charaKey].cards));
    setGamePhase('Reward');
  }

  function handleSelectReward(card: Card) {
    setRunState(prev => ({
      ...prev,
      deck: [...prev.deck, card],
      currentFloor: currentNode?.floor ?? prev.currentFloor + 1,
    }));
    setCurrentNode(null);
    setGamePhase('Map');
  }

  function handleSkipReward() {
    setRunState(prev => ({
      ...prev,
      currentFloor: currentNode?.floor ?? prev.currentFloor + 1,
    }));
    setCurrentNode(null);
    setGamePhase('Map');
  }

  function handleDefeat() {
    setGamePhase('GameOver');
  }

  function handleRestart() {
    setRunState(initRunState(charaKey));
    setCurrentNode(null);
    setRewardCandidates([]);
    setGamePhase('Title');
  }

  const enemyForBattle = currentNode
    ? (enemies as Record<EnemyKey, (typeof enemies)[EnemyKey]>)[currentNode.enemyKey as EnemyKey]
    : null;

  if (gamePhase === 'Title') {
    return <TitleScreen onStart={() => setGamePhase('CharacterSelect')} bgmEnabled={bgmEnabled} bgmVolume={bgmVolume} onToggleBgm={() => setBgmEnabled(v => !v)} onChangeBgmVolume={setBgmVolume} />;
  }

  if (gamePhase === 'CharacterSelect') {
    return (
      <CharacterSelectScreen
        characters={CHARA_OPTIONS}
        initialSelected={charaKey}
        onConfirm={handleConfirmChara}
        onBack={() => setGamePhase('Title')}
        bgmEnabled={bgmEnabled}
        bgmVolume={bgmVolume}
        onToggleBgm={() => setBgmEnabled(v => !v)}
        onChangeBgmVolume={setBgmVolume}
      />
    );
  }

  if (gamePhase === 'Map') {
    return (
      <MapScreen
        runState={runState}
        mapNodes={MAP_NODES}
        onEnterBattle={handleEnterBattle}
        bgmEnabled={bgmEnabled}
        bgmVolume={bgmVolume}
        onToggleBgm={() => setBgmEnabled(v => !v)}
        onChangeBgmVolume={setBgmVolume}
      />
    );
  }

  if (gamePhase === 'Battle' && enemyForBattle) {
    return (
      <BattleScreen
        key={currentNode?.enemyKey}
        player={runState.player}
        deck={runState.deck}
        enemies={[enemyForBattle]}
        startHp={runState.currentHp}
        onVictory={handleVictory}
        onDefeat={handleDefeat}
        bgmEnabled={bgmEnabled}
        bgmVolume={bgmVolume}
        onToggleBgm={() => setBgmEnabled(v => !v)}
        onChangeBgmVolume={setBgmVolume}
      />
    );
  }

  if (gamePhase === 'Reward') {
    return (
      <RewardScreen
        candidates={rewardCandidates}
        onSelect={handleSelectReward}
        onSkip={handleSkipReward}
      />
    );
  }

  if (gamePhase === 'GameOver') {
    return (
      <GameOverScreen
        floorReached={runState.currentFloor}
        onRestart={handleRestart}
      />
    );
  }

  return null;
}
