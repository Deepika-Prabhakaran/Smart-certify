import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import RequestCertificate from "./pages/RequestCertificate";
import StatusTracker from "./pages/StatusTracker";
import StudentStatusTracker from "./pages/StudentStatusTracker";
import AdminDashboard from "./pages/AdminDashboard";
import StudentSignIn from "./pages/StudentSignIn";
import StudentSignUp from "./pages/StudentSignUp";
import AdminSignIn from "./pages/AdminSignIn";
import AdminSignUp from "./pages/AdminSignUp";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/student-signin" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/student-signin" element={<StudentSignIn />} />
          <Route path="/student-signup" element={<StudentSignUp />} />
          <Route path="/admin-signin" element={<AdminSignIn />} />
          <Route path="/admin-signup" element={<AdminSignUp />} />
          <Route path="/request-certificate" element={<RequestCertificate />} />
          <Route path="/status-tracker" element={<StatusTracker />} />
          <Route path="/student-status-tracker" element={<StudentStatusTracker />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
