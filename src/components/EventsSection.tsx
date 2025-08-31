import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, MapPin, Users, Plus, Clock, CheckCircle } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  created_at: string;
  club_id: string | null;
}

interface Registration {
  id: string;
  event_id: string;
  user_id: string;
  registered_at: string;
}

export const EventsSection = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [registering, setRegistering] = useState<string | null>(null);
  
  // Form states
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventDate, setEventDate] = useState('');

  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch events
  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load events",
        variant: "destructive",
      });
    }
  };

  // Fetch user registrations
  const fetchRegistrations = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setRegistrations(data || []);
    } catch (error: any) {
      console.error('Error fetching registrations:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchEvents();
      if (user) {
        await fetchRegistrations();
      }
      setLoading(false);
    };
    loadData();
  }, [user]);

  // Create new event
  const createEvent = async () => {
    if (!user || !eventTitle.trim() || !eventDate) return;
    
    setCreating(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .insert({
          title: eventTitle,
          description: eventDescription,
          event_date: eventDate,
        })
        .select()
        .single();

      if (error) throw error;

      setEvents([...events, data]);
      setEventTitle('');
      setEventDescription('');
      setEventDate('');
      setShowCreateEvent(false);
      
      toast({
        title: "Success",
        description: "Event created successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
    setCreating(false);
  };

  // Register for event
  const registerForEvent = async (eventId: string) => {
    if (!user) return;
    
    setRegistering(eventId);
    try {
      const { data, error } = await supabase
        .from('registrations')
        .insert({
          event_id: eventId,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setRegistrations([...registrations, data]);
      
      toast({
        title: "Success",
        description: "Successfully registered for the event!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
    setRegistering(null);
  };

  const isRegistered = (eventId: string) => {
    return registrations.some(reg => reg.event_id === eventId);
  };

  const isUpcoming = (eventDate: string) => {
    return new Date(eventDate) > new Date();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const upcomingEvents = events.filter(event => isUpcoming(event.event_date));
  const pastEvents = events.filter(event => !isUpcoming(event.event_date));

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Loading events...</p>
      </div>
    );
  }

  return (
    <section id="events" className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl font-bold neon-text animate-slide-in">
            Events
          </h2>
          
          {user && (
            <Dialog open={showCreateEvent} onOpenChange={setShowCreateEvent}>
              <DialogTrigger asChild>
                <Button className="btn-neon">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Event
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card border-glass-border">
                <DialogHeader>
                  <DialogTitle>Create New Event</DialogTitle>
                  <DialogDescription>
                    Create a new event for the community.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="eventTitle">Event Title</Label>
                    <Input
                      id="eventTitle"
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                      placeholder="Enter event title"
                      className="glass-card border-glass-border"
                    />
                  </div>
                  <div>
                    <Label htmlFor="eventDate">Event Date & Time</Label>
                    <Input
                      id="eventDate"
                      type="datetime-local"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="glass-card border-glass-border"
                    />
                  </div>
                  <div>
                    <Label htmlFor="eventDescription">Description (Optional)</Label>
                    <Textarea
                      id="eventDescription"
                      value={eventDescription}
                      onChange={(e) => setEventDescription(e.target.value)}
                      placeholder="Enter event description"
                      className="glass-card border-glass-border"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={createEvent}
                    disabled={!eventTitle.trim() || !eventDate || creating}
                    className="btn-neon"
                  >
                    {creating ? 'Creating...' : 'Create Event'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Upcoming Events */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-6 text-primary">Upcoming Events</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event, index) => (
              <Card
                key={event.id}
                className="glass-card border-glass-border hover:neon-glow transition-all duration-300 animate-slide-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    {event.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {formatDate(event.event_date)}
                  </CardDescription>
                </CardHeader>
                
                {event.description && (
                  <CardContent>
                    <p className="text-muted-foreground">{event.description}</p>
                  </CardContent>
                )}
                
                <CardFooter>
                  {user ? (
                    isRegistered(event.id) ? (
                      <Button disabled className="w-full btn-glass">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Registered
                      </Button>
                    ) : (
                      <Button
                        onClick={() => registerForEvent(event.id)}
                        disabled={registering === event.id}
                        className="w-full btn-neon"
                      >
                        <Users className="w-4 h-4 mr-2" />
                        {registering === event.id ? 'Registering...' : 'Register'}
                      </Button>
                    )
                  ) : (
                    <Button disabled className="w-full btn-glass">
                      <Users className="w-4 h-4 mr-2" />
                      Sign in to Register
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
            
            {upcomingEvents.length === 0 && (
              <div className="col-span-full text-center py-12 glass-card rounded-2xl">
                <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No upcoming events</p>
                {user && (
                  <Button
                    onClick={() => setShowCreateEvent(true)}
                    className="btn-neon"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Event
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold mb-6 text-muted-foreground">Past Events</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.slice(0, 6).map((event, index) => (
                <Card
                  key={event.id}
                  className="glass-card border-glass-border opacity-75 animate-slide-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                      {event.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {formatDate(event.event_date)}
                    </CardDescription>
                  </CardHeader>
                  
                  {event.description && (
                    <CardContent>
                      <p className="text-muted-foreground text-sm">{event.description}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};