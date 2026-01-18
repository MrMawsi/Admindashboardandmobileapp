import React from 'react';
import { Route, Switch, useLocation } from 'wouter';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from '@/utils/auth-context';
import { WelcomeScreen } from './components/WelcomeScreen';

// Admin Pages
import { AdminLayout } from './admin/AdminLayout';
import { AdminLogin } from './admin/pages/Login';
import { AdminDashboard } from './admin/pages/Dashboard';
import { AdminUsers } from './admin/pages/Users';
import { AdminContent } from './admin/pages/Content';
import { AdminDataCenter } from './admin/pages/DataCenter';
import { AdminMessages } from './admin/pages/Messages';
import { AdminSettings } from './admin/pages/Settings';

// Mobile Pages
import { MobileLayout } from './mobile/MobileLayout';
import { MobileLogin } from './mobile/pages/Login';
import { MobileHome } from './mobile/pages/Home';
import { MobileTrading } from './mobile/pages/Trading';
import { MobileProfile } from './mobile/pages/Profile';

function AppContent() {
  const { user, isAdmin } = useAuth();
  const [location, setLocation] = useLocation();

  // Log helpful info on mount
  React.useEffect(() => {
    console.log('%c🚀 SCG Wallet System Loaded', 'color: #fbbf24; font-size: 16px; font-weight: bold;');
    console.log('%c📱 Mobile App: /app/login', 'color: #10b981;');
    console.log('%c🛡️  Admin Panel: /admin/login', 'color: #3b82f6;');
    console.log('%c🔐 Admin Credentials:', 'color: #ec4899; font-weight: bold;');
    console.log('   Email: mawsisocial@gmail.com');
    console.log('   Code: ADMIN');
    console.log('   PIN: 888999');
  }, []);

  return (
    <Switch>
      {/* Welcome Screen */}
      <Route path="/" component={WelcomeScreen} />

      {/* Admin Routes */}
      <Route path="/admin/login" component={AdminLogin} />
      
      <Route path="/admin/:rest*">
        <AdminLayout>
          <Switch>
            <Route path="/admin" component={AdminDashboard} />
            <Route path="/admin/users" component={AdminUsers} />
            <Route path="/admin/content" component={AdminContent} />
            <Route path="/admin/data" component={AdminDataCenter} />
            <Route path="/admin/messages" component={AdminMessages} />
            <Route path="/admin/settings" component={AdminSettings} />
            <Route>
              <div className="text-white">404 Admin Page Not Found</div>
            </Route>
          </Switch>
        </AdminLayout>
      </Route>

      {/* Mobile Routes */}
      <Route path="/app/login" component={MobileLogin} />
      
      <Route path="/app/:rest*">
        <MobileLayout>
           <Switch>
             <Route path="/app" component={MobileHome} />
             <Route path="/app/trading" component={MobileTrading} />
             <Route path="/app/profile" component={MobileProfile} />
             <Route>
               <div className="text-white p-4">404 Page Not Found</div>
             </Route>
           </Switch>
        </MobileLayout>
      </Route>
      
      {/* Catch All */}
      <Route>
        <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">404</h1>
            <p>Page not found</p>
          </div>
        </div>
      </Route>
    </Switch>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" richColors />
      <AppContent />
    </AuthProvider>
  );
}