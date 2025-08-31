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
import { Building2, Plus, Mail, Phone, Globe, Trash2, Edit } from 'lucide-react';

interface Sponsor {
  id: string;
  name: string;
  contact_info: string | null;
  sponsored_event: string | null;
  created_at: string;
}

export const SponsorsSection = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Form states
  const [showCreateSponsor, setShowCreateSponsor] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);
  const [sponsorName, setSponsorName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [sponsoredEvent, setSponsoredEvent] = useState('');

  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch sponsors
  const fetchSponsors = async () => {
    try {
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSponsors(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load sponsors",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchSponsors();
      setLoading(false);
    };
    loadData();
  }, []);

  // Create or update sponsor
  const saveSponsor = async () => {
    if (!user || !sponsorName.trim()) return;
    
    setSubmitting(true);
    try {
      if (editingSponsor) {
        // Update existing sponsor
        const { data, error } = await supabase
          .from('sponsors')
          .update({
            name: sponsorName,
            contact_info: contactInfo || null,
            sponsored_event: sponsoredEvent || null,
          })
          .eq('id', editingSponsor.id)
          .select()
          .single();

        if (error) throw error;

        setSponsors(sponsors.map(s => s.id === editingSponsor.id ? data : s));
        toast({
          title: "Success",
          description: "Sponsor updated successfully!",
        });
      } else {
        // Create new sponsor
        const { data, error } = await supabase
          .from('sponsors')
          .insert({
            name: sponsorName,
            contact_info: contactInfo || null,
            sponsored_event: sponsoredEvent || null,
          })
          .select()
          .single();

        if (error) throw error;

        setSponsors([data, ...sponsors]);
        toast({
          title: "Success",
          description: "Sponsor added successfully!",
        });
      }

      // Reset form
      setSponsorName('');
      setContactInfo('');
      setSponsoredEvent('');
      setShowCreateSponsor(false);
      setEditingSponsor(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
    setSubmitting(false);
  };

  // Delete sponsor
  const deleteSponsor = async (sponsorId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('sponsors')
        .delete()
        .eq('id', sponsorId);

      if (error) throw error;

      setSponsors(sponsors.filter(s => s.id !== sponsorId));
      toast({
        title: "Success",
        description: "Sponsor removed successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Start editing sponsor
  const startEdit = (sponsor: Sponsor) => {
    setEditingSponsor(sponsor);
    setSponsorName(sponsor.name);
    setContactInfo(sponsor.contact_info || '');
    setSponsoredEvent(sponsor.sponsored_event || '');
    setShowCreateSponsor(true);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingSponsor(null);
    setSponsorName('');
    setContactInfo('');
    setSponsoredEvent('');
    setShowCreateSponsor(false);
  };

  const parseContactInfo = (contactInfo: string | null) => {
    if (!contactInfo) return {};
    
    try {
      return JSON.parse(contactInfo);
    } catch {
      // If it's not JSON, treat it as plain text
      return { info: contactInfo };
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Loading sponsors...</p>
      </div>
    );
  }

  return (
    <section id="sponsors" className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold neon-text animate-slide-in mb-4">
              Sponsors & Partners
            </h2>
            <p className="text-muted-foreground">
              Supporting our community and events
            </p>
          </div>
          
          {user && (
            <Dialog open={showCreateSponsor} onOpenChange={setShowCreateSponsor}>
              <DialogTrigger asChild>
                <Button className="btn-neon" onClick={() => setEditingSponsor(null)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Sponsor
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card border-glass-border">
                <DialogHeader>
                  <DialogTitle>
                    {editingSponsor ? 'Edit Sponsor' : 'Add New Sponsor'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingSponsor 
                      ? 'Update sponsor information' 
                      : 'Add a new sponsor or partner to showcase their support'
                    }
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="sponsorName">Sponsor Name</Label>
                    <Input
                      id="sponsorName"
                      value={sponsorName}
                      onChange={(e) => setSponsorName(e.target.value)}
                      placeholder="Enter sponsor name"
                      className="glass-card border-glass-border"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactInfo">Contact Information</Label>
                    <Textarea
                      id="contactInfo"
                      value={contactInfo}
                      onChange={(e) => setContactInfo(e.target.value)}
                      placeholder="Email, phone, website, or other contact details"
                      className="glass-card border-glass-border"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sponsoredEvent">Sponsored Event (Optional)</Label>
                    <Input
                      id="sponsoredEvent"
                      value={sponsoredEvent}
                      onChange={(e) => setSponsoredEvent(e.target.value)}
                      placeholder="Event name or description"
                      className="glass-card border-glass-border"
                    />
                  </div>
                </div>
                <DialogFooter className="flex gap-2">
                  {editingSponsor && (
                    <Button
                      variant="outline"
                      onClick={cancelEdit}
                      className="btn-glass"
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    onClick={saveSponsor}
                    disabled={!sponsorName.trim() || submitting}
                    className="btn-neon"
                  >
                    {submitting 
                      ? (editingSponsor ? 'Updating...' : 'Adding...') 
                      : (editingSponsor ? 'Update Sponsor' : 'Add Sponsor')
                    }
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Sponsors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sponsors.map((sponsor, index) => {
            const contact = parseContactInfo(sponsor.contact_info);
            
            return (
              <Card
                key={sponsor.id}
                className="glass-card border-glass-border hover:neon-glow transition-all duration-300 animate-slide-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Building2 className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{sponsor.name}</CardTitle>
                        <CardDescription className="text-sm">
                          Joined {new Date(sponsor.created_at).toLocaleDateString()}
                        </CardDescription>
                      </div>
                    </div>
                    
                    {user && (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEdit(sponsor)}
                          className="h-8 w-8 p-0 hover:bg-primary/10"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteSponsor(sponsor.id)}
                          className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  {sponsor.sponsored_event && (
                    <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                      <p className="text-sm font-medium text-accent mb-1">Sponsored Event</p>
                      <p className="text-sm text-muted-foreground">{sponsor.sponsored_event}</p>
                    </div>
                  )}
                  
                  {sponsor.contact_info && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Contact Information</p>
                      <div className="text-sm text-muted-foreground space-y-1">
                        {typeof contact === 'object' && contact.info ? (
                          <p>{contact.info}</p>
                        ) : (
                          <div className="space-y-1">
                            {contact.email && (
                              <div className="flex items-center gap-2">
                                <Mail className="w-3 h-3" />
                                <span>{contact.email}</span>
                              </div>
                            )}
                            {contact.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="w-3 h-3" />
                                <span>{contact.phone}</span>
                              </div>
                            )}
                            {contact.website && (
                              <div className="flex items-center gap-2">
                                <Globe className="w-3 h-3" />
                                <span>{contact.website}</span>
                              </div>
                            )}
                            {!contact.email && !contact.phone && !contact.website && (
                              <p>{sponsor.contact_info}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
          
          {sponsors.length === 0 && (
            <div className="col-span-full text-center py-12 glass-card rounded-2xl">
              <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No sponsors added yet</p>
              {user && (
                <Button
                  onClick={() => setShowCreateSponsor(true)}
                  className="btn-neon"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Sponsor
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Call to Action for Potential Sponsors */}
        <div className="mt-16 text-center">
          <div className="glass-card rounded-2xl p-8 neon-glow">
            <h3 className="text-2xl font-bold mb-4 neon-text">Become a Sponsor</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Partner with The Network to support our community events and initiatives. 
              Contact us to learn about sponsorship opportunities and benefits.
            </p>
            <Button className="btn-neon">
              <Mail className="w-4 h-4 mr-2" />
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};