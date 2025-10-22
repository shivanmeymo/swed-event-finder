import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
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
import { Calendar, MapPin, Upload, Save, Trash2, Key } from "lucide-react";
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
  const [accessCode, setAccessCode] = useState("");
  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFindEvent = async () => {
    if (!accessCode.trim()) {
      toast({
        title: "Access Code Required",
        description: "Please enter your event access code",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('access_code', accessCode.trim())
        .single();

      if (error || !data) {
        toast({
          title: "Event Not Found",
          description: "No event found with this access code",
          variant: "destructive",
        });
        return;
      }

      setEvent(data);
      if (data.image_url) {
        setImagePreview(data.image_url);
      }
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
    if (!event) return;

    setIsLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      let imageUrl = event.image_url;

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
      const startDateTime = `${formData.get('start_date')}T${formData.get('start_time')}:00`;
      const endDateTime = `${formData.get('end_date')}T${formData.get('end_time')}:00`;
      
      const { error } = await supabase
        .from('events')
        .update({
          title: formData.get('title') as string,
          description: formData.get('description') as string,
          start_datetime: startDateTime,
          end_datetime: endDateTime,
          location: formData.get('location') as string,
          category: formData.get('category') as string,
          image_url: imageUrl,
        })
        .eq('access_code', accessCode);

      if (error) throw error;

      toast({
        title: "Event Updated!",
        description: "Your event has been updated successfully.",
      });
      
      navigate("/");
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
    if (!event) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('access_code', accessCode);

      if (error) throw error;

      toast({
        title: "Event Deleted",
        description: "Your event has been deleted successfully.",
      });
      
      navigate("/");
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
            <h1 className="text-4xl font-bold text-foreground mb-2">Manage Your Event</h1>
            <p className="text-muted-foreground">
              Enter your access code to edit or delete your event
            </p>
          </div>

          {!event ? (
            <Card className="border-border shadow-[var(--shadow-lg)]">
              <CardHeader>
                <CardTitle>Find Your Event</CardTitle>
                <CardDescription>
                  Enter the access code you received when creating the event
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="access-code">Access Code</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="access-code"
                        placeholder="Enter your 8-character code"
                        className="pl-10"
                        value={accessCode}
                        onChange={(e) => setAccessCode(e.target.value)}
                        maxLength={8}
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleFindEvent}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-primary to-[hsl(230,89%,62%)]"
                  >
                    {isLoading ? "Searching..." : "Find Event"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-border shadow-[var(--shadow-lg)]">
              <CardHeader>
                <CardTitle>Edit Event Details</CardTitle>
                <CardDescription>
                  Update your event information or delete it
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdate} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Event Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      defaultValue={event.title}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      name="description"
                      defaultValue={event.description}
                      rows={5}
                      required
                    />
                  </div>

                  <div className="space-y-4">
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
                            defaultValue={event.start_datetime?.split('T')[0]}
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
                          defaultValue={event.start_datetime?.split('T')[1]?.substring(0, 5)}
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
                            defaultValue={event.end_datetime?.split('T')[0]}
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
                          defaultValue={event.end_datetime?.split('T')[1]?.substring(0, 5)}
                          required
                        />
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                      ⚠️ Note: Events will be automatically deleted from the system at the ending date/time.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="location"
                        name="location"
                        defaultValue={event.location}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select name="category" defaultValue={event.category} required>
                      <SelectTrigger id="category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Music">Music</SelectItem>
                        <SelectItem value="Tech">Tech</SelectItem>
                        <SelectItem value="Sports">Sports</SelectItem>
                        <SelectItem value="Food">Food & Drink</SelectItem>
                        <SelectItem value="Art">Art & Culture</SelectItem>
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
