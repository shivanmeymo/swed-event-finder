import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import FilterBar from "@/components/FilterBar";
import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/sweden-outdoor-hero.jpg";

const Index = () => {
  const [filters, setFilters] = useState({
    keywords: [] as string[],
    date: "",
    location: "",
    category: "",
  });

  // Mock data for demonstration
  const allEvents = [
    {
      id: 1,
      title: "Uppsala Jazz Festival 2025",
      date: "March 15, 2025",
      location: "Uppsala Concert Hall",
      attendees: 245,
      category: "Music",
      image: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=800&auto=format&fit=crop&q=60",
    },
    {
      id: 2,
      title: "Tech Innovation Summit",
      date: "March 20, 2025",
      location: "Stockholm Tech Hub",
      attendees: 456,
      category: "Tech",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60",
    },
    {
      id: 3,
      title: "Nordic Food Market",
      date: "March 22, 2025",
      location: "Stora Torget, Uppsala",
      attendees: 892,
      category: "Food",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=60",
    },
    {
      id: 4,
      title: "Art Exhibition: Modern Sweden",
      date: "March 25, 2025",
      location: "Uppsala Art Museum",
      attendees: 178,
      category: "Art",
      image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&auto=format&fit=crop&q=60",
    },
    {
      id: 5,
      title: "Marathon Stockholm 2025",
      date: "April 1, 2025",
      location: "Stockholm City Center",
      attendees: 1240,
      category: "Sports",
      image: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&auto=format&fit=crop&q=60",
    },
    {
      id: 6,
      title: "EDM Night at Katalin",
      date: "March 18, 2025",
      location: "Katalin, Uppsala",
      attendees: 567,
      category: "Music",
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=60",
    },
  ];

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
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Outdoor activities in Sweden" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-background" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="block text-white drop-shadow-lg">
                Discover Events and Activities
              </span>
              <span className="block text-white drop-shadow-lg">Across Sweden</span>
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
              Explore thousands of events from Uppsala, Stockholm, and beyond. All in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-gradient-to-r from-primary to-[hsl(230,89%,62%)] hover:opacity-90 transition-opacity">
                Explore Events
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-2 bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20">
                Create Event
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="container mx-auto px-4 -mt-8 relative z-10">
        <FilterBar onFilterChange={setFilters} />
      </section>

      {/* Events Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Upcoming Events</h2>
            <p className="text-muted-foreground mt-1">
              {filteredEvents.length} events found
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <EventCard key={event.id} {...event} />
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
      <footer className="border-t border-border bg-card mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-primary via-[hsl(230,89%,62%)] to-accent bg-clip-text text-transparent mb-4">
                SwedEvents
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
                <li><a href="/auth" className="hover:text-primary transition-colors">Sign In</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Contact</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>Email: info@swedevents.se</li>
                <li>Support: support@swedevents.se</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} SwedEvents. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
