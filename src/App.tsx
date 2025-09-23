import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/theme/ThemeContext";
import Index from "./pages/Index";
import Play from "./pages/Play";
import HowToPlay from "./pages/HowToPlay";
import Leaderboard from "./pages/Leaderboard";
import NotFound from "./pages/NotFound";
import Theme from "./pages/Theme";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/how-to-play" element={<HowToPlay />} />
            <Route path="/play" element={<Play />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/theme" element={<Theme />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
