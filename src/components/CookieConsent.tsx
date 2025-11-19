import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Database, X } from "lucide-react";

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);

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

  const handleAcceptNecessary = () => {
    localStorage.setItem("cookieConsent", "necessary");
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl mb-2">Cookie & Data Privacy</CardTitle>
              <CardDescription>
                We value your privacy and protect your data with enterprise-grade security
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleAcceptNecessary}
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            We use cookies to enhance your experience and protect your data with industry-standard security measures. Necessary cookies enable basic functionality, while optional cookies help us improve our services.
          </p>
          <p className="text-sm text-muted-foreground">
            Your data is protected through encryption, authentication, and role-based access control. For more details, visit our <a href="/data-integrity" className="text-primary hover:underline">Data Integrity</a> page.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button onClick={handleAcceptAll} className="flex-1">
              Accept All
            </Button>
            <Button onClick={handleAcceptNecessary} variant="outline" className="flex-1">
              Accept Necessary Only
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CookieConsent;
