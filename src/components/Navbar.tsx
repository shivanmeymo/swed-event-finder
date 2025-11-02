import { Settings, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary tracking-tight hover:opacity-80 transition-opacity">
              NowInTown
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Button variant="default" size="sm" asChild>
              <Link to="/create">
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Event
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/manage">
                <Settings className="h-4 w-4 mr-2" />
                Manage Event
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
