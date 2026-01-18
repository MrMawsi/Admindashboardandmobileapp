import React, { useEffect, useState } from 'react';
import { Card, Button } from '@/app/components/ui/shared';
import { api, Transaction } from '@/utils/store';
import { Check, X, Clock } from 'lucide-react';
import { toast } from 'sonner';

export function AdminDataCenter() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const loadTx = async () => {
    const data = await api.getTransactions();
    setTransactions(data);
  };

  useEffect(() => {
    loadTx();
  }, []);

  const handleAction = async (id: string, status: 'approved' | 'rejected') => {
    await api.updateTransactionStatus(id, status);
    toast.success(`Transaction ${status}`);
    loadTx();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Data Center</h2>
      <p className="text-slate-400">Manage point requests and trading validations.</p>

      <div className="space-y-4">
        {transactions.map(tx => (
          <Card key={tx.id} className="p-4 bg-slate-800 border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                tx.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                tx.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {tx.status === 'pending' ? <Clock size={20} /> : 
                 tx.status === 'approved' ? <Check size={20} /> : <X size={20} />}
              </div>
              <div>
                <h4 className="font-bold text-white uppercase">{tx.type} Request</h4>
                <p className="text-sm text-slate-400">
                  User: <span className="text-blue-400">{tx.userId}</span> • 
                  Amount: <span className="text-white font-mono">{tx.amount} pts</span>
                </p>
                <p className="text-xs text-slate-500">{new Date(tx.timestamp).toLocaleString()}</p>
              </div>
            </div>

            {tx.status === 'pending' && (
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="bg-red-900/50 hover:bg-red-900 text-red-200 border border-red-800"
                  onClick={() => handleAction(tx.id, 'rejected')}
                >
                  Reject
                </Button>
                <Button 
                  size="sm" 
                  className="bg-green-900/50 hover:bg-green-900 text-green-200 border border-green-800"
                  onClick={() => handleAction(tx.id, 'approved')}
                >
                  Approve
                </Button>
              </div>
            )}
            
            {tx.status !== 'pending' && (
              <div className="px-4 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-medium uppercase text-slate-400">
                {tx.status}
              </div>
            )}
          </Card>
        ))}
        {transactions.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            No transactions found.
          </div>
        )}
      </div>
    </div>
  );
}
