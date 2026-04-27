import { useEffect, type Dispatch, type SetStateAction } from 'react';
import type { BattleState } from '../types';
import { allCards } from '../cards';
import { playCard } from '../gameLogic';

export function useDebugApi(setState: Dispatch<SetStateAction<BattleState>>) {
  useEffect(() => {
    if (!import.meta.env.DEV) return;

    window.__debug = {
      addCard: (cardId: string) => {
        const findCard = allCards.find((c) => c.id === cardId);
        if (!findCard) {
          console.warn(`Card with id "${cardId}" not found.`);
          return;
        }

        setState(prev => ({
          ...prev,
          playerState: {
            ...prev.playerState,
            hand: [...prev.playerState.hand, findCard],
          },
        }));
      },

      playCardFree: (cardId: string) => {
        // TODO(human): コスト無視でカードを即プレイする
        // 手順:
        //   1. allCards からカードを検索（見つからなければ console.warn して return）
        //   2. setState(prev => { ... }) の中で:
        //      a. hand にカードを追加した状態を作る
        //      b. currentEnergy を card.cost 分だけ増やす（playCard 内で同額が引かれて相殺される）
        //      c. playCard(stateWithCard, handIndex, 0) を呼んで返す
        //         handIndex = stateWithCard.playerState.hand.length - 1（末尾に追加したので）
      },
      setKi: (n: number) => {
        setState((prev) => ({
          ...prev,
          playerState: {
            ...prev.playerState,
            ki: Math.max(0, n),
          },
        }));
      },
      setEnergy: (n: number) => {
        setState((prev) => ({
          ...prev,
          playerState: {
            ...prev.playerState,
            currentEnergy: Math.max(0, n),
          },
        }));
      },
      listCards: () => {
        console.table(allCards.map(c => ({ id: c.id, name: c.name, cost: c.cost, attribute: c.attribute, desc: c.description })));
      },
    };

    return () => { delete window.__debug; };
  }, [setState]);
}
