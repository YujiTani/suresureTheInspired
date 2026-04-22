import { initBattle, playCard, startPlayerTurn, endPlayerTurn, executeEnemyTurn } from './gameLogic';
import { princessCards } from './cards/princess';
import { kunoichiCards } from './cards/kunoichi';
import type { BattleState, Card, Enemy, Player } from './types';

type CharaKey = 'princess' | 'kunoichi';

const CHARACTERS: Record<CharaKey, { player: Player; cards: Card[]; deck: string[] }> = {
  princess: {
    player: { name: '王女', maxHp: 80, startDeckNo: 1, illustrationUrl: null },
    cards: princessCards,
    deck: princessCards.map(c => c.id),
  },
  kunoichi: {
    player: { name: 'くのいち', maxHp: 70, startDeckNo: 2, illustrationUrl: null },
    cards: kunoichiCards,
    deck: kunoichiCards.map(c => c.id),
  },
};

let currentChara: CharaKey = 'princess';

const testEnemy: Enemy = {
  name: 'スライム',
  maxHp: 40,
  illustrationUrl: null,
  strength: 'Weak',
  enemyActions: [
    { type: 'Attack', value: 6, probability: 0.7 },
    { type: 'Buff',   value: 5, probability: 0.3 },
  ],
  dropTable: [],
};

function buildDeck(chara: CharaKey): Card[] {
  const { cards, deck } = CHARACTERS[chara];
  return deck.map(id => cards.find(c => c.id === id)!).filter(Boolean);
}

const testPlayer: Player = {
  name: '王女',
  maxHp: 80,
  startDeckNo: 1,
  illustrationUrl: null,
};

let state: BattleState = initBattle(testPlayer, buildDeck('princess'), [testEnemy]);

// TODO(human): カード1枚分のHTMLを返す
// card.name, card.cost, card.attribute, card.description,
// card.selfEffects, card.targetEffects, card.target を使って
// プレイヤーが判断できる情報を2〜6行のHTMLで表示してください
const ATTR_COLOR: Record<string, string> = {
  Attack: '#f66', Defense: '#66f', Skill: '#6c6', Power: '#fa0',
};

function fmtEffects(effects: Partial<Record<string, number>>): string {
  return Object.entries(effects)
    .map(([k, v]) => `${k}${v! > 0 ? '+' : ''}${v}`)
    .join(' ');
}

function renderCard(card: Card): string {
  const color = ATTR_COLOR[card.attribute] ?? '#aaa';
  const self   = fmtEffects(card.selfEffects);
  const target = fmtEffects(card.targetEffects);
  return `
    <div style="font-size:11px;color:${color};font-weight:bold;">[${card.attribute}]</div>
    <div style="font-size:13px;margin:2px 0;">${card.name}</div>
    <div style="font-size:11px;color:#ff0;">⚡${card.cost}</div>
    ${self   ? `<div style="font-size:10px;color:#8cf;">自: ${self}</div>`   : ''}
    ${target ? `<div style="font-size:10px;color:#f88;">敵: ${target}</div>` : ''}
    <div style="font-size:10px;color:#666;">${card.target}</div>
  `;
}

function bindEvents(): void {
  document.querySelectorAll<HTMLElement>('[data-card-index]').forEach(el => {
    el.addEventListener('click', () => {
      if (state.phase !== 'PlayerTurn') return;
      const index = parseInt(el.dataset.cardIndex!);
      const card = state.playerState.hand[index];
      if (!card || state.playerState.currentEnergy < card.cost) return;
      const targetIndex = card.target === 'Player' ? undefined : 0;
      state = playCard(state, index, targetIndex);
      render();
    });
  });

  document.getElementById('end-turn-btn')?.addEventListener('click', () => {
    state = endPlayerTurn(state);
    state = executeEnemyTurn(state);
    if (state.phase === 'PlayerTurn') state = startPlayerTurn(state);
    render();
  });

  document.querySelectorAll<HTMLElement>('[data-chara]').forEach(el => {
    el.addEventListener('click', () => {
      currentChara = el.dataset.chara as CharaKey;
      const chara = CHARACTERS[currentChara];
      state = initBattle(chara.player, buildDeck(currentChara), [testEnemy]);
      render();
    });
  });
}

function render(): void {
  const app = document.getElementById('app')!;
  const ps  = state.playerState;
  const enemy = state.enemies[0];

  app.innerHTML = `
    <div style="font-family:monospace;padding:20px;max-width:800px;margin:0 auto;background:#1a1a1a;color:#eee;min-height:100vh;">
      <h2 style="color:#aaa;">カードゲーム 動作確認 ｜ ターン ${state.turn}</h2>
      <div style="margin-bottom:12px;">
        ${(['princess', 'kunoichi'] as CharaKey[]).map(key => `
          <button data-chara="${key}"
                  style="padding:6px 16px;margin-right:8px;font-size:13px;
                         background:${currentChara === key ? '#555' : '#333'};
                         color:${currentChara === key ? '#fff' : '#aaa'};
                         border:1px solid ${currentChara === key ? '#aaa' : '#555'};
                         border-radius:4px;cursor:pointer;">
            ${CHARACTERS[key].player.name}
          </button>`).join('')}
        <span style="color:#555;font-size:12px;">（切替でバトルリセット）</span>
      </div>

      <div style="border:2px solid #c44;padding:12px;border-radius:8px;margin-bottom:12px;">
        <strong>${enemy.enemy.name}</strong>
        <span style="margin-left:16px;">HP: ${enemy.currentHp} / ${enemy.enemy.maxHp}</span>
        <span style="margin-left:8px;">🛡 ${enemy.shield}</span>
        <span style="margin-left:12px;color:#aaa;">Weak:${enemy.weak}  Vuln:${enemy.vulnerable}</span><br>
        <span style="color:#f90;">次の行動: ${enemy.nextAction ? `${enemy.nextAction.type} (${enemy.nextAction.value})` : '—'}</span>
      </div>

      <div style="border:2px solid #44c;padding:12px;border-radius:8px;margin-bottom:12px;">
        <strong>${state.player.name}</strong>
        <span style="margin-left:16px;">HP: ${ps.currentHp} / ${state.player.maxHp}</span>
        <span style="margin-left:8px;">🛡 ${ps.shield}</span>
        <span style="margin-left:8px;color:#ff0;">⚡ ${ps.currentEnergy}</span><br>
        <span style="color:#aaa;">ATK+${ps.attackPower}  DEF+${ps.defensePower}  Ki:${ps.ki}  Weak:${ps.weak}  Vuln:${ps.vulnerable}  Phantom:${ps.phantom}</span>
      </div>

      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;min-height:130px;">
        ${ps.hand.map((card, i) => {
          const playable = ps.currentEnergy >= card.cost;
          return `
            <div data-card-index="${i}"
                 style="border:2px solid ${playable ? '#888' : '#444'};
                        padding:8px;border-radius:6px;
                        cursor:${playable ? 'pointer' : 'not-allowed'};
                        background:${playable ? '#2a2a2a' : '#1e1e1e'};
                        opacity:${playable ? '1' : '0.5'};
                        min-width:110px;max-width:140px;">
              ${renderCard(card)}
            </div>`;
        }).join('')}
      </div>

      <p style="color:#888;margin-bottom:12px;">デッキ: ${ps.deck.length}枚 ｜ 捨て札: ${ps.discardPile.length}枚</p>

      ${state.phase === 'PlayerTurn'
        ? `<button id="end-turn-btn" style="padding:10px 24px;font-size:14px;background:#444;color:#eee;border:1px solid #888;border-radius:6px;cursor:pointer;">ターン終了</button>`
        : ''}
      ${state.phase === 'Victory' ? `<p style="color:#4f4;font-size:28px;margin-top:16px;">Victory!</p>` : ''}
      ${state.phase === 'Defeat'  ? `<p style="color:#f44;font-size:28px;margin-top:16px;">Defeat...</p>` : ''}
    </div>
  `;

  bindEvents();
}

render();
