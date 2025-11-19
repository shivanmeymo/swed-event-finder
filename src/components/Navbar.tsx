import { LogOut, User as UserIcon, Menu, Languages, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
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
  const { language, setLanguage, t } = useLanguage();

  const handleSignOut = async () => {
    await signOut();
    toast.success(language === "sv" ? "Utloggad" : "Signed out successfully");
    navigate("/");
    setIsOpen(false);
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "sv" : "en");
  };

  const menuItems = [
    { to: "/manage", label: t("nav.manageEvents") },
    { to: "/create", label: t("nav.createEvent") },
    { to: "/about", label: t("nav.aboutUs") },
    { to: "/contact", label: t("nav.contactUs") },
  ];

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

          {/* Right side buttons */}
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="hidden sm:flex hover:bg-accent/20"
              aria-label="Change language"
              title="Language"
              onClick={toggleLanguage}
            >
              <Languages className="h-5 w-5" />
            </Button>

            {/* Create Event Button */}
            <Button 
              asChild 
              className="hidden sm:flex bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-lg"
            >
              <Link to="/create">
                <Calendar className="h-4 w-4 mr-2" aria-hidden="true" />
                {t("nav.createEvent")}
              </Link>
            </Button>

            {/* Burger Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button className="bg-[#006AA7] hover:bg-[#005a8f] text-white rounded-lg" size="default" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
            <SheetContent side="right" className="w-[280px] rounded-l-xl">
              <SheetHeader className="pb-4 border-b border-border">
                <SheetTitle>{t("nav.menu")}</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 mt-4" aria-label="Mobile navigation">
                {menuItems.map((item, index) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    className={`text-sm font-medium hover:text-primary transition-colors py-3 px-2 ${
                      index < menuItems.length - 1 ? "border-b border-border" : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="mt-4">
                  {user ? (
                    <Button onClick={handleSignOut} className="w-full justify-start bg-[#006AA7] hover:bg-[#005a8f] text-white rounded-lg">
                      <LogOut className="h-4 w-4 mr-2" aria-hidden="true" />
                      {t("nav.signOut")}
                    </Button>
                  ) : (
                    <Button asChild className="w-full justify-start bg-[#006AA7] hover:bg-[#005a8f] text-white rounded-lg">
                      <Link to="/auth" onClick={() => setIsOpen(false)}>
                        <UserIcon className="h-4 w-4 mr-2" aria-hidden="true" />
                        {t("nav.signIn")}
                      </Link>
                    </Button>
                  )}
                </div>
              </nav>
            </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
