import { Suit, Rank, GameMode, EndReason } from './constants';

export interface Card {
  rank: Rank;
  suit: Suit;
  value10: number;  // face value for non-aces (2-10=face, J/Q/K=10)
  isAce: boolean;
}

export interface Stack {
  cards: Card[];
  locked: boolean;
}

export interface GameState {
  seed: string;
  mode: GameMode;
  timerSecs: number;
  timeLeft: number;
  deck: Card[];
  drawIndex: number;
  nextCard: Card | null;
  stacks: Stack[];
  waste: Card | null;
  score: number;
  streakCount: number;
  lastClearAtMs: number | null;
  busts: number;
  clears: number;
  clearedAllFourOnce: boolean;
  flags: {
    paused: boolean;
    soundOn: boolean;
    lockOnBust: boolean;
    wasteEnabled: boolean;
  };
  ended: boolean;
  endReason: EndReason;
  // Track which stacks have been cleared for perfect bonus
  stacksClearedHistory: boolean[];
  // Track how many times each stack has been cleared
  stackClearCounts: number[];
}

export interface GameSettings {
  timerSecs: number;
  wasteEnabled: boolean;
  lockOnBust: boolean;
  soundOn: boolean;
}

export interface ScoreRecord {
  id: string;
  seed: string;
  mode: GameMode;
  score: number;
  busts: number;
  clears: number;
  durationSecs: number;
  playerName: string;
  settings: Partial<GameSettings>;
  createdAt: string;
}

export interface BestTotal {
  total: number;
  soft: boolean; // true if any ace is counted as 11
}