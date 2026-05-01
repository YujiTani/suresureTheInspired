import type { EffectCategory } from '../types';

let seEnabled = true;
let seVolume = 0.3;

export function setSEEnabled(enabled: boolean): void {
  seEnabled = enabled;
}

export function setSEVolume(volume: number): void {
  seVolume = volume;
}

const SE_BY_CATEGORY: Record<EffectCategory, string> = {
  slash: new URL('../assets/SE/SE_slash_06.wav', import.meta.url).href,
  heavySlash: new URL('../assets/SE/SE_slash_06.wav', import.meta.url).href,
  lightSlash: new URL('../assets/SE/SE_slash_03.mp3', import.meta.url).href,
  multiSlash: new URL('../assets/SE/SE_slash_02.mp3', import.meta.url).href,
  aoe: new URL('../assets/SE/SE_slash_06.wav', import.meta.url).href,
  strike: new URL('../assets/SE/SE_heavy_strike.mp3', import.meta.url).href, // ← 打撃SE（変更可）
  fire: new URL('../assets/SE/SE_fire.mp3', import.meta.url).href, // ← 炎SE（変更可）
  shield: new URL('../assets/SE/SE_shiled_up.mp3', import.meta.url).href,       // ← シールドSE（変更可）
  buff: new URL('../assets/SE/SE_buff_shine.wav', import.meta.url).href,  // ← バフSE（変更可）
  upStatus: new URL('../assets/SE/SE_buff_powerup.mp3', import.meta.url).href, // ← ステータスアップSE（変更可）
  phantom: new URL('../assets/SE/SE_buff02.mp3', import.meta.url).href, // ← ファントムSE（変更可）
  debuff: new URL('../assets/SE/SE_debuff01.wav', import.meta.url).href,    // ← デバフSE（変更可）
  downStatus: new URL('../assets/SE/SE_debuff03.wav', import.meta.url).href, // ← ステータスダウンSE（変更可）
  special: new URL('../assets/SE/SE_heavy_finisher.mp3', import.meta.url).href,
};

const audioCache: Partial<Record<EffectCategory, HTMLAudioElement>> = {};

export function playSE(category: EffectCategory): void {
  if (!seEnabled) return;
  if (!audioCache[category]) {
    audioCache[category] = new Audio(SE_BY_CATEGORY[category]);
  }
  const audio = audioCache[category]!;
  audio.currentTime = 0;
  audio.volume = seVolume;
  audio.play().catch(() => { });
}

// --- 勝利演出音 ---

let victoryAchieve: HTMLAudioElement | null = null;
let victoryFanfare: HTMLAudioElement | null = null;
let enemyAttackAudio: HTMLAudioElement | null = null;

export function playEnemyAttackSE(): void {
  if (!seEnabled) return;
  if (!enemyAttackAudio) {
    enemyAttackAudio = new Audio(new URL('../assets/SE/SE_thrust_02.mp3', import.meta.url).href);
  }
  enemyAttackAudio.currentTime = 0;
  enemyAttackAudio.volume = seVolume;
  enemyAttackAudio.play().catch(() => {});
}

export function playVictorySequence(): void {
  if (!seEnabled) return;
  if (!victoryAchieve) {
    victoryAchieve = new Audio(new URL('../assets/SE/SE_achieve.mp3', import.meta.url).href);
  }
  if (!victoryFanfare) {
    victoryFanfare = new Audio(new URL('../assets/SE/SE_buff_02.wav', import.meta.url).href);
  }
  const fanfare = victoryFanfare;
  const capturedVolume = seVolume;
  victoryAchieve.currentTime = 0;
  victoryAchieve.volume = capturedVolume;
  victoryAchieve.onended = () => {
    fanfare.currentTime = 0;
    fanfare.volume = seVolume;
    fanfare.play().catch(() => { });
  };
  victoryAchieve.play().catch(() => { });
}

// --- UI 操作音 ---

export type UISoundKey = 'select' | 'encount' | 'tap' | 'impact' | 'shuiin' | 'zubashu' | 'gameStart';

const UI_SE: Record<UISoundKey, string> = {
  select: new URL('../assets/SE/SE_ui_select.wav', import.meta.url).href,
  encount: new URL('../assets/SE/SE_encount.wav', import.meta.url).href,
  tap: new URL('../assets/SE/SE_ui_tap.wav', import.meta.url).href,
  impact: new URL('../assets/SE/SE_ui_impact.mp3', import.meta.url).href,
  shuiin: new URL('../assets/SE/SE_ui_shuiin.wav', import.meta.url).href,
  zubashu: new URL('../assets/SE/SE_ui_zubashu.wav', import.meta.url).href,
  gameStart: new URL('../assets/SE/SE_game_start.wav', import.meta.url).href,
};

const uiAudioCache: Partial<Record<UISoundKey, HTMLAudioElement>> = {};

export function playUISE(key: UISoundKey): void {
  if (!seEnabled) return;
  if (!uiAudioCache[key]) {
    uiAudioCache[key] = new Audio(UI_SE[key]);
  }
  const audio = uiAudioCache[key]!;
  audio.currentTime = 0;
  audio.volume = seVolume;
  audio.play().catch(() => { });
}
