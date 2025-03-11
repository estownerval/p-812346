
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Route, Routes } from "react-router-dom";
import { Toaster as ShadcnToaster } from "@/components/ui/sonner";

// Owner Dashboard Pages
import OwnerHome from "@/components/dashboard/owner/OwnerHome";
import OwnerEstablishments from "@/components/dashboard/owner/OwnerEstablishments";
import OwnerApplications from "@/components/dashboard/owner/OwnerApplications";
import OwnerSettings from "@/components/dashboard/owner/OwnerSettings";

// Shared components
import Analytics from "@/components/dashboard/Analytics";
import Calendar from "@/components/dashboard/Calendar";
import Map from "@/components/dashboard/Map";

const OwnerDashboard = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar role="owner" />
      <main className="flex-1 overflow-y-auto">
        <ShadcnToaster position="top-center" />
        <div className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<OwnerHome />} />
            <Route path="/establishments/*" element={<OwnerEstablishments />} />
            <Route path="/applications/*" element={<OwnerApplications />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/map" element={<Map />} />
            <Route path="/settings" element={<OwnerSettings />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default OwnerDashboard;
