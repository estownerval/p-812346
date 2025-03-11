
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowUp, ArrowDown, Activity, Building, FileText, Users, Loader2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getStatusColor } from "@/utils/applicationUtils";
import { toast } from "sonner";
import { Enums } from "@/integrations/supabase/types";

// Define the interface for application status
interface StatsCard {
  title: string;
  value: number;
  description: string;
  change: number;
  icon: React.ReactNode;
}

interface InspectorStat {
  id: string;
  name: string;
  assigned: number;
  completed: number;
}

interface Application {
  id: string;
  establishment_id: string;
  application_type: Enums<"application_type">;
  status: Enums<"application_status">;
  application_date: string;
  application_time: string;
  updated_at: string;
  inspection_date: string | null;
  inspection_time: string | null;
  inspector_id: string | null;
  priority: boolean | null;
  establishmentName?: string;
  dtiNumber?: string;
  ownerName?: string;
  inspectorName?: string;
}

// Colors for the charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#e45f5a'];

const AdminHome = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [statsCards, setStatsCards] = useState<StatsCard[]>([]);
  const [applicationStats, setApplicationStats] = useState<any[]>([]);
  const [inspectorStats, setInspectorStats] = useState<InspectorStat[]>([]);
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [priorityApplications, setPriorityApplications] = useState<Application[]>([]);

  const { getApplications, getInspectors, getEstablishments, getProfiles } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // In a real app, fetch actual data from Supabase
      // const applications = await getApplications();
      // const inspectors = await getInspectors();
      // const establishments = await getEstablishments();
      // const profiles = await getProfiles();

      // For demonstration, using mock data
      // Mock stats cards
      const mockStatsCards: StatsCard[] = [
        {
          title: "Total Applications",
          value: 842,
          description: "All time applications",
          change: 12.5,
          icon: <FileText className="h-8 w-8 text-blue-500" />,
        },
        {
          title: "Registered Establishments",
          value: 368,
          description: "Active businesses",
          change: 8.2,
          icon: <Building className="h-8 w-8 text-green-500" />,
        },
        {
          title: "Active Inspectors",
          value: 24,
          description: "Field personnel",
          change: 4.1,
          icon: <Users className="h-8 w-8 text-purple-500" />,
        },
        {
          title: "Compliance Rate",
          value: 92,
          description: "Approval percentage",
          change: 3.7,
          icon: <Activity className="h-8 w-8 text-fire" />,
        },
      ];
      setStatsCards(mockStatsCards);

      // Mock application stats for chart
      const mockApplicationStats = [
        { name: 'FSEC', pending: 42, approved: 128, rejected: 15 },
        { name: 'FSIC (Occupancy)', pending: 35, approved: 95, rejected: 12 },
        { name: 'FSIC (Business)', pending: 58, approved: 210, rejected: 24 },
      ];
      setApplicationStats(mockApplicationStats);

      // Mock inspector stats
      const mockInspectorStats: InspectorStat[] = [
        { id: '1', name: 'Robert Chen', assigned: 15, completed: 12 },
        { id: '2', name: 'Sarah Williams', assigned: 21, completed: 18 },
        { id: '3', name: 'James Wilson', assigned: 18, completed: 14 },
        { id: '4', name: 'Maria Garcia', assigned: 12, completed: 9 },
        { id: '5', name: 'Michael Johnson', assigned: 19, completed: 15 },
      ];
      setInspectorStats(mockInspectorStats);

      // Mock recent applications - Fix the 'inspector' property to 'inspector_id'
      const mockRecentApplications: Application[] = [
        {
          id: '1',
          establishment_id: 'est-1',
          application_type: 'fsec',
          status: 'pending',
          application_date: '2023-05-15',
          application_time: '10:30 AM',
          updated_at: '2023-05-15T10:30:00Z',
          inspection_date: null,
          inspection_time: null,
          inspector_id: null,
          priority: false,
          establishmentName: 'ABC Restaurant',
          dtiNumber: 'DTI-123456',
          ownerName: 'Jane Smith',
        },
        {
          id: '2',
          establishment_id: 'est-2',
          application_type: 'fsic_occupancy',
          status: 'for_inspection',
          application_date: '2023-05-14',
          application_time: '2:15 PM',
          updated_at: '2023-05-16T09:15:00Z',
          inspection_date: '2023-05-20',
          inspection_time: '09:00 AM',
          inspector_id: '1',
          priority: true,
          establishmentName: 'XYZ Mall',
          dtiNumber: 'DTI-789012',
          ownerName: 'John Doe',
          inspectorName: 'Robert Chen',
        },
        {
          id: '3',
          establishment_id: 'est-3',
          application_type: 'fsic_business',
          status: 'approved',
          application_date: '2023-05-12',
          application_time: '9:00 AM',
          updated_at: '2023-05-15T14:30:00Z',
          inspection_date: '2023-05-14',
          inspection_time: '10:00 AM',
          inspector_id: '2',
          priority: false,
          establishmentName: 'City Pharmacy',
          dtiNumber: 'DTI-456789',
          ownerName: 'Alice Johnson',
          inspectorName: 'Sarah Williams',
        },
        {
          id: '4',
          establishment_id: 'est-4',
          application_type: 'fsec',
          status: 'rejected',
          application_date: '2023-05-11',
          application_time: '11:00 AM',
          updated_at: '2023-05-13T16:45:00Z',
          inspection_date: null,
          inspection_time: null,
          inspector_id: null,
          priority: false,
          establishmentName: 'Grand Hotel',
          dtiNumber: 'DTI-345678',
          ownerName: 'Bob Wilson',
        },
        {
          id: '5',
          establishment_id: 'est-5',
          application_type: 'fsic_occupancy',
          status: 'inspected',
          application_date: '2023-05-10',
          application_time: '1:30 PM',
          updated_at: '2023-05-15T09:00:00Z',
          inspection_date: '2023-05-15',
          inspection_time: '09:00 AM',
          inspector_id: '3',
          priority: true,
          establishmentName: 'Office Tower',
          dtiNumber: 'DTI-123789',
          ownerName: 'Carol Taylor',
          inspectorName: 'James Wilson',
        },
      ];
      setRecentApplications(mockRecentApplications);

      // Mock priority applications
      const mockPriorityApplications: Application[] = mockRecentApplications.filter(
        (app) => app.priority === true
      );
      setPriorityApplications(mockPriorityApplications);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    // Fix the type for the variant to include only allowed types
    let variant: "default" | "secondary" | "outline" | "destructive" = "default";
    
    switch (status) {
      case "pending":
        variant = "secondary";
        break;
      case "for_inspection":
        variant = "outline";
        break;
      case "inspected":
        variant = "outline";
        break;
      case "approved":
        variant = "default";
        break;
      case "rejected":
        variant = "destructive";
        break;
      default:
        variant = "outline";
    }
    
    return (
      <Badge variant={variant} className="capitalize">
        {status.replace("_", " ")}
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-sm text-muted-foreground">{card.description}</p>
            </CardContent>
            <CardDescription className="pt-4 text-sm text-muted-foreground">
              <span className="flex items-center">
                {card.change > 0 ? (
                  <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                {Math.abs(card.change)}%
              </span>
            </CardDescription>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="applications" className="space-y-4">
        <TabsList>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="inspectors">Inspectors</TabsTrigger>
        </TabsList>
        <TabsContent value="applications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Application Statistics</CardTitle>
              <CardDescription>Overview of application types and statuses.</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={applicationStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="pending" fill="#FFBB28" name="Pending" />
                  <Bar dataKey="approved" fill="#00C49F" name="Approved" />
                  <Bar dataKey="rejected" fill="#e45f5a" name="Rejected" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>Recently submitted applications.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Establishment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        DTI Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Owner
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentApplications.map((application) => (
                      <tr key={application.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {application.establishmentName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {application.dtiNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {application.ownerName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {application.application_date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getStatusBadge(application.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Priority Applications</CardTitle>
              <CardDescription>Applications marked as high priority.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Establishment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        DTI Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Owner
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {priorityApplications.map((application) => (
                      <tr key={application.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {application.establishmentName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {application.dtiNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {application.ownerName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {application.application_date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getStatusBadge(application.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inspectors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inspector Statistics</CardTitle>
              <CardDescription>Assigned vs Completed Inspections.</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={inspectorStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="assigned" fill="#8884d8" name="Assigned" />
                  <Bar dataKey="completed" fill="#00C49F" name="Completed" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminHome;
