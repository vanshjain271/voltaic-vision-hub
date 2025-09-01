import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PenTool, Calendar, User, Plus, Eye, Edit, Trash2 } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  author_id: string;
  created_at: string;
  updated_at: string;
  is_published: boolean;
  profiles?: {
    full_name: string | null;
  };
}

export const BlogSection = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  
  // Form states
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postExcerpt, setPostExcerpt] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch blog posts
  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          profiles (
            full_name
          )
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load blog posts",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchPosts();
      setLoading(false);
    };
    loadData();
  }, []);

  // Create or update post
  const savePost = async () => {
    if (!user || !postTitle.trim() || !postContent.trim()) return;
    
    setCreating(true);
    try {
      const postData = {
        title: postTitle,
        content: postContent,
        excerpt: postExcerpt || postContent.substring(0, 150) + '...',
        is_published: isPublished,
      };

      if (editingPost) {
        const { data, error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', editingPost.id)
          .select(`
            *,
            profiles (
              full_name
            )
          `)
          .single();

        if (error) throw error;
        setPosts(posts.map(p => p.id === editingPost.id ? data : p));
        toast({
          title: "Success",
          description: "Blog post updated successfully!",
        });
      } else {
        const { data, error } = await supabase
          .from('blog_posts')
          .insert({
            ...postData,
            author_id: user.id,
          })
          .select(`
            *,
            profiles (
              full_name
            )
          `)
          .single();

        if (error) throw error;
        setPosts([data, ...posts]);
        toast({
          title: "Success",
          description: "Blog post created successfully!",
        });
      }

      resetForm();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
    setCreating(false);
  };

  // Delete post
  const deletePost = async (postId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId)
        .eq('author_id', user.id);

      if (error) throw error;
      setPosts(posts.filter(p => p.id !== postId));
      toast({
        title: "Success",
        description: "Blog post deleted successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Start editing
  const startEdit = (post: BlogPost) => {
    setEditingPost(post);
    setPostTitle(post.title);
    setPostContent(post.content);
    setPostExcerpt(post.excerpt || '');
    setIsPublished(post.is_published);
    setShowCreatePost(true);
  };

  // Reset form
  const resetForm = () => {
    setEditingPost(null);
    setPostTitle('');
    setPostContent('');
    setPostExcerpt('');
    setIsPublished(true);
    setShowCreatePost(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const canEditPost = (post: BlogPost) => {
    return user && post.author_id === user.id;
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Loading blog posts...</p>
      </div>
    );
  }

  return (
    <section id="blog" className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold neon-text animate-slide-in mb-4">
              Community Blog
            </h2>
            <p className="text-muted-foreground">
              Stories, insights, and updates from our community
            </p>
          </div>
          
          {user && (
            <Dialog open={showCreatePost} onOpenChange={setShowCreatePost}>
              <DialogTrigger asChild>
                <Button className="btn-neon" onClick={() => setEditingPost(null)}>
                  <PenTool className="w-4 h-4 mr-2" />
                  Write Post
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card border-glass-border max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingPost ? 'Edit Blog Post' : 'Write New Blog Post'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingPost 
                      ? 'Update your blog post' 
                      : 'Share your thoughts with the community'
                    }
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="postTitle">Post Title</Label>
                    <Input
                      id="postTitle"
                      value={postTitle}
                      onChange={(e) => setPostTitle(e.target.value)}
                      placeholder="Enter post title"
                      className="glass-card border-glass-border"
                    />
                  </div>
                  <div>
                    <Label htmlFor="postExcerpt">Excerpt (Optional)</Label>
                    <Input
                      id="postExcerpt"
                      value={postExcerpt}
                      onChange={(e) => setPostExcerpt(e.target.value)}
                      placeholder="Brief description of your post"
                      className="glass-card border-glass-border"
                    />
                  </div>
                  <div>
                    <Label htmlFor="postContent">Content</Label>
                    <Textarea
                      id="postContent"
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      placeholder="Write your blog post content..."
                      className="glass-card border-glass-border min-h-[200px]"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isPublished"
                      checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                      className="rounded border-glass-border"
                    />
                    <Label htmlFor="isPublished">Publish immediately</Label>
                  </div>
                </div>
                <DialogFooter className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={resetForm}
                    className="btn-glass"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={savePost}
                    disabled={!postTitle.trim() || !postContent.trim() || creating}
                    className="btn-neon"
                  >
                    {creating 
                      ? (editingPost ? 'Updating...' : 'Publishing...') 
                      : (editingPost ? 'Update Post' : 'Publish Post')
                    }
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <Card
              key={post.id}
              className="glass-card border-glass-border hover:neon-glow transition-all duration-300 animate-slide-in flex flex-col"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-lg leading-tight pr-2">
                    {post.title}
                  </CardTitle>
                  {canEditPost(post) && (
                    <div className="flex gap-1 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEdit(post)}
                        className="h-8 w-8 p-0 hover:bg-primary/10"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deletePost(post.id)}
                        className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
                <CardDescription className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{post.profiles?.full_name || 'Anonymous'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(post.created_at)}</span>
                  </div>
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col">
                <p className="text-muted-foreground text-sm mb-4 flex-1">
                  {post.excerpt || post.content.substring(0, 120) + '...'}
                </p>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-primary hover:text-primary hover:bg-primary/10"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Read More
                </Button>
              </CardContent>
            </Card>
          ))}
          
          {posts.length === 0 && (
            <div className="col-span-full text-center py-12 glass-card rounded-2xl">
              <PenTool className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No blog posts yet</p>
              {user && (
                <Button
                  onClick={() => setShowCreatePost(true)}
                  className="btn-neon"
                >
                  <PenTool className="w-4 h-4 mr-2" />
                  Write First Post
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};