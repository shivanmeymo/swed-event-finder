import { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "sv";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navbar
    "nav.createEvent": "Create Event",
    "nav.menu": "Menu",
    "nav.manageEvents": "Manage Events",
    "nav.aboutUs": "About Us",
    "nav.contactUs": "Contact Us",
    "nav.signOut": "Sign Out",
    "nav.signIn": "Sign In",
    
    // Hero
    "hero.title1": "Discover Events and Activities",
    "hero.title2": "Across Sweden",
    "hero.subtitle": "Explore thousands of events from Uppsala, Stockholm, and beyond. All in one place.",
    "hero.exploreButton": "Explore Events",
    
    // Events
    "events.title": "Upcoming Events",
    "events.found": "events found",
    "events.noResults": "No events found matching your filters. Try adjusting your search criteria.",
    
    // Footer
    "footer.description": "Discover amazing events and activities across Sweden.",
    "footer.quickLinks": "Quick Links",
    "footer.home": "Home",
    "footer.createEvent": "Create Event",
    "footer.aboutUs": "About Us",
    "footer.contactUs": "Contact Us",
    "footer.dataIntegrity": "Data Integrity",
    "footer.newsletter": "Subscribe to Newsletter",
    "footer.email": "Your email",
    "footer.category": "Category",
    "footer.location": "Location",
    "footer.keywords": "Keywords",
    "footer.any": "Any",
    "footer.optional": "Optional",
    "footer.subscribe": "Subscribe",
    "footer.copyright": "© 2026 NowInTown. All rights reserved.",
    
    // Categories
    "category.all": "Any",
    "category.music": "Music",
    "category.sports": "Sports",
    "category.food": "Food",
    "category.art": "Art",
    "category.tech": "Tech",
    
    // Cookie Consent
    "cookie.title": "We care about your privacy",
    "cookie.description": "We use cookies to improve your browsing experience, show personalized ads or content and analyze our traffic. By clicking \"Accept all\" you consent to our use of cookies.",
    "cookie.customize": "Customize",
    "cookie.rejectAll": "Reject all",
    "cookie.acceptAll": "Accept all",
    
    // Auth
    "auth.invalidEmail": "Invalid email address. Please check and try again.",
    "auth.wrongPassword": "Incorrect password. Please try again or reset your password.",
    "auth.userNotFound": "No account found with this email. Please sign up first.",
    "auth.technicalIssue": "Technical issue occurred. Please contact support@NowInTown.com",
    
    // Create Event
    "create.organizerEmail": "Organizer Email",
    "create.aboutYourself": "About Yourself",
    "create.aboutPlaceholder": "Tell us about yourself and why you want to create this event...",
    "create.pendingApproval": "Your event is pending approval. You'll receive an email confirmation once approved.",
    "create.title": "Create New Event",
    "create.subtitle": "Fill in the details below to publish your event",
    "create.organizerInfo": "Organizer Information",
    "create.organizerInfoDesc": "Tell us about yourself",
    "create.organizerName": "Organizer's Name",
    "create.organizerDesc": "Organizer's Description (Optional)",
    "create.organizerDescPlaceholder": "Tell us about yourself and your experience organizing events (optional)...",
    "create.eventDetails": "Event Details",
    "create.eventDetailsDesc": "Fill in your event information",
    "create.eventTitle": "Event Title",
    "create.eventDesc": "Event Description (Optional)",
    "create.eventDescPlaceholder": "Describe what makes your event special...",
    "create.startDate": "Start Date",
    "create.startTime": "Start Time",
    "create.endDate": "End Date",
    "create.endTime": "End Time",
    "create.location": "Location",
    "create.category": "Category",
    "create.customCategory": "Custom Category",
    "create.eventPrice": "Event Price",
    "create.free": "Free",
    "create.paid": "Paid",
    "create.priceAdults": "Adults",
    "create.priceStudents": "Students",
    "create.priceKids": "Kids",
    "create.priceSeniors": "Seniors",
    "create.eventImage": "Event Image (Optional)",
    "create.uploadImage": "Upload Image",
    "create.changeImage": "Change Image",
    "create.createEvent": "Create Event",
    "create.creatingEvent": "Creating Event...",
    
    // Manage Events
    "manage.title": "Manage Your Events",
    "manage.subtitle": "View and edit your created events",
    "manage.yourEvents": "Your Events",
    "manage.noEvents": "No events yet",
    "manage.noEventsDesc": "You haven't created any events yet. Start by creating your first event!",
    "manage.editDetails": "Edit Event Details",
    "manage.editDetailsDesc": "Update your event information or delete it",
    "manage.statusApproved": "Status: Approved & Published",
    "manage.statusRejected": "Status: Rejected - Contact us if you are interested to know the reason",
    "manage.statusPending": "Status: Approval in Progress",
    "manage.backToList": "Back to List",
    "manage.updateEvent": "Update Event",
    "manage.deleteEvent": "Delete Event",
    "manage.deleteConfirm": "Are you sure?",
    "manage.deleteConfirmDesc": "This action cannot be undone. This will permanently delete your event.",
    "manage.cancel": "Cancel",
    "manage.delete": "Delete",
    
    // Profile
    "profile.title": "My Account",
    "profile.subtitle": "Manage your account settings and preferences",
    "profile.profileInfo": "Profile Information",
    "profile.profileInfoDesc": "View and manage your account details",
    "profile.fullName": "Full Name",
    "profile.email": "Email Address",
    "profile.updatePassword": "Update Password",
    "profile.updatePasswordDesc": "Change your password to keep your account secure",
    "profile.newPassword": "New Password",
    "profile.confirmPassword": "Confirm New Password",
    "profile.changePassword": "Change Password",
    "profile.dangerZone": "Danger Zone",
    "profile.dangerZoneDesc": "Permanently delete your account and all associated data",
    "profile.deleteAccount": "Delete Account",
    "profile.deleteWarning": "This action cannot be undone",
    "profile.deleteConfirm": "Are you absolutely sure?",
    "profile.deleteConfirmDesc": "This will permanently delete your account and all your data. This action cannot be undone.",
    
    // Contact
    "contact.title": "Contact NowInTown",
    "contact.subtitle": "We'd love to hear from you!",
    "contact.description": "Whether you're planning an unforgettable corporate event, a private celebration, or looking to collaborate, the NowInTown team is here to make it happen.",
    "contact.getInTouch": "Get in Touch",
    "contact.email": "Email",
    "contact.phone": "Phone",
    "contact.hours": "Operating Hours",
    "contact.hoursValue": "Monday - Friday: 9:00 AM - 5:00 PM",
    "contact.sendMessage": "Send Us a Message",
    "contact.name": "Name",
    "contact.yourEmail": "Your Email",
    "contact.category": "Category",
    "contact.selectCategory": "Select a category",
    "contact.generalInquiry": "General Inquiry",
    "contact.eventOrganization": "Event Organization",
    "contact.partnership": "Partnership Opportunity",
    "contact.technical": "Technical Support",
    "contact.other": "Other",
    "contact.summary": "Summary",
    "contact.summaryPlaceholder": "Tell us more about your inquiry...",
    "contact.send": "Send Message",
    "contact.sending": "Sending...",
    
    // Admin Dashboard
    "admin.title": "Admin Dashboard",
    "admin.subtitle": "Manage events and user submissions",
    "admin.pendingEvents": "Pending Events",
    "admin.approvedEvents": "Approved Events",
    "admin.rejectedEvents": "Rejected Events",
    "admin.noEvents": "No events in this category",
    "admin.approve": "Approve",
    "admin.reject": "Reject",
    "admin.view": "View",
    "admin.edit": "Edit",
    "admin.delete": "Delete",
    
    // About Us
    "about.title": "About SwedEvents",
    "about.subtitle": "Connecting people with unforgettable experiences across Sweden",
  },
  sv: {
    // Navbar
    "nav.createEvent": "Skapa Event",
    "nav.menu": "Meny",
    "nav.manageEvents": "Hantera Event",
    "nav.aboutUs": "Om Oss",
    "nav.contactUs": "Kontakta Oss",
    "nav.signOut": "Logga Ut",
    "nav.signIn": "Logga In",
    
    // Hero
    "hero.title1": "Upptäck Event och Aktiviteter",
    "hero.title2": "Över Hela Sverige",
    "hero.subtitle": "Utforska tusentals evenemang från Uppsala, Stockholm och vidare. Allt på ett ställe.",
    "hero.exploreButton": "Utforska Event",
    
    // Events
    "events.title": "Kommande Event",
    "events.found": "event hittade",
    "events.noResults": "Inga event hittades som matchar dina filter. Prova att justera dina sökkriterier.",
    
    // Footer
    "footer.description": "Upptäck fantastiska event och aktiviteter över hela Sverige.",
    "footer.quickLinks": "Snabblänkar",
    "footer.home": "Hem",
    "footer.createEvent": "Skapa Event",
    "footer.aboutUs": "Om Oss",
    "footer.contactUs": "Kontakta Oss",
    "footer.dataIntegrity": "Dataintegritet",
    "footer.newsletter": "Prenumerera på Nyhetsbrev",
    "footer.email": "Din e-post",
    "footer.category": "Kategori",
    "footer.location": "Plats",
    "footer.keywords": "Nyckelord",
    "footer.any": "Alla",
    "footer.optional": "Valfritt",
    "footer.subscribe": "Prenumerera",
    "footer.copyright": "© 2026 NowInTown. Alla rättigheter förbehållna.",
    
    // Categories
    "category.all": "Alla",
    "category.music": "Musik",
    "category.sports": "Sport",
    "category.food": "Mat",
    "category.art": "Konst",
    "category.tech": "Teknologi",
    
    // Cookie Consent
    "cookie.title": "Vi värnar om din integritet",
    "cookie.description": "Vi använder cookies för att förbättra din surfupplevelse, visa personliga annonser eller innehåll och analysera vår trafik. Genom att klicka på \"Acceptera alla\" samtycker du till vår användning av cookies.",
    "cookie.customize": "Anpassa",
    "cookie.rejectAll": "Avvisa alla",
    "cookie.acceptAll": "Acceptera alla",
    
    // Auth
    "auth.invalidEmail": "Ogiltig e-postadress. Vänligen kontrollera och försök igen.",
    "auth.wrongPassword": "Felaktigt lösenord. Försök igen eller återställ ditt lösenord.",
    "auth.userNotFound": "Inget konto hittades med denna e-post. Vänligen registrera dig först.",
    "auth.technicalIssue": "Tekniskt problem uppstod. Kontakta support@NowInTown.com",
    
    // Create Event
    "create.organizerEmail": "Arrangörs E-post",
    "create.aboutYourself": "Om Dig Själv",
    "create.aboutPlaceholder": "Berätta om dig själv och varför du vill skapa detta event...",
    "create.pendingApproval": "Ditt event väntar på godkännande. Du kommer få en e-postbekräftelse när det godkänts.",
    "create.title": "Skapa Nytt Event",
    "create.subtitle": "Fyll i detaljerna nedan för att publicera ditt event",
    "create.organizerInfo": "Arrangörsinformation",
    "create.organizerInfoDesc": "Berätta om dig själv",
    "create.organizerName": "Arrangörens Namn",
    "create.organizerDesc": "Arrangörens Beskrivning (Valfritt)",
    "create.organizerDescPlaceholder": "Berätta om dig själv och din erfarenhet av att arrangera event (valfritt)...",
    "create.eventDetails": "Eventdetaljer",
    "create.eventDetailsDesc": "Fyll i din eventinformation",
    "create.eventTitle": "Eventtitel",
    "create.eventDesc": "Eventbeskrivning (Valfritt)",
    "create.eventDescPlaceholder": "Beskriv vad som gör ditt event speciellt...",
    "create.startDate": "Startdatum",
    "create.startTime": "Starttid",
    "create.endDate": "Slutdatum",
    "create.endTime": "Sluttid",
    "create.location": "Plats",
    "create.category": "Kategori",
    "create.customCategory": "Egen Kategori",
    "create.eventPrice": "Eventpris",
    "create.free": "Gratis",
    "create.paid": "Betalt",
    "create.priceAdults": "Vuxna",
    "create.priceStudents": "Studenter",
    "create.priceKids": "Barn",
    "create.priceSeniors": "Seniorer",
    "create.eventImage": "Eventbild (Valfritt)",
    "create.uploadImage": "Ladda upp Bild",
    "create.changeImage": "Ändra Bild",
    "create.createEvent": "Skapa Event",
    "create.creatingEvent": "Skapar Event...",
    
    // Manage Events
    "manage.title": "Hantera Dina Event",
    "manage.subtitle": "Visa och redigera dina skapade event",
    "manage.yourEvents": "Dina Event",
    "manage.noEvents": "Inga event ännu",
    "manage.noEventsDesc": "Du har inte skapat några event ännu. Börja med att skapa ditt första event!",
    "manage.editDetails": "Redigera Eventdetaljer",
    "manage.editDetailsDesc": "Uppdatera din eventinformation eller radera den",
    "manage.statusApproved": "Status: Godkänt & Publicerat",
    "manage.statusRejected": "Status: Avvisat - Kontakta oss om du vill veta varför",
    "manage.statusPending": "Status: Väntar på Godkännande",
    "manage.backToList": "Tillbaka till Listan",
    "manage.updateEvent": "Uppdatera Event",
    "manage.deleteEvent": "Radera Event",
    "manage.deleteConfirm": "Är du säker?",
    "manage.deleteConfirmDesc": "Denna åtgärd kan inte ångras. Detta kommer permanent radera ditt event.",
    "manage.cancel": "Avbryt",
    "manage.delete": "Radera",
    
    // Profile
    "profile.title": "Mitt Konto",
    "profile.subtitle": "Hantera dina kontoinställningar och preferenser",
    "profile.profileInfo": "Profilinformation",
    "profile.profileInfoDesc": "Visa och hantera dina kontodetaljer",
    "profile.fullName": "Fullständigt Namn",
    "profile.email": "E-postadress",
    "profile.updatePassword": "Uppdatera Lösenord",
    "profile.updatePasswordDesc": "Ändra ditt lösenord för att hålla ditt konto säkert",
    "profile.newPassword": "Nytt Lösenord",
    "profile.confirmPassword": "Bekräfta Nytt Lösenord",
    "profile.changePassword": "Ändra Lösenord",
    "profile.dangerZone": "Farlig Zon",
    "profile.dangerZoneDesc": "Radera permanent ditt konto och all associerad data",
    "profile.deleteAccount": "Radera Konto",
    "profile.deleteWarning": "Denna åtgärd kan inte ångras",
    "profile.deleteConfirm": "Är du helt säker?",
    "profile.deleteConfirmDesc": "Detta kommer permanent radera ditt konto och all din data. Denna åtgärd kan inte ångras.",
    
    // Contact
    "contact.title": "Kontakta NowInTown",
    "contact.subtitle": "Vi vill gärna höra från dig!",
    "contact.description": "Oavsett om du planerar ett minnesvärt företagsevent, en privat fest eller vill samarbeta, är NowInTown-teamet här för att göra det möjligt.",
    "contact.getInTouch": "Kom i Kontakt",
    "contact.email": "E-post",
    "contact.phone": "Telefon",
    "contact.hours": "Öppettider",
    "contact.hoursValue": "Måndag - Fredag: 09:00 - 17:00",
    "contact.sendMessage": "Skicka Meddelande",
    "contact.name": "Namn",
    "contact.yourEmail": "Din E-post",
    "contact.category": "Kategori",
    "contact.selectCategory": "Välj en kategori",
    "contact.generalInquiry": "Allmän Förfrågan",
    "contact.eventOrganization": "Eventorganisation",
    "contact.partnership": "Partnerskapsmöjlighet",
    "contact.technical": "Teknisk Support",
    "contact.other": "Annat",
    "contact.summary": "Sammanfattning",
    "contact.summaryPlaceholder": "Berätta mer om din förfrågan...",
    "contact.send": "Skicka Meddelande",
    "contact.sending": "Skickar...",
    
    // Admin Dashboard
    "admin.title": "Admin Panel",
    "admin.subtitle": "Hantera event och användarinlämningar",
    "admin.pendingEvents": "Väntande Event",
    "admin.approvedEvents": "Godkända Event",
    "admin.rejectedEvents": "Avvisade Event",
    "admin.noEvents": "Inga event i denna kategori",
    "admin.approve": "Godkänn",
    "admin.reject": "Avvisa",
    "admin.view": "Visa",
    "admin.edit": "Redigera",
    "admin.delete": "Radera",
    
    // About Us
    "about.title": "Om SwedEvents",
    "about.subtitle": "Kopplar samman människor med oförglömliga upplevelser över hela Sverige",
  },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("sv");

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};
