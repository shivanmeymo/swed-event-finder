import { useEffect } from "react";
import { Shield, Lock, Database, FileCheck, Eye, RefreshCw, User } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const DataIntegrity = () => {
  const { t } = useLanguage();
  
  useEffect(() => {
    document.title = t("dataIntegrity.pageTitle");
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        t("dataIntegrity.pageDescription")
      );
    }
  }, [t]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-[hsl(230,89%,62%)] to-accent bg-clip-text text-transparent">
            {t("dataIntegrity.title")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t("dataIntegrity.subtitle")}
          </p>
        </header>

        <section className="grid md:grid-cols-2 gap-6 mb-12" aria-label="Security features">
          <Card>
            <CardHeader>
              <Shield className="w-12 h-12 mb-4 text-primary" aria-hidden="true" />
              <CardTitle>{t("dataIntegrity.dataProtection")}</CardTitle>
              <CardDescription>{t("dataIntegrity.dataProtectionDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t("dataIntegrity.dataProtectionText")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Lock className="w-12 h-12 mb-4 text-primary" aria-hidden="true" />
              <CardTitle>{t("dataIntegrity.accessControl")}</CardTitle>
              <CardDescription>{t("dataIntegrity.accessControlDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {t("dataIntegrity.accessControlText1")}
              </p>
              <p className="text-muted-foreground">
                {t("dataIntegrity.accessControlText2")} <Link to="/profile" className="text-primary hover:underline font-medium">{t("dataIntegrity.accountPage")}</Link>.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Database className="w-12 h-12 mb-4 text-primary" aria-hidden="true" />
              <CardTitle>{t("dataIntegrity.dataIntegrity")}</CardTitle>
              <CardDescription>{t("dataIntegrity.dataIntegrityDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t("dataIntegrity.dataIntegrityText")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <FileCheck className="w-12 h-12 mb-4 text-primary" aria-hidden="true" />
              <CardTitle>{t("dataIntegrity.autoCleanup")}</CardTitle>
              <CardDescription>{t("dataIntegrity.autoCleanupDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t("dataIntegrity.autoCleanupText")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Eye className="w-12 h-12 mb-4 text-primary" aria-hidden="true" />
              <CardTitle>{t("dataIntegrity.transparency")}</CardTitle>
              <CardDescription>{t("dataIntegrity.transparencyDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t("dataIntegrity.transparencyText")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <RefreshCw className="w-12 h-12 mb-4 text-primary" aria-hidden="true" />
              <CardTitle>{t("dataIntegrity.regularBackups")}</CardTitle>
              <CardDescription>{t("dataIntegrity.regularBackupsDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t("dataIntegrity.regularBackupsText")}
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="bg-card border rounded-lg p-8 mb-12" aria-labelledby="commitment-heading">
          <h2 id="commitment-heading" className="text-3xl font-bold mb-6">{t("dataIntegrity.commitmentTitle")}</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              {t("dataIntegrity.commitmentText")}
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>{t("dataIntegrity.commitmentItem1")}</li>
              <li>{t("dataIntegrity.commitmentItem2")}</li>
              <li>{t("dataIntegrity.commitmentItem3")}</li>
              <li>{t("dataIntegrity.commitmentItem4")}</li>
              <li>{t("dataIntegrity.commitmentItem5")}</li>
            </ul>
            <p className="mt-6">
              {t("dataIntegrity.contactText")} <Link to="/contact" className="text-primary hover:underline">{t("dataIntegrity.contactUs")}</Link>
            </p>
          </div>
        </section>

        <section className="bg-gradient-to-br from-primary/10 via-[hsl(230,89%,62%)]/10 to-accent/10 rounded-lg p-12 text-center">
          <User className="w-16 h-16 mx-auto mb-4 text-primary" aria-hidden="true" />
          <h2 className="text-3xl font-bold mb-4">{t("dataIntegrity.manageAccountTitle")}</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t("dataIntegrity.manageAccountText")}
          </p>
          <Button size="lg" asChild>
            <Link to="/profile">{t("dataIntegrity.goToAccount")}</Link>
          </Button>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default DataIntegrity;
