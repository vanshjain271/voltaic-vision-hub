import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Search, Edit, MapPin, Calendar, Linkedin, Trash2, UserPlus } from "lucide-react";
import { useRole } from "@/hooks/useRole";

interface Member {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string | null;
  bio: string | null;
  location: string | null;
  position: string | null;
  linkedin_url: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export function MembersDirectory() {
  const { user } = useAuth();
  const { isAdmin } = useRole();
  const { toast } = useToast();
  
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: "",
    bio: "",
    location: "",
    position: "",
    linkedin_url: "",
    description: "",
    avatar_url: ""
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    if (user && editingProfile) {
      // Pre-fill form with current user data
      const currentUser = members.find(m => m.id === user.id);
      if (currentUser) {
        setProfileData({
          full_name: currentUser.full_name || "",
          bio: currentUser.bio || "",
          location: currentUser.location || "",
          position: currentUser.position || "",
          linkedin_url: currentUser.linkedin_url || "",
          description: currentUser.description || "",
          avatar_url: currentUser.avatar_url || ""
        });
      }
    }
  }, [user, editingProfile, members]);

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
        description: "Failed to fetch members",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    if (!user) return;

    try {
      let avatarUrl = profileData.avatar_url;

      // Upload avatar if a new file is selected
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${user.id}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, avatarFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);

        avatarUrl = publicUrl;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.full_name,
          bio: profileData.bio,
          location: profileData.location,
          position: profileData.position,
          linkedin_url: profileData.linkedin_url,
          description: profileData.description,
          avatar_url: avatarUrl
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      setEditingProfile(false);
      fetchMembers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteMember = async (memberId: string) => {
    if (!isAdmin) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Member deleted successfully",
      });

      fetchMembers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredMembers = members.filter(member =>
    member.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  const getRoleColor = (role: string | null) => {
    switch (role?.toLowerCase()) {
      case 'admin':
      case 'president':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'vice president':
      case 'moderator':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default:
        return 'bg-green-500/10 text-green-500 border-green-500/20';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        
        <Skeleton className="h-10 w-full max-w-md" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold neon-text">Member Directory</h2>
          <p className="text-muted-foreground">Connect with our community members</p>
        </div>
        
        {user && isAdmin && (
          <Dialog open={editingProfile} onOpenChange={setEditingProfile}>
            <DialogTrigger asChild>
              <Button className="btn-neon mr-2">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card max-w-2xl">
              <DialogHeader>
                <DialogTitle className="neon-text">Add New Member</DialogTitle>
                <DialogDescription>
                  Add a new member to the directory (Admin only)
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profileData.full_name}
                      onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                      className="glass-card"
                    />
                  </div>
                  <div>
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      value={profileData.position}
                      onChange={(e) => setProfileData({ ...profileData, position: e.target.value })}
                      placeholder="e.g., President, Developer, Designer"
                      className="glass-card"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    placeholder="Tell us about the member..."
                    className="glass-card"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={profileData.description}
                    onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
                    placeholder="Detailed description about their role and expertise..."
                    className="glass-card"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profileData.location}
                      onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                      placeholder="City, Country"
                      className="glass-card"
                    />
                  </div>
                  <div>
                    <Label htmlFor="linkedin">LinkedIn URL</Label>
                    <Input
                      id="linkedin"
                      value={profileData.linkedin_url}
                      onChange={(e) => setProfileData({ ...profileData, linkedin_url: e.target.value })}
                      placeholder="https://linkedin.com/in/username"
                      className="glass-card"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="avatar">Profile Picture</Label>
                  <Input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                    className="glass-card"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button
                  onClick={updateProfile}
                  disabled={!profileData.full_name.trim()}
                  className="btn-neon"
                >
                  Add Member
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        
        {user && !isAdmin && (
          <Dialog open={editingProfile} onOpenChange={setEditingProfile}>
            <DialogTrigger asChild>
              <Button className="btn-neon">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card max-w-2xl">
              <DialogHeader>
                <DialogTitle className="neon-text">Edit Your Profile</DialogTitle>
                <DialogDescription>
                  Update your member information and profile details
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profileData.full_name}
                      onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                      className="glass-card"
                    />
                  </div>
                  <div>
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      value={profileData.position}
                      onChange={(e) => setProfileData({ ...profileData, position: e.target.value })}
                      placeholder="e.g., President, Developer, Designer"
                      className="glass-card"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                    className="glass-card"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={profileData.description}
                    onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
                    placeholder="Detailed description about your role and expertise..."
                    className="glass-card"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profileData.location}
                      onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                      placeholder="City, Country"
                      className="glass-card"
                    />
                  </div>
                  <div>
                    <Label htmlFor="linkedin">LinkedIn URL</Label>
                    <Input
                      id="linkedin"
                      value={profileData.linkedin_url}
                      onChange={(e) => setProfileData({ ...profileData, linkedin_url: e.target.value })}
                      placeholder="https://linkedin.com/in/username"
                      className="glass-card"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="avatar">Profile Picture</Label>
                  <Input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                    className="glass-card"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditingProfile(false)}>
                  Cancel
                </Button>
                <Button onClick={updateProfile} className="btn-neon">
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 glass-card"
        />
      </div>
      
      {filteredMembers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchTerm ? "No members found matching your search." : "No members found."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <Card key={member.id} className="glass-card group hover:neon-glow transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-16 h-16 border-2 border-primary/20">
                      <AvatarImage src={member.avatar_url || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {member.full_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">
                        {member.full_name || 'Anonymous User'}
                      </h3>
                      <Badge className={getRoleColor(member.position || member.role)}>
                        {member.position || member.role || 'Member'}
                      </Badge>
                    </div>
                  </div>
                  
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMember(member.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                
                {(member.bio || member.description) && (
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-3">
                    {member.description || member.bio}
                  </p>
                )}
                
                <div className="space-y-2 text-xs text-muted-foreground">
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
                  
                  {member.linkedin_url && (
                    <div className="flex items-center gap-2">
                      <Linkedin className="w-3 h-3" />
                      <a 
                        href={member.linkedin_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        LinkedIn Profile
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Community Stats */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-6">
        <Card className="glass-card text-center p-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold neon-text">{members.length}</CardTitle>
          </CardHeader>
          <CardDescription>Total Members</CardDescription>
        </Card>
        
        <Card className="glass-card text-center p-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold neon-text">
              {members.filter(m => m.role === 'admin' || m.position?.toLowerCase().includes('president')).length}
            </CardTitle>
          </CardHeader>
          <CardDescription>Leadership Team</CardDescription>
        </Card>
        
        <Card className="glass-card text-center p-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold neon-text">
              {members.filter(m => {
                const joinDate = new Date(m.created_at);
                const oneMonthAgo = new Date();
                oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
                return joinDate > oneMonthAgo;
              }).length}
            </CardTitle>
          </CardHeader>
          <CardDescription>New This Month</CardDescription>
        </Card>
      </div>
    </div>
  );
}