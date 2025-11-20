import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, MapPin, Clock, ArrowLeft, UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to load event details",
          variant: "destructive",
        });
        navigate('/');
        return;
      }
      
      if (!data) {
        toast({
          title: "Not Found",
          description: "Event not found",
          variant: "destructive",
        });
        navigate('/');
        return;
      }
      
      setEvent(data);
      setLoading(false);
    };

    fetchEvent();
  }, [id, navigate, toast]);

  const formatDateTime = (datetime: string) => {
    try {
      return format(new Date(datetime), "EEEE, d MMMM yyyy 'kl' HH:mm");
    } catch {
      return datetime;
    }
  };

  const getCategoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      Music: "bg-gradient-to-r from-purple-500 to-pink-500",
      Tech: "bg-gradient-to-r from-blue-500 to-cyan-500",
      Sports: "bg-gradient-to-r from-green-500 to-emerald-500",
      Food: "bg-gradient-to-r from-orange-500 to-red-500",
      Art: "bg-gradient-to-r from-indigo-500 to-purple-500",
    };
    return colors[cat] || "bg-primary";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="animate-pulse">
            <div className="h-96 bg-muted rounded-lg mb-8"></div>
            <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Button>

        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden border-border">
            <CardContent className="p-0">
              <div className="relative h-96">
                {event.image_url ? (
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <Calendar className="h-24 w-24 text-muted-foreground" />
                  </div>
                )}
                <Badge className={`absolute top-4 right-4 ${getCategoryColor(event.category)} text-white border-0 text-lg px-4 py-2`}>
                  {event.category}
                </Badge>
              </div>

              <div className="p-8">
              <h1 className="text-4xl font-bold mb-6 text-foreground">
                {event.title}
              </h1>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3 text-muted-foreground">
                  <Calendar className="h-5 w-5 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-foreground">Start</p>
                    <p>{formatDateTime(event.start_datetime)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-muted-foreground">
                  <Clock className="h-5 w-5 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-foreground">End</p>
                    <p>{formatDateTime(event.end_datetime)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-muted-foreground">
                  <MapPin className="h-5 w-5 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-foreground">Location</p>
                    <p>{event.location}</p>
                  </div>
                </div>
              </div>

              {event.description && (
                <div className="border-t border-border pt-6">
                  <h2 className="text-2xl font-semibold mb-4 text-foreground">About this event</h2>
                  <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {event.description}
                  </p>
                </div>
              )}

              {event.organizer_description && (
                <div className="border-t border-border pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <UserCircle2 className="h-6 w-6 text-primary" />
                    <h2 className="text-2xl font-semibold text-foreground">About the Organizer</h2>
                  </div>
                  <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {event.organizer_description}
                  </p>
                </div>
              )}

              <div className="border-t border-border pt-6">
                <h2 className="text-2xl font-semibold mb-4 text-foreground">Pricing</h2>
                {event.is_free ? (
                  <p className="text-lg font-semibold text-primary">FREE EVENT</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {event.price_adults && (
                      <div className="bg-muted/30 rounded-lg p-4">
                        <p className="text-sm text-muted-foreground mb-1">Adults</p>
                        <p className="text-lg font-semibold">{event.price_adults} SEK</p>
                      </div>
                    )}
                    {event.price_students && (
                      <div className="bg-muted/30 rounded-lg p-4">
                        <p className="text-sm text-muted-foreground mb-1">Students</p>
                        <p className="text-lg font-semibold">{event.price_students} SEK</p>
                      </div>
                    )}
                    {event.price_kids && (
                      <div className="bg-muted/30 rounded-lg p-4">
                        <p className="text-sm text-muted-foreground mb-1">Kids</p>
                        <p className="text-lg font-semibold">{event.price_kids} SEK</p>
                      </div>
                    )}
                    {event.price_seniors && (
                      <div className="bg-muted/30 rounded-lg p-4">
                        <p className="text-sm text-muted-foreground mb-1">Seniors</p>
                        <p className="text-lg font-semibold">{event.price_seniors} SEK</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="border-t border-border pt-6">
                <h2 className="text-2xl font-semibold mb-4 text-foreground">Add to Calendar</h2>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const title = encodeURIComponent(event.title);
                      const details = encodeURIComponent(event.description || '');
                      const location = encodeURIComponent(event.location);
                      const start = new Date(event.start_datetime).toISOString().replace(/-|:|\.\d\d\d/g, '');
                      const end = new Date(event.end_datetime).toISOString().replace(/-|:|\.\d\d\d/g, '');
                      window.open(
                        `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${start}/${end}`,
                        '_blank'
                      );
                    }}
                  >
                    Google Calendar
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const start = new Date(event.start_datetime).toISOString().replace(/-|:|\.\d\d\d/g, '');
                      const end = new Date(event.end_datetime).toISOString().replace(/-|:|\.\d\d\d/g, '');
                      window.open(
                        `https://outlook.office.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(event.title)}&body=${encodeURIComponent(event.description || '')}&location=${encodeURIComponent(event.location)}&startdt=${start}&enddt=${end}`,
                        '_blank'
                      );
                    }}
                  >
                    Outlook Calendar
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const start = new Date(event.start_datetime).toISOString().replace(/-|:|\.\d\d\d/g, '');
                      const end = new Date(event.end_datetime).toISOString().replace(/-|:|\.\d\d\d/g, '');
                      const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${start}
DTEND:${end}
SUMMARY:${event.title}
DESCRIPTION:${event.description || ''}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`;
                      const blob = new Blob([icsContent], { type: 'text/calendar' });
                      const url = window.URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `${event.title}.ics`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      window.URL.revokeObjectURL(url);
                    }}
                  >
                    iCal Calendar
                  </Button>
                </div>
              </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
