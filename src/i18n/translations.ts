export const translations = {
  sv: {
    // Navbar
    events: "Evenemang",
    createEvent: "Skapa Evenemang",
    signIn: "Logga In",
    
    // Hero Section
    heroSubtitle: "Upptäck Evenemang Över Sverige",
    heroTitle: "Upptäck Evenemang och Aktiviteter Över Sverige",
    heroDescription: "Utforska tusentals evenemang från Uppsala, Stockholm och mer. Allt på ett ställe.",
    exploreEvents: "Utforska Evenemang",
    
    // Filter Bar
    searchPlaceholder: "Sök evenemang...",
    keywords: "Nyckelord",
    keywordsPlaceholder: "Skriv nyckelord...",
    date: "Datum",
    location: "Plats",
    category: "Kategori",
    today: "Idag",
    tomorrow: "Imorgon",
    thisWeek: "Denna Vecka",
    thisMonth: "Denna Månad",
    uppsala: "Uppsala",
    stockholm: "Stockholm",
    gothenburg: "Göteborg",
    malmo: "Malmö",
    music: "Musik",
    tech: "Teknik",
    sports: "Sport",
    food: "Mat & Dryck",
    art: "Konst & Kultur",
    subscribe: "Prenumerera på Aviseringar",
    
    // Events Section
    upcomingEvents: "Kommande Evenemang",
    eventsFound: "evenemang hittade",
    attendees: "deltagare",
    
    // Auth Page
    welcomeBack: "Välkommen Tillbaka",
    signInDescription: "Logga in på ditt konto för att hantera dina evenemang",
    signUp: "Skapa Konto",
    email: "E-post",
    password: "Lösenord",
    
    // Create Event Page
    createNewEvent: "Skapa Nytt Evenemang",
    eventTitle: "Evenemangets Titel",
    eventTitlePlaceholder: "t.ex. Uppsala Jazz Festival 2025",
    eventDescription: "Beskrivning",
    eventDescriptionPlaceholder: "Beskriv ditt evenemang...",
    eventDate: "Datum",
    eventLocation: "Plats",
    eventLocationPlaceholder: "t.ex. Uppsala Konserthus",
    eventCategory: "Kategori",
    eventImage: "Bild URL",
    eventImagePlaceholder: "https://exempel.se/bild.jpg",
    publishEvent: "Publicera Evenemang",
    cancel: "Avbryt",
  },
  en: {
    // Navbar
    events: "Events",
    createEvent: "Create Event",
    signIn: "Sign In",
    
    // Hero Section
    heroSubtitle: "Discover Events Across Sweden",
    heroTitle: "Discover Events and Activities Across Sweden",
    heroDescription: "Explore thousands of events from Uppsala, Stockholm, and beyond. All in one place.",
    exploreEvents: "Explore Events",
    
    // Filter Bar
    searchPlaceholder: "Search events...",
    keywords: "Keywords",
    keywordsPlaceholder: "Enter keywords...",
    date: "Date",
    location: "Location",
    category: "Category",
    today: "Today",
    tomorrow: "Tomorrow",
    thisWeek: "This Week",
    thisMonth: "This Month",
    uppsala: "Uppsala",
    stockholm: "Stockholm",
    gothenburg: "Gothenburg",
    malmo: "Malmö",
    music: "Music",
    tech: "Tech",
    sports: "Sports",
    food: "Food & Drink",
    art: "Art & Culture",
    subscribe: "Subscribe to Notifications",
    
    // Events Section
    upcomingEvents: "Upcoming Events",
    eventsFound: "events found",
    attendees: "attendees",
    
    // Auth Page
    welcomeBack: "Welcome Back",
    signInDescription: "Sign in to your account to manage your events",
    signUp: "Sign Up",
    email: "Email",
    password: "Password",
    
    // Create Event Page
    createNewEvent: "Create New Event",
    eventTitle: "Event Title",
    eventTitlePlaceholder: "e.g. Uppsala Jazz Festival 2025",
    eventDescription: "Description",
    eventDescriptionPlaceholder: "Describe your event...",
    eventDate: "Date",
    eventLocation: "Location",
    eventLocationPlaceholder: "e.g. Uppsala Concert Hall",
    eventCategory: "Category",
    eventImage: "Image URL",
    eventImagePlaceholder: "https://example.com/image.jpg",
    publishEvent: "Publish Event",
    cancel: "Cancel",
  }
};

export type Language = 'sv' | 'en';
export type TranslationKey = keyof typeof translations.sv;
