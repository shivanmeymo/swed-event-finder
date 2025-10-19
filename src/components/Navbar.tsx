import { Calendar, Search, User, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary via-[hsl(230,89%,62%)] to-accent bg-clip-text text-transparent tracking-tight hover:opacity-80 transition-opacity">
              SwedEvents
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">
                <Search className="h-4 w-4 mr-2" />
                Discover
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/create">
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Event
              </Link>
            </Button>
            <Button variant="default" size="sm" asChild>
              <Link to="/auth">
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
