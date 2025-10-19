import { Calendar, Search, User, PlusCircle, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import logo from "@/assets/swedevents-logo.png";

const Navbar = () => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'sv' ? 'en' : 'sv');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
            <img src={logo} alt="SwedEvents" className="h-10" />
          </Link>

          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={toggleLanguage}
            >
              <Languages className="h-4 w-4 mr-2" />
              {language === 'sv' ? 'EN' : 'SV'}
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">
                <Search className="h-4 w-4 mr-2" />
                {t('events')}
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/create">
                <PlusCircle className="h-4 w-4 mr-2" />
                {t('createEvent')}
              </Link>
            </Button>
            <Button variant="default" size="sm" asChild>
              <Link to="/auth">
                <User className="h-4 w-4 mr-2" />
                {t('signIn')}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
