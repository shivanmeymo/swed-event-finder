import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CreateEvent from "./pages/CreateEvent";
import ManageEvent from "./pages/ManageEvent";
import EventDetail from "./pages/EventDetail";
import Contact from "./pages/Contact";
import DataIntegrity from "./pages/DataIntegrity";
import AboutUs from "./pages/AboutUs";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/AdminDashboard";
import EventApproved from "./pages/EventApproved";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import TermsConditions from "./pages/TermsConditions";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/create" element={<CreateEvent />} />
        <Route path="/manage" element={<ManageEvent />} />
        <Route path="/event/:id" element={<EventDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/data-integrity" element={<DataIntegrity />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/event-approved" element={<EventApproved />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/terms" element={<TermsConditions />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
