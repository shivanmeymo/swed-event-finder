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
          keyword_filter: keywords.join(', ') || null,
        });

      if (error) {
        if (error.code === '23505') {
          toast.error(language === "sv" ? "Denna e-post är redan prenumererad" : "This email is already subscribed");
        } else {
          throw error;
        }
      } else {
        toast.success(language === "sv" ? "Fantastiskt! Du kommer att meddelas om nya event! 🎉" : "Awesome! You'll be notified about new events! 🎉");
        setNotifyEmail("");
        setNotifyDialogOpen(false);
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error(language === "sv" ? "Misslyckades att prenumerera" : "Failed to subscribe. Please try again.");
    }
  };

  return (
    <div className="w-full rounded-2xl p-6 shadow-sm bg-card/50 backdrop-blur-sm border border-border/50">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2 space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events through keywords..."
              className="pl-10 bg-background/80 border-border/50 focus:border-primary transition-all"
              value={currentKeyword}
              onChange={(e) => setCurrentKeyword(e.target.value)}
              onKeyDown={handleKeywordAdd}
            />
          </div>
          {keywords.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword) => (
                <Badge
                  key={keyword}
                  variant="secondary"
                  className="px-3 py-1 cursor-pointer hover:bg-secondary/80 transition-colors rounded-full"
                >
                  {keyword}
                  <X
                    className="ml-1 h-3 w-3"
                    onClick={() => handleKeywordRemove(keyword)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        <Select onValueChange={handleDateChange} value={dateFilter}>
          <SelectTrigger className="bg-background/80 border-border/50 focus:border-primary transition-all">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Dates</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="tomorrow">Tomorrow</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={handleLocationChange} value={locationFilter}>
          <SelectTrigger className="bg-background/80 border-border/50 focus:border-primary transition-all">
            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="uppsala">Uppsala</SelectItem>
            <SelectItem value="stockholm">Stockholm</SelectItem>
            <SelectItem value="gothenburg">Gothenburg</SelectItem>
            <SelectItem value="malmo">Malmö</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={handleCategoryChange} value={categoryFilter}>
          <SelectTrigger className="bg-background/80 border-border/50 focus:border-primary transition-all">
            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="music">Music</SelectItem>
            <SelectItem value="tech">Tech</SelectItem>
            <SelectItem value="sports">Sports</SelectItem>
            <SelectItem value="food">Food & Drink</SelectItem>
            <SelectItem value="art">Art & Culture</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border/50">
        <div className="flex items-center space-x-2">
          <Switch
            id="free-only"
            checked={isFreeFilter}
            onCheckedChange={toggleFreeFilter}
          />
          <Label 
            htmlFor="free-only" 
            className="text-sm font-medium cursor-pointer"
          >
            {language === "sv" ? "Endast gratis event" : "Free events only"}
          </Label>
        </div>

        <Dialog open={notifyDialogOpen} onOpenChange={setNotifyDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Bell className="h-4 w-4" />
              {language === "sv" ? "Bli Meddelad" : "Get Notified"}
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
                  ? "Du kommer att få meddelanden baserat på dina nuvarande filter. Ändra filtren ovan och klicka sedan på 'Bli Meddelad' igen för att uppdatera dina preferenser."
                  : "You'll be notified based on your current filters. Change the filters above and click 'Get Notified' again to update your preferences."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleNotifySubscribe} className="space-y-4">
              <div>
                <Label htmlFor="notify-email">{language === "sv" ? "E-post" : "Email"}</Label>
                <Input
                  id="notify-email"
                  type="email"
                  placeholder={language === "sv" ? "din@email.se" : "your@email.com"}
                  value={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p className="font-semibold mb-1">{language === "sv" ? "Dina nuvarande filter:" : "Your current filters:"}</p>
                <ul className="space-y-1">
                  {categoryFilter && <li>• {language === "sv" ? "Kategori" : "Category"}: {categoryFilter}</li>}
                  {locationFilter && <li>• {language === "sv" ? "Plats" : "Location"}: {locationFilter}</li>}
                  {keywords.length > 0 && <li>• {language === "sv" ? "Nyckelord" : "Keywords"}: {keywords.join(', ')}</li>}
                  {isFreeFilter && <li>• {language === "sv" ? "Endast gratis event" : "Free events only"}</li>}
                  {!categoryFilter && !locationFilter && keywords.length === 0 && !isFreeFilter && (
                    <li className="text-muted-foreground/60">{language === "sv" ? "Inga filter valda (alla event)" : "No filters selected (all events)"}</li>
                  )}
                </ul>
              </div>

              <Button type="submit" className="w-full">
                {language === "sv" ? "Prenumerera" : "Subscribe"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default FilterBar;
