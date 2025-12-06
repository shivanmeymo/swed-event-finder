import { useState, useMemo, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FilterBar from "@/components/FilterBar";
import EventCard from "@/components/EventCard";
import CookieConsent from "@/components/CookieConsent";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import heroImage from "@/assets/sweden-outdoor-hero.jpg";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [filters, setFilters] = useState({
    keywords: [] as string[],
    date: "",
    dateRange: "",
    location: "",
    category: "",
    isFree: false,
  });
  const [allEvents, setAllEvents] = useState<any[]>([]);

  // Fetch events from database
  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('approved', true)
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
          is_free: event.is_free,
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

      // Date range filter
      if (filters.dateRange && filters.dateRange !== "all") {
        const eventDate = new Date(event.start_datetime);
        const now = new Date();
        
        // Get today's date at midnight in local timezone
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        
        if (filters.dateRange === "today") {
          // Check if event date is today (comparing just the date parts)
          const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
          const todayDateOnly = new Date(todayStart.getFullYear(), todayStart.getMonth(), todayStart.getDate());
          if (eventDateOnly.getTime() !== todayDateOnly.getTime()) return false;
        } else if (filters.dateRange === "thisWeek") {
          // Get end of week (7 days from today)
          const weekEnd = new Date(todayStart);
          weekEnd.setDate(weekEnd.getDate() + 7);
          const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
          if (eventDateOnly < todayStart || eventDateOnly >= weekEnd) return false;
        } else if (filters.dateRange === "thisMonth") {
          // Get events from today until end of current month
          const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
          const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
          if (eventDateOnly < todayStart || eventDate > monthEnd) return false;
        }
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

      // Free filter
      if (filters.isFree && !event.is_free) {
        return false;
      }

      return true;
    });
  }, [filters, allEvents]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden" role="banner" aria-labelledby="hero-heading">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Sweden outdoor activities" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        {/* Content Overlay */}
        <div className="container mx-auto px-4 z-10 relative">
          <div className="text-center space-y-6 animate-fade-in">
            <h1 id="hero-heading" className="text-4xl md:text-6xl font-bold tracking-tight text-white drop-shadow-lg">
              {t("hero.title1")} <br />
              {t("hero.title2")}
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
              {t("hero.subtitle")}
            </p>
            <Button
              onClick={() => {
                const filterSection = document.getElementById('filter-section');
                if (filterSection) {
                  const navbarHeight = 80;
                  const y = filterSection.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                  window.scrollTo({ top: y, behavior: 'smooth' });
                }
              }}
              size="lg"
              variant="default"
              className="text-lg h-12 px-8 shadow-lg hover:shadow-xl transition-all bg-accent hover:bg-accent/90"
              aria-label={t("hero.exploreButton")}
            >
              {t("hero.exploreButton")}
              <ArrowDown className="ml-2 h-5 w-5 animate-bounce" />
            </Button>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section id="filter-section" className="container mx-auto px-4 py-8" aria-label="Event filters">
        <FilterBar onFilterChange={setFilters} />
      </section>

      {/* Events Section */}
      <section id="events-section" className="container mx-auto px-4 py-8" aria-label="Event listings">
        <div className="mb-4">
          <h2 className="text-3xl font-bold text-foreground">{t("events.title")}</h2>
          <p className="text-muted-foreground mt-1" role="status" aria-live="polite">
            {filteredEvents.length} {t("events.found")}
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
                {t("events.noResults")}
              </p>
            </div>
          )}
        </div>
      </section>
      
      <Footer />
      
      <CookieConsent />
    </div>
  );
};

export default Index;
