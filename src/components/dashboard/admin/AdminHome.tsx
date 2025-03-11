
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, FileText, Users, AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface Inspector {
  id: string;
  first_name: string;
  last_name: string;
}

interface Establishment {
  id: string;
  name: string;
}

interface Application {
  id: string;
  establishment_id: string;
  establishment: Establishment;
  application_type: "fsec" | "fsic_occupancy" | "fsic_business";
  status: "pending" | "for-inspection" | "inspected" | "approved" | "rejected";
  application_date: string;
  application_time: string;
  created_at: string;
  inspector_id?: string;
  inspector?: Inspector;
  inspection_date?: string;
  priority?: boolean;
}

const AdminHome = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    registeredEstablishments: 0,
    pendingApplications: 0,
    requireAttention: 0,
  });
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [upcomingInspections, setUpcomingInspections] = useState<Application[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Mock data for demonstration
      // In a real app, this would come from Supabase
      
      // Mock stats
      const mockStats = {
        totalUsers: 245,
        registeredEstablishments: 178,
        pendingApplications: 32,
        requireAttention: 8,
      };
      setStats(mockStats);

      // Mock recent applications
      const mockRecentApplications: Application[] = [
        {
          id: "1",
          establishment_id: "1",
          establishment: { id: "1", name: "ABC Restaurant" },
          application_type: "fsec",
          status: "pending",
          application_date: "2023-06-15",
          application_time: "10:30",
          created_at: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        },
        {
          id: "2",
          establishment_id: "2",
          establishment: { id: "2", name: "XYZ Mall" },
          application_type: "fsic_occupancy",
          status: "for-inspection",
          application_date: "2023-06-14",
          application_time: "14:30",
          created_at: new Date(Date.now() - 14400000).toISOString(), // 4 hours ago
          inspector_id: "1",
          inspector: { id: "1", first_name: "Jane", last_name: "Smith" },
          inspection_date: "2023-06-21",
        },
        {
          id: "3",
          establishment_id: "3",
          establishment: { id: "3", name: "Grand Hotel" },
          application_type: "fsic_business",
          status: "inspected",
          application_date: "2023-06-13",
          application_time: "09:00",
          created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          inspector_id: "2",
          inspector: { id: "2", first_name: "John", last_name: "Doe" },
          inspection_date: "2023-06-20",
        },
      ];
      setRecentApplications(mockRecentApplications);

      // Mock upcoming inspections
      const mockUpcomingInspections: Application[] = [
        {
          id: "2",
          establishment_id: "2",
          establishment: { id: "2", name: "XYZ Mall" },
          application_type: "fsic_occupancy",
          status: "for-inspection",
          application_date: "2023-06-14",
          application_time: "14:30",
          created_at: new Date(Date.now() - 14400000).toISOString(),
          inspector_id: "1",
          inspector: { id: "1", first_name: "Jane", last_name: "Smith" },
          inspection_date: "2023-06-21",
        },
        {
          id: "4",
          establishment_id: "1",
          establishment: { id: "1", name: "ABC Restaurant" },
          application_type: "fsic_business",
          status: "for-inspection",
          application_date: "2023-06-16",
          application_time: "10:00",
          created_at: new Date(Date.now() - 172800000).toISOString(),
          inspector_id: "1",
          inspector: { id: "1", first_name: "Jane", last_name: "Smith" },
          inspection_date: "2023-06-22",
          priority: true,
        },
        {
          id: "5",
          establishment_id: "3",
          establishment: { id: "3", name: "Grand Hotel" },
          application_type: "fsic_occupancy",
          status: "for-inspection",
          application_date: "2023-06-17",
          application_time: "09:00",
          created_at: new Date(Date.now() - 259200000).toISOString(),
          inspector_id: "2",
          inspector: { id: "2", first_name: "John", last_name: "Doe" },
          inspection_date: "2023-06-23",
        },
      ];
      setUpcomingInspections(mockUpcomingInspections);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
  };

  const formatInspectionDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Get day of week abbreviation
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayName = days[date.getDay()];
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return dayName;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome to the FireInspect admin dashboard.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
              +12% from last month
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
              +5% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Applications
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApplications}</div>
            <p className="text-xs text-muted-foreground">
              -2% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Requiring Attention
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-fire" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.requireAttention}</div>
            <p className="text-xs text-fire">
              +3 from yesterday
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>
              Latest applications submitted for approval
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentApplications.map(app => (
                <div key={app.id} className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    app.status === 'pending' ? 'bg-yellow-500' :
                    app.status === 'for-inspection' ? 'bg-blue-500' :
                    app.status === 'inspected' ? 'bg-purple-500' :
                    app.status === 'approved' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{app.establishment.name} - {
                      app.application_type === 'fsec' ? 'FSEC Application' :
                      app.application_type === 'fsic_occupancy' ? 'FSIC (Occupancy)' : 'FSIC (Business)'
                    }</p>
                    <p className="text-xs text-muted-foreground">Submitted {getTimeAgo(app.created_at)}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">{
                    app.status === 'pending' ? 'Pending Review' :
                    app.status === 'for-inspection' ? 'Inspector Assigned' :
                    app.status === 'inspected' ? 'Inspection Complete' :
                    app.status === 'approved' ? 'Approved' : 'Rejected'
                  }</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Inspections</CardTitle>
            <CardDescription>
              Scheduled inspections for this week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingInspections.map(inspection => (
                <div key={inspection.id} className={`border-l-2 pl-3 ${
                  inspection.priority ? 'border-fire' : 'border-blue-500'
                }`}>
                  <p className="text-sm font-medium">
                    {inspection.establishment.name}
                    {inspection.priority && <span className="ml-2 text-fire text-xs">★ Priority</span>}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatInspectionDate(inspection.inspection_date || '')}, {inspection.application_time}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Inspector: {inspection.inspector?.first_name} {inspection.inspector?.last_name}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminHome;
