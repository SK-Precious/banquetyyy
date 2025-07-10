import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SimplifiedLogin } from "@/components/SimplifiedLogin";
import { SimplifiedDashboard } from "@/components/SimplifiedDashboard";
import { AdminDashboard } from "@/components/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [currentUser, setCurrentUser] = useState<{code: string, name: string, isAdmin: boolean} | null>(null);

  const handleLogin = (code: string, name: string) => {
    setCurrentUser({
      code,
      name,
      isAdmin: code === '000'
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/" 
              element={
                currentUser ? (
                  currentUser.isAdmin ? (
                    <AdminDashboard user={currentUser} onLogout={handleLogout} />
                  ) : (
                    <SimplifiedDashboard user={currentUser} onLogout={handleLogout} />
                  )
                ) : (
                  <SimplifiedLogin onLogin={handleLogin} />
                )
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
