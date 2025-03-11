
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Route, Routes } from "react-router-dom";
import { Toaster as ShadcnToaster } from "@/components/ui/sonner";

// Inspector Dashboard Pages
import InspectorHome from "@/components/dashboard/inspector/InspectorHome";
import InspectorInspections from "@/components/dashboard/inspector/InspectorInspections";
import InspectorSettings from "@/components/dashboard/inspector/InspectorSettings";

// Shared components
import Analytics from "@/components/dashboard/Analytics";
import Calendar from "@/components/dashboard/Calendar";
import Map from "@/components/dashboard/Map";

const InspectorDashboard = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar role="inspector" />
      <main className="flex-1 overflow-y-auto">
        <ShadcnToaster position="top-center" />
        <div className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<InspectorHome />} />
            <Route path="/inspections/*" element={<InspectorInspections />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/map" element={<Map />} />
            <Route path="/settings" element={<InspectorSettings />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default InspectorDashboard;
