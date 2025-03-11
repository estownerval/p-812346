
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, FileText, AlertCircle, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const OwnerHome = () => {
  // Mock data - would be from Supabase in a real application
  const stats = [
    { title: "Registered Establishments", value: 1, icon: Building, change: "1 approved, 1 pending" },
    { title: "Applications", value: 3, icon: FileText, change: "2 pending, 1 approved" },
    { title: "Requiring Attention", value: 1, icon: AlertCircle, change: "Action needed", urgent: true },
  ];
  
  // Establishment cards
  const establishments = [
    {
      id: 1,
      name: "ABC Restaurant",
      dtiNumber: "DTI-123456",
      status: "Registered",
    },
    {
      id: 2,
      name: "XYZ Cafe",
      dtiNumber: "DTI-789012",
      status: "Unregistered",
    },
  ];
  
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
          {establishments.map((est) => (
            <Card key={est.id}>
              <CardHeader>
                <CardTitle className="text-xl">{est.name}</CardTitle>
                <CardDescription>DTI: {est.dtiNumber}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                    est.status === 'Registered' 
                      ? 'bg-green-50 text-green-600 border-green-200'
                      : 'bg-yellow-50 text-yellow-600 border-yellow-200'
                  }`}>
                    {est.status}
                  </span>
                </div>
                
                {est.status === 'Registered' ? (
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Link to="/dashboard/owner/applications/new">
                      <Button className="bg-fire hover:bg-fire/90 w-full" size="sm">
                        Apply for Certification
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Button className="w-full bg-fire hover:bg-fire/90" size="sm">
                    Register Establishment
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
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
                  <tr className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle">FSEC</td>
                    <td className="p-4 align-middle">ABC Restaurant</td>
                    <td className="p-4 align-middle">May 15, 2023</td>
                    <td className="p-4 align-middle">
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-yellow-50 text-yellow-600">
                        Pending
                      </span>
                    </td>
                    <td className="p-4 align-middle">
                      <Button variant="outline" size="sm">View</Button>
                    </td>
                  </tr>
                  <tr className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle">FSIC (Business)</td>
                    <td className="p-4 align-middle">ABC Restaurant</td>
                    <td className="p-4 align-middle">May 10, 2023</td>
                    <td className="p-4 align-middle">
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-blue-50 text-blue-600">
                        For Inspection
                      </span>
                    </td>
                    <td className="p-4 align-middle">
                      <Button variant="outline" size="sm">View</Button>
                    </td>
                  </tr>
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
