import React, { useEffect, useState } from 'react';
import { Card } from '@/app/components/ui/shared';
import { api, UserProfile, Transaction } from '@/utils/store';
import { Users, CreditCard, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPoints: 0,
    totalTransactions: 0,
    volume: 0
  });

  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      const users = await api.getUsers();
      const txs = await api.getTransactions();
      
      const totalPoints = users.reduce((acc, u) => acc + u.points, 0);
      const volume = txs.reduce((acc, t) => acc + t.amount, 0);
      
      setStats({
        totalUsers: users.length,
        totalPoints,
        totalTransactions: txs.length,
        volume
      });

      // Mock chart data for prototype visualization
      const data = [
        { name: 'Mon', volume: 4000 },
        { name: 'Tue', volume: 3000 },
        { name: 'Wed', volume: 2000 },
        { name: 'Thu', volume: 2780 },
        { name: 'Fri', volume: 1890 },
        { name: 'Sat', volume: 2390 },
        { name: 'Sun', volume: 3490 },
      ];
      setChartData(data);
    }
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Users" 
          value={stats.totalUsers.toString()} 
          icon={Users} 
          trend="+12%" 
        />
        <StatsCard 
          title="Points Circulation" 
          value={stats.totalPoints.toLocaleString()} 
          icon={CreditCard} 
          trend="+5%" 
        />
        <StatsCard 
          title="Transactions" 
          value={stats.totalTransactions.toString()} 
          icon={ArrowUpRight} 
          trend="+8%" 
        />
        <StatsCard 
          title="Total Volume" 
          value={stats.volume.toLocaleString()} 
          icon={ArrowDownRight} 
          trend="+24%" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card className="p-6 bg-slate-800 border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Transaction Volume</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                />
                <Area type="monotone" dataKey="volume" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 bg-slate-800 border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <p className="text-slate-400 text-sm">Real-time trading activity will appear here.</p>
            {/* Placeholder for activity feed */}
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <ArrowUpRight size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Points Purchased</p>
                    <p className="text-xs text-slate-400">2 minutes ago</p>
                  </div>
                </div>
                <span className="text-green-400 font-medium">+500 pts</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon: Icon, trend }: any) {
  return (
    <Card className="p-6 bg-slate-800 border-slate-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
        </div>
        <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center text-slate-300">
          <Icon size={20} />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <span className="text-green-400 text-sm font-medium">{trend}</span>
        <span className="text-slate-500 text-sm">from last month</span>
      </div>
    </Card>
  );
}
