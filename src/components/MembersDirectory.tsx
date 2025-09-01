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
import { Users, UserPlus, Mail, Calendar, MapPin, Edit, Camera, Search } from 'lucide-react';

interface Member {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  created_at: string;
  updated_at: string;
  bio?: string | null;
  location?: string | null;
}

export const MembersDirectory = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Profile form states
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch members
  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMembers(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load members",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchMembers();
      setLoading(false);
    };
    loadData();
  }, []);

  // Load user profile data
  useEffect(() => {
    if (user) {
      const userProfile = members.find(m => m.id === user.id);
      if (userProfile) {
        setFullName(userProfile.full_name || '');
        setBio(userProfile.bio || '');
        setLocation(userProfile.location || '');
      }
    }
  }, [user, members]);

  // Update profile
  const updateProfile = async () => {
    if (!user) return;
    
    setUpdating(true);
    try {
      let avatarUrl = members.find(m => m.id === user.id)?.avatar_url;

      // Upload avatar if selected
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${user.id}/avatar.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, selectedFile, {
            upsert: true
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);
          
        avatarUrl = publicUrl;
      }

      // Update profile
      const { data, error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName || null,
          bio: bio || null,
          location: location || null,
          avatar_url: avatarUrl,
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      setMembers(members.map(m => m.id === user.id ? data : m));
      setSelectedFile(null);
      setShowEditProfile(false);
      
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
    setUpdating(false);
  };

  // Filter members based on search
  const filteredMembers = members.filter(member => 
    member.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'moderator':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'member':
      default:
        return 'text-green-400 bg-green-400/10 border-green-400/20';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Loading members...</p>
      </div>
    );
  }

  return (
    <section id="members" className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold neon-text animate-slide-in mb-4">
              Member Directory
            </h2>
            <p className="text-muted-foreground">
              Connect with our community members
            </p>
          </div>
          
          {user && (
            <Dialog open={showEditProfile} onOpenChange={setShowEditProfile}>
              <DialogTrigger asChild>
                <Button className="btn-neon">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card border-glass-border">
                <DialogHeader>
                  <DialogTitle>Edit Your Profile</DialogTitle>
                  <DialogDescription>
                    Update your profile information to connect with other members
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="glass-card border-glass-border"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us about yourself..."
                      className="glass-card border-glass-border"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Your city, country"
                      className="glass-card border-glass-border"
                    />
                  </div>
                  <div>
                    <Label htmlFor="avatarFile">Profile Picture</Label>
                    <Input
                      id="avatarFile"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      className="glass-card border-glass-border"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={updateProfile}
                    disabled={updating}
                    className="btn-neon"
                  >
                    {updating ? 'Updating...' : 'Update Profile'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 glass-card border-glass-border"
            />
          </div>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member, index) => (
            <Card
              key={member.id}
              className="glass-card border-glass-border hover:neon-glow transition-all duration-300 animate-slide-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {member.avatar_url ? (
                      <img
                        src={member.avatar_url}
                        alt={member.full_name || 'Member'}
                        className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border-2 border-primary/20">
                        <Users className="w-8 h-8 text-primary" />
                      </div>
                    )}
                    {member.id === user?.id && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <Camera className="w-3 h-3 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">
                      {member.full_name || 'Anonymous Member'}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-1 text-xs rounded-full border ${getRoleColor(member.role)}`}>
                        {member.role}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {member.bio && (
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {member.bio}
                  </p>
                )}
                
                <div className="space-y-2 text-sm text-muted-foreground">
                  {member.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3" />
                      <span>{member.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    <span>Joined {formatDate(member.created_at)}</span>
                  </div>
                </div>

                {member.id !== user?.id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-primary hover:text-primary hover:bg-primary/10"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
          
          {filteredMembers.length === 0 && (
            <div className="col-span-full text-center py-12 glass-card rounded-2xl">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'No members found matching your search' : 'No members found'}
              </p>
              {!user && (
                <Button className="btn-neon">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Join The Community
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Community Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold neon-text mb-2">{members.length}</div>
            <p className="text-muted-foreground">Total Members</p>
          </div>
          <div className="glass-card rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold neon-text mb-2">
              {members.filter(m => m.role === 'admin').length}
            </div>
            <p className="text-muted-foreground">Admins</p>
          </div>
          <div className="glass-card rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold neon-text mb-2">
              {members.filter(m => m.created_at > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()).length}
            </div>
            <p className="text-muted-foreground">New This Month</p>
          </div>
        </div>
      </div>
    </section>
  );
};