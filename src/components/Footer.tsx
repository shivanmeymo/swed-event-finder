import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import logo from "@/assets/logo.png";

const Footer = () => {
  const { t, language } = useLanguage();
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [subscribeCategory, setSubscribeCategory] = useState("");
  const [subscribeLocation, setSubscribeLocation] = useState("");
  const [subscribeKeyword, setSubscribeKeyword] = useState("");

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

  return (
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
                <li><Link to="/create" className="text-primary hover:text-primary/80 font-medium transition-colors">{t("footer.createEvent")}</Link></li>
                <li><Link to="/about" className="text-primary hover:text-primary/80 font-medium transition-colors">{t("footer.aboutUs")}</Link></li>
                <li><Link to="/contact" className="text-primary hover:text-primary/80 font-medium transition-colors">{t("footer.contactUs")}</Link></li>
                <li><Link to="/data-integrity" className="text-primary hover:text-primary/80 font-medium transition-colors">{t("footer.dataIntegrity")}</Link></li>
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
                        <SelectItem value="music">Music</SelectItem>
                        <SelectItem value="sports">Sports</SelectItem>
                        <SelectItem value="art">Art</SelectItem>
                        <SelectItem value="food">Food</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="subscribe-location" className="text-xs text-muted-foreground">{t("footer.location")}</Label>
                    <Input
                      id="subscribe-location"
                      type="text"
                      placeholder={t("footer.location")}
                      value={subscribeLocation}
                      onChange={(e) => setSubscribeLocation(e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div>
                    <Label htmlFor="subscribe-keyword" className="text-xs text-muted-foreground">{t("footer.keyword")}</Label>
                    <Input
                      id="subscribe-keyword"
                      type="text"
                      placeholder={t("footer.keyword")}
                      value={subscribeKeyword}
                      onChange={(e) => setSubscribeKeyword(e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                </div>
                <Button type="submit" size="sm" className="w-full h-8 text-xs">
                  {t("footer.subscribe")}
                </Button>
              </form>
            </div>
          </div>
          
          <div className="border-t border-border mt-6 pt-4 text-center text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} NowInTown. All rights reserved.</p>
          </div>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
