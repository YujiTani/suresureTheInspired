import type { Card } from '../types';
import { shuffle } from '../gameLogic';

export function getRewardCandidates(cardPool: Card[], count: number = 3): Card[] {
  return shuffle([...cardPool]).slice(0, count);
}
