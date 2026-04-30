import { useEffect, useMemo, useState } from 'react';
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
import battleBgm from './assets/audio/Scramble_Line.mp3';
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
  const [fieldBgmEnabled, setFieldBgmEnabled] = useState(false);
  const [fieldBgmVolume, setFieldBgmVolume] = useState(0.6);
  const [battleBgmEnabled, setBattleBgmEnabled] = useState(false);
  const [battleBgmVolume, setBattleBgmVolume] = useState(0.6);

  const fieldAudio = useMemo(() => {
    const audio = new Audio(gardenBgm);
    audio.loop = true;
    return audio;
  }, []);
  const battleAudio = useMemo(() => {
    const audio = new Audio(battleBgm);
    audio.loop = true;
    return audio;
  }, []);

  useEffect(() => {
    const inField = gamePhase === 'Title' || gamePhase === 'CharacterSelect' || gamePhase === 'Map';
    const inBattle = gamePhase === 'Battle';

    fieldAudio.volume = inField && fieldBgmEnabled ? fieldBgmVolume : 0;
    battleAudio.volume = inBattle && battleBgmEnabled ? battleBgmVolume : 0;

    fieldAudio.play().catch(() => undefined);
    battleAudio.play().catch(() => undefined);
  }, [gamePhase, fieldBgmEnabled, fieldBgmVolume, battleBgmEnabled, battleBgmVolume, fieldAudio, battleAudio]);

  useEffect(() => () => {
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
    return <TitleScreen onStart={() => setGamePhase('CharacterSelect')} bgmEnabled={fieldBgmEnabled} bgmVolume={fieldBgmVolume} onToggleBgm={() => setFieldBgmEnabled(v => !v)} onChangeBgmVolume={setFieldBgmVolume} />;
  }

  if (gamePhase === 'CharacterSelect') {
    return (
      <CharacterSelectScreen
        characters={CHARA_OPTIONS}
        initialSelected={charaKey}
        onConfirm={handleConfirmChara}
        onBack={() => setGamePhase('Title')}
        bgmEnabled={fieldBgmEnabled}
        bgmVolume={fieldBgmVolume}
        onToggleBgm={() => setFieldBgmEnabled(v => !v)}
        onChangeBgmVolume={setFieldBgmVolume}
      />
    );
  }

  if (gamePhase === 'Map') {
    return (
      <MapScreen
        runState={runState}
        mapNodes={MAP_NODES}
        onEnterBattle={handleEnterBattle}
        bgmEnabled={fieldBgmEnabled}
        bgmVolume={fieldBgmVolume}
        onToggleBgm={() => setFieldBgmEnabled(v => !v)}
        onChangeBgmVolume={setFieldBgmVolume}
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
        bgmEnabled={battleBgmEnabled}
        bgmVolume={battleBgmVolume}
        onToggleBgm={() => setBattleBgmEnabled(v => !v)}
        onChangeBgmVolume={setBattleBgmVolume}
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
