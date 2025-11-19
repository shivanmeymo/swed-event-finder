import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";

const EventApproved = () => {
  const [searchParams] = useSearchParams();
  const eventTitle = searchParams.get("title") || "Unknown Event";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="flex justify-center">
            <CheckCircle2 className="h-24 w-24 text-green-600" />
          </div>
          
          <h1 className="text-4xl font-bold text-foreground">
            Event Approved!
          </h1>
          
          <p className="text-xl text-muted-foreground">
            The event "<span className="font-semibold text-foreground">{eventTitle}</span>" has been successfully approved.
          </p>
          
          <p className="text-muted-foreground">
            A confirmation email has been sent to the organizer.
          </p>

          <div className="pt-8">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90">
              <Link to="/">
                View All Events
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventApproved;
