import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { EmployeeLogin } from "@/components/EmployeeLogin";
import { EmployeeDashboard } from "@/components/EmployeeDashboard";

const queryClient = new QueryClient();

const App = () => {
  const [employeeCode, setEmployeeCode] = useState<string | null>(null);
  const [showManagerPortal, setShowManagerPortal] = useState(false);

  const handleEmployeeLogin = (code: string) => {
    setEmployeeCode(code);
  };

  const handleEmployeeLogout = () => {
    setEmployeeCode(null);
  };

  const handleShowManagerPortal = () => {
    setShowManagerPortal(true);
  };

  const handleHideManagerPortal = () => {
    setShowManagerPortal(false);
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
                employeeCode ? (
                  <EmployeeDashboard 
                    employeeCode={employeeCode} 
                    onLogout={handleEmployeeLogout} 
                  />
                ) : showManagerPortal ? (
                  <Index onBackToEmployeePortal={handleHideManagerPortal} />
                ) : (
                  <EmployeeLogin onLogin={handleEmployeeLogin} />
                )
              } 
            />
            <Route 
              path="/manager" 
              element={<Index onBackToEmployeePortal={handleHideManagerPortal} />} 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
