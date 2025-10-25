import { useEffect } from "react";
import { Shield, Lock, Database, FileCheck, Eye, RefreshCw } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const DataIntegrity = () => {
  useEffect(() => {
    document.title = "Data Integrity & Security - SwedEvents | Secure Event Management";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Learn how SwedEvents ensures data integrity and security for all event information. Our commitment to protecting your data with enterprise-grade security measures."
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-[hsl(230,89%,62%)] to-accent bg-clip-text text-transparent">
            Data Integrity & Security
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your trust is our priority. We implement robust security measures to protect your event data and ensure its integrity at all times.
          </p>
        </header>

        <section className="grid md:grid-cols-2 gap-6 mb-12" aria-label="Security features">
          <Card>
            <CardHeader>
              <Shield className="w-12 h-12 mb-4 text-primary" aria-hidden="true" />
              <CardTitle>Data Protection</CardTitle>
              <CardDescription>Enterprise-grade security for your peace of mind</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                All event data is encrypted both in transit and at rest using industry-standard encryption protocols. 
                We employ SSL/TLS certificates and secure data transmission to protect your information from unauthorized access.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Lock className="w-12 h-12 mb-4 text-primary" aria-hidden="true" />
              <CardTitle>Access Control</CardTitle>
              <CardDescription>Secure authentication and authorization</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Event organizers receive unique access codes to manage their events. Only authorized users can view, 
                modify, or delete event information, ensuring complete control over your data.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Database className="w-12 h-12 mb-4 text-primary" aria-hidden="true" />
              <CardTitle>Data Integrity</CardTitle>
              <CardDescription>Reliable and consistent information</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We maintain strict data validation rules to ensure all event information remains accurate and consistent. 
                Regular integrity checks prevent data corruption and maintain reliability across our platform.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <FileCheck className="w-12 h-12 mb-4 text-primary" aria-hidden="true" />
              <CardTitle>Automatic Cleanup</CardTitle>
              <CardDescription>Privacy-first data management</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Events are automatically deleted at the end of their scheduled date, ensuring no unnecessary data retention. 
                This privacy-first approach minimizes data storage and protects user information.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Eye className="w-12 h-12 mb-4 text-primary" aria-hidden="true" />
              <CardTitle>Transparency</CardTitle>
              <CardDescription>Clear data usage policies</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We collect only essential information needed to display and manage events. No personal data is shared 
                with third parties without explicit consent, and users can request data deletion at any time.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <RefreshCw className="w-12 h-12 mb-4 text-primary" aria-hidden="true" />
              <CardTitle>Regular Backups</CardTitle>
              <CardDescription>Reliable data recovery</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Automated backups ensure your event data is safe and recoverable in case of system failures. 
                Our redundant storage systems guarantee high availability and data durability.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="bg-card border rounded-lg p-8 mb-12" aria-labelledby="commitment-heading">
          <h2 id="commitment-heading" className="text-3xl font-bold mb-6">Our Commitment to You</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              At SwedEvents, we understand that your event data is valuable and sensitive. We are committed to maintaining 
              the highest standards of data security and integrity through:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Regular security audits and penetration testing</li>
              <li>Compliance with GDPR and international data protection regulations</li>
              <li>Continuous monitoring for suspicious activities</li>
              <li>Prompt security updates and patches</li>
              <li>Transparent incident reporting and response procedures</li>
            </ul>
            <p className="mt-6">
              If you have any questions about our data security practices or would like to report a security concern, 
              please contact us at <a href="mailto:security@swedevents.com" className="text-primary hover:underline">security@swedevents.com</a>
            </p>
          </div>
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

export default DataIntegrity;
