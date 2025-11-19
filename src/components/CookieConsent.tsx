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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm mb-1">Data Protection</h3>
                <p className="text-xs text-muted-foreground">
                  Your information is encrypted and stored securely in compliance with GDPR and international privacy standards.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm mb-1">Access Control</h3>
                <p className="text-xs text-muted-foreground">
                  Role-based permissions ensure only authorized users can access sensitive data, protecting your privacy.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Database className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm mb-1">Data Integrity</h3>
                <p className="text-xs text-muted-foreground">
                  We maintain comprehensive audit trails and implement validation rules to ensure data accuracy.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm mb-1">Cookie Usage</h3>
                <p className="text-xs text-muted-foreground">
                  We use necessary cookies for functionality and optional cookies to improve your experience.
                </p>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground pt-2">
            For more detailed information about our security practices and data handling procedures, please visit our{" "}
            <a href="/data-integrity" className="text-primary hover:underline font-medium">
              Data Integrity
            </a>{" "}
            page.
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
