import type { Card } from '../types';
import { princessCards, princessStarterDeck, princessDropCards } from './princess';
import { kunoichiCards, kunoichiStarterDeck, kunoichiDropCards } from './kunoichi';

export * from './princess';
export * from './kunoichi';

export const allCards: Card[] = [...princessCards, ...kunoichiCards];
export const starterDeck: string[] = [...princessStarterDeck, ...kunoichiStarterDeck];
export const dropCards: string[] = [...princessDropCards, ...kunoichiDropCards];
