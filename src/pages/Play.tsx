import { useEffect, useCallback, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useGameState } from '@/hooks/useGameState';
import { loadSettings } from '@/lib/storage';
import { TopBar } from '@/components/TopBar';
import { StackColumn } from '@/components/StackColumn';
import { DeckPanel } from '@/components/DeckPanel';
import { WasteSlot } from '@/components/WasteSlot';
import { ControlsHelp } from '@/components/ControlsHelp';
import { ScoreBreakdown } from '@/components/ScoreBreakdown';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { bestTotal } from '@/lib/blackjack';
import { GAME_CONSTANTS } from '@/lib/constants';
import { cn } from '@/lib/utils';
const Play = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const seed = searchParams.get('seed') || undefined;
  const settings = loadSettings();
  const [focusedElement, setFocusedElement] = useState<string | number | null>(null);
  const [hoveredStack, setHoveredStack] = useState<number | null>(null);
  const [gameEffects, setGameEffects] = useState<{
    showConfetti: boolean;
    showRedFlash: boolean;
    shakeContainer: boolean;
  }>({
    showConfetti: false,
    showRedFlash: false,
    shakeContainer: false
  });
  const {
    gameState,
    drawNext,
    placeOnStack,
    placeInWaste,
    pauseGame,
    resetGame,
    toggleSound
  } = useGameState(seed, settings);

  // Update URL with seed if not present
  useEffect(() => {
    if (gameState.seed && !seed) {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('seed', gameState.seed);
      window.history.replaceState({}, '', newUrl.toString());
    }
  }, [gameState.seed, seed]);
  const handleBackHome = () => {
    navigate('/');
  };
  const handleSettings = () => {
    // TODO: Implement settings modal
    console.log('Settings clicked');
  };
  const getStackLegality = (stackIndex: number) => {
    if (!gameState.nextCard) return true;
    const stack = gameState.stacks[stackIndex];
    if (stack.locked) return false;
    const currentTotal = bestTotal(stack.cards).total;
    const newTotal = bestTotal([...stack.cards, gameState.nextCard]).total;
    return newTotal <= GAME_CONSTANTS.BLACKJACK_TARGET;
  };
  const getLegalStacks = () => {
    return gameState.stacks.map((_, index) => ({
      index,
      legal: getStackLegality(index)
    })).filter(s => s.legal);
  };
  const shouldHighlightStack = (stackIndex: number) => {
    const legalStacks = getLegalStacks();
    return legalStacks.length === 1 && legalStacks[0].index === stackIndex && hoveredStack === null;
  };
  const handleStackHover = (stackIndex: number | null) => {
    setHoveredStack(stackIndex);
  };
  const handleElementFocus = (element: string | number | null) => {
    setFocusedElement(element);
  };
  return <div className={cn("min-h-screen flex flex-col transition-all duration-300", gameEffects.shakeContainer && "container-shake", gameEffects.showRedFlash && "red-flash")}>
      {/* Confetti overlay */}
      {gameEffects.showConfetti && <div className="fixed inset-0 pointer-events-none z-50">
          <div className="confetti-burst text-6xl text-center pt-20">
            🎉 Perfect! 🎉
          </div>
        </div>}

      {/* Swiftie Hero */}
      <section className="tsw-hero">
        <div className="tsw-hero__inner">
          <div className="tsw-hero__title">
            <h1 className="text-3xl font-extralight text-left">Stack your cards like Taylor stacks her eras.</h1>
          </div>
          <div className="tsw-hero__image">
            <img src="/TSWIZBANNER.png" alt="Taylor QB pose" />
          </div>
        </div>
      </section>

      {/* Floating HUD */}
      <div className="tsw-hud">
        <div className="hud-chip">
          <span className="label">Score</span>
          <span className="value green" id="hudScore">{gameState.score}</span>
        </div>
        <div className="hud-chip">
          <span className="label">Timer</span>
          <span className="value warn" id="hudTimer">
            {Math.floor(gameState.timeLeft / 60)}:{(gameState.timeLeft % 60).toString().padStart(2, '0')}
          </span>
        </div>
        <div className="hud-chip code">
          <span className="value" id="hudRoom">{gameState.seed}</span>
          <button className="copy" aria-label="Copy code" onClick={() => navigator.clipboard?.writeText(gameState.seed || '')}>📋</button>
        </div>
        <button className="hud-quit" id="hudQuit" onClick={handleBackHome}>QUIT</button>
      </div>

      {/* Main game area */}
      <div className="flex-1 p-4 space-y-6">
        {/* Game stacks */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {gameState.stacks.map((stack, index) => <StackColumn key={index} stack={stack} stackIndex={index} clearCount={gameState.stackClearCounts[index]} bustCount={gameState.stackBustCounts[index]} onPlace={placeOnStack} disabled={gameState.ended || gameState.flags.paused || !gameState.nextCard} nextCard={gameState.nextCard} focused={focusedElement === index} dimmed={focusedElement !== null && focusedElement !== index} onHover={handleStackHover} shouldHighlight={shouldHighlightStack(index)} />)}
        </div>

        {/* Draw area and waste */}
        {!gameState.ended && <div className="flex items-center justify-center space-x-4 md:space-x-8">
            {/* Draw pile and next card side by side on all screen sizes */}
              <DeckPanel cardsLeft={gameState.deck.length - gameState.drawIndex} deckSize={gameState.deck.length} nextCard={gameState.nextCard} onDraw={drawNext} focused={focusedElement === 'nextCard'} dimmed={focusedElement !== null && focusedElement !== 'nextCard'} onHover={handleElementFocus} />
              
              {gameState.flags.wasteEnabled && <WasteSlot card={gameState.waste} onPlace={placeInWaste} disabled={gameState.ended || gameState.flags.paused || !gameState.nextCard} />}
          </div>}


        {gameState.flags.paused && <div className="text-center">
            <div className="inline-block bg-warning text-warning-foreground px-4 py-2 rounded-lg">
              Game Paused - Use controls in top bar to resume
            </div>
          </div>}

        {gameState.ended && <div className="text-center space-y-4">
            <div className="inline-block bg-white px-6 py-4 rounded-lg max-w-sm border border-border">
              <h3 className="text-lg font-bold mb-2 text-gray-800">Game Over!</h3>
              <p className="text-sm text-gray-600">
                Reason: {gameState.endReason === 'TIME' ? 'Time expired' : 'Deck exhausted'}
              </p>
              <div className="mt-4 space-y-1 text-gray-700">
                <div><span className="font-bold">Final Score:</span> <span className="font-bold text-primary">{gameState.score}</span></div>
                <div>Scores: {gameState.clears}</div>
                <div>Fumbles: {gameState.busts}</div>
              </div>
              <ScoreBreakdown gameState={gameState} />
            </div>
            
            <div className="space-x-4">
              <Button onClick={() => resetGame()} className="bg-hotPink text-hotPink-foreground hover:bg-hotPink/90">
                Play Again
              </Button>
              <Button onClick={handleBackHome} variant="outline">
                Back to Home
              </Button>
            </div>
          </div>}
      </div>
    </div>;
};
export default Play;