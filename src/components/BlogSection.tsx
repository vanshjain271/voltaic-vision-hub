import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PenTool, Calendar, User, Plus, Eye } from 'lucide-react';

// Temporary mock data for demo purposes
interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  author: string;
  created_at: string;
}

export const BlogSection = () => {
  const [posts, setPosts] = useState<BlogPost[]>([
    {
      id: '1',
      title: 'Welcome to The Network',
      content: 'This is our first blog post! We are excited to share our journey with you. The Network is a community of developers, designers, and creators working together to build amazing things.',
      excerpt: 'Welcome to The Network community blog. Join us on this exciting journey!',
      author: 'The Network Team',
      created_at: new Date().toISOString(),
    },
    {
      id: '2', 
      title: 'Community Guidelines',
      content: 'Here are some guidelines to help make our community a welcoming space for everyone. We believe in collaboration, respect, and innovation.',
      excerpt: 'Learn about our community guidelines and values.',
      author: 'Admin',
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    }
  ]);
  const [creating, setCreating] = useState(false);
  
  // Form states
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postExcerpt, setPostExcerpt] = useState('');

  const { user } = useAuth();

  // Create post (demo version)
  const savePost = async () => {
    if (!user || !postTitle.trim() || !postContent.trim()) return;
    
    setCreating(true);
    
    // Simulate API call
    setTimeout(() => {
      const newPost: BlogPost = {
        id: Date.now().toString(),
        title: postTitle,
        content: postContent,
        excerpt: postExcerpt || postContent.substring(0, 150) + '...',
        author: user.email?.split('@')[0] || 'Anonymous',
        created_at: new Date().toISOString(),
      };

      setPosts([newPost, ...posts]);
      resetForm();
      setCreating(false);
    }, 1000);
  };

  // Delete post (demo version)
  const deletePost = (postId: string) => {
    setPosts(posts.filter(p => p.id !== postId));
  };

  // Reset form
  const resetForm = () => {
    setPostTitle('');
    setPostContent('');
    setPostExcerpt('');
    setShowCreatePost(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

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
                <Button className="btn-neon">
                  <PenTool className="w-4 h-4 mr-2" />
                  Write Post
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card border-glass-border max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Write New Blog Post</DialogTitle>
                  <DialogDescription>
                    Share your thoughts with the community
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
                    {creating ? 'Publishing...' : 'Publish Post'}
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
                <CardTitle className="text-lg leading-tight mb-2">
                  {post.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{post.author}</span>
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