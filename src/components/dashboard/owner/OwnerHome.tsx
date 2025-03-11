import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, CheckCircle, Clock, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Enums } from "@/integrations/supabase/types";

interface Establishment {
  id: string;
  name: string;
  dti_number: string;
  status: 'unregistered' | 'registered' | 'rejected' | 'pending';
  address?: string;
  created_at: string;
}

interface Application {
  id: string;
  establishment_id: string;
  application_type: Enums<"application_type">;
  status: Enums<"application_status">;
  application_date: string;
  application_time: string;
  inspection_date: string | null;
  inspection_time: string | null;
  created_at: string;
  updated_at: string;
  establishment?: Establishment;
}

const OwnerHome = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [upcomingInspections, setUpcomingInspections] = useState<Application[]>([]);
  
  const { getOwnedEstablishments, getApplicationsByOwner } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // In a real app, fetch from Supabase
      // const establishmentsData = await getOwnedEstablishments();
      // const applicationsData = await getApplicationsByOwner();
      
      // Mock establishments for demonstration
      const mockEstablishments: Establishment[] = [
        {
          id: "est-1",
          name: "ABC Restaurant",
          dti_number: "DTI-123456",
          status: "registered",
          address: "123 Main St, Quezon City",
          created_at: "2023-05-15T10:30:00Z",
        },
        {
          id: "est-2",
          name: "XYZ Cafe",
          dti_number: "DTI-789012",
          status: "pending",
          address: "456 Park Ave, Makati City",
          created_at: "2023-05-14T14:15:00Z",
        },
        {
          id: "est-3",
          name: "City Pharmacy",
          dti_number: "DTI-456789",
          status: "registered",
          address: "789 Health St, Manila",
          created_at: "2023-05-10T09:45:00Z",
        }
      ];
      setEstablishments(mockEstablishments);
      
      // Mock applications
      const mockApplications: Application[] = [
        {
          id: "app-1",
          establishment_id: "est-1",
          application_type: "fsec",
          status: "pending",
          application_date: "2023-05-16",
          application_time: "10:30 AM",
          inspection_date: null,
          inspection_time: null,
          created_at: "2023-05-16T10:30:00Z",
          updated_at: "2023-05-16T10:30:00Z",
          establishment: mockEstablishments[0]
        },
        {
          id: "app-2",
          establishment_id: "est-1",
          application_type: "fsic_business",
          status: "for_inspection",
          application_date: "2023-05-14",
          application_time: "2:15 PM",
          inspection_date: "2023-05-20",
          inspection_time: "09:00 AM",
          created_at: "2023-05-14T14:15:00Z",
          updated_at: "2023-05-15T09:30:00Z",
          establishment: mockEstablishments[0]
        },
        {
          id: "app-3",
          establishment_id: "est-3",
          application_type: "fsic_occupancy",
          status: "approved",
          application_date: "2023-05-10",
          application_time: "9:00 AM",
          inspection_date: "2023-05-15",
          inspection_time: "10:00 AM",
          created_at: "2023-05-10T09:00:00Z",
          updated_at: "2023-05-15T14:30:00Z",
          establishment: mockEstablishments[2]
        }
      ];
      setApplications(mockApplications);
      
      // Filter recent applications (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recent = mockApplications
        .filter(app => new Date(app.created_at) >= thirtyDaysAgo)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);
        
      setRecentApplications(recent);
      
      // Filter upcoming inspections
      const now = new Date();
      const upcoming = mockApplications
        .filter(app => 
          app.status === "for_inspection" && 
          app.inspection_date && 
          new Date(app.inspection_date) >= now
        )
        .sort((a, b) => 
          new Date(a.inspection_date!).getTime() - new Date(b.inspection_date!).getTime()
        );
        
      setUpcomingInspections(upcoming);
      
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    let variant: "default" | "secondary" | "outline" | "destructive" = "default";
    let text = status.replace("_", " ");
    
    switch (status) {
      case "pending":
        variant = "secondary";
        text = "Pending";
        break;
      case "for_inspection":
        variant = "outline";
        text = "For Inspection";
        break;
      case "inspected":
        variant = "outline";
        text = "Inspected";
        break;
      case "approved":
        variant = "default";
        text = "Approved";
        break;
      case "rejected":
        variant = "destructive";
        text = "Rejected";
        break;
      case "registered":
        variant = "default";
        text = "Registered";
        break;
      case "unregistered":
        variant = "outline";
        text = "Unregistered";
        break;
    }
    
    return (
      <Badge variant={variant} className="capitalize">
        {text}
      </Badge>
    );
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
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Inspections ({upcomingInspections.length})</TabsTrigger>
          <TabsTrigger value="establishments">My Establishments ({establishments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          {recentApplications.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recentApplications.map((application) => (
                <Card key={application.id}>
                  <CardHeader>
                    <CardTitle>
                      {application.establishment?.name}
                    </CardTitle>
                    <CardDescription>
                      {application.application_type === "fsec"
                        ? "Fire Safety Evaluation Clearance"
                        : application.application_type === "fsic_occupancy"
                        ? "Fire Safety Inspection Certificate (Occupancy)"
                        : "Fire Safety Inspection Certificate (Business)"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-2">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Application Date: {application.application_date}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Time: {application.application_time}
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Status: {getStatusBadge(application.status)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent>
                No recent applications found.
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingInspections.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingInspections.map((inspection) => (
                <Card key={inspection.id}>
                  <CardHeader>
                    <CardTitle>
                      {inspection.establishment?.name}
                    </CardTitle>
                    <CardDescription>
                      Scheduled Inspection
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-2">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Date: {inspection.inspection_date}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Time: {inspection.inspection_time}
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Status: {getStatusBadge(inspection.status)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent>
                No upcoming inspections scheduled.
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="establishments" className="space-y-4">
          {establishments.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {establishments.map((establishment) => (
                <Card key={establishment.id}>
                  <CardHeader>
                    <CardTitle>{establishment.name}</CardTitle>
                    <CardDescription>
                      DTI Number: {establishment.dti_number}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-2">
                    <div>
                      Status: {getStatusBadge(establishment.status)}
                    </div>
                    <div>
                      Address: {establishment.address}
                    </div>
                  </CardContent>
                  <CardContent>
                    <Link to={`/dashboard/applications/${establishment.id}`}>
                      <Button variant="outline">
                        View Applications
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent>
                No establishments found.
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OwnerHome;
