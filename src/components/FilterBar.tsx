import { useState } from "react";
import { Search, Calendar, MapPin, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [keywords, setKeywords] = useState<string[]>([]);
  const [currentKeyword, setCurrentKeyword] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isFreeFilter, setIsFreeFilter] = useState(false);

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

  const toggleFreeFilter = () => {
    const newValue = !isFreeFilter;
    setIsFreeFilter(newValue);
    onFilterChange({
      keywords,
      date: dateFilter,
      location: locationFilter,
      category: categoryFilter,
      isFree: newValue,
    });
  };

  return (
    <div className="w-full border-2 border-border/40 rounded-xl p-6 shadow-lg backdrop-blur-sm bg-gradient-to-br from-background/5 to-background/5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2 space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events through keywords..."
              className="pl-10 bg-background border-input"
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
                  className="px-3 py-1 cursor-pointer hover:bg-secondary/80 transition-colors"
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
          <SelectTrigger className="bg-background">
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
          <SelectTrigger className="bg-background">
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
          <SelectTrigger className="bg-background">
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

        <Button
          variant={isFreeFilter ? "default" : "outline"}
          onClick={toggleFreeFilter}
          className="w-full whitespace-nowrap"
        >
          {isFreeFilter ? "✓ " : ""}Free Only
        </Button>
      </div>
    </div>
  );
};

export default FilterBar;
