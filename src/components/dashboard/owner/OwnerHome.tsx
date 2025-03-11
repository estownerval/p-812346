import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, FileText, AlertCircle, Plus, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Establishment {
  id: string;
  name: string;
  dti_number: string;
  status: "registered" | "unregistered" | "rejected";
  address?: string;
}

interface Application {
  id: string;
  establishment_id: string;
  application_type: string;
  status: string;
  application_date: string;
  application_time: string;
  inspector_id?: string;
  inspection_date?: string;
  inspection_time?: string;
  rejection_reason?: string;
  priority?: boolean;
  establishment?: Establishment;
}

const OwnerHome = () => {
  const { getEstablishments, getApplications } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState([
    { title: "Registered Establishments", value: 0, icon: Building, change: "0 establishments" },
    { title: "Applications", value: 0, icon: FileText, change: "No applications" },
    { title: "Requiring Attention", value: 0, icon: AlertCircle, change: "No issues", urgent: false },
  ]);
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const establishmentsData = await getEstablishments();
      setEstablishments(establishmentsData);
      
      const applicationsData = await getApplications();
      
      const processedApplications = applicationsData.map(app => ({
        ...app
      }));
      
      setApplications(processedApplications);
      
      const registeredCount = establishmentsData.filter(est => est.status === "registered").length;
      const unregisteredCount = establishmentsData.filter(est => est.status === "unregistered").length;
      
      const pendingApps = applicationsData.filter(app => app.status === "pending").length;
      const approvedApps = applicationsData.filter(app => app.status === "approved").length;
      const rejectedApps = applicationsData.filter(app => app.status === "rejected").length;
      const forInspectionApps = applicationsData.filter(app => app.status === "for_inspection").length;
      
      const requireAttention = rejectedApps + unregisteredCount;
      
      setStats([
        { 
          title: "Registered Establishments", 
          value: registeredCount, 
          icon: Building, 
          change: `${registeredCount} registered, ${unregisteredCount} unregistered` 
        },
        { 
          title: "Applications", 
          value: applicationsData.length, 
          icon: FileText, 
          change: `${pendingApps} pending, ${approvedApps} approved, ${forInspectionApps} for inspection` 
        },
        { 
          title: "Requiring Attention", 
          value: requireAttention, 
          icon: AlertCircle, 
          change: requireAttention > 0 ? "Action needed" : "No issues", 
          urgent: requireAttention > 0 
        },
      ]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-fire" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome to your establishment owner dashboard.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.urgent ? "text-fire" : "text-muted-foreground"}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${stat.urgent ? "text-fire" : "text-muted-foreground"}`}>
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">My Establishments</h3>
          <Link to="/dashboard/owner/establishments/add">
            <Button className="bg-fire hover:bg-fire/90" size="sm">
              <Plus className="mr-2 h-4 w-4" /> Add Establishment
            </Button>
          </Link>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {establishments.length > 0 ? establishments.map((est) => (
            <Card key={est.id}>
              <CardHeader>
                <CardTitle className="text-xl">{est.name}</CardTitle>
                <CardDescription>DTI: {est.dti_number}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                    est.status === 'registered' 
                      ? 'bg-green-50 text-green-600 border-green-200'
                      : est.status === 'rejected'
                      ? 'bg-red-50 text-red-600 border-red-200'
                      : 'bg-yellow-50 text-yellow-600 border-yellow-200'
                  }`}>
                    {est.status === 'registered' 
                      ? 'Registered' 
                      : est.status === 'rejected'
                      ? 'Registration Rejected'
                      : 'Unregistered'}
                  </span>
                </div>
                {est.address && (
                  <p className="text-xs text-muted-foreground">
                    {est.address}
                  </p>
                )}
                
                {est.status === 'registered' ? (
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/dashboard/owner/establishments/${est.id}`}>
                        View Details
                      </Link>
                    </Button>
                    <Link to={`/dashboard/owner/applications/new/${est.id}`}>
                      <Button className="bg-fire hover:bg-fire/90 w-full" size="sm">
                        Apply for Certification
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Button 
                    className="w-full bg-fire hover:bg-fire/90" 
                    size="sm"
                    asChild
                  >
                    <Link to={`/dashboard/owner/establishments`}>
                      Register Establishment
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          )) : (
            <div className="col-span-full text-center py-12">
              <Building className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-2 text-lg font-medium">No establishments yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Add your first establishment to get started.
              </p>
              <Link to="/dashboard/owner/establishments/add">
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" /> Add Establishment
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Recent Applications</h3>
        
        <Card>
          <CardContent className="p-0">
            <div className="rounded-md border">
              <table className="w-full caption-bottom text-sm">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="h-12 px-4 text-left align-middle font-medium">Application Type</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Establishment</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.length > 0 ? (
                    applications.slice(0, 5).map((app) => (
                      <tr key={app.id} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle">{app.application_type.toUpperCase()}</td>
                        <td className="p-4 align-middle">{app.establishment?.name || "Unknown"}</td>
                        <td className="p-4 align-middle">{new Date(app.application_date).toLocaleDateString()}</td>
                        <td className="p-4 align-middle">
                          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                            app.status === 'approved' 
                              ? 'bg-green-50 text-green-600 border-green-200'
                              : app.status === 'rejected'
                              ? 'bg-red-50 text-red-600 border-red-200'
                              : app.status === 'for_inspection'
                              ? 'bg-blue-50 text-blue-600 border-blue-200'
                              : app.status === 'inspected'
                              ? 'bg-purple-50 text-purple-600 border-purple-200'
                              : 'bg-yellow-50 text-yellow-600 border-yellow-200'
                          }`}>
                            {app.status === 'approved' 
                              ? 'Approved' 
                              : app.status === 'rejected'
                              ? 'Rejected'
                              : app.status === 'for_inspection'
                              ? 'For Inspection'
                              : app.status === 'inspected'
                              ? 'Inspected'
                              : 'Pending'}
                          </span>
                        </td>
                        <td className="p-4 align-middle">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/dashboard/owner/applications/${app.id}`}>
                              View
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-muted-foreground">
                        No applications found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OwnerHome;
