import { useState, useCallback, useEffect, useRef } from 'react';
import { GameState, GameSettings } from '@/lib/types';
import { GAME_CONSTANTS } from '@/lib/constants';
import { createShuffledDeck } from '@/lib/deck';
import { bestTotal, scoreForClear, allFourClearedAtLeastOnce } from '@/lib/blackjack';
import { generateSeed } from '@/lib/rng';
import { generateScoreId, saveScore } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

export function useGameState(initialSeed?: string, settings?: GameSettings) {
  const { toast } = useToast();
  const gameStartTimeRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout>();
  
  const initializeGame = useCallback((seed?: string): GameState => {
    const gameSeed = seed || generateSeed();
    const deck = createShuffledDeck(gameSeed);
    
    const gameState: GameState = {
      seed: gameSeed,
      mode: 'SPEED',
      timerSecs: settings?.timerSecs || GAME_CONSTANTS.SPEED_MODE_TIMER,
      timeLeft: settings?.timerSecs || GAME_CONSTANTS.SPEED_MODE_TIMER,
      deck,
      drawIndex: 1, // Start after first card
      nextCard: deck[0], // First card is immediately revealed
      stacks: Array(GAME_CONSTANTS.STACK_COUNT).fill(null).map(() => ({
        cards: [],
        locked: false
      })),
      waste: null,
      score: 0,
      streakCount: 0,
      lastClearAtMs: null,
      busts: 0,
      clears: 0,
      clearedAllFourOnce: false,
      flags: {
        paused: false,
        soundOn: settings?.soundOn ?? true,
        lockOnBust: settings?.lockOnBust ?? false,
        wasteEnabled: settings?.wasteEnabled ?? false,
        
      },
      ended: false,
      endReason: null,
      stacksClearedHistory: Array(GAME_CONSTANTS.STACK_COUNT).fill(false),
      stackClearCounts: Array(GAME_CONSTANTS.STACK_COUNT).fill(0),
    };
    
    gameStartTimeRef.current = Date.now();
    return gameState;
  }, [settings]);

  const [gameState, setGameState] = useState(() => initializeGame(initialSeed));

  // Timer effect
  useEffect(() => {
    if (!gameState.flags.paused && 
        !gameState.ended && 
        gameState.timeLeft > 0) {
      
      timerRef.current = setTimeout(() => {
        setGameState(prev => {
          // If already ended or paused, don't change state
          if (prev.ended || prev.flags.paused) {
            return prev;
          }
          
          const newTimeLeft = Math.max(0, prev.timeLeft - 1);
          if (newTimeLeft === 0) {
            // Game ends when timer reaches 0
            return endGame({ ...prev, timeLeft: 0 }, 'TIME');
          }
          return { ...prev, timeLeft: newTimeLeft };
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [gameState.flags.paused, gameState.ended, gameState.timeLeft]);

  const endGame = useCallback((state: GameState, reason: 'TIME' | 'DECK'): GameState => {
    let finalScore = state.score;
    
    // Add time bonus if game ended early
    if (reason !== 'TIME') {
      const timeBonus = state.timeLeft * GAME_CONSTANTS.TIME_BONUS_PER_SECOND;
      finalScore += timeBonus;
    }
    
    // Perfect clear bonus
    if (allFourClearedAtLeastOnce(state.stacksClearedHistory) && !state.clearedAllFourOnce) {
      finalScore += GAME_CONSTANTS.PERFECT_CLEAR_BONUS;
    }
    
    // Penalties (waste if enabled)
    if (state.waste && state.flags.wasteEnabled) {
      finalScore += GAME_CONSTANTS.WASTE_PENALTY;
    }
    
    // Save score
    const durationSecs = Math.floor((Date.now() - gameStartTimeRef.current) / 1000);
    const scoreRecord = {
      id: generateScoreId(),
      seed: state.seed,
      mode: state.mode,
      score: finalScore,
      busts: state.busts,
      clears: state.clears,
      durationSecs,
      playerName: 'Player',
      settings: {
        wasteEnabled: state.flags.wasteEnabled,
        lockOnBust: state.flags.lockOnBust,
      },
      createdAt: new Date().toISOString(),
    };
    
    saveScore(scoreRecord);
    
    return {
      ...state,
      score: finalScore,
      ended: true,
      endReason: reason,
      clearedAllFourOnce: true, // Mark as awarded
    };
  }, []);

  const drawNext = useCallback(() => {
    setGameState(prev => {
      if (prev.drawIndex >= prev.deck.length) {
        return endGame(prev, 'DECK');
      }
      
      return {
        ...prev,
        nextCard: prev.deck[prev.drawIndex],
        drawIndex: prev.drawIndex + 1,
      };
    });
  }, [endGame]);

  const placeOnStack = useCallback((stackIndex: number) => {
    setGameState(prev => {
      if (!prev.nextCard || prev.ended || prev.flags.paused || prev.stacks[stackIndex].locked) {
        return prev;
      }

      const newStacks = [...prev.stacks];
      newStacks[stackIndex] = {
        ...newStacks[stackIndex],
        cards: [...newStacks[stackIndex].cards, prev.nextCard]
      };

      const { total } = bestTotal(newStacks[stackIndex].cards);
      let newScore = prev.score;
      let newBusts = prev.busts;
      let newClears = prev.clears;
      let newStreakCount = prev.streakCount;
      let newLastClearAtMs = prev.lastClearAtMs;
      let newStacksClearedHistory = [...prev.stacksClearedHistory];
      let newStackClearCounts = [...prev.stackClearCounts];
      
      const now = Date.now();
      
      if (total === GAME_CONSTANTS.BLACKJACK_TARGET) {
        // Clear!
        const within5s = newLastClearAtMs && (now - newLastClearAtMs) <= GAME_CONSTANTS.STREAK_WINDOW_MS;
        const clearScore = scoreForClear(newStacks[stackIndex].cards, newStreakCount > 0, within5s);
        
        newScore += clearScore;
        newClears++;
        newLastClearAtMs = now;
        newStreakCount = within5s ? newStreakCount + 1 : 1;
        
        // Mark this stack as cleared and increment its clear count
        newStacksClearedHistory[stackIndex] = true;
        newStackClearCounts[stackIndex]++;
        
        // Clear the stack and unlock all locked stacks
        newStacks[stackIndex] = { cards: [], locked: false };
        if (prev.flags.lockOnBust) {
          newStacks.forEach(stack => { stack.locked = false; });
        }
        
        toast({
          title: "21! 🎉",
          description: `+${clearScore} points`,
          duration: 2000,
        });
        
      } else if (total > GAME_CONSTANTS.BLACKJACK_TARGET) {
        // Bust!
        newScore += GAME_CONSTANTS.BUST_PENALTY;
        newBusts++;
        newStreakCount = 0;
        
        // Clear the stack and maybe lock it
        newStacks[stackIndex] = { 
          cards: [], 
          locked: prev.flags.lockOnBust 
        };
        
        toast({
          title: "Bust! 💥",
          description: `${GAME_CONSTANTS.BUST_PENALTY} points`,
          variant: "destructive",
          duration: 2000,
        });
      }

      // Check if deck is exhausted
      const newDrawIndex = prev.drawIndex + 1;
      if (newDrawIndex > prev.deck.length) {
        return endGame({
          ...prev,
          stacks: newStacks,
          nextCard: null,
          drawIndex: newDrawIndex,
          score: newScore,
          busts: newBusts,
          clears: newClears,
          streakCount: newStreakCount,
          lastClearAtMs: newLastClearAtMs,
          stacksClearedHistory: newStacksClearedHistory,
        }, 'DECK');
      }

      return {
        ...prev,
        stacks: newStacks,
        nextCard: prev.deck[prev.drawIndex] || null,
        drawIndex: newDrawIndex,
        score: newScore,
        busts: newBusts,
        clears: newClears,
        stacksClearedHistory: newStacksClearedHistory,
        stackClearCounts: newStackClearCounts,
      };
    });
  }, [endGame, toast]);

  const placeInWaste = useCallback(() => {
    setGameState(prev => {
      if (!prev.nextCard || prev.ended || prev.flags.paused || !prev.flags.wasteEnabled) {
        return prev;
      }

      const newDrawIndex = prev.drawIndex + 1;
      if (newDrawIndex > prev.deck.length) {
        return endGame({
          ...prev,
          waste: prev.nextCard,
          nextCard: null,
          drawIndex: newDrawIndex,
        }, 'DECK');
      }

      return {
        ...prev,
        waste: prev.nextCard,
        nextCard: prev.deck[prev.drawIndex] || null,
        drawIndex: newDrawIndex,
      };
    });
  }, [endGame]);

  const pauseGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      flags: { ...prev.flags, paused: !prev.flags.paused }
    }));
  }, []);

  const resetGame = useCallback((newSeed?: string) => {
    setGameState(initializeGame(newSeed || gameState.seed));
  }, [initializeGame, gameState.seed]);

  const toggleSound = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      flags: { ...prev.flags, soundOn: !prev.flags.soundOn }
    }));
  }, []);

  return {
    gameState,
    drawNext,
    placeOnStack,
    placeInWaste,
    pauseGame,
    resetGame,
    toggleSound,
    initializeGame: (seed?: string) => setGameState(initializeGame(seed)),
  };
}