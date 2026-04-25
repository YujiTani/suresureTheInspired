import { describe, it, expect } from 'vitest';
import { initBattle, playCard, executeEnemyTurn as _executeEnemyTurn, startPlayerTurn as _startPlayerTurn } from '../gameLogic';
import type { Card, Enemy, Player } from '../types';

// --- テスト用フィクスチャ ---

const testPlayer: Player = {
  name: 'テストプレイヤー',
  maxHp: 80,
  startDeckNo: 1,
  illustrationUrl: null,
};

const strikeCard: Card = {
  id: 'TEST_STRIKE',
  cost: 1,
  name: 'ストライク',
  attribute: 'Attack',
  selfEffects: {},
  targetEffects: { HP: -6 },
  illustrationUrl: null,
  rarity: 'Common',
  description: '6ダメージ',
  target: 'Single',
};

const testEnemy: Enemy = {
  name: 'テスト敵',
  maxHp: 50,
  illustrationUrl: null,
  strength: 'Weak',
  enemyActions: [
    { type: 'Attack', value: 8, probability: 1.0 },
  ],
  dropTable: [],
};

function makeState() {
  return initBattle(testPlayer, [strikeCard, strikeCard, strikeCard, strikeCard, strikeCard], [testEnemy]);
}

// --- ログテスト ---

describe('battleLog', () => {
  it('initBattle 直後はログが空', () => {
    const state = makeState();
    expect(state.log).toHaveLength(0);
  });

  it('カードをプレイすると CardPlay ログが追加される', () => {
    const state = makeState();
    const next = playCard(state, 0, 0);
    const cardPlayLogs = next.log.filter(l => l.event === 'CardPlay');
    expect(cardPlayLogs).toHaveLength(1);
    expect(cardPlayLogs[0].message).toContain('ストライク');
  });

  it('カードで敵にダメージを与えると DamageDealt ログが追加される', () => {
    // TODO(human): ストライクをプレイして、ログに DamageDealt が含まれているか確認する
    // ヒント: next.log.filter(l => l.event === 'DamageDealt') でフィルタ
    // ヒント: ダメージ値 "6" がメッセージに含まれているか expect(...).toContain('6') で検証
  });

  it.todo('敵ターンに EnemyAction ログが追加される');

  it.todo('ターン開始時に TurnStart ログが追加される');
});
