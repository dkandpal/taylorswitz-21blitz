import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { loadRecentScores } from '@/lib/storage';
import { ScoreRecord } from '@/lib/types';
import { formatTime } from '@/lib/blackjack';
import { ArrowLeft, Trophy, Timer, Target } from 'lucide-react';

const Leaderboard = () => {
  const navigate = useNavigate();
  const [scores, setScores] = useState<ScoreRecord[]>([]);
  
  useEffect(() => {
    setScores(loadRecentScores());
  }, []);

  const allTimeScores = scores
    .sort((a, b) => b.score - a.score)
    .slice(0, 50);

  const todayScores = scores
    .filter(score => {
      const today = new Date().toDateString();
      const scoreDate = new Date(score.createdAt).toDateString();
      return today === scoreDate;
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 50);

  const ScoreRow = ({ score, rank }: { score: ScoreRecord; rank: number }) => (
    <div className="flex items-center justify-between p-4 border-b border-game-border last:border-b-0">
      <div className="flex items-center space-x-4">
        <div className="text-center min-w-[2rem]">
          {rank <= 3 ? (
            <div className={`text-lg ${
              rank === 1 ? 'text-warning' :
              rank === 2 ? 'text-muted-foreground' :
              'text-warning-foreground'
            }`}>
              {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
            </div>
          ) : (
            <div className="text-muted-foreground">#{rank}</div>
          )}
        </div>
        
        <div>
          <div className="font-medium text-foreground">{score.playerName}</div>
          <div className="text-sm text-muted-foreground">
            {new Date(score.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-4 text-sm">
        <Badge variant="outline">
          {score.mode}
        </Badge>
        
        <div className="text-center">
          <div className="font-bold text-primary">{score.score}</div>
          <div className="text-xs text-muted-foreground">score</div>
        </div>
        
        <div className="text-center">
          <div className="text-success">{score.clears}</div>
          <div className="text-xs text-muted-foreground">21s</div>
        </div>
        
        <div className="text-center">
          <div className="text-danger">{score.busts}</div>
          <div className="text-xs text-muted-foreground">fumbles</div>
        </div>
        
        <div className="text-center">
          <div className="text-foreground">{formatTime(score.durationSecs)}</div>
          <div className="text-xs text-muted-foreground">time</div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/play?seed=${score.seed}`)}
          className="text-xs"
        >
          Replay
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <h1 className="text-3xl font-bold flex items-center text-foreground">
            <Trophy className="w-8 h-8 mr-2 text-primary" />
            Leaderboard
          </h1>
          
          <div></div>
        </div>

        {/* Stats overview */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-4 text-center bg-gradient-surface border-game-border">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-warning" />
            <div className="text-2xl font-bold text-foreground">
              {allTimeScores[0]?.score || 0}
            </div>
            <div className="text-sm text-muted-foreground">Best Score</div>
          </Card>
          
          <Card className="p-4 text-center bg-gradient-surface border-game-border">
            <Timer className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold text-foreground">
              {scores.length}
            </div>
            <div className="text-sm text-muted-foreground">Games Played</div>
          </Card>
          
          <Card className="p-4 text-center bg-gradient-surface border-game-border">
            <Target className="w-8 h-8 mx-auto mb-2 text-success" />
            <div className="text-2xl font-bold text-foreground">
              {scores.reduce((sum, s) => sum + s.clears, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total 21s</div>
          </Card>
        </div>

        {/* Leaderboard tabs */}
        <Card className="p-6 bg-gradient-surface border-game-border">
          <Tabs defaultValue="all-time" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="all-time">All-Time</TabsTrigger>
              <TabsTrigger value="today">Today</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all-time" className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Top Scores of All Time</h3>
              <div className="border border-game-border rounded-lg overflow-hidden">
                {allTimeScores.length > 0 ? (
                  allTimeScores.map((score, index) => (
                    <ScoreRow key={score.id} score={score} rank={index + 1} />
                  ))
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    No scores yet. Be the first to play!
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="today" className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Today's Best</h3>
              <div className="border border-game-border rounded-lg overflow-hidden">
                {todayScores.length > 0 ? (
                  todayScores.map((score, index) => (
                    <ScoreRow key={score.id} score={score} rank={index + 1} />
                  ))
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    No games played today. Start playing to see your scores!
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Quick actions */}
        <div className="text-center space-x-4">
          <Button 
            onClick={() => navigate('/play')}
            className="bg-gradient-primary"
          >
            Play Now
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
          >
            Refresh Scores
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;