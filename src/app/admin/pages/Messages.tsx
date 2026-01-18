import React, { useEffect, useState } from 'react';
import { Card, Button, Input } from '@/app/components/ui/shared';
import { api, ChatMessage, UserProfile } from '@/utils/store';
import { Send, User } from 'lucide-react';

export function AdminMessages() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    api.getUsers().then(setUsers);
  }, []);

  useEffect(() => {
    if (selectedUser) {
      loadMessages();
      const interval = setInterval(loadMessages, 5000); // Poll every 5s
      return () => clearInterval(interval);
    }
  }, [selectedUser]);

  const loadMessages = async () => {
    if (selectedUser) {
      const msgs = await api.getMessages('admin', selectedUser);
      setMessages(msgs);
    }
  };

  const handleSend = async () => {
    if (!selectedUser || !inputText.trim()) return;
    await api.sendMessage('admin', selectedUser, inputText);
    setInputText('');
    loadMessages();
  };

  return (
    <div className="flex h-[calc(100vh-140px)] gap-6">
      <Card className="w-1/3 bg-slate-800 border-slate-700 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-700 bg-slate-900/50">
          <h3 className="font-bold text-white">Conversations</h3>
        </div>
        <div className="flex-1 overflow-y-auto">
          {users.map(user => (
            <div 
              key={user.username}
              onClick={() => setSelectedUser(user.username)}
              className={`p-4 flex items-center gap-3 cursor-pointer border-b border-slate-700/50 hover:bg-slate-700/50 transition-colors ${selectedUser === user.username ? 'bg-blue-600/20 border-l-4 border-l-blue-500' : ''}`}
            >
              <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center text-white">
                <User size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-white truncate">{user.username}</h4>
                <p className="text-xs text-slate-400">Click to chat</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="flex-1 bg-slate-800 border-slate-700 flex flex-col overflow-hidden">
        {selectedUser ? (
          <>
            <div className="p-4 border-b border-slate-700 bg-slate-900/50 flex justify-between items-center">
              <h3 className="font-bold text-white">Chat with {selectedUser}</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${
                    msg.sender === 'admin' 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-slate-700 text-slate-200 rounded-bl-none'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {messages.length === 0 && (
                <p className="text-center text-slate-500 my-8">No messages yet.</p>
              )}
            </div>

            <div className="p-4 bg-slate-900/50 border-t border-slate-700 flex gap-2">
              <Input 
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Type a message..."
                className="bg-slate-800 border-slate-600"
                onKeyDown={e => e.key === 'Enter' && handleSend()}
              />
              <Button onClick={handleSend} className="bg-blue-600 hover:bg-blue-500">
                <Send size={18} />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500 flex-col gap-4">
            <User size={48} className="opacity-20" />
            <p>Select a user to start messaging</p>
          </div>
        )}
      </Card>
    </div>
  );
}
