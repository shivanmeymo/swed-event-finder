import { Calendar, MapPin, Users } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface EventCardProps {
  title: string;
  date: string;
  location: string;
  attendees: number;
  category: string;
  image: string;
}

const EventCard = ({ title, date, location, attendees, category, image }: EventCardProps) => {
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
            <Calendar className="h-4 w-4" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-4 pb-4 pt-0">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{attendees} attending</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
