import { useEffect } from "react";
import { Heart, Users, Sparkles, MapPin, Calendar, Award } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AboutUs = () => {
  useEffect(() => {
    document.title = "About SwedEvents - Your Premier Event Discovery Platform in Sweden";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Discover SwedEvents: Sweden's leading event discovery platform connecting people with unforgettable experiences. Learn about our mission to make every event in Sweden easily discoverable."
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-[hsl(230,89%,62%)] to-accent bg-clip-text text-transparent">
            About SwedEvents
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connecting people with unforgettable experiences across Sweden
          </p>
        </header>

        <section className="mb-16" aria-labelledby="mission-heading">
          <div className="bg-card border rounded-lg p-8">
            <h2 id="mission-heading" className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground mb-4">
              SwedEvents was born from a simple idea: every amazing event happening across Sweden should be easily 
              discoverable by everyone. Whether it's a local art exhibition in Malmö, a sports tournament in Stockholm, 
              or a music festival in Gothenburg, we believe great experiences should never go unnoticed.
            </p>
            <p className="text-lg text-muted-foreground">
              We're here to bridge the gap between event organizers and attendees, making it effortless to share, 
              discover, and participate in the vibrant cultural landscape of Sweden.
            </p>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-6 mb-16" aria-label="Core values">
          <Card>
            <CardHeader>
              <Heart className="w-12 h-12 mb-4 text-primary" aria-hidden="true" />
              <CardTitle>Community First</CardTitle>
              <CardDescription>Building connections that matter</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We believe in the power of community. Every event brings people together, creates memories, 
                and strengthens the social fabric of Sweden.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Sparkles className="w-12 h-12 mb-4 text-primary" aria-hidden="true" />
              <CardTitle>Simplicity & Access</CardTitle>
              <CardDescription>Easy for everyone to use</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Creating and finding events should be simple. Our platform is designed to be intuitive, 
                accessible, and welcoming for all users.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Award className="w-12 h-12 mb-4 text-primary" aria-hidden="true" />
              <CardTitle>Quality & Trust</CardTitle>
              <CardDescription>Reliable event information</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We maintain high standards for event listings and protect user data with enterprise-grade 
                security measures.
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
            <p><strong>Email:</strong> <a href="mailto:info@swedevents.com" className="text-primary hover:underline">info@swedevents.com</a></p>
            <p><strong>Phone:</strong> <a href="tel:+46700543050" className="text-primary hover:underline">+46 (0)70 054 3050</a></p>
            <p><strong>Address:</strong> Skeppsbron 2, 111 30 Stockholm, Sweden</p>
          </div>
          <Button className="mt-6" variant="default" asChild>
            <Link to="/contact">Contact Us</Link>
          </Button>
        </section>
      </main>

      <footer className="border-t border-border bg-card mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} SwedEvents. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;
