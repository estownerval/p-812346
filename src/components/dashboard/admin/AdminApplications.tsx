
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Eye, Calendar, FileText } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminApplications = () => {
  // This would be connected to Supabase in a real application
  const fsecApplications = [
    { 
      id: 1, 
      businessName: "ABC Restaurant", 
      dtiNumber: "DTI-123456", 
      owner: "Jane Smith", 
      date: "2023-05-15",
      time: "10:30 AM", 
      status: "Pending" 
    },
    { 
      id: 2, 
      businessName: "XYZ Mall", 
      dtiNumber: "DTI-789012", 
      owner: "John Doe", 
      date: "2023-05-14",
      time: "2:15 PM",
      status: "Pending" 
    },
  ];

  const fsicOccupancyApplications = [
    { 
      id: 1, 
      businessName: "Grand Hotel", 
      dtiNumber: "DTI-345678", 
      owner: "Alice Johnson", 
      date: "2023-05-15",
      time: "9:00 AM",
      status: "Unscheduled" 
    },
    { 
      id: 2, 
      businessName: "City Mall", 
      dtiNumber: "DTI-567890", 
      owner: "Bob Wilson", 
      date: "2023-05-13",
      time: "1:30 PM",
      status: "For Inspection",
      inspector: "Robert Chen",
      inspectionDate: "2023-05-20",
      priority: true
    },
    { 
      id: 3, 
      businessName: "Office Tower", 
      dtiNumber: "DTI-123789", 
      owner: "Carol Taylor", 
      date: "2023-05-10",
      time: "11:45 AM",
      status: "Inspected",
      inspector: "Sarah Williams",
      inspectionDate: "2023-05-18"
    },
  ];

  const fsicBusinessApplications = [
    { 
      id: 1, 
      businessName: "Small Cafe", 
      dtiNumber: "DTI-987654", 
      owner: "Dave Brown", 
      date: "2023-05-16",
      time: "3:00 PM",
      status: "Unscheduled" 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Applications</h2>
      </div>

      <Tabs defaultValue="fsec" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="fsec">FSEC</TabsTrigger>
            <TabsTrigger value="fsic-occupancy">FSIC (Occupancy)</TabsTrigger>
            <TabsTrigger value="fsic-business">FSIC (Business)</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search applications..."
                className="w-[250px] pl-8"
              />
            </div>
          </div>
        </div>

        <TabsContent value="fsec" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <table className="w-full caption-bottom text-sm">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="h-12 px-4 text-left align-middle font-medium">Business Name</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">DTI Number</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Owner</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Time</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fsecApplications.map((application) => (
                      <tr key={application.id} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle">{application.businessName}</td>
                        <td className="p-4 align-middle">{application.dtiNumber}</td>
                        <td className="p-4 align-middle">{application.owner}</td>
                        <td className="p-4 align-middle">{application.date}</td>
                        <td className="p-4 align-middle">{application.time}</td>
                        <td className="p-4 align-middle">
                          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-yellow-50 text-yellow-600">
                            {application.status}
                          </span>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex gap-2">
                            <Button size="icon" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="outline"
                            >
                              <FileText className="h-4 w-4" />
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

        <TabsContent value="fsic-occupancy" className="space-y-4">
          <div className="flex justify-between items-center">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Applications</SelectItem>
                <SelectItem value="unscheduled">Unscheduled</SelectItem>
                <SelectItem value="for-inspection">For Inspection</SelectItem>
                <SelectItem value="inspected">Inspected</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <table className="w-full caption-bottom text-sm">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="h-12 px-4 text-left align-middle font-medium">Business Name</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">DTI Number</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Owner</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Time</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fsicOccupancyApplications.map((application) => (
                      <tr key={application.id} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle">{application.businessName}</td>
                        <td className="p-4 align-middle">{application.dtiNumber}</td>
                        <td className="p-4 align-middle">{application.owner}</td>
                        <td className="p-4 align-middle">{application.date}</td>
                        <td className="p-4 align-middle">{application.time}</td>
                        <td className="p-4 align-middle">
                          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                            application.status === 'Unscheduled' 
                              ? 'bg-yellow-50 text-yellow-600'
                              : application.status === 'For Inspection'
                                ? 'bg-blue-50 text-blue-600'
                                : application.status === 'Inspected'
                                  ? 'bg-purple-50 text-purple-600'
                                  : ''
                          }`}>
                            {application.status}
                            {application.priority && (
                              <span className="ml-1 text-fire">★</span>
                            )}
                          </span>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex gap-2">
                            {(application.status === 'Unscheduled' || application.status === 'For Inspection') && (
                              <>
                                <Button size="icon" variant="outline">
                                  <Calendar className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="outline">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            {application.status === 'Inspected' && (
                              <>
                                <Button size="icon" variant="outline">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </>
                            )}
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

        <TabsContent value="fsic-business" className="space-y-4">
          <div className="flex justify-between items-center">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Applications</SelectItem>
                <SelectItem value="unscheduled">Unscheduled</SelectItem>
                <SelectItem value="for-inspection">For Inspection</SelectItem>
                <SelectItem value="inspected">Inspected</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <table className="w-full caption-bottom text-sm">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="h-12 px-4 text-left align-middle font-medium">Business Name</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">DTI Number</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Owner</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Time</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fsicBusinessApplications.map((application) => (
                      <tr key={application.id} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle">{application.businessName}</td>
                        <td className="p-4 align-middle">{application.dtiNumber}</td>
                        <td className="p-4 align-middle">{application.owner}</td>
                        <td className="p-4 align-middle">{application.date}</td>
                        <td className="p-4 align-middle">{application.time}</td>
                        <td className="p-4 align-middle">
                          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-yellow-50 text-yellow-600">
                            {application.status}
                          </span>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex gap-2">
                            <Button size="icon" variant="outline">
                              <Calendar className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="outline">
                              <Eye className="h-4 w-4" />
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
      </Tabs>
    </div>
  );
};

export default AdminApplications;
