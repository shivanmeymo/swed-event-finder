import { useState, useMemo, useEffect } from "react";
import Navbar from "@/components/Navbar";
import FilterBar from "@/components/FilterBar";
import EventCard from "@/components/EventCard";
import CookieConsent from "@/components/CookieConsent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowDown } from "lucide-react";
import heroImage from "@/assets/sweden-outdoor-hero.jpg";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import logo from "@/assets/logo.png";

const Index = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
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
      toast.error(language === "sv" ? "Ange din e-postadress" : "Please enter your email address");
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
          toast.error(language === "sv" ? "Denna e-post är redan prenumererad" : "This email is already subscribed");
        } else {
          throw error;
        }
      } else {
        toast.success(language === "sv" ? "Prenumeration lyckades!" : "Successfully subscribed to newsletter!");
        setSubscribeEmail("");
        setSubscribeCategory("");
        setSubscribeLocation("");
        setSubscribeKeyword("");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error(language === "sv" ? "Misslyckades att prenumerera" : "Failed to subscribe. Please try again.");
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
      <section className="relative min-h-[600px] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-background to-muted/20">
        {/* Content */}
        <div className="container mx-auto px-4 py-12 text-center z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[#006AA7] to-[#FECC00] bg-clip-text text-transparent animate-fade-in">
            {t("hero.title1")} <br />
            {t("hero.title2")}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-foreground/90 max-w-3xl mx-auto animate-fade-in">
            {t("hero.subtitle")}
          </p>
          <Button 
            size="lg" 
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-lg px-8 py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in"
            onClick={() => {
              const filterSection = document.getElementById('filter-section');
              filterSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
          >
            {t("hero.exploreButton")}
            <ArrowDown className="ml-2 h-5 w-5 animate-bounce" />
          </Button>
        </div>
        
        {/* Hero Image */}
        <div className="w-full max-w-6xl mx-auto px-4 mt-8">
          <img 
            src={heroImage} 
            alt="Sweden outdoor activities and events" 
            className="w-full h-auto rounded-2xl shadow-2xl animate-fade-in"
          />
        </div>
      </section>

      {/* Filter Section */}
      <section id="filter-section" className="container mx-auto px-4 -mt-8 relative z-20" aria-label="Event filters">
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

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-12" role="contentinfo">
        <div className="container mx-auto px-4 py-8">
          <nav aria-label="Footer navigation">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity mb-3"
                  aria-label="Scroll to top"
                >
                  <img src={logo} alt="" className="h-10 w-10" aria-hidden="true" />
                  <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-[#006AA7] to-[#FECC00] bg-clip-text text-transparent">
                    NowInTown
                  </span>
                </button>
                <p className="text-muted-foreground text-sm mb-4">
                  {t("footer.description")}
                </p>
                
                <h4 className="font-semibold text-foreground mb-2 text-sm">{t("footer.quickLinks")}</h4>
                <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                  <li><a href="/create" className="text-primary hover:text-primary/80 font-medium transition-colors">{t("footer.createEvent")}</a></li>
                  <li><a href="/about" className="text-primary hover:text-primary/80 font-medium transition-colors">{t("footer.aboutUs")}</a></li>
                  <li><a href="/contact" className="text-primary hover:text-primary/80 font-medium transition-colors">{t("footer.contactUs")}</a></li>
                  <li><a href="/data-integrity" className="text-primary hover:text-primary/80 font-medium transition-colors">{t("footer.dataIntegrity")}</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-3 text-sm">{t("footer.newsletter")}</h4>
                <form onSubmit={handleSubscribe} className="space-y-2">
                  <div>
                    <Label htmlFor="subscribe-email" className="sr-only">{t("footer.email")}</Label>
                    <Input
                      id="subscribe-email"
                      type="email"
                      placeholder={t("footer.email")}
                      value={subscribeEmail}
                      onChange={(e) => setSubscribeEmail(e.target.value)}
                      required
                      className="h-9"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label htmlFor="subscribe-category" className="text-xs text-muted-foreground">{t("footer.category")}</Label>
                      <Select value={subscribeCategory} onValueChange={setSubscribeCategory}>
                        <SelectTrigger id="subscribe-category" className="h-8 text-xs">
                          <SelectValue placeholder={t("footer.any")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t("category.all")}</SelectItem>
                          <SelectItem value="music">{t("category.music")}</SelectItem>
                          <SelectItem value="sports">{t("category.sports")}</SelectItem>
                          <SelectItem value="food">{t("category.food")}</SelectItem>
                          <SelectItem value="art">{t("category.art")}</SelectItem>
                          <SelectItem value="tech">{t("category.tech")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="subscribe-location" className="text-xs text-muted-foreground">{t("footer.location")}</Label>
                      <Input
                        id="subscribe-location"
                        type="text"
                        placeholder={t("footer.any")}
                        value={subscribeLocation}
                        onChange={(e) => setSubscribeLocation(e.target.value)}
                        className="h-8 text-xs"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subscribe-keyword" className="text-xs text-muted-foreground">{t("footer.keywords")}</Label>
                      <Input
                        id="subscribe-keyword"
                        type="text"
                        placeholder={t("footer.optional")}
                        value={subscribeKeyword}
                        onChange={(e) => setSubscribeKeyword(e.target.value)}
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>
                  <Button type="submit" size="sm" className="w-full h-8 text-xs rounded-lg">{t("footer.subscribe")}</Button>
                </form>
              </div>
            </div>
          </nav>
          
          <div className="border-t border-border mt-4 pt-2 text-center text-muted-foreground text-xs">
            <p>{t("footer.copyright")}</p>
          </div>
        </div>
      </footer>
      
      <CookieConsent />
    </div>
  );
};

export default Index;
