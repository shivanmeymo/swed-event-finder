import { useState, useMemo, useEffect } from "react";
import Navbar from "@/components/Navbar";
import FilterBar from "@/components/FilterBar";
import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/sweden-outdoor-hero.jpg";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    keywords: [] as string[],
    date: "",
    location: "",
    category: "",
  });
  const [allEvents, setAllEvents] = useState<any[]>([]);

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
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Button size="lg" className="bg-primary hover:bg-primary/90 transition-all hover:scale-105" onClick={() => document.getElementById('events-section')?.scrollIntoView({ behavior: 'smooth' })}>
                Explore Events
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 bg-accent hover:bg-accent/90 text-accent-foreground border-accent font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105" 
                onClick={() => window.location.href = '/create'}
              >
                Create Event
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
      <section id="events-section" className="container mx-auto px-4 py-12" aria-label="Event listings">
        <div className="mb-8">
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
      <footer className="border-t border-border bg-card mt-20" role="contentinfo">
        <div className="container mx-auto px-4 py-12">
          <nav aria-label="Footer navigation">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <h3 className="text-2xl font-bold text-primary mb-4">
                  NowInTown
                </h3>
                <p className="text-muted-foreground mb-4">
                  Discover amazing events and activities across Sweden. From music festivals to tech conferences, find your next experience with us.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li><a href="/" className="hover:text-primary transition-colors">Home</a></li>
                  <li><a href="/create" className="hover:text-primary transition-colors">Create Event</a></li>
                  <li><a href="/manage" className="hover:text-primary transition-colors">Manage Event</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-4">Legal & Contact</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li><a href="/about" className="hover:text-primary transition-colors">About Us</a></li>
                  <li><a href="/contact" className="hover:text-primary transition-colors">Contact Us</a></li>
                  <li><a href="/data-integrity" className="hover:text-primary transition-colors">Data Integrity</a></li>
                </ul>
              </div>
            </div>
          </nav>
          
          <div className="border-t border-border mt-8 pt-4 text-center text-muted-foreground text-sm">
            <p>&copy; {new Date().getFullYear()} NowInTown. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
