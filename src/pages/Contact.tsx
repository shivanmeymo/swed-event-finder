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
import { Mail, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      // Prepare email data
      const emailData = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        topic: formData.get('topic') as string,
        category: formData.get('category') as string,
        summary: formData.get('summary') as string,
      };

      // TODO: Implement email sending via edge function
      console.log('Contact form data:', emailData);

      toast({
        title: "Message Sent!",
        description: "We've received your message and will get back to you soon.",
      });

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">✉️ Contact Swedevents</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We'd love to hear from you!
            </p>
            <p className="text-muted-foreground mt-2 max-w-3xl mx-auto">
              Whether you're planning an unforgettable corporate event, a private celebration, or looking to collaborate, the Swedevents team is here to make it happen.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Contact Information */}
            <Card className="border-border shadow-[var(--shadow-lg)]">
              <CardHeader>
                <CardTitle>📍 Get in Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-semibold text-foreground mb-1">Email:</p>
                  <a href="mailto:info@swedevents.com" className="text-primary hover:underline">
                    info@swedevents.com
                  </a>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">Phone:</p>
                  <a href="tel:+46700543050" className="text-primary hover:underline">
                    +46 (0)70 05430505
                  </a>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">Office Address:</p>
                  <p className="text-muted-foreground">
                    Swedevents AB<br />
                    Skeppsbron 2, 111 30<br />
                    Stockholm, Sweden
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Office Hours */}
            <Card className="border-border shadow-[var(--shadow-lg)]">
              <CardHeader>
                <CardTitle>🕒 Office Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Monday – Friday: 9:00 AM – 5:00 PM
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="border-border shadow-[var(--shadow-lg)]">
            <CardHeader>
              <CardTitle>💬 Send Us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your full name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+46 XX XXX XX XX"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Type of Event *</Label>
                    <Select name="category" required>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sport">Sport</SelectItem>
                        <SelectItem value="art">Art</SelectItem>
                        <SelectItem value="kids">Kids</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="summary">Message *</Label>
                  <Textarea
                    id="summary"
                    name="summary"
                    placeholder="Tell us about your event or inquiry..."
                    rows={6}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-[hsl(230,89%,62%)]"
                  disabled={isLoading}
                >
                  <Send className="mr-2 h-4 w-4" />
                  {isLoading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Footer Message */}
          <div className="mt-12 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-2">🤝 Let's Create Something Unforgettable</h3>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              At Swedevents, we specialize in turning your ideas into memorable experiences — from concept to celebration. 
              Fill out the form or reach out directly, and one of our event specialists will get back to you within 24 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
