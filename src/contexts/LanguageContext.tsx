import { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "sv";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navbar
    "nav.createEvent": "Create Event",
    "nav.menu": "Menu",
    "nav.manageEvents": "Manage Events",
    "nav.aboutUs": "About Us",
    "nav.contactUs": "Contact Us",
    "nav.signOut": "Sign Out",
    "nav.signIn": "Sign In",
    
    // Hero
    "hero.title1": "Discover Events and Activities",
    "hero.title2": "Across Sweden",
    "hero.subtitle": "Explore thousands of events from Uppsala, Stockholm, and beyond. All in one place.",
    "hero.exploreButton": "Explore Events",
    
    // Events
    "events.title": "Upcoming Events",
    "events.found": "events found",
    "events.noResults": "No events found matching your filters. Try adjusting your search criteria.",
    
    // Footer
    "footer.description": "Discover amazing events and activities across Sweden.",
    "footer.quickLinks": "Quick Links",
    "footer.home": "Home",
    "footer.createEvent": "Create Event",
    "footer.aboutUs": "About Us",
    "footer.contactUs": "Contact Us",
    "footer.dataIntegrity": "Data Integrity",
    "footer.newsletter": "Subscribe to Newsletter",
    "footer.email": "Your email",
    "footer.category": "Category",
    "footer.location": "Location",
    "footer.keywords": "Keywords",
    "footer.any": "Any",
    "footer.optional": "Optional",
    "footer.subscribe": "Subscribe",
    "footer.copyright": "© 2026 NowInTown. All rights reserved.",
    
    // Categories
    "category.all": "Any",
    "category.music": "Music",
    "category.sports": "Sports",
    "category.food": "Food",
    "category.art": "Art",
    "category.tech": "Tech",
    
    // Cookie Consent
    "cookie.title": "Vi värnar om din integritet",
    "cookie.description": "Vi använder cookies för att förbättra din surfupplevelse, visa personliga annonser eller innehåll och analysera vår trafik. Genom att klicka på \"Acceptera alla\" samtycker du till vår användning av cookies.",
    "cookie.customize": "Anpassa",
    "cookie.rejectAll": "Avvisa alla",
    "cookie.acceptAll": "Acceptera alla",
  },
  sv: {
    // Navbar
    "nav.createEvent": "Skapa Event",
    "nav.menu": "Meny",
    "nav.manageEvents": "Hantera Event",
    "nav.aboutUs": "Om Oss",
    "nav.contactUs": "Kontakta Oss",
    "nav.signOut": "Logga Ut",
    "nav.signIn": "Logga In",
    
    // Hero
    "hero.title1": "Upptäck Event och Aktiviteter",
    "hero.title2": "Över Hela Sverige",
    "hero.subtitle": "Utforska tusentals evenemang från Uppsala, Stockholm och vidare. Allt på ett ställe.",
    "hero.exploreButton": "Utforska Event",
    
    // Events
    "events.title": "Kommande Event",
    "events.found": "event hittade",
    "events.noResults": "Inga event hittades som matchar dina filter. Prova att justera dina sökkriterier.",
    
    // Footer
    "footer.description": "Upptäck fantastiska event och aktiviteter över hela Sverige.",
    "footer.quickLinks": "Snabblänkar",
    "footer.home": "Hem",
    "footer.createEvent": "Skapa Event",
    "footer.aboutUs": "Om Oss",
    "footer.contactUs": "Kontakta Oss",
    "footer.dataIntegrity": "Dataintegritet",
    "footer.newsletter": "Prenumerera på Nyhetsbrev",
    "footer.email": "Din e-post",
    "footer.category": "Kategori",
    "footer.location": "Plats",
    "footer.keywords": "Nyckelord",
    "footer.any": "Alla",
    "footer.optional": "Valfritt",
    "footer.subscribe": "Prenumerera",
    "footer.copyright": "© 2026 NowInTown. Alla rättigheter förbehållna.",
    
    // Categories
    "category.all": "Alla",
    "category.music": "Musik",
    "category.sports": "Sport",
    "category.food": "Mat",
    "category.art": "Konst",
    "category.tech": "Teknologi",
    
    // Cookie Consent
    "cookie.title": "Vi värnar om din integritet",
    "cookie.description": "Vi använder cookies för att förbättra din surfupplevelse, visa personliga annonser eller innehåll och analysera vår trafik. Genom att klicka på \"Acceptera alla\" samtycker du till vår användning av cookies.",
    "cookie.customize": "Anpassa",
    "cookie.rejectAll": "Avvisa alla",
    "cookie.acceptAll": "Acceptera alla",
  },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("sv");

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};
