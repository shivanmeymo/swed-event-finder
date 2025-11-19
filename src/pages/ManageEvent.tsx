import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, MapPin, Upload, Save, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ManageEvent = () => {
  const { user, loading } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    } else if (!loading && user) {
      fetchUserEvents();
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    // Check if there's an eventId in the query params
    const eventId = searchParams.get('eventId');
    if (eventId && events.length > 0) {
      const event = events.find(e => e.id === eventId);
      if (event) {
        handleSelectEvent(event);
      }
    }
  }, [searchParams, events]);

  const fetchUserEvents = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('organizer_id', user.id)
        .order('start_datetime', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectEvent = (event: any) => {
    setSelectedEvent(event);
    if (event.image_url) {
      setImagePreview(event.image_url);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedEvent) return;

    setIsLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      let imageUrl = selectedEvent.image_url;

      // Upload new image if provided
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('event-images')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('event-images')
          .getPublicUrl(fileName);
        
        imageUrl = publicUrl;
      }

      // Update event
      const startDatetime = `${formData.get('start_date')} ${formData.get('start_time')}`;
      const endDatetime = `${formData.get('end_date')} ${formData.get('end_time')}`;
      
      const { error } = await supabase
        .from('events')
        .update({
          title: formData.get('title') as string,
          description: formData.get('description') as string,
          start_datetime: startDatetime,
          end_datetime: endDatetime,
          location: formData.get('location') as string,
          category: formData.get('category') as string,
          image_url: imageUrl,
        } as any)
        .eq('id', selectedEvent.id);

      if (error) throw error;

      toast({
        title: "Event Updated!",
        description: "Your event has been updated successfully.",
      });
      
      setSelectedEvent(null);
      fetchUserEvents();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedEvent) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', selectedEvent.id);

      if (error) throw error;

      toast({
        title: "Event Deleted",
        description: "Your event has been deleted successfully.",
      });
      
      setSelectedEvent(null);
      fetchUserEvents();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Manage Your Events</h1>
            <p className="text-muted-foreground">
              View, edit, or delete your created events
            </p>
          </div>

          {!selectedEvent ? (
            <Card className="border-border shadow-[var(--shadow-lg)]">
              <CardHeader>
                <CardTitle>Your Events</CardTitle>
                <CardDescription>
                  Select an event to edit or delete
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p className="text-center text-muted-foreground py-8">Loading your events...</p>
                ) : events.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    You haven't created any events yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {events.map((event) => (
                      <button
                        key={event.id}
                        onClick={() => handleSelectEvent(event)}
                        className="w-full text-left p-4 rounded-lg border border-border hover:bg-accent transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground">{event.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {new Date(event.start_datetime).toLocaleDateString()} - {event.location}
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            {event.approved === true ? (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-300">
                                Approved & Published
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-300">
                                Approval in Progress
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="border-border shadow-[var(--shadow-lg)]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <CardTitle>Edit Event Details</CardTitle>
                    <CardDescription>
                      Update your event information or delete it
                    </CardDescription>
                    <div className="mt-2">
                      {selectedEvent.approved === true ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-300">
                          Status: Approved & Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-300">
                          Status: Approval in Progress
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setSelectedEvent(null)}
                  >
                    Back to List
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdate} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Event Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      defaultValue={selectedEvent.title}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      name="description"
                      defaultValue={selectedEvent.description}
                      rows={5}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start_date">Start Date *</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="start_date"
                          name="start_date"
                          type="date"
                          className="pl-10"
                          defaultValue={selectedEvent.start_datetime?.split(' ')[0] || ''}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="start_time">Start Time *</Label>
                      <Input
                        id="start_time"
                        name="start_time"
                        type="time"
                        defaultValue={selectedEvent.start_datetime?.split(' ')[1]?.substring(0, 5) || ''}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="end_date">End Date *</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="end_date"
                          name="end_date"
                          type="date"
                          className="pl-10"
                          defaultValue={selectedEvent.end_datetime?.split(' ')[0] || ''}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="end_time">End Time *</Label>
                      <Input
                        id="end_time"
                        name="end_time"
                        type="time"
                        defaultValue={selectedEvent.end_datetime?.split(' ')[1]?.substring(0, 5) || ''}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="location"
                        name="location"
                        defaultValue={selectedEvent.location}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select name="category" defaultValue={selectedEvent.category} required>
                      <SelectTrigger id="category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Music">Music</SelectItem>
                        <SelectItem value="Tech">Tech</SelectItem>
                        <SelectItem value="Sports">Sports</SelectItem>
                        <SelectItem value="Food">Food & Drink</SelectItem>
                        <SelectItem value="Art">Art & Culture</SelectItem>
                        <SelectItem value="Student">Student</SelectItem>
                        <SelectItem value="Kid">Kid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">Event Image</Label>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4">
                        <Input
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="cursor-pointer"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById("image")?.click()}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload
                        </Button>
                      </div>
                      {imagePreview && (
                        <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border">
                          <img
                            src={imagePreview}
                            alt="Event preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-primary to-[hsl(230,89%,62%)]"
                      disabled={isLoading}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {isLoading ? "Updating..." : "Update Event"}
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => setShowDeleteDialog(true)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your event.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageEvent;
