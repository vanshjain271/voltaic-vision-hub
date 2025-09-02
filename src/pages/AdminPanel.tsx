import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface JoinApplication {
  id: string;
  name: string;
  roll_number: string;
  branch: string;
  reason_to_join: string;
  prior_experience: string | null;
  status: string;
  created_at: string;
}

interface UserRole {
  id: string;
  user_id: string;
  role: string;
  profiles: {
    full_name: string;
  } | null;
}

const AdminPanel = () => {
  const { user } = useAuth();
  const { isAdmin, loading } = useRole();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [applications, setApplications] = useState<JoinApplication[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loadingApplications, setLoadingApplications] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/');
      return;
    }
    
    if (isAdmin) {
      fetchApplications();
      fetchUserRoles();
    }
  }, [isAdmin, loading, navigate]);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('join_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch applications",
        variant: "destructive",
      });
    } finally {
      setLoadingApplications(false);
    }
  };

  const fetchUserRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          id,
          user_id,
          role,
          created_at
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Fetch profiles separately to avoid complex join issues
      if (data && data.length > 0) {
        const userIds = data.map(ur => ur.user_id);
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', userIds);

        const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);
        
        const enrichedData = data.map(userRole => ({
          ...userRole,
          profiles: profilesMap.get(userRole.user_id) || { full_name: 'Unknown User' }
        }));
        
        setUserRoles(enrichedData);
      } else {
        setUserRoles([]);
      }
    } catch (error: any) {
      toast({
        title: "Error", 
        description: "Failed to fetch user roles",
        variant: "destructive",
      });
    } finally {
      setLoadingUsers(false);
    }
  };

  const updateApplicationStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('join_applications')
        .update({
          status,
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Application ${status} successfully`,
      });

      fetchApplications();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateUserRole = async (userId: string, newRole: 'admin' | 'visitor') => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User role updated successfully",
      });

      fetchUserRoles();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">Loading...</div>
          </div>
        </main>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-foreground mb-8 text-center">Admin Panel</h1>
          
          <Tabs defaultValue="applications" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="applications">Join Applications</TabsTrigger>
              <TabsTrigger value="users">User Management</TabsTrigger>
            </TabsList>
            
            <TabsContent value="applications">
              <Card>
                <CardHeader>
                  <CardTitle>Membership Applications</CardTitle>
                  <CardDescription>
                    Review and approve/reject membership applications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingApplications ? (
                    <div>Loading applications...</div>
                  ) : applications.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      No applications found
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {applications.map((application) => (
                        <Card key={application.id}>
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="font-semibold text-lg">{application.name}</h3>
                                <p className="text-muted-foreground">
                                  {application.roll_number} • {application.branch}
                                </p>
                              </div>
                              <Badge variant={
                                application.status === 'approved' ? 'default' :
                                application.status === 'rejected' ? 'destructive' : 'secondary'
                              }>
                                {application.status}
                              </Badge>
                            </div>
                            
                            <div className="space-y-2 mb-4">
                              <div>
                                <strong>Reason to join:</strong>
                                <p className="text-muted-foreground">{application.reason_to_join}</p>
                              </div>
                              {application.prior_experience && (
                                <div>
                                  <strong>Prior experience:</strong>
                                  <p className="text-muted-foreground">{application.prior_experience}</p>
                                </div>
                              )}
                            </div>
                            
                            {application.status === 'pending' && (
                              <div className="flex space-x-2">
                                <Button 
                                  onClick={() => updateApplicationStatus(application.id, 'approved')}
                                  size="sm"
                                >
                                  Approve
                                </Button>
                                <Button 
                                  onClick={() => updateApplicationStatus(application.id, 'rejected')}
                                  variant="destructive"
                                  size="sm"
                                >
                                  Reject
                                </Button>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>User Role Management</CardTitle>
                  <CardDescription>
                    Manage user roles and permissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingUsers ? (
                    <div>Loading users...</div>
                  ) : userRoles.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      No users found
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userRoles.map((userRole) => (
                        <Card key={userRole.id}>
                          <CardContent className="p-6">
                            <div className="flex justify-between items-center">
                              <div>
                                <h3 className="font-semibold">
                                  {userRole.profiles?.full_name || 'Unknown User'}
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                  User ID: {userRole.user_id}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge variant={userRole.role === 'admin' ? 'default' : 'secondary'}>
                                  {userRole.role}
                                </Badge>
                                {userRole.user_id !== user?.id && (
                                  <div className="flex space-x-1">
                                    <Button
                                      onClick={() => updateUserRole(userRole.user_id, 'admin')}
                                      size="sm"
                                      variant={userRole.role === 'admin' ? 'default' : 'outline'}
                                      disabled={userRole.role === 'admin'}
                                    >
                                      Make Admin
                                    </Button>
                                    <Button
                                      onClick={() => updateUserRole(userRole.user_id, 'visitor')}
                                      size="sm"
                                      variant={userRole.role === 'visitor' ? 'default' : 'outline'}
                                      disabled={userRole.role === 'visitor'}
                                    >
                                      Make Visitor
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;