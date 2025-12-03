import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const TermsConditions = () => {
  const { language } = useLanguage();

  useEffect(() => {
    document.title = language === "sv" ? "Villkor - NowInTown" : "Terms and Conditions - NowInTown";
  }, [language]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <article className="max-w-4xl mx-auto prose prose-lg dark:prose-invert">
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              {language === "sv" ? "Villkor" : "Terms and Conditions"}
            </h1>
            <p className="text-muted-foreground">
              {language === "sv" ? "Senast uppdaterad: 02/12/2025" : "Last updated: 02/12/2025"}
            </p>
          </header>

          <section className="space-y-8 text-muted-foreground">
            <p>
              {language === "sv"
                ? "Välkommen till NowInTown! Genom att använda vår webbplats, tjänster och allt innehåll, funktioner eller funktionalitet som är tillgänglig genom den (tillsammans kallade \"Tjänsterna\"), samtycker du till att följa dessa Villkor. Läs dessa noggrant innan du använder våra Tjänster."
                : "Welcome to NowInTown! By using our website, services, and any content, features, or functionality available through it (collectively referred to as the \"Services\"), you agree to comply with and be bound by these Terms and Conditions. Please read these carefully before using our Services."}
            </p>

            <section>
              <h2 className="text-2xl font-bold text-foreground">1. {language === "sv" ? "Godkännande av Villkor" : "Agreement to Terms"}</h2>
              <p>
                {language === "sv"
                  ? "Genom att gå in på och använda NowInTown (tillgänglig på www.nowintown.lovable.app), samtycker du till dessa Villkor och vår Integritetspolicy. Om du inte samtycker till dessa villkor, får du inte använda Tjänsterna."
                  : "By accessing and using NowInTown (available at www.nowintown.lovable.app), you agree to these Terms and Conditions and our Privacy Policy. If you do not agree to these terms, you must not use the Services."}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground">2. {language === "sv" ? "Tjänster som Tillhandahålls" : "Services Provided"}</h2>
              <p>{language === "sv" ? "NowInTown erbjuder en plattform för att upptäcka, marknadsföra och hantera lokala evenemang, inklusive:" : "NowInTown offers a platform for discovering, promoting, and managing local events, including:"}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{language === "sv" ? "Evenemangslistor (offentliga, privata, företag, etc.)" : "Event listings (public, private, corporate, etc.)"}</li>
                <li>{language === "sv" ? "Evenemangsmarknadsföring, biljettförsäljning och registreringshantering" : "Event promotion, ticket sales, and registration management"}</li>
                <li>{language === "sv" ? "Evenemangssökning och platsbaserade filtreringsverktyg" : "Event search and location-based filtering tools"}</li>
              </ul>
              <p>{language === "sv" ? "Vi förbehåller oss rätten att ändra, uppdatera eller avbryta någon del av Tjänsterna när som helst." : "We reserve the right to modify, update, or discontinue any part of the Services at any time."}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground">3. {language === "sv" ? "Användaransvar" : "User Responsibilities"}</h2>
              <h3 className="text-xl font-semibold text-foreground">3.1. {language === "sv" ? "Kontoregistrering" : "Account Registration"}</h3>
              <p>
                {language === "sv"
                  ? "För att få tillgång till vissa funktioner kan du behöva skapa ett konto. Vid registrering samtycker du till att tillhandahålla korrekt, aktuell och fullständig information. Du är ansvarig för att hålla dina kontouppgifter säkra."
                  : "To access certain features, you may need to create an account. When registering, you agree to provide accurate, current, and complete information. You are responsible for keeping your account details secure."}
              </p>
              <h3 className="text-xl font-semibold text-foreground">3.2. {language === "sv" ? "Användning av Tjänster" : "Use of Services"}</h3>
              <p>{language === "sv" ? "Du samtycker till att använda Tjänsterna endast för lagliga ändamål. Du får inte använda NowInTown för att:" : "You agree to use the Services solely for lawful purposes. You will not use NowInTown to:"}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{language === "sv" ? "Publicera eller marknadsföra olagligt, skadligt eller stötande innehåll." : "Post or promote illegal, harmful, or offensive content."}</li>
                <li>{language === "sv" ? "Delta i aktiviteter som stör eller påverkar webbplatsen eller tjänsterna." : "Engage in activities that disrupt or interfere with the website or services."}</li>
                <li>{language === "sv" ? "Trakassera, bedra eller skada andra användare eller tredje parter." : "Harass, defraud, or harm other users or third parties."}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground">4. {language === "sv" ? "Evenemangslistor" : "Event Listings"}</h2>
              <p>{language === "sv" ? "Som evenemangsarrangör eller promotor, genom att skicka in ett evenemang på NowInTown:" : "As an event organizer or promoter, by submitting an event on NowInTown, you:"}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{language === "sv" ? "Säkerställer att evenemangsuppgifterna som tillhandahålls är korrekta, fullständiga och i enlighet med svensk lag och förordningar." : "Ensure that the event details provided are accurate, complete, and in compliance with Swedish laws and regulations."}</li>
                <li>{language === "sv" ? "Ger NowInTown rätten att visa och marknadsföra ditt evenemang på plattformen." : "Grant NowInTown the right to display and promote your event on the platform."}</li>
                <li>{language === "sv" ? "Bekräftar att vi kan ta bort evenemang som bryter mot våra riktlinjer eller tillämplig lagstiftning efter eget gottfinnande." : "Acknowledge that we may remove any event that violates our guidelines or applicable laws at our discretion."}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground">5. {language === "sv" ? "Betalning och Avgifter" : "Payment and Fees"}</h2>
              <h3 className="text-xl font-semibold text-foreground">5.1. {language === "sv" ? "Biljett- och Registreringsavgifter" : "Ticketing and Registration Fees"}</h3>
              <p>{language === "sv" ? "Vissa evenemang kan kräva en avgift för registrering eller biljettköp. När du köper en biljett eller registrerar dig för ett evenemang:" : "Some events may require a fee for registration or ticket purchase. When you buy a ticket or register for an event:"}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{language === "sv" ? "Du samtycker till att betala de avgifter som anges vid tidpunkten för registrering eller köp." : "You agree to pay the fees specified at the time of registration or purchase."}</li>
                <li>{language === "sv" ? "Alla försäljningar är slutgiltiga om inte annat anges av evenemangsarrangören eller i enlighet med svensk konsumentskyddslag." : "All sales are final unless stated otherwise by the event organizer or in accordance with Swedish consumer protection laws."}</li>
              </ul>
              <h3 className="text-xl font-semibold text-foreground">5.2. {language === "sv" ? "Betalningshantering" : "Payment Processing"}</h3>
              <p>
                {language === "sv"
                  ? "Betalningar för biljetter eller evenemangsrelaterade tjänster behandlas genom säkra tredjepartsbetalningsprocessorer. Genom att använda våra Tjänster samtycker du till att vara bunden av villkoren för dessa tredjepartsbetalningsprocessorer."
                  : "Payments for tickets or event-related services are processed through secure third-party payment processors. By using our Services, you agree to be bound by the terms and conditions of these third-party payment processors."}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground">6. {language === "sv" ? "Integritet och Dataskydd" : "Privacy and Data Protection"}</h2>
              <p>
                {language === "sv"
                  ? "Vi är engagerade i att skydda dina personuppgifter. Din användning av NowInTown styrs av vår Integritetspolicy, som förklarar hur vi samlar in, använder och lagrar dina personuppgifter. Genom att använda vår plattform samtycker du till insamling och användning av dina personuppgifter enligt beskrivningen i Integritetspolicyn."
                  : "We are committed to protecting your personal data. Your use of NowInTown is governed by our Privacy Policy, which explains how we collect, use, and store your personal data. By using our platform, you consent to the collection and use of your personal data as described in the Privacy Policy."}
              </p>
              <h3 className="text-xl font-semibold text-foreground">6.1. {language === "sv" ? "GDPR-efterlevnad" : "GDPR Compliance"}</h3>
              <p>{language === "sv" ? "I enlighet med den allmänna dataskyddsförordningen (GDPR) har du rätt att:" : "In compliance with the General Data Protection Regulation (GDPR), you have the right to:"}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{language === "sv" ? "Få tillgång till dina personuppgifter." : "Access your personal data."}</li>
                <li>{language === "sv" ? "Korrigera felaktig eller ofullständig information." : "Correct any inaccurate or incomplete information."}</li>
                <li>{language === "sv" ? "Begära radering av dina personuppgifter." : "Request deletion of your personal data."}</li>
                <li>{language === "sv" ? "Återkalla ditt samtycke när som helst." : "Withdraw your consent at any time."}</li>
                <li>{language === "sv" ? "Begära överföring av dina uppgifter till en annan tjänsteleverantör (dataportabilitet)." : "Request the transfer of your data to another service provider (data portability)."}</li>
              </ul>
              <p>{language === "sv" ? "Om du har några frågor angående dina uppgifter, vänligen kontakta oss på contact@nowintown.se." : "If you have any questions regarding your data, please contact us at contact@nowintown.se."}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground">7. {language === "sv" ? "Immateriella Rättigheter" : "Intellectual Property"}</h2>
              <p>
                {language === "sv"
                  ? "Allt innehåll på NowInTown, inklusive text, bilder, logotyper och evenemangsbeskrivningar, tillhör NowInTown eller dess licensgivare. Du får inte använda, reproducera eller distribuera något av detta innehåll utan föregående skriftligt samtycke från oss, förutom vad som är tillåtet för personlig, icke-kommersiell användning."
                  : "All content on NowInTown, including text, images, logos, and event descriptions, is the property of NowInTown or its licensors. You may not use, reproduce, or distribute any of this content without prior written consent from us, except as permitted for personal, non-commercial use."}
              </p>
              <p>
                {language === "sv"
                  ? "Du behåller upphovsrätten till allt innehåll du laddar upp (t.ex. evenemangsfoton, videor), men genom att skicka in innehåll till NowInTown ger du oss en världsomspännande, royaltyfri och icke-exklusiv licens att visa och distribuera det som en del av våra Tjänster."
                  : "You retain the copyright to any content you upload (e.g., event photos, videos), but by submitting content to NowInTown, you grant us a worldwide, royalty-free, and non-exclusive license to display and distribute it as part of our Services."}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground">8. {language === "sv" ? "Ansvarsbegränsning" : "Limitation of Liability"}</h2>
              <p>
                {language === "sv"
                  ? "NowInTown strävar efter att tillhandahålla korrekta och tillförlitliga tjänster. Vi garanterar dock inte att vår webbplats alltid kommer att vara tillgänglig, felfri eller säker. Vårt ansvar är begränsat så långt som är tillåtet enligt svensk lag."
                  : "NowInTown strives to provide accurate and reliable services. However, we do not guarantee that our website will always be available, error-free, or secure. Our liability is limited as far as permissible under Swedish law."}
              </p>
              <p>
                {language === "sv"
                  ? "Vi ansvarar inte för några indirekta, tillfälliga, särskilda eller följdskador som uppstår till följd av din användning av webbplatsen eller Tjänsterna."
                  : "We are not responsible for any indirect, incidental, special, or consequential damages arising from your use of the website or Services."}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground">9. {language === "sv" ? "Evenemangsavbokningar och Återbetalningar" : "Event Cancellations and Refunds"}</h2>
              <p>
                {language === "sv"
                  ? "Vid evenemangsavbokningar eller ändringar gäller evenemangsarrangörens villkor. NowInTown ansvarar inte för återbetalningar om inte evenemangsarrangören uttryckligen erbjuder dem via plattformen."
                  : "In the case of event cancellations or changes, the event organizer's terms will apply. NowInTown is not responsible for refunds unless the event organizer explicitly offers them through the platform."}
              </p>
              <p>
                {language === "sv"
                  ? "För eventuella tvister angående evenemangsavbokningar rekommenderar vi att du kontaktar evenemangsarrangören direkt."
                  : "For any disputes regarding event cancellations, we recommend contacting the event organizer directly."}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground">10. {language === "sv" ? "Konsumentskydd" : "Consumer Protection"}</h2>
              <p>
                {language === "sv"
                  ? "Enligt svensk konsumentskyddslag har konsumenter särskilda rättigheter, såsom rätten att avbryta vissa transaktioner inom en bestämd period. Observera dock att för evenemangsbiljetter kan dessa rättigheter vara begränsade, särskilt när evenemangsdatumet är nära förestående."
                  : "Under Swedish consumer protection laws, consumers have specific rights, such as the right to cancel certain transactions within a set period. However, please note that for event tickets, these rights may be limited, especially when the event date is imminent."}
              </p>
              <p>
                {language === "sv"
                  ? "För mer information om dina konsumenträttigheter, besök Konsumentverkets webbplats på www.konsumentverket.se."
                  : "For more details on your consumer rights, please visit the Swedish Consumer Agency's website at www.konsumentverket.se."}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground">11. {language === "sv" ? "Ändringar av Villkor" : "Changes to Terms"}</h2>
              <p>
                {language === "sv"
                  ? "Vi kan uppdatera dessa Villkor då och då. Eventuella uppdateringar kommer att publiceras på denna sida, och ändringarna träder i kraft när de publiceras. Det är ditt ansvar att regelbundet granska dessa villkor."
                  : "We may update these Terms and Conditions from time to time. Any updates will be posted on this page, and the changes will become effective once they are posted. It is your responsibility to review these terms periodically."}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground">12. {language === "sv" ? "Tillämplig Lag och Jurisdiktion" : "Governing Law and Jurisdiction"}</h2>
              <p>
                {language === "sv"
                  ? "Dessa Villkor ska styras av svensk lag. Eventuella tvister som uppstår från dessa Villkor ska omfattas av exklusiv jurisdiktion för domstolarna i Sverige."
                  : "These Terms and Conditions shall be governed by Swedish law. Any disputes arising from these Terms will be subject to the exclusive jurisdiction of the courts in Sweden."}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground">13. {language === "sv" ? "Kontaktinformation" : "Contact Information"}</h2>
              <p>
                {language === "sv"
                  ? "Om du har några frågor eller funderingar om dessa Villkor, eller behöver kontakta oss av någon anledning, vänligen kontakta:"
                  : "If you have any questions or concerns about these Terms and Conditions, or need to contact us for any reason, please reach out to:"}
              </p>
              <ul className="list-none space-y-2">
                <li><strong>Email:</strong> <a href="mailto:contact@nowintown.se" className="text-primary hover:underline">contact@nowintown.se</a></li>
                <li><strong>{language === "sv" ? "Telefon" : "Phone"}:</strong> <a href="tel:+46705430505" className="text-primary hover:underline">+46 70 543 05 05</a></li>
                <li><strong>{language === "sv" ? "Adress" : "Address"}:</strong> Uppsala, Sweden</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground">14. {language === "sv" ? "Fullständigt Avtal" : "Entire Agreement"}</h2>
              <p>
                {language === "sv"
                  ? "Dessa Villkor utgör, tillsammans med vår Integritetspolicy, det fullständiga avtalet mellan dig och NowInTown avseende din användning av webbplatsen och Tjänsterna."
                  : "These Terms and Conditions, together with our Privacy Policy, form the complete agreement between you and NowInTown regarding your use of the website and Services."}
              </p>
            </section>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default TermsConditions;
