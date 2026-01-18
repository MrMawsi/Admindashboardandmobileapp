import React, { useEffect, useState } from 'react';
import { Card, Button, Input } from '@/app/components/ui/shared';
import { api, UserProfile } from '@/utils/store';
import { Search, Edit2, Shield } from 'lucide-react';
import { toast } from 'sonner';

export function AdminUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [editPoints, setEditPoints] = useState('');

  const loadUsers = async () => {
    const data = await api.getUsers();
    setUsers(data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleUpdatePoints = async () => {
    if (!selectedUser) return;
    const points = parseInt(editPoints);
    if (isNaN(points)) {
      toast.error('Invalid points amount');
      return;
    }
    
    await api.updateUserPoints(selectedUser.username, points);
    toast.success('User wallet updated');
    setSelectedUser(null);
    loadUsers();
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">User Management</h2>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input 
            placeholder="Search users..." 
            className="pl-10 bg-slate-800 border-slate-700"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card className="bg-slate-800 border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Username</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Wallet Balance</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredUsers.map(user => (
                <tr key={user.username} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4 text-white font-medium">{user.username}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-amber-400 font-mono font-bold">
                    {user.points.toLocaleString()} pts
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-sm">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => {
                        setSelectedUser(user);
                        setEditPoints(user.points.toString());
                      }}
                    >
                      <Edit2 size={16} className="mr-2" />
                      Manage Wallet
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edit Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md bg-slate-900 border-slate-700 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Manage Wallet: {selectedUser.username}</h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedUser(null)}>✕</Button>
            </div>
            
            <div className="p-4 bg-slate-800 rounded-lg">
              <label className="text-sm text-slate-400 mb-1 block">Ownership Points</label>
              <Input 
                type="number" 
                value={editPoints}
                onChange={e => setEditPoints(e.target.value)}
                className="bg-slate-900 border-slate-700 font-mono text-lg"
              />
              <div className="flex justify-between mt-2 text-xs text-slate-500">
                <span>Current: {selectedUser.points}</span>
                <span className={parseInt(editPoints) > selectedUser.points ? "text-green-400" : "text-red-400"}>
                  {parseInt(editPoints) - selectedUser.points > 0 ? '+' : ''}
                  {parseInt(editPoints) - selectedUser.points} diff
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button className="flex-1 bg-slate-800" onClick={() => setSelectedUser(null)}>Cancel</Button>
              <Button className="flex-1 bg-blue-600 hover:bg-blue-500" onClick={handleUpdatePoints}>Save Changes</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
