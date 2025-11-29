import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem("cookieConsent", "all");
    setShowConsent(false);
  };

  const handleRejectAll = () => {
    localStorage.setItem("cookieConsent", "necessary");
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-xl shadow-2xl max-w-2xl w-full p-8 border border-border">
        <h2 className="text-2xl font-bold mb-4">
          {t("cookie.title")}
        </h2>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          {t("cookie.description")}
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={handleRejectAll} 
            variant="outline" 
            className="flex-1 border-2 hover:bg-accent/10 rounded-lg"
          >
            {t("cookie.rejectAll")}
          </Button>
          <Button 
            onClick={handleAcceptAll} 
            className="flex-1 bg-foreground text-background hover:bg-foreground/90 rounded-lg"
          >
            {t("cookie.acceptAll")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
