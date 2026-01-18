import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/utils/auth-context';
import { Button, Input, Card } from '@/app/components/ui/shared';
import { HealthCheck } from '@/app/components/HealthCheck';
import { ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [pin, setPin] = useState('');
  const { loginAdmin } = useAuth();
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await loginAdmin(email, code, pin);
    if (success) {
      toast.success('Welcome back, Admin');
      setLocation('/admin');
    } else {
      toast.error('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <HealthCheck />
      <Card className="w-full max-w-md p-8 bg-slate-900 border-slate-800">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mb-4">
            <ShieldCheck className="text-blue-500" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
          <p className="text-slate-400 mt-2">Secure Access Only</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Email Address</label>
            <Input 
              type="email" 
              placeholder="admin@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="bg-slate-950 border-slate-800 focus:border-blue-600"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Admin Code</label>
            <Input 
              type="text" 
              placeholder="ENTER CODE"
              value={code}
              onChange={e => setCode(e.target.value)}
              className="bg-slate-950 border-slate-800 focus:border-blue-600"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Security PIN</label>
            <Input 
              type="password" 
              placeholder="••••••"
              value={pin}
              onChange={e => setPin(e.target.value)}
              className="bg-slate-950 border-slate-800 focus:border-blue-600"
            />
          </div>

          <Button type="submit" className="w-full mt-6 bg-blue-600 hover:bg-blue-500">
            Authenticate
          </Button>
        </form>
      </Card>
    </div>
  );
}