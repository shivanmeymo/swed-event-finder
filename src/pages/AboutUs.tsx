import { useEffect } from "react";
import { Heart, Users, Sparkles, MapPin, Calendar, Award } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import heroImage from "@/assets/about-hero.jpg";

const AboutUs = () => {
  const { t } = useLanguage();
  
  useEffect(() => {
    document.title = t("aboutUs.pageTitle");
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        t("aboutUs.pageDescription")
      );
    }
  }, [t]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <header className="text-center mb-12">
          <div className="relative rounded-2xl overflow-hidden mb-8 h-[400px] shadow-2xl">
            <img 
              src={heroImage} 
              alt={t("aboutUs.heroImageAlt")}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/60 to-background/20 flex items-end justify-center pb-12">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold mb-4 text-foreground drop-shadow-lg">
                  {t("aboutUs.title")}
                </h1>
                <p className="text-xl md:text-2xl text-foreground/90 max-w-3xl mx-auto drop-shadow-md px-4">
                  {t("aboutUs.subtitle")}
                </p>
              </div>
            </div>
          </div>
        </header>

        <section className="mb-16" aria-labelledby="mission-heading">
          <div className="bg-card border rounded-lg p-8">
            <h2 id="mission-heading" className="text-3xl font-bold mb-6">{t("aboutUs.mission")}</h2>
            <p className="text-lg text-muted-foreground mb-4">
              {t("aboutUs.missionText1")}
            </p>
            <p className="text-lg text-muted-foreground">
              {t("aboutUs.missionText2")}
            </p>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-6 mb-16" aria-label="Core values">
          <Card>
            <CardHeader>
              <Heart className="w-12 h-12 mb-4 text-primary" aria-hidden="true" />
              <CardTitle>{t("aboutUs.valueTitle1")}</CardTitle>
              <CardDescription>{t("aboutUs.valueSubtitle1")}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t("aboutUs.valueText1")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Sparkles className="w-12 h-12 mb-4 text-primary" aria-hidden="true" />
              <CardTitle>{t("aboutUs.valueTitle2")}</CardTitle>
              <CardDescription>{t("aboutUs.valueSubtitle2")}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t("aboutUs.valueText2")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Award className="w-12 h-12 mb-4 text-primary" aria-hidden="true" />
              <CardTitle>{t("aboutUs.valueTitle3")}</CardTitle>
              <CardDescription>{t("aboutUs.valueSubtitle3")}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t("aboutUs.valueText3")}
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="mb-16" aria-labelledby="story-heading">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 id="story-heading" className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  SwedEvents started in 2024 with a vision to transform how people discover and share events 
                  throughout Sweden. Our founders, passionate about community building and cultural experiences, 
                  recognized that incredible events were often happening in people's backyards without them knowing.
                </p>
                <p>
                  Today, we're proud to serve event organizers and attendees across Sweden, from major cities 
                  to small towns. Our platform has become a trusted resource for discovering everything from 
                  art exhibitions and sports events to family-friendly activities and professional networking opportunities.
                </p>
                <p>
                  We're committed to continuously improving our platform, adding new features, and expanding 
                  our reach to ensure that no great event goes undiscovered.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-8 h-8 text-primary flex-shrink-0" aria-hidden="true" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Nationwide Coverage</h3>
                  <p className="text-muted-foreground">
                    Events from all across Sweden, from Stockholm to Kiruna
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Calendar className="w-8 h-8 text-primary flex-shrink-0" aria-hidden="true" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Daily Updates</h3>
                  <p className="text-muted-foreground">
                    Fresh event listings added every day by our community
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Users className="w-8 h-8 text-primary flex-shrink-0" aria-hidden="true" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Growing Community</h3>
                  <p className="text-muted-foreground">
                    Thousands of event organizers and attendees trust SwedEvents
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-br from-primary/10 via-[hsl(230,89%,62%)]/10 to-accent/10 rounded-lg p-12 text-center" aria-labelledby="cta-heading">
          <h2 id="cta-heading" className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join our community of event organizers and attendees. Create your first event or discover 
            something amazing happening near you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/create">Create an Event</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/">Explore Events</Link>
            </Button>
          </div>
        </section>

        <section className="mt-16 bg-card border rounded-lg p-8" aria-labelledby="contact-heading">
          <h2 id="contact-heading" className="text-3xl font-bold mb-6">Get in Touch</h2>
          <p className="text-muted-foreground mb-6">
            Have questions, suggestions, or just want to say hello? We'd love to hear from you!
          </p>
          <div className="space-y-2 text-muted-foreground">
            <p><strong>Email:</strong> <a href="mailto:contact@nowintown.com" className="text-primary hover:underline">contact@nowintown.com</a></p>
            <p><strong>Phone:</strong> <a href="tel:+46705430505" className="text-primary hover:underline">+46 (0)70 543 05 05</a></p>
            <p><strong>Address:</strong> Uppsala, Sweden</p>
          </div>
          <Button className="mt-6" variant="default" asChild>
            <Link to="/contact">Contact Us</Link>
          </Button>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUs;
