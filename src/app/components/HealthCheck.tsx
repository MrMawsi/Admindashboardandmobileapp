import React, { useEffect, useState } from 'react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

export function HealthCheck() {
  const [status, setStatus] = useState<'checking' | 'success' | 'error'>('checking');
  const [message, setMessage] = useState('Checking backend connection...');

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const url = `https://${projectId}.supabase.co/functions/v1/make-server-5a58837f/health`;
        console.log('Health check URL:', url);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          },
          mode: 'cors'
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Health check response:', data);
        
        if (data.status === 'ok') {
          setStatus('success');
          setMessage('✅ Backend is connected and running!');
        } else {
          setStatus('error');
          setMessage('❌ Backend returned unexpected status');
        }
      } catch (error) {
        console.error('Health check failed:', error);
        setStatus('error');
        setMessage(`❌ Backend connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };

    checkHealth();
  }, []);

  const bgColor = status === 'checking' ? 'bg-yellow-500/10' : status === 'success' ? 'bg-green-500/10' : 'bg-red-500/10';
  const textColor = status === 'checking' ? 'text-yellow-400' : status === 'success' ? 'text-green-400' : 'text-red-400';
  const borderColor = status === 'checking' ? 'border-yellow-500/20' : status === 'success' ? 'border-green-500/20' : 'border-red-500/20';

  return (
    <div className={`fixed bottom-4 right-4 z-50 p-4 rounded-lg border ${bgColor} ${borderColor} backdrop-blur-lg shadow-xl max-w-md`}>
      <p className={`text-sm font-medium ${textColor}`}>{message}</p>
      {status === 'checking' && (
        <div className="mt-2 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
          <span className="text-xs text-yellow-300/60">Testing connection...</span>
        </div>
      )}
    </div>
  );
}
