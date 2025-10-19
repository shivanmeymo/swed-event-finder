import { Search, Calendar, MapPin, Filter, Tag, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

const FilterBar = () => {
  const { t } = useLanguage();
  const [keywords, setKeywords] = useState("");

  const handleSubscribe = () => {
    // This will require Lovable Cloud for backend functionality
    console.log("Subscribe to keywords:", keywords);
  };

  return (
    <div className="w-full bg-card border border-border rounded-xl p-6 shadow-[var(--shadow-md)]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
        <div className="lg:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('searchPlaceholder')}
            className="pl-10 bg-background border-input"
          />
        </div>
        
        <Select>
          <SelectTrigger className="bg-background">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder={t('date')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">{t('today')}</SelectItem>
            <SelectItem value="tomorrow">{t('tomorrow')}</SelectItem>
            <SelectItem value="week">{t('thisWeek')}</SelectItem>
            <SelectItem value="month">{t('thisMonth')}</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="bg-background">
            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder={t('location')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="uppsala">{t('uppsala')}</SelectItem>
            <SelectItem value="stockholm">{t('stockholm')}</SelectItem>
            <SelectItem value="gothenburg">{t('gothenburg')}</SelectItem>
            <SelectItem value="malmo">{t('malmo')}</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="bg-background">
            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder={t('category')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="music">{t('music')}</SelectItem>
            <SelectItem value="tech">{t('tech')}</SelectItem>
            <SelectItem value="sports">{t('sports')}</SelectItem>
            <SelectItem value="food">{t('food')}</SelectItem>
            <SelectItem value="art">{t('art')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Keywords Filter with Subscribe */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('keywordsPlaceholder')}
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="pl-10 bg-background border-input"
          />
        </div>
        <Button 
          onClick={handleSubscribe}
          variant="outline"
          className="border-2"
        >
          <Bell className="h-4 w-4 mr-2" />
          {t('subscribe')}
        </Button>
      </div>
    </div>
  );
};

export default FilterBar;
