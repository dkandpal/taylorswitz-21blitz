import { Card, BestTotal } from './types';
import { GAME_CONSTANTS } from './constants';

// Calculate best total with Aces (can be 1 or 11)
export function bestTotal(cards: Card[]): BestTotal {
  const values = cards.filter(c => !c.isAce).map(c => c.value10);
  const aceCount = cards.filter(c => c.isAce).length;
  
  // Start with all aces as 11
  let total = values.reduce((s,v)=>s+v, 0) + (aceCount * GAME_CONSTANTS.ACE_HIGH_VALUE);
  let soft = aceCount > 0;
  
  // Reduce 10 per Ace until <=21 or no aces remain counted as 11
  let acesAsEleven = aceCount;
  while (total > GAME_CONSTANTS.BLACKJACK_TARGET && acesAsEleven > 0) {
    total -= (GAME_CONSTANTS.ACE_HIGH_VALUE - GAME_CONSTANTS.ACE_LOW_VALUE);
    acesAsEleven--;
    soft = acesAsEleven > 0;
  }
  
  return { total, soft };
}

// Check if exactly 2 cards make blackjack (Ace + 10-value)
export function isBlackjack(cards: Card[]): boolean {
  if (cards.length !== 2) return false;
  
  const hasAce = cards.some(c => c.isAce);
  const hasTen = cards.some(c => c.value10 === GAME_CONSTANTS.FACE_CARD_VALUE);
  
  return hasAce && hasTen;
}

// Calculate score for a cleared stack
export function scoreForClear(
  cards: Card[], 
  streakEligible: boolean, 
  within5s: boolean
): number {
  let baseScore: number;
  
  if (isBlackjack(cards)) {
    baseScore = GAME_CONSTANTS.TWO_CARD_21;
  } else if (cards.length === 3) {
    baseScore = GAME_CONSTANTS.THREE_CARD_21;
  } else {
    baseScore = GAME_CONSTANTS.FOUR_PLUS_CARD_21;
  }
  
  // Add streak bonus if applicable
  if (streakEligible && within5s) {
    baseScore += GAME_CONSTANTS.STREAK_BONUS;
  }
  
  return baseScore;
}

// Check if all four stacks have been cleared at least once
export function allFourClearedAtLeastOnce(stacksClearedHistory: boolean[]): boolean {
  return stacksClearedHistory.length >= GAME_CONSTANTS.STACK_COUNT && 
         stacksClearedHistory.slice(0, GAME_CONSTANTS.STACK_COUNT).every(cleared => cleared);
}

// Format time as M:SS
export function formatTime(seconds: number): string {
  // Ensure we don't show negative time
  const safeSeconds = Math.max(0, seconds);
  const mins = Math.floor(safeSeconds / 60);
  const secs = safeSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Get card display name (for accessibility)
export function getCardName(card: Card): string {
  const suitNames = {
    '♠': 'Spades',
    '♥': 'Hearts', 
    '♦': 'Diamonds',
    '♣': 'Clubs'
  };
  
  const rankNames = {
    'A': 'Ace',
    'J': 'Jack',
    'Q': 'Queen', 
    'K': 'King'
  };
  
  const rankName = rankNames[card.rank as keyof typeof rankNames] || card.rank;
  const suitName = suitNames[card.suit];
  
  return `${rankName} of ${suitName}`;
}