
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Eye, Check, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const AdminEstablishments = () => {
  // Mock data for registrations
  const pendingRegistrations = [
    { 
      id: 1, 
      name: "ABC Restaurant", 
      dtiNumber: "DTI-123456", 
      owner: "Jane Smith", 
      submittedDate: "2023-05-15", 
      status: "Pending" 
    },
    { 
      id: 2, 
      name: "XYZ Mall", 
      dtiNumber: "DTI-789012", 
      owner: "John Doe", 
      submittedDate: "2023-05-14", 
      status: "Pending" 
    },
  ];

  const approvedRegistrations = [
    { 
      id: 3, 
      name: "Grand Hotel", 
      dtiNumber: "DTI-345678", 
      owner: "Alice Johnson", 
      submittedDate: "2023-05-10", 
      approvedDate: "2023-05-12",
      status: "Approved" 
    },
  ];

  const handleApprove = (id: number) => {
    toast({
      title: "Registration Approved",
      description: "The establishment registration has been approved.",
    });
  };

  const handleReject = (id: number) => {
    toast({
      title: "Registration Rejected",
      description: "The establishment registration has been rejected.",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Establishment Management</h2>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="pending">Pending Registrations</TabsTrigger>
            <TabsTrigger value="approved">Approved Establishments</TabsTrigger>
            <TabsTrigger value="rejected">Rejected Registrations</TabsTrigger>
          </TabsList>
          
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search establishments..."
              className="w-[250px] pl-8"
            />
          </div>
        </div>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <table className="w-full caption-bottom text-sm">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">DTI Number</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Owner</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Submitted Date</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingRegistrations.map((registration) => (
                      <tr key={registration.id} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle">{registration.name}</td>
                        <td className="p-4 align-middle">{registration.dtiNumber}</td>
                        <td className="p-4 align-middle">{registration.owner}</td>
                        <td className="p-4 align-middle">{registration.submittedDate}</td>
                        <td className="p-4 align-middle">
                          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-yellow-50 text-yellow-600">
                            {registration.status}
                          </span>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex gap-2">
                            <Button size="icon" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleApprove(registration.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="destructive"
                              onClick={() => handleReject(registration.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <table className="w-full caption-bottom text-sm">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">DTI Number</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Owner</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Submitted Date</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Approved Date</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvedRegistrations.map((registration) => (
                      <tr key={registration.id} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle">{registration.name}</td>
                        <td className="p-4 align-middle">{registration.dtiNumber}</td>
                        <td className="p-4 align-middle">{registration.owner}</td>
                        <td className="p-4 align-middle">{registration.submittedDate}</td>
                        <td className="p-4 align-middle">{registration.approvedDate}</td>
                        <td className="p-4 align-middle">
                          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-50 text-green-600">
                            {registration.status}
                          </span>
                        </td>
                        <td className="p-4 align-middle">
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No rejected registrations at this time.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminEstablishments;
