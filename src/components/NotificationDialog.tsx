import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

const NotificationDialog = () => {
  const { t, language } = useLanguage();
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [subscribeCategory, setSubscribeCategory] = useState("");
  const [subscribeLocation, setSubscribeLocation] = useState("");
  const [subscribeKeyword, setSubscribeKeyword] = useState("");
  const [open, setOpen] = useState(false);

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
        toast.success(language === "sv" ? "Fantastiskt! Du kommer att meddelas om nya event! 🎉" : "Awesome! You'll be notified about new events! 🎉");
        setSubscribeEmail("");
        setSubscribeCategory("");
        setSubscribeLocation("");
        setSubscribeKeyword("");
        setOpen(false);
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error(language === "sv" ? "Misslyckades att prenumerera" : "Failed to subscribe. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Bell className="h-4 w-4" />
          {language === "sv" ? "Bli Meddelad" : "Be Notified"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            {language === "sv" ? "Få Meddelanden om Event" : "Get Notified About Events"}
          </DialogTitle>
          <DialogDescription>
            {language === "sv" 
              ? "Ange din e-post och preferenser för att få meddelanden när nya event som matchar dina intressen läggs upp."
              : "Enter your email and preferences to get notified when new events matching your interests are posted."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubscribe} className="space-y-4">
          <div>
            <Label htmlFor="notify-email">{t("footer.email")}</Label>
            <Input
              id="notify-email"
              type="email"
              placeholder={language === "sv" ? "din@email.se" : "your@email.com"}
              value={subscribeEmail}
              onChange={(e) => setSubscribeEmail(e.target.value)}
              required
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="notify-category">{t("footer.category")} ({t("footer.optional")})</Label>
            <Select value={subscribeCategory} onValueChange={setSubscribeCategory}>
              <SelectTrigger id="notify-category" className="mt-1">
                <SelectValue placeholder={t("footer.any")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("footer.any")}</SelectItem>
                <SelectItem value="music">{t("category.music")}</SelectItem>
                <SelectItem value="tech">{t("category.tech")}</SelectItem>
                <SelectItem value="sports">{t("category.sports")}</SelectItem>
                <SelectItem value="food">{t("category.food")}</SelectItem>
                <SelectItem value="art">{t("category.art")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notify-location">{t("footer.location")} ({t("footer.optional")})</Label>
            <Select value={subscribeLocation} onValueChange={setSubscribeLocation}>
              <SelectTrigger id="notify-location" className="mt-1">
                <SelectValue placeholder={t("footer.any")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("footer.any")}</SelectItem>
                <SelectItem value="uppsala">Uppsala</SelectItem>
                <SelectItem value="stockholm">Stockholm</SelectItem>
                <SelectItem value="gothenburg">Gothenburg</SelectItem>
                <SelectItem value="malmo">Malmö</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notify-keywords">{t("footer.keywords")} ({t("footer.optional")})</Label>
            <Input
              id="notify-keywords"
              type="text"
              placeholder={language === "sv" ? "musik, konst, mat..." : "music, art, food..."}
              value={subscribeKeyword}
              onChange={(e) => setSubscribeKeyword(e.target.value)}
              className="mt-1"
            />
          </div>

          <Button type="submit" className="w-full">
            {t("footer.subscribe")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationDialog;
