
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, FileText, Users, AlertCircle } from "lucide-react";

const AdminHome = () => {
  // These would be fetched from a database in a real application
  const stats = [
    { title: "Total Users", value: 245, icon: Users, change: "+12% from last month" },
    { title: "Registered Establishments", value: 178, icon: Building, change: "+5% from last month" },
    { title: "Pending Applications", value: 32, icon: FileText, change: "-2% from last month" },
    { title: "Requiring Attention", value: 8, icon: AlertCircle, change: "+3 from yesterday", urgent: true },
  ];
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome to the FireInspect admin dashboard.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">ABC Restaurant - FSIC Application</p>
                  <p className="text-xs text-muted-foreground">Submitted 2 hours ago</p>
                </div>
                <div className="text-xs text-muted-foreground">Pending Review</div>
              </div>
              
              <div className="flex items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">XYZ Mall - FSEC Application</p>
                  <p className="text-xs text-muted-foreground">Submitted 4 hours ago</p>
                </div>
                <div className="text-xs text-muted-foreground">Inspector Assigned</div>
              </div>
              
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Grand Hotel - FSIC (Occupancy)</p>
                  <p className="text-xs text-muted-foreground">Submitted 1 day ago</p>
                </div>
                <div className="text-xs text-muted-foreground">Inspection Scheduled</div>
              </div>
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
              <div className="border-l-2 border-fire pl-3">
                <p className="text-sm font-medium">ABC Restaurant</p>
                <p className="text-xs text-muted-foreground">Tomorrow, 10:00 AM</p>
                <p className="text-xs text-muted-foreground">Inspector: John Doe</p>
              </div>
              
              <div className="border-l-2 border-fire pl-3">
                <p className="text-sm font-medium">XYZ Mall</p>
                <p className="text-xs text-muted-foreground">Wed, 2:00 PM</p>
                <p className="text-xs text-muted-foreground">Inspector: Jane Smith</p>
              </div>
              
              <div className="border-l-2 border-blue-500 pl-3">
                <p className="text-sm font-medium">Grand Hotel</p>
                <p className="text-xs text-muted-foreground">Fri, 9:00 AM</p>
                <p className="text-xs text-muted-foreground">Inspector: John Doe</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminHome;
