/// <reference types="vite/client" />

interface Window {
  __debug?: {
    addCard: (cardId: string) => void;
    playCardFree: (cardId: string) => void;
    setKi: (n: number) => void;
    setEnergy: (n: number) => void;
    listCards: () => void;
  };
}
