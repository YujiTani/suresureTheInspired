import type { Card } from '../types';
import { shuffle } from '../gameLogic';

export function getRewardCandidates(cardPool: Card[], count: number = 4): Card[] {
  return shuffle([...cardPool]).slice(0, count);
}
