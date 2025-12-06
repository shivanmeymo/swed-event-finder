import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { MapPin, Loader2, AlertCircle } from "lucide-react";

interface GoogleMapsAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  name?: string;
  required?: boolean;
}

declare global {
  interface Window {
    google: typeof google;
    initGoogleMaps: () => void;
  }
}

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

const GoogleMapsAutocomplete = ({
  value,
  onChange,
  placeholder = "Enter location",
  className = "",
  id,
  name,
  required,
}: GoogleMapsAutocompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If no API key, just use basic input
    if (!GOOGLE_MAPS_API_KEY) {
      console.warn("Google Maps API key not configured - using basic input");
      return;
    }

    // Check if Google Maps is already loaded
    if (window.google?.maps?.places) {
      setIsLoaded(true);
      return;
    }

    // Check if script is already loading
    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      // Wait for existing script to load
      const checkLoaded = setInterval(() => {
        if (window.google?.maps?.places) {
          setIsLoaded(true);
          setIsLoading(false);
          clearInterval(checkLoaded);
        }
      }, 100);
      return () => clearInterval(checkLoaded);
    }

    // Load Google Maps script
    setIsLoading(true);
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;
    
    window.initGoogleMaps = () => {
      setIsLoaded(true);
      setIsLoading(false);
    };

    script.onerror = () => {
      setIsLoading(false);
      setError("Failed to load location suggestions");
      console.error("Failed to load Google Maps");
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup
      delete window.initGoogleMaps;
    };
  }, []);

  useEffect(() => {
    if (!isLoaded || !inputRef.current || autocompleteRef.current) return;

    try {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ["establishment", "geocode"],
          componentRestrictions: { country: "se" },
          fields: ["formatted_address", "name", "geometry"],
        }
      );

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current?.getPlace();
        if (place) {
          const locationName = place.name 
            ? `${place.name}, ${place.formatted_address}` 
            : place.formatted_address || "";
          onChange(locationName);
        }
      });
    } catch (err) {
      console.error("Error initializing autocomplete:", err);
      setError("Location suggestions unavailable");
    }

    return () => {
      if (autocompleteRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [isLoaded, onChange]);

  return (
    <div className="relative">
      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
      {isLoading && (
        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin z-10" />
      )}
      {error && !isLoading && (
        <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
      )}
      <Input
        ref={inputRef}
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className={`pl-10 ${className}`}
        autoComplete="off"
      />
    </div>
  );
};

export default GoogleMapsAutocomplete;
