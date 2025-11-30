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
    dateRange: string;
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
  const [dateRangeFilter, setDateRangeFilter] = useState("");
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
        dateRange: dateRangeFilter,
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
      dateRange: dateRangeFilter,
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
      dateRange: dateRangeFilter,
      location: locationFilter,
      category: categoryFilter,
      isFree: isFreeFilter,
    });
  };

  const handleDateRangeChange = (value: string) => {
    setDateRangeFilter(value);
    onFilterChange({
      keywords,
      date: dateFilter,
      dateRange: value,
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
      dateRange: dateRangeFilter,
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
      dateRange: dateRangeFilter,
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
      dateRange: dateRangeFilter,
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

  const getActiveFiltersText = () => {
    const filters = [];
    if (categoryFilter && categoryFilter !== 'all') filters.push(categoryFilter);
    if (locationFilter && locationFilter !== 'all') filters.push(locationFilter);
    if (dateRangeFilter && dateRangeFilter !== 'all') {
      const dateRangeText = dateRangeFilter === 'today' ? (language === "sv" ? "Idag" : "Today") :
                            dateRangeFilter === 'thisWeek' ? (language === "sv" ? "Denna vecka" : "This week") :
                            dateRangeFilter === 'thisMonth' ? (language === "sv" ? "Denna månad" : "This month") : '';
      if (dateRangeText) filters.push(dateRangeText);
    }
    if (isFreeFilter) filters.push(language === "sv" ? "Gratis" : "Free");
    if (keywords.length > 0) filters.push(keywords.join(', '));
    
    if (filters.length === 0) {
      return language === "sv" ? "alla evenemang" : "all events";
    }
    return filters.join(', ');
  };

  return (
    <div className="bg-card p-4 rounded-lg shadow-sm border border-border mb-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Search Keywords */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-foreground text-sm">
            <Search className="h-4 w-4" />
            {language === "sv" ? "Sök" : "Search"}
          </Label>
          <Input
            value={currentKeyword}
            onChange={(e) => setCurrentKeyword(e.target.value)}
            onKeyDown={handleKeywordAdd}
            placeholder={language === "sv" ? "Tryck Enter..." : "Press Enter..."}
            className="bg-background border-input h-9"
          />
          {keywords.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {keywords.map((keyword) => (
                <Badge
                  key={keyword}
                  variant="secondary"
                  className="pl-2 pr-1 py-0.5 text-xs bg-primary/10 text-primary"
                >
                  {keyword}
                  <button
                    onClick={() => handleKeywordRemove(keyword)}
                    className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                    aria-label={`Remove ${keyword}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Date Range Filter */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-foreground text-sm">
            <Calendar className="h-4 w-4" />
            {language === "sv" ? "Datum" : "Date"}
          </Label>
          <Select value={dateRangeFilter} onValueChange={handleDateRangeChange}>
            <SelectTrigger className="bg-background border-input h-9">
              <SelectValue placeholder={language === "sv" ? "Välj..." : "Select..."} />
            </SelectTrigger>
            <SelectContent className="bg-background border-border z-50">
              <SelectItem value="all">{language === "sv" ? "Alla datum" : "All dates"}</SelectItem>
              <SelectItem value="today">{language === "sv" ? "Idag" : "Today"}</SelectItem>
              <SelectItem value="thisWeek">{language === "sv" ? "Denna vecka" : "This week"}</SelectItem>
              <SelectItem value="thisMonth">{language === "sv" ? "Denna månad" : "This month"}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Location Filter */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-foreground text-sm">
            <MapPin className="h-4 w-4" />
            {language === "sv" ? "Plats" : "Location"}
          </Label>
          <Select value={locationFilter} onValueChange={handleLocationChange}>
            <SelectTrigger className="bg-background border-input h-9">
              <SelectValue placeholder={language === "sv" ? "Välj..." : "Select..."} />
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

        {/* Category Filter */}
        <div className="space-y-2">
          <Label className="text-foreground text-sm">
            {language === "sv" ? "Kategori" : "Category"}
          </Label>
          <Select value={categoryFilter} onValueChange={handleCategoryChange}>
            <SelectTrigger className="bg-background border-input h-9">
              <SelectValue placeholder={language === "sv" ? "Välj..." : "Select..."} />
            </SelectTrigger>
            <SelectContent className="bg-background border-border z-50">
              <SelectItem value="all">{language === "sv" ? "Alla kategorier" : "All categories"}</SelectItem>
              <SelectItem value="Music">{language === "sv" ? "Musik" : "Music"}</SelectItem>
              <SelectItem value="Sports">{language === "sv" ? "Sport" : "Sports"}</SelectItem>
              <SelectItem value="Art">{language === "sv" ? "Konst" : "Art"}</SelectItem>
              <SelectItem value="Food">{language === "sv" ? "Mat" : "Food"}</SelectItem>
              <SelectItem value="Tech">{language === "sv" ? "Teknologi" : "Tech"}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Free Events Filter & Notify Button */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="free-filter"
              checked={isFreeFilter}
              onCheckedChange={toggleFreeFilter}
            />
            <Label
              htmlFor="free-filter"
              className="text-sm font-medium text-foreground cursor-pointer"
            >
              {language === "sv" ? "Gratis" : "Free"}
            </Label>
          </div>
          
          {/* Be Notified Button */}
          <Dialog open={notifyDialogOpen} onOpenChange={setNotifyDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full gap-2 h-9 mt-2">
                <Bell className="h-4 w-4" />
                {language === "sv" ? "Notifiera" : "Notify"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {language === "sv" ? "Prenumerera på Notifikationer" : "Subscribe to Notifications"}
                </DialogTitle>
                <DialogDescription className="space-y-2">
                  <p>
                    {language === "sv" 
                      ? `Du kommer att få e-post för: ${getActiveFiltersText()}`
                      : `You'll receive emails for: ${getActiveFiltersText()}`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {language === "sv" 
                      ? "För att ändra dina filter, gå tillbaka och justera filtren."
                      : "To change your filters, go back and adjust the filters."}
                  </p>
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
