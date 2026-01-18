# Testing Guide - SCG Wallet System

## 🎯 Current Status
Your application has been fully configured with:
- ✅ Backend routing fixed with `/make-server-5a58837f` prefix
- ✅ Frontend store configured for CORS requests
- ✅ Separate authentication flows for Admin and Mobile users
- ✅ Animated 3D globe background on mobile
- ✅ Dark-themed admin dashboard
- ✅ Health check component for debugging

## 🔧 Backend Health Check
Both login pages now display a **real-time backend health indicator** in the bottom-right corner:
- 🟡 Yellow = Checking connection
- 🟢 Green = Backend connected successfully
- 🔴 Red = Connection failed (check browser console for details)

## 📱 Testing Mobile App Login

### Access URL
Navigate to: `/app/login` (or just `/` - it redirects automatically)

### Test Credentials (Auto-Registration)
The mobile app uses **auto-registration** - any username + 6-digit PIN combination will:
1. Create a new user account if it doesn't exist
2. Log in existing users if the PIN matches

**Example Test User:**
- Username: `testuser`
- PIN: `123456`

**What to expect:**
1. Beautiful luxury-themed login screen with animated globe background
2. Gold/amber gradient UI elements
3. After login, you'll see:
   - News Feed (Home page)
   - Trading page with embedded chart
   - Profile page with wallet balance
   - Bottom navigation bar

## 🛡️ Testing Admin Panel Login

### Access URL
Navigate to: `/admin/login`

### Admin Credentials (Hardcoded)
```
Email: mawsisocial@gmail.com
Code: ADMIN
PIN: 888999
```

**What to expect:**
1. Dark-themed admin login with shield icon
2. After login, you'll see:
   - Dashboard with metrics
   - User Management
   - Content & Feed Manager
   - Data Center (approve/reject transactions)
   - Customer Service (chat with users)
   - Settings

## 🔍 Common Issues & Solutions

### Issue: "Failed to fetch" errors
**Check:**
1. Open browser DevTools (F12) → Console tab
2. Look for the health check message
3. If backend is red, check:
   - Supabase project is deployed
   - Environment variables are set correctly
   - CORS is enabled on the server

### Issue: Login doesn't work
**Check:**
1. Console for error messages
2. Network tab to see API calls
3. Make sure you're using the exact admin credentials above

### Issue: Blank screen after login
**Check:**
1. Browser console for errors
2. Try refreshing the page (session is saved in localStorage)
3. Clear localStorage and try logging in again

## 🧪 Testing User Flow

### Mobile User Journey:
1. Login with username + PIN → `/app/login`
2. View news feed → `/app` (home)
3. Submit a trading transaction → `/app/trading`
4. Check profile and points → `/app/profile`

### Admin Journey:
1. Login with admin credentials → `/admin/login`
2. View dashboard metrics → `/admin`
3. Create a social post → `/admin/content`
4. Approve pending transactions → `/admin/data`
5. Chat with users → `/admin/messages`
6. Update app settings → `/admin/settings`

## 📊 Data Synchronization

The system uses a **KV Store** (Key-Value database) via Supabase:
- User profiles: `user:{username}`
- Social posts: `post:{id}`
- Transactions: `tx:{id}`
- Messages: `msg:{id}`
- Settings: `settings:app`

All data syncs in real-time between Admin and Mobile interfaces.

## 🚀 Next Steps

1. **Open the app** and check the health indicator
2. **Test mobile login** with any username + 6-digit PIN
3. **Test admin login** with the credentials above
4. **Create a post** in Admin → view it in Mobile feed
5. **Submit a transaction** in Mobile → approve it in Admin Data Center
6. **Send a message** from Mobile → respond in Admin Customer Service

## 🐛 Debugging Tips

Open browser console and look for:
```
Health check URL: https://...
Health check response: { status: "ok" }
KV Error [status]: ...
```

If you see errors, share the console output for specific troubleshooting.

---

**Ready to test!** The app should work perfectly now. If you encounter any issues, check the health indicator and browser console first.
