import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
import { supabase } from "@/integrations/supabase/client";
import contactHero from "@/assets/contact-hero.jpg";
import { useLanguage } from "@/contexts/LanguageContext";

const Contact = () => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      const emailData = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        subject: `${category} Inquiry`,
        message: formData.get('summary') as string,
      };

      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: emailData
      });

      if (error) throw error;

      toast({
        title: "Message Sent!",
        description: "We've received your message and will get back to you soon.",
      });

      e.currentTarget.reset();
      setCategory("");

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error: any) {
      console.error('Error sending email:', error);
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
          {/* Hero Image */}
          <div className="mb-12 rounded-lg overflow-hidden shadow-[var(--shadow-lg)]">
            <img 
              src={contactHero} 
              alt="Contact NowInTown" 
              className="w-full h-64 object-cover"
            />
          </div>

          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">✉️ {t("contact.title")}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("contact.subtitle")}
            </p>
            <p className="text-muted-foreground mt-2 max-w-3xl mx-auto">
              {t("contact.description")}
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
                  <a href="mailto:contact@nowintown.com" className="text-primary hover:underline">
                    contact@nowintown.com
                  </a>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">Phone:</p>
                  <a href="tel:+46705430505" className="text-primary hover:underline">
                    +46 (0)70 543 05 05
                  </a>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">Office Address:</p>
                  <p className="text-muted-foreground">
                    Uppsala, Sweden
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
                    <Label htmlFor="category">Category *</Label>
                    <Select value={category} onValueChange={setCategory} required>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Support">Support</SelectItem>
                        <SelectItem value="Data Integrity">Data Integrity</SelectItem>
                        <SelectItem value="Suggestion">Suggestion</SelectItem>
                        <SelectItem value="Events">Events</SelectItem>
                        <SelectItem value="Business">Business</SelectItem>
                        <SelectItem value="Others">Others</SelectItem>
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
              At NowInTown, we specialize in turning your ideas into memorable experiences — from concept to celebration. 
              Fill out the form or reach out directly, and one of our event specialists will get back to you within 24 hours.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
