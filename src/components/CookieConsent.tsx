import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);
  const { t, language } = useLanguage();

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem("cookieConsent", "all");
    localStorage.setItem("cookieConsentDetails", JSON.stringify({
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString()
    }));
    setShowConsent(false);
  };

  const handleAcceptNecessary = () => {
    localStorage.setItem("cookieConsent", "necessary");
    localStorage.setItem("cookieConsentDetails", JSON.stringify({
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    }));
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-description"
    >
      <div className="bg-background rounded-xl shadow-2xl max-w-2xl w-full p-8 border border-border">
        <h2 id="cookie-title" className="text-2xl font-bold mb-4">
          {t("cookie.title")}
        </h2>
        
        <div id="cookie-description" className="space-y-4 mb-6">
          <p className="text-muted-foreground leading-relaxed">
            {t("cookie.description")}
          </p>
          
          {/* GDPR Transparency - Data Categories */}
          <div className="bg-muted/50 rounded-lg p-4 text-sm">
            <h3 className="font-semibold text-foreground mb-2">
              {language === "sv" ? "Datakategorier:" : "Data Categories:"}
            </h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>
                  <strong>{language === "sv" ? "Nödvändiga cookies" : "Necessary Cookies"}:</strong>{" "}
                  {language === "sv" 
                    ? "Krävs för webbplatsens grundläggande funktioner (inloggning, säkerhet, språkpreferenser). Kan inte inaktiveras."
                    : "Required for basic website functionality (login, security, language preferences). Cannot be disabled."}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>
                  <strong>{language === "sv" ? "Analyscookies" : "Analytics Cookies"}:</strong>{" "}
                  {language === "sv"
                    ? "Hjälper oss att förstå hur besökare använder webbplatsen för att förbättra upplevelsen."
                    : "Help us understand how visitors use the website to improve the experience."}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>
                  <strong>{language === "sv" ? "Marknadsföringscookies" : "Marketing Cookies"}:</strong>{" "}
                  {language === "sv"
                    ? "Används för att visa relevanta annonser och mäta annonseffektivitet."
                    : "Used to display relevant ads and measure advertising effectiveness."}
                </span>
              </li>
            </ul>
          </div>

          <p className="text-xs text-muted-foreground">
            {language === "sv"
              ? "Enligt GDPR har du rätt att när som helst återkalla ditt samtycke. Läs mer i vår integritetspolicy."
              : "Under GDPR, you have the right to withdraw your consent at any time. Read more in our privacy policy."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={handleAcceptNecessary} 
            variant="outline" 
            className="flex-1 border-2 hover:bg-accent/10 rounded-lg"
          >
            {t("cookie.acceptNecessary")}
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
