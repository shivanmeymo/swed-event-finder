import Navbar from "@/components/Navbar";
import FilterBar from "@/components/FilterBar";
import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const { t } = useLanguage();
  
  // Mock data for demonstration
  const events = [
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent-foreground text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              {t('heroSubtitle')}
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
              <span className="block bg-gradient-to-r from-primary via-[hsl(230,89%,62%)] to-accent bg-clip-text text-transparent">
                {t('heroTitle')}
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('heroDescription')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-gradient-to-r from-primary to-[hsl(230,89%,62%)] hover:opacity-90 transition-opacity">
                {t('exploreEvents')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-2">
                {t('createEvent')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="container mx-auto px-4 -mt-8 relative z-10">
        <FilterBar />
      </section>

      {/* Events Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">{t('upcomingEvents')}</h2>
            <p className="text-muted-foreground mt-1">
              {events.length} {t('eventsFound')}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
