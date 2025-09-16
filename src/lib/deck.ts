import { Card } from './types';
import { GAME_CONSTANTS } from './constants';
import { shuffle } from './shuffle';
import { mulberry32 } from './rng';

// Create a standard 52-card deck
export function createDeck(): Card[] {
  const deck: Card[] = [];
  
  for (const suit of GAME_CONSTANTS.SUITS) {
    for (const rank of GAME_CONSTANTS.RANKS) {
      let value10: number;
      const isAce = rank === 'A';
      
      if (isAce) {
        value10 = GAME_CONSTANTS.ACE_LOW_VALUE; // We'll handle 11 in bestTotal calculation
      } else if (rank === 'J' || rank === 'Q' || rank === 'K') {
        value10 = GAME_CONSTANTS.FACE_CARD_VALUE;
      } else {
        value10 = parseInt(rank, 10);
      }
      
      deck.push({
        rank,
        suit,
        value10,
        isAce
      });
    }
  }
  
  return deck;
}

// Create and shuffle a deck with a seed
export function createShuffledDeck(seed: string): Card[] {
  const deck = createDeck();
  const rng = mulberry32(seed);
  return shuffle(deck, rng);
}