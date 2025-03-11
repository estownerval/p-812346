
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, profile, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-fire" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (!user) {
    // Redirect to appropriate login page based on current path
    if (location.pathname.includes('/dashboard/admin')) {
      return <Navigate to="/login/admin" state={{ from: location }} replace />;
    } else if (location.pathname.includes('/dashboard/inspector')) {
      return <Navigate to="/login/inspector" state={{ from: location }} replace />;
    } else {
      return <Navigate to="/login/owner" state={{ from: location }} replace />;
    }
  }

  // Role-based access control
  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    // Redirect to appropriate dashboard based on role
    if (profile.role === 'admin') {
      return <Navigate to="/dashboard/admin" replace />;
    } else if (profile.role === 'inspector') {
      return <Navigate to="/dashboard/inspector" replace />;
    } else {
      return <Navigate to="/dashboard/owner" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
