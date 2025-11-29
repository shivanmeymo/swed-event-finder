import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import logo from "@/assets/logo.png";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border bg-card mt-12" role="contentinfo">
      <div className="container mx-auto px-4 py-8">
        <nav aria-label="Footer navigation">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="flex-1">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity mb-3"
                aria-label="Scroll to top"
              >
                <img src={logo} alt="" className="h-10 w-10" aria-hidden="true" />
                <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-[#006AA7] to-[#FECC00] bg-clip-text text-transparent">
                  NowInTown
                </span>
              </button>
              <p className="text-muted-foreground text-sm mb-4">
                {t("footer.description")}
              </p>
              <div className="mt-4">
                <h4 className="font-semibold text-foreground mb-3 text-sm">{t("footer.quickLinks")}</h4>
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                  <Link to="/" className="text-primary hover:text-primary/80 font-medium transition-colors">{t("footer.home")}</Link>
                  <Link to="/create" className="text-primary hover:text-primary/80 font-medium transition-colors">{t("footer.createEvent")}</Link>
                  <Link to="/about" className="text-primary hover:text-primary/80 font-medium transition-colors">{t("footer.aboutUs")}</Link>
                  <Link to="/contact" className="text-primary hover:text-primary/80 font-medium transition-colors">{t("footer.contactUs")}</Link>
                  <Link to="/data-integrity" className="text-primary hover:text-primary/80 font-medium transition-colors">{t("footer.dataIntegrity")}</Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border mt-6 pt-4 text-center text-xs text-muted-foreground">
            <p>© 2026 NowInTown. All rights reserved.</p>
          </div>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;