import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, MapPin, Upload, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const eventSchema = z.object({
  organizer_name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  organizer_email: z.string().trim().email("Please enter a valid email").max(255),
  organizer_description: z.string().trim().max(1000).optional(),
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(200),
  description: z.string().trim().max(2000, "Description too long").optional(),
  location: z.string().trim().min(3, "Location must be at least 3 characters").max(200),
  category: z.string().min(1, "Please select a category"),
  start_date: z.string().min(1, "Start date is required"),
  start_time: z.string().min(1, "Start time is required"),
  end_date: z.string().min(1, "End date is required"),
  end_time: z.string().min(1, "End time is required"),
  is_free: z.boolean(),
  price_adults: z.string().optional(),
  price_students: z.string().optional(),
  price_kids: z.string().optional(),
  price_seniors: z.string().optional(),
}).refine(
  (data) => {
    const startDateTime = new Date(`${data.start_date}T${data.start_time}`);
    const endDateTime = new Date(`${data.end_date}T${data.end_time}`);
    return endDateTime > startDateTime;
  },
  {
    message: "Oops! Your event can't end before it starts! 🕐 Please check your dates and times.",
    path: ["end_date"],
  }
);

const CreateEvent = () => {
  const { user, loading } = useAuth();
  const { t, language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const [isFree, setIsFree] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      const categoryValue = formData.get('category') as string;
      const finalCategory = categoryValue === 'Others' ? customCategory : categoryValue;
      
      const validated = eventSchema.parse({
        organizer_name: formData.get('organizer_name') as string || "",
        organizer_email: formData.get('organizer_email') as string || "",
        organizer_description: formData.get('organizer_description') as string || undefined,
        title: formData.get('title') as string || "",
        description: (formData.get('description') as string) || '',
        location: formData.get('location') as string || "",
        category: finalCategory || "",
        start_date: formData.get('start_date') as string || "",
        start_time: formData.get('start_time') as string || "",
        end_date: formData.get('end_date') as string || "",
        end_time: formData.get('end_time') as string || "",
        is_free: isFree,
        price_adults: formData.get('price_adults') as string,
        price_students: formData.get('price_students') as string,
        price_kids: formData.get('price_kids') as string,
        price_seniors: formData.get('price_seniors') as string,
      });

      let imageUrl = "";

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

      const startDatetime = `${validated.start_date} ${validated.start_time}`;
      const endDatetime = `${validated.end_date} ${validated.end_time}`;

      const { data: eventData, error: insertError } = await supabase
        .from('events')
        .insert([{
          title: validated.title,
          description: validated.description,
          location: validated.location,
          category: finalCategory,
          start_datetime: startDatetime,
          end_datetime: endDatetime,
          organizer_id: user!.id,
          image_url: imageUrl,
          organizer_email: validated.organizer_email,
          organizer_description: validated.organizer_description,
          approved: false,
          is_free: validated.is_free,
          price_adults: validated.price_adults ? parseFloat(validated.price_adults) : null,
          price_students: validated.price_students ? parseFloat(validated.price_students) : null,
          price_kids: validated.price_kids ? parseFloat(validated.price_kids) : null,
          price_seniors: validated.price_seniors ? parseFloat(validated.price_seniors) : null,
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      try {
        await supabase.functions.invoke('notify-admin-event-created', {
          body: {
            eventId: eventData.id,
            title: validated.title,
            description: validated.description || '',
            location: validated.location,
            category: finalCategory,
            startDatetime: startDatetime,
            organizerEmail: validated.organizer_email,
            organizerDescription: validated.organizer_description,
          },
        });
        console.log("Admin notification sent");
      } catch (notifError) {
        console.error("Failed to send admin notification:", notifError);
      }

      toast({
        title: "Awesome! Your event is submitted! 🎉",
        description: "Our team will review it soon and you'll get an email when it's approved!",
      });

      setTimeout(() => navigate("/"), 2000);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({
          title: "✨ Let's fix a few things!",
          description: error.errors[0].message,
        });
      } else {
        toast({
          title: "Hmm, something unexpected happened! 🤔",
          description: error.message || "Please try again or contact support if the issue persists.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Create New Event</h1>
            <p className="text-muted-foreground">
              Fill in the details below to publish your event
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <Card className="border-border/40 shadow-lg">
              <CardHeader className="pb-4 border-b border-border/40">
                <CardTitle className="text-xl flex items-center gap-2 text-foreground">
                  <Upload className="h-5 w-5 text-primary" />
                  Organizer Information
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Tell us about yourself
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="organizer_name" className="text-sm font-semibold text-foreground flex items-center gap-1">
                    Organizer's Name
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="organizer_name"
                    name="organizer_name"
                    required
                    placeholder="Enter organizer's full name"
                    className="bg-background border-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organizer_email" className="text-sm font-semibold text-foreground flex items-center gap-1">
                    Organizer's Email
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="organizer_email"
                    name="organizer_email"
                    type="email"
                    required
                    placeholder="organizer@example.com"
                    className="bg-background border-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organizer_description" className="text-sm font-semibold text-foreground flex items-center gap-1">
                    Organizer's Description (Optional)
                  </Label>
                  <Textarea
                    id="organizer_description"
                    name="organizer_description"
                    placeholder="Tell us about yourself and your experience organizing events (optional)..."
                    className="min-h-[120px] bg-background border-input resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40 shadow-lg">
              <CardHeader className="pb-4 border-b border-border/40">
                <CardTitle className="text-xl flex items-center gap-2 text-foreground">
                  <Calendar className="h-5 w-5 text-primary" />
                  Event Details
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Fill in your event information
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-semibold text-foreground flex items-center gap-1">
                    Event Title
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    required
                    placeholder="e.g., Summer Music Festival 2025"
                    className="bg-background border-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-semibold text-foreground">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe your event in detail..."
                    className="min-h-[120px] bg-background border-input resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date" className="text-sm font-semibold text-foreground flex items-center gap-1">
                      Start Date
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="start_date"
                      name="start_date"
                      type="date"
                      required
                      className="bg-background border-input"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="start_time" className="text-sm font-semibold text-foreground flex items-center gap-1">
                      Start Time
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="start_time"
                      name="start_time"
                      type="time"
                      required
                      className="bg-background border-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="end_date" className="text-sm font-semibold text-foreground flex items-center gap-1">
                      End Date
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="end_date"
                      name="end_date"
                      type="date"
                      required
                      className="bg-background border-input"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="end_time" className="text-sm font-semibold text-foreground flex items-center gap-1">
                      End Time
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="end_time"
                      name="end_time"
                      type="time"
                      required
                      className="bg-background border-input"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm font-semibold text-foreground flex items-center gap-1">
                    Location
                    <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      name="location"
                      required
                      placeholder="Event location"
                      className="pl-10 bg-background border-input"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-semibold text-foreground flex items-center gap-1">
                    Category
                    <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    name="category"
                    onValueChange={(value) => {
                      setShowCustomCategory(value === 'Others');
                    }}
                  >
                    <SelectTrigger className="bg-background border-input">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border z-50">
                      <SelectItem value="Music">Music</SelectItem>
                      <SelectItem value="Tech">Tech</SelectItem>
                      <SelectItem value="Sports">Sports</SelectItem>
                      <SelectItem value="Food">Food</SelectItem>
                      <SelectItem value="Art">Art</SelectItem>
                      <SelectItem value="Others">Others (Custom)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {showCustomCategory && (
                  <div className="space-y-2 animate-fade-in">
                    <Label htmlFor="custom_category" className="text-sm font-semibold text-foreground flex items-center gap-1">
                      Custom Category
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="custom_category"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      placeholder="Enter your custom category"
                      className="bg-background border-input"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-foreground flex items-center gap-1">
                    Event Price
                    <span className="text-destructive">*</span>
                  </Label>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="is_free"
                        checked={isFree}
                        onChange={(e) => setIsFree(e.target.checked)}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="is_free" className="text-sm font-normal cursor-pointer">
                        This event is free
                      </Label>
                    </div>
                    
                    {!isFree && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                        <div className="space-y-2">
                          <Label htmlFor="price_adults" className="text-sm">
                            Adults
                          </Label>
                          <Input
                            id="price_adults"
                            name="price_adults"
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            className="bg-background border-input"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="price_students" className="text-sm">
                            Students
                          </Label>
                          <Input
                            id="price_students"
                            name="price_students"
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            className="bg-background border-input"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="price_kids" className="text-sm">
                            Kids
                          </Label>
                          <Input
                            id="price_kids"
                            name="price_kids"
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            className="bg-background border-input"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="price_seniors" className="text-sm">
                            Seniors
                          </Label>
                          <Input
                            id="price_seniors"
                            name="price_seniors"
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            className="bg-background border-input"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40 shadow-lg">
              <CardHeader className="pb-4 border-b border-border/40">
                <CardTitle className="text-xl flex items-center gap-2 text-foreground">
                  <Upload className="h-5 w-5 text-primary" />
                  Event Image
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Upload an image to make your event more attractive
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-border/40 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <input
                      type="file"
                      id="image"
                      name="image"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label htmlFor="image" className="cursor-pointer">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-h-64 mx-auto rounded-lg"
                        />
                      ) : (
                        <div className="space-y-2">
                          <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Click to upload or drag and drop
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-lg shadow-lg"
            >
              {isLoading ? (
                "Creating Event..."
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  Create Event
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;