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
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Shield className="w-8 h-8 text-primary" aria-hidden="true" />
              <h3 className="font-semibold">Data Protection</h3>
              <p className="text-sm text-muted-foreground">
                All event data is encrypted both in transit and at rest using industry-standard encryption protocols.
              </p>
            </div>

            <div className="space-y-2">
              <Lock className="w-8 h-8 text-primary" aria-hidden="true" />
              <h3 className="font-semibold">Access Control</h3>
              <p className="text-sm text-muted-foreground">
                Only authorized users can view, modify, or delete event information.
              </p>
            </div>

            <div className="space-y-2">
              <Database className="w-8 h-8 text-primary" aria-hidden="true" />
              <h3 className="font-semibold">Data Integrity</h3>
              <p className="text-sm text-muted-foreground">
                We maintain strict data validation rules to ensure all event information remains accurate.
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Cookie Usage</h3>
            <p className="text-sm text-muted-foreground mb-4">
              We use cookies to enhance your experience. Necessary cookies are required for the site to function, 
              while optional cookies help us improve our services and understand how you use our platform.
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li><strong>Necessary:</strong> Authentication, security, and basic functionality</li>
              <li><strong>Optional:</strong> Analytics and performance monitoring</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
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
