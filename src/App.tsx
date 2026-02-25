import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProgressProvider } from "@/contexts/ProgressContext";
import { UserProvider, useUser } from "@/contexts/UserContext";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Lesson from "@/pages/Lesson";
import Onboarding from "@/pages/Onboarding";
import VocabView from "@/pages/VocabView";
import GrammarView from "@/pages/GrammarView";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { hasCompletedOnboarding } = useUser();

  if (!hasCompletedOnboarding) {
    return (
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/lesson/:topicId" element={<Lesson />} />
        <Route path="/vocabulary" element={<VocabView />} />
        <Route path="/grammar" element={<GrammarView />} />
        <Route path="/onboarding" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <UserProvider>
        <ProgressProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ProgressProvider>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
