import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/utils/auth-context';
import { Button, Input, Card } from '@/app/components/ui/shared';
import { GlobeBackground } from '@/app/components/mobile/GlobeBackground';
import { HealthCheck } from '@/app/components/HealthCheck';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export function MobileLogin() {
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const { loginUser } = useAuth();
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || pin.length !== 6) {
      toast.error('Please enter a valid username and 6-digit PIN');
      return;
    }

    const { success, message } = await loginUser(username, pin);
    if (success) {
      toast.success('Welcome to SCG Wallet');
      setLocation('/app');
    } else {
      toast.error(message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center bg-black font-sans overflow-hidden">
      <HealthCheck />
      <div className="relative w-full max-w-[480px] h-screen bg-slate-900 shadow-2xl flex flex-col justify-center p-8">
        <GlobeBackground />
        
        <div className="relative z-10 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-amber-300 to-amber-600 rounded-2xl mx-auto mb-6 shadow-lg shadow-amber-500/20 rotate-3 flex items-center justify-center">
              <span className="text-3xl font-bold text-white drop-shadow-md">SCG</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-b from-amber-200 to-amber-500 bg-clip-text text-transparent">
              Luxury Wallet
            </h1>
            <p className="text-amber-100/60 mt-2">Enter the future of trading</p>
          </motion.div>

          <Card variant="luxury" className="p-6 backdrop-blur-xl bg-black/40 border-amber-500/10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-medium text-amber-200/70 uppercase tracking-wider">Username</label>
                <Input 
                  variant="luxury"
                  type="text" 
                  placeholder="Enter your username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-amber-200/70 uppercase tracking-wider">6-Digit PIN</label>
                <Input 
                  variant="luxury"
                  type="password" 
                  maxLength={6}
                  placeholder="• • • • • •"
                  value={pin}
                  onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="tracking-[0.5em] text-center font-bold"
                />
              </div>

              <Button 
                variant="luxury" 
                type="submit" 
                className="w-full h-12 text-lg font-bold shadow-amber-900/20"
              >
                ACCESS WALLET
              </Button>
            </form>
          </Card>
          
          <p className="text-center text-xs text-slate-500 mt-8">
            Secure Connection • Encrypted Data
          </p>
        </div>
      </div>
    </div>
  );
}