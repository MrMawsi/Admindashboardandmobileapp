import React, { useEffect, useState } from 'react';
import { Card, Button, Input } from '@/app/components/ui/shared';
import { api, AppSettings } from '@/utils/store';
import { toast } from 'sonner';

export function AdminSettings() {
  const [settings, setSettings] = useState<AppSettings>({
    appName: '',
    tradingEmbedUrl: '',
    tradingEnabled: true,
    logoUrl: ''
  });

  useEffect(() => {
    api.getSettings().then(setSettings);
  }, []);

  const handleSave = async () => {
    await api.updateSettings(settings);
    toast.success('Settings saved');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">System Settings</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-slate-800 border-slate-700 space-y-6">
          <h3 className="text-lg font-semibold text-white border-b border-slate-700 pb-2">General Configuration</h3>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">App Name</label>
            <Input 
              value={settings.appName}
              onChange={e => setSettings({ ...settings, appName: e.target.value })}
              className="bg-slate-900 border-slate-700"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Logo URL</label>
            <Input 
              value={settings.logoUrl || ''}
              onChange={e => setSettings({ ...settings, logoUrl: e.target.value })}
              className="bg-slate-900 border-slate-700"
              placeholder="https://..."
            />
          </div>
        </Card>

        <Card className="p-6 bg-slate-800 border-slate-700 space-y-6">
          <h3 className="text-lg font-semibold text-white border-b border-slate-700 pb-2">Trading Configuration</h3>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Embed Chart URL</label>
            <p className="text-xs text-slate-500 mb-2">The URL to be embedded in the top section of the mobile trading screen.</p>
            <Input 
              value={settings.tradingEmbedUrl || ''}
              onChange={e => setSettings({ ...settings, tradingEmbedUrl: e.target.value })}
              className="bg-slate-900 border-slate-700"
              placeholder="https://tradingview.com/..."
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg">
            <div>
              <p className="text-sm font-medium text-white">Enable Trading</p>
              <p className="text-xs text-slate-500">Allow users to place buy/sell orders</p>
            </div>
            <div 
              className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${settings.tradingEnabled ? 'bg-green-600' : 'bg-slate-700'}`}
              onClick={() => setSettings({ ...settings, tradingEnabled: !settings.tradingEnabled })}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${settings.tradingEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
          </div>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-500 px-8">Save Changes</Button>
      </div>
    </div>
  );
}
