import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WagmiProvider } from "@/components/WagmiProvider";
import Index from "./pages/Index";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Pars from "./pages/Pars";
import Dao from "./pages/Dao";
import CyrusToken from "./pages/Cyrus";
import NotFound from "./pages/NotFound";

// Use base path from Vite config for GitHub Pages
const basename = import.meta.env.BASE_URL || '/';

const App = () => (
  <WagmiProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={basename}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/pars" element={<Pars />} />
          <Route path="/dao" element={<Dao />} />
          <Route path="/cyrus" element={<CyrusToken />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </WagmiProvider>
);

export default App;
