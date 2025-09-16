import { Card } from '@/components/ui/card';

interface ControlsHelpProps {
  wasteEnabled: boolean;
}

export function ControlsHelp({ wasteEnabled }: ControlsHelpProps) {
  return (
    <Card className="p-4 bg-game-surface border-game-border">
      <h3 className="text-sm font-medium text-foreground mb-3">Game Controls</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-2 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground text-xs">👆</span>
          </div>
          <div className="text-muted-foreground">Tap stacks to place cards</div>
        </div>
        
        {wasteEnabled && (
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-2 bg-secondary rounded-lg flex items-center justify-center">
              <span className="text-secondary-foreground text-xs">🗑️</span>
            </div>
            <div className="text-muted-foreground">Tap waste to discard</div>
          </div>
        )}
      </div>
    </Card>
  );
}