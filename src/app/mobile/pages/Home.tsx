import React, { useEffect, useState } from 'react';
import { api, SocialPost } from '@/utils/store';
import { Card } from '@/app/components/ui/shared';
import { motion } from 'motion/react';
import { ExternalLink } from 'lucide-react';

export function MobileHome() {
  const [posts, setPosts] = useState<SocialPost[]>([]);

  useEffect(() => {
    api.getPosts().then(setPosts);
  }, []);

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center py-2">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
          News Feed
        </h1>
        <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center">
          <span className="text-amber-400 font-bold text-xs">SCG</span>
        </div>
      </div>

      <div className="space-y-6">
        {posts.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card variant="luxury" className="overflow-hidden border-amber-500/10 bg-slate-900/60 backdrop-blur-md">
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                    <span className="text-xs font-bold text-white">AD</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">SCG Admin</h3>
                    <p className="text-[10px] text-slate-400">{new Date(post.timestamp).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <p className="text-sm text-slate-200 leading-relaxed mb-3">
                  {post.content}
                </p>

                {post.image_url && (
                  <div className="rounded-lg overflow-hidden mb-3 border border-slate-700/50 shadow-lg">
                    <img src={post.image_url} alt="Feed" className="w-full h-auto object-cover" />
                  </div>
                )}

                {post.link_url && (
                  <a 
                    href={post.link_url}
                    target="_blank"
                    rel="noreferrer"
                    className="block p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg active:scale-[0.98] transition-transform"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-blue-400 truncate pr-4">{post.link_url}</span>
                      <ExternalLink size={14} className="text-blue-400" />
                    </div>
                  </a>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
        
        {posts.length === 0 && (
          <div className="text-center py-10">
            <p className="text-slate-500 text-sm">No updates available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
