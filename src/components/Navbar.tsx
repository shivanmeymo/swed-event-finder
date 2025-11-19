import { Settings, PlusCircle, LogOut, User as UserIcon, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/");
    setIsOpen(false);
  };

  const menuItems = [
    { to: "/about", label: "About Us" },
    { to: "/contact", label: "Contact Us" },
  ];

  if (user) {
    menuItems.unshift(
      { to: "/create", label: "Create Event" },
      { to: "/manage", label: "Manage Events" }
    );
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-lg" role="navigation" aria-label="Main navigation">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity" aria-label="NowInTown home">
            <img src={logo} alt="" className="h-10 w-10" aria-hidden="true" />
            <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-[#006AA7] to-[#FECC00] bg-clip-text text-transparent">
              NowInTown
            </span>
          </Link>


          {/* Burger Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" aria-label="Open menu" className="ml-2">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-6" aria-label="Mobile navigation">
                {menuItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    className="text-base font-medium hover:text-primary transition-colors py-2"
                  >
                    {item.label}
                  </Link>
                ))}
                {user ? (
                  <Button onClick={handleSignOut} variant="outline" className="w-full justify-start">
                    <LogOut className="h-4 w-4 mr-2" aria-hidden="true" />
                    Sign Out
                  </Button>
                ) : (
                  <Button asChild variant="default" className="w-full justify-start">
                    <Link to="/auth" onClick={() => setIsOpen(false)}>
                      <UserIcon className="h-4 w-4 mr-2" aria-hidden="true" />
                      Sign In
                    </Link>
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
