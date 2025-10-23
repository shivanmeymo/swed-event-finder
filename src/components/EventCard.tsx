import { Calendar, MapPin, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface EventCardProps {
  title: string;
  start_datetime: string;
  end_datetime: string;
  location: string;
  category: string;
  image: string;
}

const EventCard = ({ title, start_datetime, end_datetime, location, category, image }: EventCardProps) => {
  const formatDateTime = (datetime: string) => {
    try {
      return format(new Date(datetime), "MMM d, yyyy 'at' h:mm a");
    } catch {
      return datetime;
    }
  };
  const getCategoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      Music: "bg-gradient-to-r from-purple-500 to-pink-500",
      Tech: "bg-gradient-to-r from-blue-500 to-cyan-500",
      Sports: "bg-gradient-to-r from-green-500 to-emerald-500",
      Food: "bg-gradient-to-r from-orange-500 to-red-500",
      Art: "bg-gradient-to-r from-indigo-500 to-purple-500",
    };
    return colors[cat] || "bg-primary";
  };

  return (
    <Card className="group overflow-hidden border-border hover:shadow-[var(--shadow-lg)] transition-all duration-300 cursor-pointer">
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <Badge className={`absolute top-3 right-3 ${getCategoryColor(category)} text-white border-0`}>
          {category}
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-3 line-clamp-2 text-card-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span className="line-clamp-1">{formatDateTime(start_datetime)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 flex-shrink-0" />
            <span className="line-clamp-1">{formatDateTime(end_datetime)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="line-clamp-1">{location}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
