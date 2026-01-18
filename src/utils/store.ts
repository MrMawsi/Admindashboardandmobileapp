import { projectId, publicAnonKey } from '/utils/supabase/info';

// KV Client implementation
const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-5a58837f`;

const fetchKv = async (endpoint: string, body: any) => {
  const url = `${BASE_URL}/kv/${endpoint}`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      },
      body: JSON.stringify(body),
      mode: 'cors'
    });

    if (!response.ok) {
       console.error(`KV Error [${response.status}]: ${response.statusText} at ${url}`);
       const text = await response.text();
       console.error(`Response body: ${text}`);
       return {}; 
    }
    return await response.json();
  } catch (e) {
    console.error(`KV Fetch Error at ${url}:`, e);
    return {};
  }
};

const kv = {
  get: async (key: string) => {
    const data = await fetchKv('get', { key });
    return data?.value;
  },
  set: async (key: string, value: any) => {
    await fetchKv('set', { key, value });
  },
  del: async (key: string) => {
    await fetchKv('del', { key });
  },
  getByPrefix: async (prefix: string) => {
    const data = await fetchKv('get-by-prefix', { prefix });
    return data?.values || [];
  }
};

// Types
export interface UserProfile {
  username: string;
  pin: string;
  points: number;
  role: 'user';
  created_at: number;
}

export interface AdminProfile {
  email: string;
  role: 'admin';
}

export interface SocialPost {
  id: string;
  content: string;
  image_url?: string;
  link_url?: string;
  author: 'admin';
  timestamp: number;
  type: 'text' | 'photo' | 'link';
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'buy' | 'sell';
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: number;
}

export interface AppSettings {
  appName: string;
  logoUrl?: string;
  tradingEmbedUrl?: string;
  tradingEnabled: boolean;
}

// Keys
const KEY_USERS_PREFIX = 'user:';
const KEY_POSTS_PREFIX = 'post:';
const KEY_TX_PREFIX = 'tx:';
const KEY_SETTINGS = 'settings:app';

export interface ChatMessage {
  id: string;
  sender: string; // username or 'admin'
  recipient: string; // username or 'admin'
  content: string;
  timestamp: number;
}

const KEY_MSG_PREFIX = 'msg:';

// Helpers
export const api = {
  // Messages
  async getMessages(userA: string, userB: string): Promise<ChatMessage[]> {
    const all = await kv.getByPrefix(KEY_MSG_PREFIX);
    return all.filter((m: ChatMessage) => 
      (m.sender === userA && m.recipient === userB) || 
      (m.sender === userB && m.recipient === userA)
    ).sort((a: ChatMessage, b: ChatMessage) => a.timestamp - b.timestamp);
  },

  async getAllMessages(): Promise<ChatMessage[]> {
     return await kv.getByPrefix(KEY_MSG_PREFIX);
  },

  async sendMessage(sender: string, recipient: string, content: string): Promise<void> {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    const msg: ChatMessage = {
      id,
      sender,
      recipient,
      content,
      timestamp: Date.now()
    };
    await kv.set(`${KEY_MSG_PREFIX}${id}`, msg);
  },

  async getUser(username: string): Promise<UserProfile | null> {
    try {
      const user = await kv.get(`${KEY_USERS_PREFIX}${username}`);
      return user as UserProfile;
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  async createUser(username: string, pin: string): Promise<UserProfile> {
    const user: UserProfile = {
      username,
      pin,
      points: 0,
      role: 'user',
      created_at: Date.now(),
    };
    await kv.set(`${KEY_USERS_PREFIX}${username}`, user);
    return user;
  },

  async updateUserPoints(username: string, newPoints: number): Promise<void> {
    const user = await this.getUser(username);
    if (user) {
      user.points = newPoints;
      await kv.set(`${KEY_USERS_PREFIX}${username}`, user);
    }
  },

  async getUsers(): Promise<UserProfile[]> {
    try {
      const users = await kv.getByPrefix(KEY_USERS_PREFIX);
      return users;
    } catch (e) {
      return [];
    }
  },

  // Posts
  async getPosts(): Promise<SocialPost[]> {
    try {
      const posts = await kv.getByPrefix(KEY_POSTS_PREFIX);
      return posts.sort((a: SocialPost, b: SocialPost) => b.timestamp - a.timestamp);
    } catch (e) {
      return [];
    }
  },

  async createPost(post: Omit<SocialPost, 'id' | 'timestamp'>): Promise<void> {
    const id = Date.now().toString();
    const newPost: SocialPost = {
      ...post,
      id,
      timestamp: Date.now(),
    };
    await kv.set(`${KEY_POSTS_PREFIX}${id}`, newPost);
  },

  // Transactions
  async getTransactions(username?: string): Promise<Transaction[]> {
    const txs = await kv.getByPrefix(KEY_TX_PREFIX);
    const sorted = txs.sort((a: Transaction, b: Transaction) => b.timestamp - a.timestamp);
    if (username) {
      return sorted.filter((tx: Transaction) => tx.userId === username);
    }
    return sorted;
  },

  async createTransaction(tx: Omit<Transaction, 'id' | 'timestamp' | 'status'>): Promise<void> {
    const id = Date.now().toString();
    const newTx: Transaction = {
      ...tx,
      id,
      timestamp: Date.now(),
      status: 'pending',
    };
    await kv.set(`${KEY_TX_PREFIX}${id}`, newTx);
  },

  async updateTransactionStatus(id: string, status: 'approved' | 'rejected'): Promise<void> {
    const tx = await kv.get(`${KEY_TX_PREFIX}${id}`) as Transaction;
    if (tx) {
      tx.status = status;
      await kv.set(`${KEY_TX_PREFIX}${id}`, tx);
      
      // If approved, update user balance
      if (status === 'approved') {
        const user = await this.getUser(tx.userId);
        if (user) {
          if (tx.type === 'buy') {
            user.points += tx.amount;
          } else {
             user.points -= tx.amount;
          }
          await kv.set(`${KEY_USERS_PREFIX}${user.username}`, user);
        }
      }
    }
  },

  // Settings
  async getSettings(): Promise<AppSettings> {
    const settings = await kv.get(KEY_SETTINGS);
    return (settings as AppSettings) || {
      appName: 'SCG Wallet',
      tradingEnabled: true,
      tradingEmbedUrl: 'https://www.tradingview.com/chart/?symbol=BJP'
    };
  },

  async updateSettings(settings: AppSettings): Promise<void> {
    await kv.set(KEY_SETTINGS, settings);
  }
};
