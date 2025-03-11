
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { 
  BarChart, 
  Building, 
  Calendar, 
  ClipboardCheck, 
  FileText, 
  Home, 
  LogOut, 
  MapPin, 
  Menu, 
  Settings, 
  Shield, 
  Users, 
  X 
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  role: "admin" | "inspector" | "owner";
}

interface SidebarNavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  activePath?: string;
}

export function Sidebar({ role }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const { signOut } = useAuth();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  
  // Define navigation items based on user role
  const navItems: Record<string, SidebarNavItem[]> = {
    admin: [
      { title: "Dashboard", href: "/dashboard/admin", icon: Home, activePath: "/dashboard/admin" },
      { title: "Users", href: "/dashboard/admin/users", icon: Users, activePath: "/dashboard/admin/users" },
      { title: "Establishments", href: "/dashboard/admin/establishments", icon: Building, activePath: "/dashboard/admin/establishments" },
      { title: "Applications", href: "/dashboard/admin/applications", icon: FileText, activePath: "/dashboard/admin/applications" },
      { title: "Analytics", href: "/dashboard/admin/analytics", icon: BarChart, activePath: "/dashboard/admin/analytics" },
      { title: "Calendar", href: "/dashboard/admin/calendar", icon: Calendar, activePath: "/dashboard/admin/calendar" },
      { title: "Map", href: "/dashboard/admin/map", icon: MapPin, activePath: "/dashboard/admin/map" },
      { title: "Settings", href: "/dashboard/admin/settings", icon: Settings, activePath: "/dashboard/admin/settings" },
    ],
    inspector: [
      { title: "Dashboard", href: "/dashboard/inspector", icon: Home, activePath: "/dashboard/inspector" },
      { title: "Inspections", href: "/dashboard/inspector/inspections", icon: ClipboardCheck, activePath: "/dashboard/inspector/inspections" },
      { title: "Analytics", href: "/dashboard/inspector/analytics", icon: BarChart, activePath: "/dashboard/inspector/analytics" },
      { title: "Calendar", href: "/dashboard/inspector/calendar", icon: Calendar, activePath: "/dashboard/inspector/calendar" },
      { title: "Map", href: "/dashboard/inspector/map", icon: MapPin, activePath: "/dashboard/inspector/map" },
      { title: "Settings", href: "/dashboard/inspector/settings", icon: Settings, activePath: "/dashboard/inspector/settings" },
    ],
    owner: [
      { title: "Dashboard", href: "/dashboard/owner", icon: Home, activePath: "/dashboard/owner" },
      { title: "My Establishments", href: "/dashboard/owner/establishments", icon: Building, activePath: "/dashboard/owner/establishments" },
      { title: "Applications", href: "/dashboard/owner/applications", icon: FileText, activePath: "/dashboard/owner/applications" },
      { title: "Analytics", href: "/dashboard/owner/analytics", icon: BarChart, activePath: "/dashboard/owner/analytics" },
      { title: "Calendar", href: "/dashboard/owner/calendar", icon: Calendar, activePath: "/dashboard/owner/calendar" },
      { title: "Map", href: "/dashboard/owner/map", icon: MapPin, activePath: "/dashboard/owner/map" },
      { title: "Settings", href: "/dashboard/owner/settings", icon: Settings, activePath: "/dashboard/owner/settings" },
    ],
  };
  
  const items = navItems[role] || [];

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={toggleSidebar}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>
      
      <aside
        className={cn(
          "flex flex-col h-screen bg-white border-r transition-all duration-300 fixed md:sticky top-0 left-0 z-40",
          isOpen ? "w-64" : "w-0 md:w-16 overflow-hidden"
        )}
      >
        <div className={cn("flex items-center h-14 px-4 border-b", isOpen ? "justify-between" : "justify-center")}>
          {isOpen ? (
            <>
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-fire" />
                <span className="font-bold">FireInspect</span>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:flex"
                onClick={toggleSidebar}
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex"
              onClick={toggleSidebar}
            >
              <Menu className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="flex-1 py-4 overflow-y-auto">
          <nav className="px-2 space-y-1">
            {items.map((item) => {
              const isActive = location.pathname === item.href || 
                              (item.activePath && location.pathname.startsWith(item.activePath));
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-fire/10 text-fire"
                      : "text-gray-700 hover:bg-gray-100",
                    !isOpen && "justify-center"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", isActive ? "text-fire" : "text-gray-500")} />
                  {isOpen && <span className="ml-3">{item.title}</span>}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className={cn("p-4 border-t", !isOpen && "flex justify-center")}>
          <Button
            variant="ghost"
            className={cn(
              "w-full text-gray-700 hover:bg-gray-100",
              !isOpen && "px-2 justify-center"
            )}
            onClick={signOut}
          >
            <LogOut className="h-5 w-5 text-gray-500" />
            {isOpen && <span className="ml-3">Logout</span>}
          </Button>
        </div>
      </aside>
    </>
  );
}
