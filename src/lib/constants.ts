// Game Constants - Easy to tune
export const GAME_CONSTANTS = {
  // Timer
  SPEED_MODE_TIMER: 150, // seconds
  
  // Scoring
  TWO_CARD_21: 150,
  THREE_CARD_21: 110,
  FOUR_PLUS_CARD_21: 90,
  STREAK_BONUS: 20,
  PERFECT_CLEAR_BONUS: 75,
  TIME_BONUS_PER_SECOND: 1,
  BUST_PENALTY: -50,
  DEAD_STACK_PENALTY: -10,
  WASTE_PENALTY: -15,
  
  // Streak timing
  STREAK_WINDOW_MS: 5000, // 5 seconds
  
  // UI
  CARD_FAN_OFFSET: 8, // pixels between cards in stack
  ANIMATION_DURATION: 300, // ms
  CONFETTI_DURATION: 800, // ms
  
  // Deck
  SUITS: ['♠', '♥', '♦', '♣'] as const,
  RANKS: ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'] as const,
  
  // Card values
  FACE_CARD_VALUE: 10,
  ACE_LOW_VALUE: 1,
  ACE_HIGH_VALUE: 11,
  
  // Game rules
  BLACKJACK_TARGET: 21,
  STACK_COUNT: 4,
} as const;

export type Suit = typeof GAME_CONSTANTS.SUITS[number];
export type Rank = typeof GAME_CONSTANTS.RANKS[number];
export type GameMode = 'SPEED';
export type EndReason = 'TIME' | 'DECK' | null;