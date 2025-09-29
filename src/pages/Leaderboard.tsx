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
    <div className="flex items-center justify-between p-4 border-b border-brand-border last:border-b-0 bg-brand-surface">
      <div className="flex items-center space-x-4">
        <div className="text-center min-w-[2rem]">
          {rank <= 3 ? (
            <div className={`text-lg ${
              rank === 1 ? 'text-warning' :
              rank === 2 ? 'text-brand-muted' :
              'text-warning-foreground'
            }`}>
              {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
            </div>
          ) : (
            <div className="text-brand-muted">#{rank}</div>
          )}
        </div>
        
        <div>
          <div className="font-medium text-brand-text">{score.playerName}</div>
          <div className="text-sm text-brand-muted">
            {new Date(score.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-4 text-sm">
        <Badge variant="outline" className="border-brand-border text-brand-muted">
          {score.mode}
        </Badge>
        
        <div className="text-center">
          <div className="font-bold text-brand-accent">{score.score}</div>
          <div className="text-xs text-brand-muted">score</div>
        </div>
        
        <div className="text-center">
          <div className="text-success">{score.clears}</div>
          <div className="text-xs text-brand-muted">21s</div>
        </div>
        
        <div className="text-center">
          <div className="text-danger">{score.busts}</div>
          <div className="text-xs text-brand-muted">fumbles</div>
        </div>
        
        <div className="text-center">
          <div className="text-brand-text">{formatTime(score.durationSecs)}</div>
          <div className="text-xs text-brand-muted">time</div>
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
    <div className="min-h-screen p-4 bg-brand-gradient">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-brand-text hover:bg-brand-surface2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <h1 className="text-3xl font-bold flex items-center text-brand-text">
            <Trophy className="w-8 h-8 mr-2 text-brand-accent" />
            Leaderboard
          </h1>
          
          <div></div>
        </div>

        {/* Stats overview */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-4 text-center bg-brand-surface border-brand-border shadow-brand-card">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-brand-accent" />
            <div className="text-2xl font-bold text-brand-text">
              {allTimeScores[0]?.score || 0}
            </div>
            <div className="text-sm text-brand-muted">Best Score</div>
          </Card>
          
          <Card className="p-4 text-center bg-brand-surface border-brand-border shadow-brand-card">
            <Timer className="w-8 h-8 mx-auto mb-2 text-brand-accent" />
            <div className="text-2xl font-bold text-brand-text">
              {scores.length}
            </div>
            <div className="text-sm text-brand-muted">Games Played</div>
          </Card>
          
          <Card className="p-4 text-center bg-brand-surface border-brand-border shadow-brand-card">
            <Target className="w-8 h-8 mx-auto mb-2 text-brand-accent" />
            <div className="text-2xl font-bold text-brand-text">
              {scores.reduce((sum, s) => sum + s.clears, 0)}
            </div>
            <div className="text-sm text-brand-muted">Total 21s</div>
          </Card>
        </div>

        {/* Leaderboard tabs */}
        <Card className="p-6 bg-brand-surface border-brand-border shadow-brand-card">
          <Tabs defaultValue="all-time" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-brand-surface2 border border-brand-border">
              <TabsTrigger value="all-time" className="data-[state=active]:bg-brand-accent data-[state=active]:text-black text-brand-muted">All-Time</TabsTrigger>
              <TabsTrigger value="today" className="data-[state=active]:bg-brand-accent data-[state=active]:text-black text-brand-muted">Today</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all-time" className="space-y-4">
              <h3 className="text-lg font-semibold text-brand-text">Top Scores of All Time</h3>
              <div className="border border-brand-border rounded-lg overflow-hidden bg-brand-surface">
                {allTimeScores.length > 0 ? (
                  allTimeScores.map((score, index) => (
                    <ScoreRow key={score.id} score={score} rank={index + 1} />
                  ))
                ) : (
                  <div className="p-8 text-center text-brand-muted">
                    No scores yet. Be the first to play!
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="today" className="space-y-4">
              <h3 className="text-lg font-semibold text-brand-text">Today's Best</h3>
              <div className="border border-brand-border rounded-lg overflow-hidden bg-brand-surface">
                {todayScores.length > 0 ? (
                  todayScores.map((score, index) => (
                    <ScoreRow key={score.id} score={score} rank={index + 1} />
                  ))
                ) : (
                  <div className="p-8 text-center text-brand-muted">
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
            className="bg-btn-primary text-btn-primaryText hover:brightness-95"
          >
            Play Now
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="border-brand-border text-brand-text hover:bg-brand-surface2"
          >
            Refresh Scores
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;