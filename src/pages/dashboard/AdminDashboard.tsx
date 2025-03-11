
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Route, Routes } from "react-router-dom";
import { Toaster as ShadcnToaster } from "@/components/ui/sonner";

// Admin Dashboard Pages
import AdminHome from "@/components/dashboard/admin/AdminHome";
import AdminUsers from "@/components/dashboard/admin/AdminUsers";
import AdminEstablishments from "@/components/dashboard/admin/AdminEstablishments";
import AdminApplications from "@/components/dashboard/admin/AdminApplications";
import AdminSettings from "@/components/dashboard/admin/AdminSettings";

// Placeholder components for routes we'll implement later
const Analytics = () => <div className="p-6">Analytics (Coming Soon)</div>;
const Calendar = () => <div className="p-6">Calendar (Coming Soon)</div>;
const Map = () => <div className="p-6">Map (Coming Soon)</div>;

const AdminDashboard = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar role="admin" />
      <main className="flex-1 overflow-y-auto">
        <ShadcnToaster position="top-center" />
        <div className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<AdminHome />} />
            <Route path="/users/*" element={<AdminUsers />} />
            <Route path="/establishments/*" element={<AdminEstablishments />} />
            <Route path="/applications/*" element={<AdminApplications />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/map" element={<Map />} />
            <Route path="/settings" element={<AdminSettings />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
