import { useState, useMemo, useEffect } from "react";
import Navbar from "@/components/Navbar";
import FilterBar from "@/components/FilterBar";
import EventCard from "@/components/EventCard";
import CookieConsent from "@/components/CookieConsent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, ArrowDown } from "lucide-react";
import heroImage from "@/assets/sweden-outdoor-hero.jpg";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const Index = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    keywords: [] as string[],
    date: "",
    location: "",
    category: "",
  });
  const [allEvents, setAllEvents] = useState<any[]>([]);
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [subscribeCategory, setSubscribeCategory] = useState("");
  const [subscribeLocation, setSubscribeLocation] = useState("");
  const [subscribeKeyword, setSubscribeKeyword] = useState("");

  // Fetch events from database
  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) {
        setAllEvents(data.map((event: any) => ({
          id: event.id,
          title: event.title,
          start_datetime: event.start_datetime,
          end_datetime: event.end_datetime,
          location: event.location,
          category: event.category,
          image: event.image_url,
          organizer_id: event.organizer_id,
        })));
      }
    };

    fetchEvents();

    // Set up realtime subscription for all event changes
    const channel = supabase
      .channel('events-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events',
        },
        () => {
          // Refetch all events on any change
          fetchEvents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Handle newsletter subscription
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subscribeEmail) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .insert({
          email: subscribeEmail,
          category_filter: subscribeCategory || null,
          location_filter: subscribeLocation || null,
          keyword_filter: subscribeKeyword || null,
        });

      if (error) {
        if (error.code === '23505') {
          toast.error("This email is already subscribed");
        } else {
          throw error;
        }
      } else {
        toast.success("Successfully subscribed to newsletter!");
        setSubscribeEmail("");
        setSubscribeCategory("");
        setSubscribeLocation("");
        setSubscribeKeyword("");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Failed to subscribe. Please try again.");
    }
  };

  // Filter events based on selected filters
  const filteredEvents = useMemo(() => {
    return allEvents.filter((event) => {
      // Keyword filter
      if (filters.keywords.length > 0) {
        const eventText = `${event.title} ${event.category} ${event.location}`.toLowerCase();
        const matchesKeywords = filters.keywords.some((keyword) =>
          eventText.includes(keyword.toLowerCase())
        );
        if (!matchesKeywords) return false;
      }

      // Location filter
      if (filters.location && filters.location !== "all") {
        if (!event.location.toLowerCase().includes(filters.location.toLowerCase())) {
          return false;
        }
      }

      // Category filter
      if (filters.category && filters.category !== "all") {
        if (event.category.toLowerCase() !== filters.category.toLowerCase()) {
          return false;
        }
      }

      return true;
    });
  }, [filters, allEvents]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20" aria-label="Welcome banner">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Scenic outdoor activities in Sweden" 
            className="w-full h-full object-cover animate-fade-in"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-background" aria-hidden="true" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight animate-fade-in">
              <span className="block text-white drop-shadow-lg">
                Discover Events and Activities
              </span>
              <span className="block text-accent drop-shadow-lg">Across Sweden</span>
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Explore thousands of events from Uppsala, Stockholm, and beyond. All in one place.
            </p>
            <div className="flex justify-center gap-4 mt-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Button size="lg" className="group" asChild>
                <a href="#events-section">
                  Explore Events
                  <ArrowDown className="ml-2 h-5 w-5 group-hover:translate-y-1 transition-transform" aria-hidden="true" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="container mx-auto px-4 -mt-8 relative z-20" aria-label="Event filters">
        <FilterBar onFilterChange={setFilters} />
      </section>

      {/* Events Section */}
      <section id="events-section" className="container mx-auto px-4 py-8" aria-label="Event listings">
        <div className="mb-4">
          <h2 className="text-3xl font-bold text-foreground">Upcoming Events</h2>
          <p className="text-muted-foreground mt-1" role="status" aria-live="polite">
            {filteredEvents.length} events found
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <EventCard key={event.id} {...event} currentUserId={user?.id} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground text-lg">
                No events found matching your filters. Try adjusting your search criteria.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-12" role="contentinfo">
        <div className="container mx-auto px-4 py-8">
          <nav aria-label="Footer navigation">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-primary mb-3">
                  NowInTown
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Discover amazing events and activities across Sweden.
                </p>
                
                <h4 className="font-semibold text-foreground mb-2 text-sm">Quick Links</h4>
                <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                  <li><a href="/" className="text-primary hover:text-primary/80 font-medium transition-colors">Home</a></li>
                  <li><a href="/create" className="text-primary hover:text-primary/80 font-medium transition-colors">Create Event</a></li>
                  <li><a href="/manage" className="text-primary hover:text-primary/80 font-medium transition-colors">Manage Event</a></li>
                  <li><a href="/about" className="text-primary hover:text-primary/80 font-medium transition-colors">About Us</a></li>
                  <li><a href="/contact" className="text-primary hover:text-primary/80 font-medium transition-colors">Contact Us</a></li>
                  <li><a href="/data-integrity" className="text-primary hover:text-primary/80 font-medium transition-colors">Data Integrity</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-3 text-sm">Subscribe to Newsletter</h4>
                <form onSubmit={handleSubscribe} className="space-y-2">
                  <div>
                    <Label htmlFor="subscribe-email" className="sr-only">Email</Label>
                    <Input
                      id="subscribe-email"
                      type="email"
                      placeholder="Your email"
                      value={subscribeEmail}
                      onChange={(e) => setSubscribeEmail(e.target.value)}
                      required
                      className="h-9"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label htmlFor="subscribe-category" className="text-xs text-muted-foreground">Category</Label>
                      <Select value={subscribeCategory} onValueChange={setSubscribeCategory}>
                        <SelectTrigger id="subscribe-category" className="h-8 text-xs">
                          <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Any</SelectItem>
                          <SelectItem value="music">Music</SelectItem>
                          <SelectItem value="sports">Sports</SelectItem>
                          <SelectItem value="food">Food</SelectItem>
                          <SelectItem value="art">Art</SelectItem>
                          <SelectItem value="tech">Tech</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="subscribe-location" className="text-xs text-muted-foreground">Location</Label>
                      <Input
                        id="subscribe-location"
                        type="text"
                        placeholder="Any"
                        value={subscribeLocation}
                        onChange={(e) => setSubscribeLocation(e.target.value)}
                        className="h-8 text-xs"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subscribe-keyword" className="text-xs text-muted-foreground">Keywords</Label>
                      <Input
                        id="subscribe-keyword"
                        type="text"
                        placeholder="Optional"
                        value={subscribeKeyword}
                        onChange={(e) => setSubscribeKeyword(e.target.value)}
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>
                  <Button type="submit" size="sm" className="w-full h-8 text-xs">Subscribe</Button>
                </form>
              </div>
            </div>
          </nav>
          
          <div className="border-t border-border mt-4 pt-2 text-center text-muted-foreground text-xs">
            <p>&copy; 2026 NowInTown. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
      <CookieConsent />
    </div>
  );
};

export default Index;
