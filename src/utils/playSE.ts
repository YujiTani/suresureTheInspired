import type { EffectCategory } from '../types';

// TODO(human): 各カテゴリに使う SE ファイルを割り当ててください。
// src/assets/SE/ 配下のファイルから選びます（リネーム済みの名前で）。
// 実際に音を聞いてみて、カードの雰囲気に合うものを選ぶのがポイントです。
//
// 利用可能なファイル一覧 (src/assets/SE/):
//   斬撃系: SE_slash_01.wav, SE_slash_02.mp3, SE_slash_03.mp3, SE_slash_04.mp3,
//           SE_slash_05.wav, SE_slash_06.wav, SE_slash_light.wav,
//           SE_slash_dagger_01.mp3, SE_slash_dagger_02.mp3
//   重撃系: SE_heavy_swing.mp3, SE_heavy_strike.mp3, SE_heavy_finisher.mp3, SE_heavy_ready.wav
//   刺突系: SE_thrust_01.mp3, SE_thrust_02.mp3
//   防御系: SE_shield.mp3, SE_shield_heavy.mp3
//   パリィ: SE_parry.mp3, SE_parry_02.mp3
//   バフ系: SE_buff.mp3, SE_buff_02.wav, SE_buff_shine.wav, SE_buff_sparkle.mp3, SE_buff_powerup.mp3
//   回復系: SE_heal.wav, SE_heal_01.wav, SE_heal_02.wav
//   UI系 : SE_ui_select.wav, SE_encount.wav, SE_ui_shuiin.wav, SE_ui_zubashu.wav,
//           SE_ui_tap.wav, SE_ui_impact.mp3
//
// Record<EffectCategory, string> の全 8 カテゴリを埋めてください:
//   'slash' | 'heavySlash' | 'multiSlash' | 'aoe' | 'shield' | 'buff' | 'debuff' | 'special'
const SE_BY_CATEGORY: Record<EffectCategory, string> = {
  slash: new URL('../assets/SE/SE_slash_06.wav', import.meta.url).href,
  heavySlash: new URL('../assets/SE/SE_slash_06.wav', import.meta.url).href,
  lightSlash: new URL('../assets/SE/SE_slash_03.mp3', import.meta.url).href,
  multiSlash: new URL('../assets/SE/SE_slash_02.mp3', import.meta.url).href,
  aoe: new URL('../assets/SE/SE_slash_06.wav', import.meta.url).href,
  shield: new URL('../assets/SE/SE_shield.mp3', import.meta.url).href,
  buff: new URL('../assets/SE/SE_buff_shine.wav', import.meta.url).href,
  debuff: new URL('../assets/SE/SE_debuff_01.wav', import.meta.url).href,
  special: new URL('../assets/SE/SE_heavy_finisher.mp3', import.meta.url).href,
};

const audioCache: Partial<Record<EffectCategory, HTMLAudioElement>> = {};

export function playSE(category: EffectCategory): void {
  if (!audioCache[category]) {
    audioCache[category] = new Audio(SE_BY_CATEGORY[category]);
  }
  const audio = audioCache[category]!;
  audio.currentTime = 0;
  audio.play().catch(() => {
    // ブラウザの自動再生ポリシーでブロックされた場合は無視
  });
}

// --- UI 操作音 ---

export type UISoundKey = 'select' | 'encount' | 'tap' | 'impact' | 'shuiin' | 'zubashu';

const UI_SE: Record<UISoundKey, string> = {
  select: new URL('../assets/SE/SE_ui_select.wav', import.meta.url).href,
  encount: new URL('../assets/SE/SE_encount.wav', import.meta.url).href,
  tap: new URL('../assets/SE/SE_ui_tap.wav', import.meta.url).href,
  impact: new URL('../assets/SE/SE_ui_impact.mp3', import.meta.url).href,
  shuiin: new URL('../assets/SE/SE_ui_shuiin.wav', import.meta.url).href,
  zubashu: new URL('../assets/SE/SE_ui_zubashu.wav', import.meta.url).href,
};

const uiAudioCache: Partial<Record<UISoundKey, HTMLAudioElement>> = {};

export function playUISE(key: UISoundKey): void {
  if (!uiAudioCache[key]) {
    uiAudioCache[key] = new Audio(UI_SE[key]);
  }
  const audio = uiAudioCache[key]!;
  audio.currentTime = 0;
  audio.play().catch(() => { });
}
