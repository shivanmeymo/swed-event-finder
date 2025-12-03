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
import contactHero from "@/assets/contact-hero-new.jpg";
import { useLanguage } from "@/contexts/LanguageContext";

const Contact = () => {
  const { t, language } = useLanguage();
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
                <CardTitle>📍 {t("contact.getInTouch")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-semibold text-foreground mb-1">{t("contact.email")}:</p>
                  <a href="mailto:contact@nowintown.se" className="text-primary hover:underline">
                    contact@nowintown.se
                  </a>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">{t("contact.phone")}:</p>
                  <a href="tel:+46705430505" className="text-primary hover:underline">
                    +46 (0)70 543 05 05
                  </a>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">{language === "sv" ? "Adress:" : "Office Address:"}</p>
                  <p className="text-muted-foreground">
                    Uppsala, Sweden
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Office Hours */}
            <Card className="border-border shadow-[var(--shadow-lg)]">
              <CardHeader>
                <CardTitle>🕒 {t("contact.hours")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t("contact.hoursValue")}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="border-border shadow-[var(--shadow-lg)]">
            <CardHeader>
              <CardTitle>💬 {t("contact.sendMessage")}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t("contact.name")} *</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder={language === "sv" ? "Ditt fullständiga namn" : "Your full name"}
                      required
                      aria-required="true"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t("contact.email")} *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder={language === "sv" ? "din.email@exempel.se" : "your.email@example.com"}
                      required
                      aria-required="true"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t("contact.phone")}</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+46 XX XXX XX XX"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">{t("contact.category")} *</Label>
                    <Select value={category} onValueChange={setCategory} required>
                      <SelectTrigger id="category">
                        <SelectValue placeholder={t("contact.selectCategory")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Support">{language === "sv" ? "Support" : "Support"}</SelectItem>
                        <SelectItem value="Data Integrity">{language === "sv" ? "Dataintegritet" : "Data Integrity"}</SelectItem>
                        <SelectItem value="Suggestion">{language === "sv" ? "Förslag" : "Suggestion"}</SelectItem>
                        <SelectItem value="Events">{language === "sv" ? "Evenemang" : "Events"}</SelectItem>
                        <SelectItem value="Business">{language === "sv" ? "Företag" : "Business"}</SelectItem>
                        <SelectItem value="Others">{language === "sv" ? "Annat" : "Others"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="summary">{language === "sv" ? "Meddelande" : "Message"} *</Label>
                  <Textarea
                    id="summary"
                    name="summary"
                    placeholder={language === "sv" ? "Berätta mer om din förfrågan..." : "Tell us about your event or inquiry..."}
                    rows={6}
                    required
                    aria-required="true"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-[hsl(230,89%,62%)]"
                  disabled={isLoading}
                >
                  <Send className="mr-2 h-4 w-4" />
                  {isLoading ? t("contact.sending") : t("contact.send")}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Footer Message */}
          <div className="mt-12 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-2">
              🤝 {language === "sv" ? "Låt oss skapa något oförglömligt" : "Let's Create Something Unforgettable"}
            </h3>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              {language === "sv"
                ? "På NowInTown specialiserar vi oss på att förvandla dina idéer till minnesvärda upplevelser — från koncept till firande. Fyll i formuläret eller kontakta oss direkt, så återkommer en av våra eventspecialister inom 24 timmar."
                : "At NowInTown, we specialize in turning your ideas into memorable experiences — from concept to celebration. Fill out the form or reach out directly, and one of our event specialists will get back to you within 24 hours."}
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
