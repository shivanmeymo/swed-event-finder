import { useState } from "react";
import { Search, Calendar, MapPin, Filter, X, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface FilterBarProps {
  onFilterChange: (filters: {
    keywords: string[];
    date: string;
    location: string;
    category: string;
    isFree: boolean;
  }) => void;
}

const FilterBar = ({ onFilterChange }: FilterBarProps) => {
  const { language } = useLanguage();
  const [keywords, setKeywords] = useState<string[]>([]);
  const [currentKeyword, setCurrentKeyword] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isFreeFilter, setIsFreeFilter] = useState(false);
  const [notifyDialogOpen, setNotifyDialogOpen] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState("");

  const handleKeywordAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && currentKeyword.trim()) {
      e.preventDefault();
      const newKeywords = [...keywords, currentKeyword.trim()];
      setKeywords(newKeywords);
      setCurrentKeyword("");
      onFilterChange({
        keywords: newKeywords,
        date: dateFilter,
        location: locationFilter,
        category: categoryFilter,
        isFree: isFreeFilter,
      });
    }
  };

  const handleKeywordRemove = (keywordToRemove: string) => {
    const newKeywords = keywords.filter((k) => k !== keywordToRemove);
    setKeywords(newKeywords);
    onFilterChange({
      keywords: newKeywords,
      date: dateFilter,
      location: locationFilter,
      category: categoryFilter,
      isFree: isFreeFilter,
    });
  };

  const handleDateChange = (value: string) => {
    setDateFilter(value);
    onFilterChange({
      keywords,
      date: value,
      location: locationFilter,
      category: categoryFilter,
      isFree: isFreeFilter,
    });
  };

  const handleLocationChange = (value: string) => {
    setLocationFilter(value);
    onFilterChange({
      keywords,
      date: dateFilter,
      location: value,
      category: categoryFilter,
      isFree: isFreeFilter,
    });
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
    onFilterChange({
      keywords,
      date: dateFilter,
      location: locationFilter,
      category: value,
      isFree: isFreeFilter,
    });
  };

  const toggleFreeFilter = (checked: boolean) => {
    setIsFreeFilter(checked);
    onFilterChange({
      keywords,
      date: dateFilter,
      location: locationFilter,
      category: categoryFilter,
      isFree: checked,
    });
  };

  const handleNotifySubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!notifyEmail) {
      toast.error(language === "sv" ? "Ange din e-postadress" : "Please enter your email address");
      return;
    }

    try {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .insert({
          email: notifyEmail,
          category_filter: categoryFilter || null,
          location_filter: locationFilter || null,
          keyword_filter: keywords.length > 0 ? keywords.join(',') : null,
        });

      if (error) throw error;

      toast.success(language === "sv" ? "Du är nu prenumererad!" : "Successfully subscribed!");
      setNotifyDialogOpen(false);
      setNotifyEmail("");
    } catch (error: any) {
      toast.error(language === "sv" ? "Kunde inte prenumerera. Försök igen." : "Failed to subscribe. Please try again.");
      console.error('Subscription error:', error);
    }
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-sm border border-border mb-8">
      <div className="flex items-center gap-2 mb-6">
        <Filter className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">
          {language === "sv" ? "Filtrera Evenemang" : "Filter Events"}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          {/* Search Keywords */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-foreground">
              <Search className="h-4 w-4" />
              {language === "sv" ? "Sök Nyckelord" : "Search Keywords"}
            </Label>
            <Input
              value={currentKeyword}
              onChange={(e) => setCurrentKeyword(e.target.value)}
              onKeyDown={handleKeywordAdd}
              placeholder={language === "sv" ? "Skriv och tryck Enter för att lägga till..." : "Type and press Enter to add..."}
              className="bg-background border-input"
            />
            {keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {keywords.map((keyword) => (
                  <Badge
                    key={keyword}
                    variant="secondary"
                    className="pl-3 pr-1 py-1 bg-primary/10 text-primary"
                  >
                    {keyword}
                    <button
                      onClick={() => handleKeywordRemove(keyword)}
                      className="ml-2 hover:bg-primary/20 rounded-full p-0.5"
                      aria-label={`Remove ${keyword}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Date Filter */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-foreground">
              <Calendar className="h-4 w-4" />
              {language === "sv" ? "Datum" : "Date"}
            </Label>
            <Select value={dateFilter} onValueChange={handleDateChange}>
              <SelectTrigger className="bg-background border-input">
                <SelectValue placeholder={language === "sv" ? "Välj datum" : "Select date"} />
              </SelectTrigger>
              <SelectContent className="bg-background border-border z-50">
                <SelectItem value="all">{language === "sv" ? "Alla datum" : "All dates"}</SelectItem>
                <SelectItem value="today">{language === "sv" ? "Idag" : "Today"}</SelectItem>
                <SelectItem value="tomorrow">{language === "sv" ? "Imorgon" : "Tomorrow"}</SelectItem>
                <SelectItem value="this-week">{language === "sv" ? "Denna vecka" : "This week"}</SelectItem>
                <SelectItem value="this-weekend">{language === "sv" ? "Denna helg" : "This weekend"}</SelectItem>
                <SelectItem value="next-week">{language === "sv" ? "Nästa vecka" : "Next week"}</SelectItem>
                <SelectItem value="this-month">{language === "sv" ? "Denna månad" : "This month"}</SelectItem>
                <SelectItem value="next-month">{language === "sv" ? "Nästa månad" : "Next month"}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location Filter */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-foreground">
              <MapPin className="h-4 w-4" />
              {language === "sv" ? "Plats" : "Location"}
            </Label>
            <Select value={locationFilter} onValueChange={handleLocationChange}>
              <SelectTrigger className="bg-background border-input">
                <SelectValue placeholder={language === "sv" ? "Välj plats" : "Select location"} />
              </SelectTrigger>
              <SelectContent className="bg-background border-border z-50">
                <SelectItem value="all">{language === "sv" ? "Alla platser" : "All locations"}</SelectItem>
                <SelectItem value="Stockholm">Stockholm</SelectItem>
                <SelectItem value="Gothenburg">Gothenburg</SelectItem>
                <SelectItem value="Malmö">Malmö</SelectItem>
                <SelectItem value="Uppsala">Uppsala</SelectItem>
                <SelectItem value="Västerås">Västerås</SelectItem>
                <SelectItem value="Örebro">Örebro</SelectItem>
                <SelectItem value="Linköping">Linköping</SelectItem>
                <SelectItem value="Helsingborg">Helsingborg</SelectItem>
                <SelectItem value="Jönköping">Jönköping</SelectItem>
                <SelectItem value="Norrköping">Norrköping</SelectItem>
                <SelectItem value="Lund">Lund</SelectItem>
                <SelectItem value="Umeå">Umeå</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Free Events Filter */}
          <div className="flex items-center space-x-2 pt-6">
            <Switch
              id="free-filter"
              checked={isFreeFilter}
              onCheckedChange={toggleFreeFilter}
            />
            <Label
              htmlFor="free-filter"
              className="text-sm font-medium text-foreground cursor-pointer"
            >
              {language === "sv" ? "Endast gratis evenemang" : "Free events only"}
            </Label>
          </div>
        </div>

        <div className="space-y-4">
          {/* Category Filter */}
          <div className="space-y-2">
            <Label className="text-foreground">
              {language === "sv" ? "Kategori" : "Category"}
            </Label>
            <Select value={categoryFilter} onValueChange={handleCategoryChange}>
              <SelectTrigger className="bg-background border-input">
                <SelectValue placeholder={language === "sv" ? "Välj kategori" : "Select category"} />
              </SelectTrigger>
              <SelectContent className="bg-background border-border z-50">
                <SelectItem value="all">{language === "sv" ? "Alla kategorier" : "All categories"}</SelectItem>
                <SelectItem value="Music">{language === "sv" ? "Musik" : "Music"}</SelectItem>
                <SelectItem value="Sports">{language === "sv" ? "Sport" : "Sports"}</SelectItem>
                <SelectItem value="Arts & Culture">{language === "sv" ? "Konst & Kultur" : "Arts & Culture"}</SelectItem>
                <SelectItem value="Food & Drink">{language === "sv" ? "Mat & Dryck" : "Food & Drink"}</SelectItem>
                <SelectItem value="Business">{language === "sv" ? "Företag" : "Business"}</SelectItem>
                <SelectItem value="Technology">{language === "sv" ? "Teknologi" : "Technology"}</SelectItem>
                <SelectItem value="Health & Wellness">{language === "sv" ? "Hälsa & Välbefinnande" : "Health & Wellness"}</SelectItem>
                <SelectItem value="Education">{language === "sv" ? "Utbildning" : "Education"}</SelectItem>
                <SelectItem value="Family & Kids">{language === "sv" ? "Familj & Barn" : "Family & Kids"}</SelectItem>
                <SelectItem value="Community">{language === "sv" ? "Gemenskap" : "Community"}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Be Notified Button */}
          <Dialog open={notifyDialogOpen} onOpenChange={setNotifyDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full gap-2">
                <Bell className="h-4 w-4" />
                {language === "sv" ? "Bli Notifierad" : "Be Notified"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {language === "sv" ? "Prenumerera på Notifikationer" : "Subscribe to Notifications"}
                </DialogTitle>
                <DialogDescription>
                  {language === "sv" 
                    ? "Du kommer att meddelas via e-post enligt de filter du har valt. Om du vill ändra dina filter, gå tillbaka till filtersektionen, ändra och klicka på notifiera för att ange din e-post igen."
                    : "You will be notified via email according to the filters you've chosen. If you want to change your filters, go back to the filter section, change them, and click notify to enter your email again."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleNotifySubscribe} className="space-y-4">
                <div>
                  <Label htmlFor="notify-email">
                    {language === "sv" ? "E-postadress" : "Email Address"}
                  </Label>
                  <Input
                    id="notify-email"
                    type="email"
                    value={notifyEmail}
                    onChange={(e) => setNotifyEmail(e.target.value)}
                    placeholder={language === "sv" ? "din@email.se" : "your@email.com"}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  {language === "sv" ? "Prenumerera" : "Subscribe"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
