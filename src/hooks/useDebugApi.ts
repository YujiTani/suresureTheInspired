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
        const findCard = allCards.find(card => card.id === cardId);
        if (!findCard) {
          console.warn(`Card with id "${cardId}" not found.`);
          return;
        }

        setState(prev => {
          const stateWithCard = {
            ...prev,
            playerState: {
              ...prev.playerState,
              currentEnergy: prev.playerState.currentEnergy + findCard.cost,
              hand: [...prev.playerState.hand, findCard],
            },
          };
          return playCard(stateWithCard, stateWithCard.playerState.hand.length - 1, 0);
        });
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
