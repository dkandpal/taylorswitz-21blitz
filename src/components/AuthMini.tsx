import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';

export default function AuthMini() {
  const [email, setEmail] = useState(''); 
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleSignIn = async () => {
    if (!email) return;
    setLoading(true);
    try {
      await supabase.auth.signInWithOtp({ email });
      alert('Magic link sent to your email!');
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div className="bg-theme-surface text-theme-text p-3 rounded-lg border">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{user.email}</span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => supabase.auth.signOut()}
          >
            Sign out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-theme-surface text-theme-text p-3 rounded-lg border">
      <div className="flex gap-2">
        <Input 
          placeholder="Enter your email" 
          value={email} 
          onChange={e => setEmail(e.target.value)}
          className="flex-1"
          type="email"
        />
        <Button 
          onClick={handleSignIn}
          disabled={loading || !email}
          size="sm"
        >
          {loading ? 'Sending...' : 'Sign in'}
        </Button>
      </div>
      <p className="text-xs text-theme-text-2 mt-1">
        Sign in to save and share your themes
      </p>
    </div>
  );
}