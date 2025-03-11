
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const Analytics = () => {
  const { profile, getApplications, getEstablishments } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [applicationStats, setApplicationStats] = useState<any>([]);
  const [statusDistribution, setStatusDistribution] = useState<any>([]);
  const [establishmentStats, setEstablishmentStats] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch applications data
        const applications = await getApplications();
        
        // Group applications by type
        const applicationsByType = applications.reduce((acc: any, app: any) => {
          acc[app.application_type] = (acc[app.application_type] || 0) + 1;
          return acc;
        }, {});
        
        const appTypeData = Object.keys(applicationsByType).map(type => ({
          name: type.toUpperCase(),
          count: applicationsByType[type]
        }));
        
        setApplicationStats(appTypeData);
        
        // Group applications by status
        const applicationsByStatus = applications.reduce((acc: any, app: any) => {
          acc[app.status] = (acc[app.status] || 0) + 1;
          return acc;
        }, {});
        
        const statusData = Object.keys(applicationsByStatus).map(status => ({
          name: status.replace(/_/g, ' ').toUpperCase(),
          value: applicationsByStatus[status]
        }));
        
        setStatusDistribution(statusData);
        
        // Fetch establishments data if admin or owner
        if (profile?.role === 'admin' || profile?.role === 'owner') {
          const establishments = await getEstablishments();
          
          // Group establishments by status
          const establishmentsByStatus = establishments.reduce((acc: any, est: any) => {
            acc[est.status] = (acc[est.status] || 0) + 1;
            return acc;
          }, {});
          
          const estStatusData = Object.keys(establishmentsByStatus).map(status => ({
            name: status.replace(/_/g, ' ').toUpperCase(),
            count: establishmentsByStatus[status]
          }));
          
          setEstablishmentStats(estStatusData);
        }
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (profile) {
      fetchData();
    }
  }, [profile, getApplications, getEstablishments]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-fire" />
        <span className="ml-2">Loading analytics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
        <p className="text-muted-foreground">
          View performance metrics and statistics
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Applications</CardTitle>
            <CardDescription>By application type</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={applicationStats}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Applications" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Application Status</CardTitle>
            <CardDescription>Distribution by status</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusDistribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {(profile?.role === 'admin' || profile?.role === 'owner') && (
          <Card>
            <CardHeader>
              <CardTitle>Establishments</CardTitle>
              <CardDescription>By registration status</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={establishmentStats}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Establishments" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {profile?.role === 'admin' && (
        <Card>
          <CardHeader>
            <CardTitle>Monthly Application Trend</CardTitle>
            <CardDescription>Applications over time</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <p className="text-muted-foreground text-center h-full flex items-center justify-center">
              Monthly trend data will be available once more applications are submitted.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Analytics;
