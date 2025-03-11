
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Calendar, CheckCircle, FilePlus, Users, Building, AlertCircle, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DashboardStats {
  totalUsers: number;
  totalInspectors: number;
  totalOwners: number;
  registeredEstablishments: number;
  pendingApplications: number;
  upcomingInspections: number;
}

interface Application {
  id: string;
  application_type: string;
  status: string;
  application_date: string;
  application_time: string;
  inspection_date: string | null;
  inspection_time: string | null;
  establishment: {
    name: string;
    dti_number: string;
  } | null;
  inspector: {
    first_name: string;
    last_name: string;
  } | null;
}

const AdminHome = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalInspectors: 0,
    totalOwners: 0,
    registeredEstablishments: 0,
    pendingApplications: 0,
    upcomingInspections: 0
  });
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [upcomingInspections, setUpcomingInspections] = useState<Application[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch user counts
      const { count: totalUsers, error: usersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      if (usersError) throw usersError;

      // Fetch inspector count
      const { count: totalInspectors, error: inspectorsError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'inspector');
      
      if (inspectorsError) throw inspectorsError;

      // Fetch owner count
      const { count: totalOwners, error: ownersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'owner');
      
      if (ownersError) throw ownersError;

      // Fetch registered establishments count
      const { count: registeredEstablishments, error: establishmentsError } = await supabase
        .from('establishments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'registered');
      
      if (establishmentsError) throw establishmentsError;

      // Fetch pending applications count
      const { count: pendingApplications, error: applicationsError } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
      
      if (applicationsError) throw applicationsError;

      // Fetch upcoming inspections count (applications with status for_inspection and future inspection date)
      const today = new Date().toISOString().split('T')[0];
      const { count: upcomingInspections, error: inspectionsError } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'for_inspection')
        .gte('inspection_date', today);
      
      if (inspectionsError) throw inspectionsError;

      // Set stats
      setStats({
        totalUsers: totalUsers || 0,
        totalInspectors: totalInspectors || 0,
        totalOwners: totalOwners || 0,
        registeredEstablishments: registeredEstablishments || 0,
        pendingApplications: pendingApplications || 0,
        upcomingInspections: upcomingInspections || 0
      });

      // Fetch recent applications
      const { data: recentApps, error: recentAppsError } = await supabase
        .from('applications')
        .select(`
          *,
          establishment:establishments(name, dti_number),
          inspector:profiles(first_name, last_name)
        `)
        .order('application_date', { ascending: false })
        .limit(5);
      
      if (recentAppsError) throw recentAppsError;
      
      // Process data to ensure it matches our Application type
      const processedRecentApps: Application[] = recentApps?.map(app => ({
        ...app,
        establishment: app.establishment && typeof app.establishment !== 'string' ? app.establishment : null,
        inspector: app.inspector && typeof app.inspector !== 'string' ? app.inspector : null
      })) || [];
      
      setRecentApplications(processedRecentApps);

      // Fetch upcoming inspections
      const { data: upcomingInspectionsData, error: upcomingInspectionsError } = await supabase
        .from('applications')
        .select(`
          *,
          establishment:establishments(name, dti_number),
          inspector:profiles(first_name, last_name)
        `)
        .eq('status', 'for_inspection')
        .gte('inspection_date', today)
        .order('inspection_date', { ascending: true })
        .limit(5);
      
      if (upcomingInspectionsError) throw upcomingInspectionsError;
      
      // Process data to ensure it matches our Application type
      const processedUpcomingInspections: Application[] = upcomingInspectionsData?.map(app => ({
        ...app,
        establishment: app.establishment && typeof app.establishment !== 'string' ? app.establishment : null,
        inspector: app.inspector && typeof app.inspector !== 'string' ? app.inspector : null
      })) || [];
      
      setUpcomingInspections(processedUpcomingInspections);

    } catch (error: any) {
      console.error("Error fetching dashboard data:", error);
      toast.error(`Failed to load dashboard data: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        <p className="text-muted-foreground mt-2">
          Welcome to the admin dashboard. Monitor system activities and manage users.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalInspectors} inspectors, {stats.totalOwners} owners
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Registered Establishments
            </CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.registeredEstablishments}</div>
            <p className="text-xs text-muted-foreground">
              Approved business establishments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Applications
            </CardTitle>
            <FilePlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApplications}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting review and approval
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Inspections
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingInspections}</div>
            <p className="text-xs text-muted-foreground">
              Scheduled for inspection
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Analytics Summary
            </CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">View</div>
            <p className="text-xs text-muted-foreground">
              Performance metrics and trends
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              System Status
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Operational</div>
            <p className="text-xs text-muted-foreground">
              All systems running normally
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Link to="/dashboard/admin/users">
          <Button className="w-full bg-primary">
            <Users className="mr-2 h-4 w-4" />
            Manage Users
          </Button>
        </Link>
        <Link to="/dashboard/admin/establishments">
          <Button className="w-full bg-secondary text-secondary-foreground">
            <Building className="mr-2 h-4 w-4" />
            View Establishments
          </Button>
        </Link>
        <Link to="/dashboard/admin/applications">
          <Button className="w-full bg-accent text-accent-foreground">
            <FilePlus className="mr-2 h-4 w-4" />
            Review Applications
          </Button>
        </Link>
        <Link to="/dashboard/admin/analytics">
          <Button className="w-full bg-muted text-muted-foreground">
            <BarChart className="mr-2 h-4 w-4" />
            View Analytics
          </Button>
        </Link>
      </div>

      {/* Recent Applications */}
      <div>
        <h3 className="text-lg font-medium mb-4">Recent Applications</h3>
        <Card>
          <CardContent className="p-0">
            <div className="rounded-md border">
              <table className="w-full caption-bottom text-sm">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="h-12 px-4 text-left align-middle font-medium">Type</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Establishment</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentApplications.length > 0 ? (
                    recentApplications.map((app) => (
                      <tr key={app.id} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle">{app.application_type.toUpperCase()}</td>
                        <td className="p-4 align-middle">{app.establishment?.name || "Unknown"}</td>
                        <td className="p-4 align-middle">
                          {new Date(app.application_date).toLocaleDateString()}
                        </td>
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
                            <Link to={`/dashboard/admin/applications/${app.id}`}>View</Link>
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-muted-foreground">
                        No recent applications found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Inspections */}
      <div>
        <h3 className="text-lg font-medium mb-4">Upcoming Inspections</h3>
        <Card>
          <CardContent className="p-0">
            <div className="rounded-md border">
              <table className="w-full caption-bottom text-sm">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="h-12 px-4 text-left align-middle font-medium">Establishment</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Time</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Type</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Inspector</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingInspections.length > 0 ? (
                    upcomingInspections.map((app) => (
                      <tr key={app.id} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle">{app.establishment?.name || "Unknown"}</td>
                        <td className="p-4 align-middle">
                          {app.inspection_date ? new Date(app.inspection_date).toLocaleDateString() : "Not set"}
                        </td>
                        <td className="p-4 align-middle">{app.inspection_time || "Not set"}</td>
                        <td className="p-4 align-middle">{app.application_type.toUpperCase()}</td>
                        <td className="p-4 align-middle">
                          {app.inspector 
                            ? `${app.inspector.first_name} ${app.inspector.last_name}` 
                            : "Not assigned"}
                        </td>
                        <td className="p-4 align-middle">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/dashboard/admin/applications/${app.id}`}>View</Link>
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-muted-foreground">
                        No upcoming inspections found
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

export default AdminHome;
