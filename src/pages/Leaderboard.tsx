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
    <div className="flex items-center justify-between p-4 border-b border-gray-200 last:border-b-0">
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
            <div className="text-gray-600">#{rank}</div>
          )}
        </div>
        
        <div>
          <div className="font-medium text-gray-900">{score.playerName}</div>
          <div className="text-sm text-gray-600">
            {new Date(score.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-4 text-sm">
        <Badge variant="outline">
          {score.mode}
        </Badge>
        
        <div className="text-center">
          <div className="font-bold text-hotPink">{score.score}</div>
          <div className="text-xs text-gray-600">score</div>
        </div>
        
        <div className="text-center">
          <div className="text-success">{score.clears}</div>
          <div className="text-xs text-gray-600">21s</div>
        </div>
        
        <div className="text-center">
          <div className="text-danger">{score.busts}</div>
          <div className="text-xs text-gray-600">fumbles</div>
        </div>
        
        <div className="text-center">
          <div className="text-gray-900">{formatTime(score.durationSecs)}</div>
          <div className="text-xs text-gray-600">time</div>
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
          
          <h1 className="text-3xl font-bold flex items-center text-gray-900">
            <Trophy className="w-8 h-8 mr-2 text-hotPink" />
            Leaderboard
          </h1>
          
          <div></div>
        </div>

        {/* Stats overview */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-4 text-center bg-card border-border">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-hotPink" />
            <div className="text-2xl font-bold text-gray-900">
              {allTimeScores[0]?.score || 0}
            </div>
            <div className="text-sm text-gray-600">Best Score</div>
          </Card>
          
          <Card className="p-4 text-center bg-card border-border">
            <Timer className="w-8 h-8 mx-auto mb-2 text-hotPink" />
            <div className="text-2xl font-bold text-gray-900">
              {scores.length}
            </div>
            <div className="text-sm text-gray-600">Games Played</div>
          </Card>
          
          <Card className="p-4 text-center bg-card border-border">
            <Target className="w-8 h-8 mx-auto mb-2 text-hotPink" />
            <div className="text-2xl font-bold text-gray-900">
              {scores.reduce((sum, s) => sum + s.clears, 0)}
            </div>
            <div className="text-sm text-gray-600">Total 21s</div>
          </Card>
        </div>

        {/* Leaderboard tabs */}
        <Card className="p-6 bg-card border-border">
          <Tabs defaultValue="all-time" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted text-muted-foreground">
              <TabsTrigger value="all-time" className="data-[state=active]:bg-card data-[state=active]:text-foreground">All-Time</TabsTrigger>
              <TabsTrigger value="today" className="data-[state=active]:bg-card data-[state=active]:text-foreground">Today</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all-time" className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Top Scores of All Time</h3>
              <div className="border border-border rounded-lg overflow-hidden bg-card">
                {allTimeScores.length > 0 ? (
                  allTimeScores.map((score, index) => (
                    <ScoreRow key={score.id} score={score} rank={index + 1} />
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-600">
                    No scores yet. Be the first to play!
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="today" className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Today's Best</h3>
              <div className="border border-border rounded-lg overflow-hidden bg-card">
                {todayScores.length > 0 ? (
                  todayScores.map((score, index) => (
                    <ScoreRow key={score.id} score={score} rank={index + 1} />
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-600">
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
            className="bg-hotPink text-hotPink-foreground hover:bg-hotPink/90"
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