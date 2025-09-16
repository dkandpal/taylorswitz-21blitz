import { GameSettings, ScoreRecord } from './types';
import { GAME_CONSTANTS } from './constants';

const STORAGE_KEYS = {
  SETTINGS: 'blitz21:settings',
  RECENT_SCORES: 'blitz21:recent',
} as const;

// Default settings
export const DEFAULT_SETTINGS: GameSettings = {
  timerSecs: GAME_CONSTANTS.SPEED_MODE_TIMER,
  wasteEnabled: false,
  lockOnBust: false,
  soundOn: true,
};

// Load settings from localStorage
export function loadSettings(): GameSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch (error) {
    console.warn('Failed to load settings:', error);
  }
  return DEFAULT_SETTINGS;
}

// Save settings to localStorage
export function saveSettings(settings: GameSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.warn('Failed to save settings:', error);
  }
}

// Load recent scores from localStorage
export function loadRecentScores(): ScoreRecord[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.RECENT_SCORES);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Failed to load recent scores:', error);
  }
  return [];
}

// Save score to localStorage (keep last 20)
export function saveScore(score: ScoreRecord): void {
  try {
    const recent = loadRecentScores();
    recent.unshift(score);
    
    // Keep only last 20 scores
    const trimmed = recent.slice(0, 20);
    
    localStorage.setItem(STORAGE_KEYS.RECENT_SCORES, JSON.stringify(trimmed));
  } catch (error) {
    console.warn('Failed to save score:', error);
  }
}

// Generate unique ID for score record
export function generateScoreId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
