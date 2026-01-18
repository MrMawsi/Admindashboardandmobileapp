import React, { useEffect, useState } from 'react';
import { api, AppSettings, UserProfile } from '@/utils/store';
import { Button, Input, Card } from '@/app/components/ui/shared';
import { useAuth } from '@/utils/auth-context';
import { ArrowUp, ArrowDown, Clock, Wallet } from 'lucide-react';
import { toast } from 'sonner';

export function MobileTrading() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [amount, setAmount] = useState('');
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    api.getSettings().then(setSettings);
    if (user?.username) {
      api.getUser(user.username).then(setUserProfile);
    }
  }, [user]);

  // Simple countdown timer simulation
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const handleTrade = async (type: 'buy' | 'sell') => {
    if (!settings?.tradingEnabled) {
      toast.error('Trading is currently disabled by admin.');
      return;
    }
    
    if (!amount || isNaN(parseInt(amount)) || parseInt(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (type === 'sell' && userProfile && parseInt(amount) > userProfile.points) {
      toast.error('Insufficient funds');
      return;
    }

    // Start a "session" timer (mock)
    setTimeLeft(60); 

    await api.createTransaction({
      userId: user?.username || 'unknown',
      type,
      amount: parseInt(amount)
    });

    toast.success(`${type === 'buy' ? 'Buy' : 'Sell'} request sent to Data Center`);
    setAmount('');
  };

  const iframeSrc = settings?.tradingEmbedUrl || 'https://www.tradingview.com/chart/?symbol=BJP';

  return (
    <div className="flex flex-col h-full bg-black text-white">
      {/* Top Section (65%) - Chart */}
      <div className="h-[65vh] w-full bg-slate-900 border-b border-slate-800 relative">
        <iframe 
          src={iframeSrc} 
          className="w-full h-full border-0"
          title="Trading Chart"
          allowFullScreen
        />
        {/* Header 5% overlay or separate? Prompt says "Header 5%: Trading title bar". 
            Let's put a small absolute bar on top or just let the iframe take space. 
            I'll add a floating header. */}
        <div className="absolute top-0 left-0 right-0 h-[5vh] bg-black/60 backdrop-blur-sm flex items-center justify-between px-4 z-20">
           <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Live Market</span>
           <div className="flex items-center gap-1">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
             <span className="text-[10px] text-green-400">Connected</span>
           </div>
        </div>
      </div>

      {/* Bottom Section (30% + remaining) - Interface */}
      <div className="flex-1 bg-slate-900 p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="text-amber-400" size={18} />
            <span className="font-mono text-lg font-bold text-white">
              {userProfile?.points.toLocaleString() ?? 0}
            </span>
            <span className="text-xs text-slate-400">PTS</span>
          </div>
          
          {timeLeft > 0 ? (
             <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/20 rounded-full border border-amber-500/50">
               <Clock size={14} className="text-amber-400 animate-spin" />
               <span className="font-mono font-bold text-amber-400">
                 00:{timeLeft.toString().padStart(2, '0')}
               </span>
             </div>
          ) : (
            <span className="text-xs text-slate-500">Session Ready</span>
          )}
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-[10px] uppercase text-slate-500 font-bold mb-1 block">Amount</label>
            <Input 
              type="number" 
              placeholder="0.00" 
              variant="luxury"
              className="text-lg font-mono"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
          </div>
           {/* Minute selection placeholder (visual only for now as requested "Minute selection") */}
           <div className="w-1/3">
             <label className="text-[10px] uppercase text-slate-500 font-bold mb-1 block">Time</label>
             <select className="w-full h-10 bg-black/20 border border-amber-200/30 rounded-md text-white text-sm px-2 focus:outline-none focus:border-amber-400">
               <option>1 Min</option>
               <option>3 Min</option>
               <option>5 Min</option>
             </select>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-auto">
          <Button 
            variant="luxury"
            className="bg-gradient-to-r from-red-600 to-red-800 border-red-500 shadow-red-900/20 hover:shadow-red-900/40"
            onClick={() => handleTrade('sell')}
          >
            <ArrowDown className="mr-2" size={18} />
            SELL / DATA
          </Button>
          <Button 
            variant="luxury"
            className="bg-gradient-to-r from-green-600 to-green-800 border-green-500 shadow-green-900/20 hover:shadow-green-900/40"
            onClick={() => handleTrade('buy')}
          >
            <ArrowUp className="mr-2" size={18} />
            ADD POINTS
          </Button>
        </div>
      </div>
    </div>
  );
}
