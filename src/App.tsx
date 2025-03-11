
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/auth/AdminLogin";
import InspectorLogin from "./pages/auth/InspectorLogin";
import OwnerLogin from "./pages/auth/OwnerLogin";
import OwnerSignup from "./pages/auth/OwnerSignup";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import InspectorDashboard from "./pages/dashboard/InspectorDashboard";
import OwnerDashboard from "./pages/dashboard/OwnerDashboard";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login/admin" element={<AdminLogin />} />
            <Route path="/login/inspector" element={<InspectorLogin />} />
            <Route path="/login/owner" element={<OwnerLogin />} />
            <Route path="/signup/owner" element={<OwnerSignup />} />
            <Route path="/dashboard/admin/*" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/inspector/*" element={
              <ProtectedRoute allowedRoles={['inspector']}>
                <InspectorDashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/owner/*" element={
              <ProtectedRoute allowedRoles={['owner']}>
                <OwnerDashboard />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
