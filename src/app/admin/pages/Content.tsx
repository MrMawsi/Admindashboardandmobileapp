import React, { useEffect, useState } from 'react';
import { Card, Button, Input } from '@/app/components/ui/shared';
import { api, SocialPost } from '@/utils/store';
import { Plus, Image as ImageIcon, Link as LinkIcon, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export function AdminContent() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [newPost,YWNewPost] = useState({ content: '', image_url: '', link_url: '', type: 'text' as 'text'|'photo'|'link' });
  const [isCreating, setIsCreating] = useState(false);

  const loadPosts = async () => {
    const data = await api.getPosts();
    setPosts(data);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleCreate = async () => {
    if (!newPost.content) {
      toast.error('Post content is required');
      return;
    }

    await api.createPost({
      ...newPost,
      author: 'admin',
      type: newPost.image_url ? 'photo' : newPost.link_url ? 'link' : 'text'
    });
    
    toast.success('Post published to feed');
    setIsCreating(false);
    setNewPost({ content: '', image_url: '', link_url: '', type: 'text' });
    loadPosts();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Content Management</h2>
        <Button onClick={() => setIsCreating(true)} className="bg-blue-600 hover:bg-blue-500">
          <Plus size={18} className="mr-2" />
          Create Post
        </Button>
      </div>

      {isCreating && (
        <Card className="p-6 bg-slate-800 border-slate-700 space-y-4 animate-in fade-in slide-in-from-top-4">
          <h3 className="text-lg font-semibold text-white">New Social Post</h3>
          
          <textarea
            className="w-full h-32 bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 resize-none"
            placeholder="What's new?"
            value={newPost.content}
            onChange={e => YWNewPost({ ...newPost, content: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400 flex items-center gap-2">
                <ImageIcon size={14} /> Image URL (Optional)
              </label>
              <Input 
                placeholder="https://..." 
                className="bg-slate-900 border-slate-700"
                value={newPost.image_url}
                onChange={e => YWNewPost({ ...newPost, image_url: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400 flex items-center gap-2">
                <LinkIcon size={14} /> External Link (Optional)
              </label>
              <Input 
                placeholder="https://..." 
                className="bg-slate-900 border-slate-700"
                value={newPost.link_url}
                onChange={e => YWNewPost({ ...newPost, link_url: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setIsCreating(false)}>Cancel</Button>
            <Button className="bg-blue-600 hover:bg-blue-500" onClick={handleCreate}>Publish</Button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6">
        {posts.map(post => (
          <Card key={post.id} className="p-6 bg-slate-800 border-slate-700 flex gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
              <span className="font-bold text-white">AD</span>
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-white">Admin</h4>
                  <p className="text-xs text-slate-400">{new Date(post.timestamp).toLocaleString()}</p>
                </div>
                <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                  <Trash2 size={16} />
                </Button>
              </div>
              
              <p className="text-slate-200 whitespace-pre-wrap">{post.content}</p>
              
              {post.image_url && (
                <img src={post.image_url} alt="Post attachment" className="rounded-lg max-h-[300px] w-auto object-cover" />
              )}
              
              {post.link_url && (
                <a 
                  href={post.link_url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-2 text-blue-400 hover:underline text-sm p-3 bg-slate-900/50 rounded-lg"
                >
                  <LinkIcon size={14} />
                  {post.link_url}
                </a>
              )}
            </div>
          </Card>
        ))}
        {posts.length === 0 && !isCreating && (
          <div className="text-center py-12 text-slate-500">
            No posts yet. Create one to engage your users.
          </div>
        )}
      </div>
    </div>
  );
}
