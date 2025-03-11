
import { useEffect, useState } from "react";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Users, Building, FileText, CalendarCheck, Eye, Calendar 
} from "lucide-react";
import { useAuth, Application } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

interface DashboardStats {
  totalUsers: number;
  registeredEstablishments: number;
  pendingApplications: number;
  upcomingInspections: number;
}

interface InspectionAppointment {
  id: string;
  establishment: string;
  inspector: string;
  date: string;
  time: string;
  type: string;
}

const AdminHome = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    registeredEstablishments: 0,
    pendingApplications: 0,
    upcomingInspections: 0
  });
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [upcomingInspections, setUpcomingInspections] = useState<InspectionAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { getApplications, getEstablishments, getOwners, getInspectors } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch real data from Supabase (in a production app)
      // const applications = await getApplications();
      // const establishments = await getEstablishments();
      // const owners = await getOwners();
      // const inspectors = await getInspectors();
      
      // For now, use mock data
      const mockStats: DashboardStats = {
        totalUsers: 42,
        registeredEstablishments: 23,
        pendingApplications: 15,
        upcomingInspections: 7
      };
      setStats(mockStats);
      
      // Mock applications data
      const mockApplications: Application[] = [
        {
          id: "1",
          establishment_id: "1",
          application_type: "fsec",
          status: "pending",
          application_date: "2023-05-15",
          application_time: "10:30 AM",
          inspector_id: undefined,
          inspection_date: undefined,
          inspection_time: undefined,
          rejection_reason: undefined,
          priority: false,
          establishment: {
            id: "1",
            name: "ABC Restaurant",
            dti_number: "DTI-123456",
            status: "registered",
            owner_id: "user-1"
          }
        },
        {
          id: "2",
          establishment_id: "2",
          application_type: "fsic_occupancy",
          status: "for_inspection",
          application_date: "2023-05-14",
          application_time: "2:15 PM",
          inspector_id: "inspector-1",
          inspection_date: "2023-05-20",
          inspection_time: "09:00 AM",
          rejection_reason: undefined,
          priority: true,
          establishment: {
            id: "2",
            name: "XYZ Mall",
            dti_number: "DTI-789012",
            status: "registered",
            owner_id: "user-2"
          },
          inspector: {
            first_name: "Robert",
            last_name: "Chen"
          }
        },
        {
          id: "3",
          establishment_id: "3",
          application_type: "fsic_business",
          status: "inspected",
          application_date: "2023-05-13",
          application_time: "1:30 PM",
          inspector_id: "inspector-2",
          inspection_date: "2023-05-18",
          inspection_time: "02:00 PM",
          rejection_reason: undefined,
          priority: false,
          establishment: {
            id: "3",
            name: "Grand Hotel",
            dti_number: "DTI-345678",
            status: "registered",
            owner_id: "user-3"
          },
          inspector: {
            first_name: "Sarah",
            last_name: "Williams"
          }
        },
        {
          id: "4",
          establishment_id: "4",
          application_type: "fsec",
          status: "rejected",
          application_date: "2023-05-12",
          application_time: "11:45 AM",
          inspector_id: undefined,
          inspection_date: undefined,
          inspection_time: undefined,
          rejection_reason: "Incomplete documentation",
          priority: false,
          establishment: {
            id: "4",
            name: "Office Tower",
            dti_number: "DTI-567890",
            status: "registered",
            owner_id: "user-4"
          }
        },
        {
          id: "5",
          establishment_id: "5",
          application_type: "fsic_business",
          status: "approved",
          application_date: "2023-05-11",
          application_time: "9:00 AM",
          inspector_id: "inspector-1",
          inspection_date: "2023-05-16",
          inspection_time: "10:00 AM",
          rejection_reason: undefined,
          priority: false,
          establishment: {
            id: "5",
            name: "Tech Hub",
            dti_number: "DTI-901234",
            status: "registered",
            owner_id: "user-5"
          },
          inspector: {
            first_name: "Robert",
            last_name: "Chen"
          }
        }
      ];
      
      // Get recent applications (last 5)
      setRecentApplications(mockApplications.slice(0, 5));
      
      // Mock upcoming inspections
      const mockInspections: InspectionAppointment[] = [
        {
          id: "1",
          establishment: "XYZ Mall",
          inspector: "Robert Chen",
          date: "2023-05-20",
          time: "09:00 AM",
          type: "FSIC (Occupancy)"
        },
        {
          id: "2",
          establishment: "Grand Hotel",
          inspector: "Sarah Williams",
          date: "2023-05-18",
          time: "02:00 PM",
          type: "FSIC (Business)"
        },
        {
          id: "3",
          establishment: "City Supermarket",
          inspector: "James Wilson",
          date: "2023-05-22",
          time: "10:30 AM",
          type: "FSIC (Business)"
        },
        {
          id: "4",
          establishment: "Downtown Apartments",
          inspector: "Robert Chen",
          date: "2023-05-23",
          time: "01:00 PM",
          type: "FSIC (Occupancy)"
        }
      ];
      setUpcomingInspections(mockInspections);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get badge color based on status
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'for_inspection':
        return 'warning';
      case 'inspected':
        return 'default';
      case 'approved':
        return 'success';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome to your admin dashboard.
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
              Fire inspectors and business owners
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
              Active business establishments
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
              Applications awaiting review
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Inspections
            </CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingInspections}</div>
            <p className="text-xs text-muted-foreground">
              Scheduled for the next 7 days
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>
              The most recent applications from business owners
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Establishment</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentApplications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">
                      {app.establishment?.name || "Unknown"}
                    </TableCell>
                    <TableCell>
                      {app.application_type === 'fsec' 
                        ? 'FSEC' 
                        : app.application_type === 'fsic_occupancy' 
                        ? 'FSIC (Occupancy)' 
                        : 'FSIC (Business)'}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusBadgeVariant(app.status)}
                        className={app.priority ? "ml-1" : ""}
                      >
                        {app.status === 'pending' 
                          ? 'Pending' 
                          : app.status === 'for_inspection' 
                          ? 'For Inspection' 
                          : app.status === 'inspected'
                          ? 'Inspected'
                          : app.status === 'approved'
                          ? 'Approved'
                          : 'Rejected'}
                        {app.priority && <span className="ml-1">★</span>}
                      </Badge>
                    </TableCell>
                    <TableCell>{app.application_date}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/dashboard/admin/applications/${app.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 flex justify-end">
              <Button asChild variant="outline" size="sm">
                <Link to="/dashboard/admin/applications">
                  View all applications
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Upcoming Inspections</CardTitle>
            <CardDescription>
              Inspections scheduled in the next 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Establishment</TableHead>
                  <TableHead>Inspector</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingInspections.map((inspection) => (
                  <TableRow key={inspection.id}>
                    <TableCell className="font-medium">
                      {inspection.establishment}
                    </TableCell>
                    <TableCell>
                      {inspection.inspector}
                    </TableCell>
                    <TableCell>
                      {inspection.date} at {inspection.time}
                    </TableCell>
                    <TableCell>{inspection.type}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        Calendar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 flex justify-end">
              <Button asChild variant="outline" size="sm">
                <Link to="/dashboard/admin/calendar">
                  View full calendar
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminHome;
