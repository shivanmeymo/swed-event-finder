import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Check, X, Eye, Trash2, Edit } from "lucide-react";
import { format } from "date-fns";

const AdminDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        navigate("/auth");
        return;
      }

      // Check if user has admin role
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();

      if (error || !data) {
        toast.error("Access denied. Admin privileges required.");
        navigate("/");
        return;
      }

      setIsAdmin(true);
      fetchEvents();
    };

    if (!loading) {
      checkAdminStatus();
    }
  }, [user, loading, navigate]);

  const fetchEvents = async () => {
    setLoadingEvents(true);
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setEvents(data);
    } else if (error) {
      toast.error("Failed to load events");
    }
    setLoadingEvents(false);
  };

  const handleApprove = async (eventId: string) => {
    const { error } = await supabase
      .from('events')
      .update({ approved: true })
      .eq('id', eventId);

    if (error) {
      toast.error("Failed to approve event");
    } else {
      // Send approval email to organizer
      try {
        await supabase.functions.invoke('send-approval-email', {
          body: { eventId },
        });
        console.log("Approval email sent to organizer");
      } catch (emailError) {
        console.error("Failed to send approval email:", emailError);
      }

      // Send notification emails to subscribers
      try {
        await supabase.functions.invoke('send-notification-emails', {
          body: { eventId },
        });
        console.log("Notification emails sent to subscribers");
      } catch (notifError) {
        console.error("Failed to send notification emails:", notifError);
      }

      toast.success("Event approved successfully! 🎉 Organizer and subscribers will be notified via email 📧");
      fetchEvents();
    }
  };

  const handleReject = async (eventId: string) => {
    const { error } = await supabase
      .from('events')
      .update({ approved: null })
      .eq('id', eventId);

    if (error) {
      toast.error("Failed to reject event");
    } else {
      toast.success("Event rejected");
      fetchEvents();
    }
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);

    if (error) {
      toast.error("Failed to delete event");
    } else {
      toast.success("Event deleted successfully");
      fetchEvents();
    }
  };

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-20">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage all events</p>
        </div>

        {loadingEvents ? (
          <p className="text-center text-muted-foreground">Loading events...</p>
        ) : (
          <div className="grid gap-6">
            {events.map((event) => (
              <Card key={event.id} className="border-2">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {event.title}
                        {event.approved ? (
                          <Badge variant="default" className="bg-green-500">Approved</Badge>
                        ) : (
                          <Badge variant="destructive">Pending</Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        <span className="font-semibold">Category:</span> {event.category}<br />
                        <span className="font-semibold">Location:</span> {event.location}<br />
                        <span className="font-semibold">Organizer Email:</span> {event.organizer_email || "N/A"}<br />
                        <span className="font-semibold">Start:</span> {format(new Date(event.start_datetime), "PPp")}<br />
                        <span className="font-semibold">End:</span> {format(new Date(event.end_datetime), "PPp")}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
                  {event.organizer_description && (
                    <div className="mb-4 p-3 bg-muted rounded-md">
                      <p className="font-semibold text-sm mb-1">About the Organizer:</p>
                      <p className="text-sm">{event.organizer_description}</p>
                    </div>
                  )}
                  {event.image_url && (
                    <img src={event.image_url} alt={event.title} className="w-full h-48 object-cover rounded-md mb-4" />
                  )}
                  <div className="flex gap-2 flex-wrap">
                    {!event.approved && (
                      <>
                        <Button
                          onClick={() => handleApprove(event.id)}
                          variant="default"
                          size="sm"
                          className="bg-green-500 hover:bg-green-600"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleReject(event.id)}
                          variant="destructive"
                          size="sm"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                    <Button
                      onClick={() => navigate(`/event/${event.id}`)}
                      variant="outline"
                      size="sm"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      onClick={() => navigate(`/manage-event/${event.id}`)}
                      variant="outline"
                      size="sm"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(event.id)}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
