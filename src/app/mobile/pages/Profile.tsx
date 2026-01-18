import React, { useEffect, useState } from 'react';
import { useAuth } from '@/utils/auth-context';
import { api, UserProfile, ChatMessage } from '@/utils/store';
import { Button, Input, Card } from '@/app/components/ui/shared';
import { User, LogOut, MessageSquare, Shield, Clock, Send } from 'lucide-react';
import { toast } from 'sonner';

export function MobileProfile() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [msgInput, setMsgInput] = useState('');

  useEffect(() => {
    if (user?.username) {
      api.getUser(user.username).then(setProfile);
    }
  }, [user]);

  useEffect(() => {
    if (showChat && user?.username) {
      const load = async () => {
        const msgs = await api.getMessages(user.username, 'admin');
        setMessages(msgs);
      };
      load();
      const interval = setInterval(load, 5000);
      return () => clearInterval(interval);
    }
  }, [showChat, user]);

  const handleSend = async () => {
    if (!msgInput.trim() || !user?.username) return;
    await api.sendMessage(user.username, 'admin', msgInput);
    setMsgInput('');
    const msgs = await api.getMessages(user.username, 'admin');
    setMessages(msgs);
  };

  if (!profile) return <div className="p-8 text-center text-slate-500">Loading profile...</div>;

  return (
    <div className="p-4 space-y-6 pb-20">
      {/* Profile Header */}
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-300 to-amber-600 p-1 shadow-2xl shadow-amber-500/30 mb-4">
          <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
             <span className="text-4xl font-bold text-amber-500">{profile.username.slice(0, 1).toUpperCase()}</span>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white">{profile.username}</h2>
        <p className="text-amber-400 font-mono mt-1">ID: {Math.random().toString().slice(2, 8)}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card variant="luxury" className="p-4 bg-slate-800/50 text-center">
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Ownership</p>
          <p className="text-xl font-bold text-amber-400 font-mono">{profile.points.toLocaleString()}</p>
        </Card>
        <Card variant="luxury" className="p-4 bg-slate-800/50 text-center">
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Status</p>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-400 font-bold text-sm">Active</span>
          </div>
        </Card>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <Button 
          variant="secondary" 
          className="w-full justify-start bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 h-12"
          onClick={() => setShowChat(true)}
        >
          <MessageSquare className="mr-3 text-blue-400" size={18} />
          Customer Service (Admin)
        </Button>
        
        <Button 
          variant="secondary" 
          className="w-full justify-start bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 h-12"
        >
          <Clock className="mr-3 text-purple-400" size={18} />
          Trading History
        </Button>

        <Button 
          variant="secondary" 
          className="w-full justify-start bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 h-12"
        >
          <Shield className="mr-3 text-green-400" size={18} />
          Change Password
        </Button>
        
        <Button 
          variant="ghost" 
          className="w-full text-red-400 hover:bg-red-950/20"
          onClick={logout}
        >
          <LogOut className="mr-2" size={18} />
          Sign Out
        </Button>
      </div>

      {/* Chat Modal */}
      {showChat && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col">
          <div className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">Customer Support</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowChat(false)}>Close</Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === profile.username ? 'justify-end' : 'justify-start'}`}>
                 <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                    msg.sender === profile.username 
                      ? 'bg-amber-600 text-white rounded-br-none' 
                      : 'bg-slate-700 text-slate-200 rounded-bl-none'
                  }`}>
                    {msg.content}
                 </div>
              </div>
            ))}
            {messages.length === 0 && (
              <p className="text-center text-slate-500 mt-20">Start a conversation with admin...</p>
            )}
          </div>

          <div className="p-4 bg-slate-900 border-t border-slate-800 flex gap-2 pb-8">
            <Input 
              value={msgInput}
              onChange={e => setMsgInput(e.target.value)}
              placeholder="Type your message..."
              variant="luxury"
            />
            <Button variant="luxury" onClick={handleSend} className="bg-amber-600">
              <Send size={18} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
