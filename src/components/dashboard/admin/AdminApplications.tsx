
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Eye, Calendar, FileText, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface Inspector {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  position: string;
}

interface ApplicationView {
  id: string;
  businessName: string;
  dtiNumber: string;
  owner: string;
  date: string;
  time: string;
  status: "pending" | "for_inspection" | "inspected" | "approved" | "rejected";
  inspectorId?: string;
  inspector?: string;
  inspectionDate?: string;
  inspectionTime?: string;
  priority?: boolean;
  type: "fsec" | "fsic_occupancy" | "fsic_business";
}

const AdminApplications = () => {
  const [applications, setApplications] = useState<ApplicationView[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<ApplicationView[]>([]);
  const [fsecApplications, setFsecApplications] = useState<ApplicationView[]>([]);
  const [fsicOccupancyApplications, setFsicOccupancyApplications] = useState<ApplicationView[]>([]);
  const [fsicBusinessApplications, setFsicBusinessApplications] = useState<ApplicationView[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [inspectors, setInspectors] = useState<Inspector[]>([]);
  const [scheduleDialog, setScheduleDialog] = useState({
    isOpen: false,
    applicationId: "",
    inspectorId: "",
    inspectionDate: "",
    inspectionTime: "09:00",
    priority: false
  });
  const [viewDetailsDialog, setViewDetailsDialog] = useState({
    isOpen: false,
    application: null as ApplicationView | null
  });
  
  const { getApplications, getInspectors, updateApplication } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, searchTerm, statusFilter]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Try to fetch real data
      // const applicationsData = await getApplications();
      // const inspectorsData = await getInspectors();
      
      // Mock data for demonstration
      const mockApplications: ApplicationView[] = [
        { 
          id: "1", 
          businessName: "ABC Restaurant", 
          dtiNumber: "DTI-123456", 
          owner: "Jane Smith", 
          date: "2023-05-15",
          time: "10:30 AM", 
          status: "pending",
          type: "fsec"
        },
        { 
          id: "2", 
          businessName: "XYZ Mall", 
          dtiNumber: "DTI-789012", 
          owner: "John Doe", 
          date: "2023-05-14",
          time: "2:15 PM",
          status: "pending",
          type: "fsec"
        },
        { 
          id: "3", 
          businessName: "Grand Hotel", 
          dtiNumber: "DTI-345678", 
          owner: "Alice Johnson", 
          date: "2023-05-15",
          time: "9:00 AM",
          status: "pending",
          type: "fsic_occupancy"
        },
        { 
          id: "4", 
          businessName: "City Mall", 
          dtiNumber: "DTI-567890", 
          owner: "Bob Wilson", 
          date: "2023-05-13",
          time: "1:30 PM",
          status: "for_inspection",
          inspector: "Robert Chen",
          inspectorId: "1",
          inspectionDate: "2023-05-20",
          inspectionTime: "09:00 AM",
          priority: true,
          type: "fsic_occupancy"
        },
        { 
          id: "5", 
          businessName: "Office Tower", 
          dtiNumber: "DTI-123789", 
          owner: "Carol Taylor", 
          date: "2023-05-10",
          time: "11:45 AM",
          status: "inspected",
          inspector: "Sarah Williams",
          inspectorId: "2",
          inspectionDate: "2023-05-18",
          inspectionTime: "02:00 PM",
          type: "fsic_occupancy"
        },
        { 
          id: "6", 
          businessName: "Small Cafe", 
          dtiNumber: "DTI-987654", 
          owner: "Dave Brown", 
          date: "2023-05-16",
          time: "3:00 PM",
          status: "pending",
          type: "fsic_business"
        },
        { 
          id: "7", 
          businessName: "Tech Hub", 
          dtiNumber: "DTI-901234", 
          owner: "Mike Wilson", 
          date: "2023-05-11",
          time: "9:00 AM",
          status: "approved",
          inspector: "Robert Chen",
          inspectorId: "1",
          inspectionDate: "2023-05-16",
          inspectionTime: "10:00 AM",
          type: "fsic_business"
        },
        { 
          id: "8", 
          businessName: "Sunrise Apartments", 
          dtiNumber: "DTI-456123", 
          owner: "Lisa Garcia", 
          date: "2023-05-12",
          time: "11:30 AM",
          status: "rejected",
          type: "fsic_business"
        },
      ];
      setApplications(mockApplications);

      // Filter applications by type
      setFsecApplications(mockApplications.filter(app => app.type === "fsec"));
      setFsicOccupancyApplications(mockApplications.filter(app => app.type === "fsic_occupancy"));
      setFsicBusinessApplications(mockApplications.filter(app => app.type === "fsic_business"));
      
      // Mock inspectors
      const mockInspectors: Inspector[] = [
        {
          id: "1",
          first_name: "Robert",
          last_name: "Chen",
          email: "robert.chen@example.com",
          position: "Senior Fire Inspector"
        },
        {
          id: "2",
          first_name: "Sarah",
          last_name: "Williams",
          email: "sarah.williams@example.com",
          position: "Fire Inspector"
        },
        {
          id: "3",
          first_name: "James",
          last_name: "Wilson",
          email: "james.wilson@example.com",
          position: "Fire Inspector"
        },
        {
          id: "4",
          first_name: "Maria",
          last_name: "Garcia",
          email: "maria.garcia@example.com",
          position: "Junior Fire Inspector"
        }
      ];
      setInspectors(mockInspectors);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch applications data");
    } finally {
      setIsLoading(false);
    }
  };

  const filterApplications = () => {
    let fsecFiltered = [...fsecApplications];
    let fsicOccupancyFiltered = [...fsicOccupancyApplications];
    let fsicBusinessFiltered = [...fsicBusinessApplications];
    
    // Apply search filter if present
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      
      fsecFiltered = fsecFiltered.filter(app => 
        app.businessName.toLowerCase().includes(search) ||
        app.dtiNumber.toLowerCase().includes(search) ||
        app.owner.toLowerCase().includes(search)
      );
      
      fsicOccupancyFiltered = fsicOccupancyFiltered.filter(app => 
        app.businessName.toLowerCase().includes(search) ||
        app.dtiNumber.toLowerCase().includes(search) ||
        app.owner.toLowerCase().includes(search) ||
        (app.inspector && app.inspector.toLowerCase().includes(search))
      );
      
      fsicBusinessFiltered = fsicBusinessFiltered.filter(app => 
        app.businessName.toLowerCase().includes(search) ||
        app.dtiNumber.toLowerCase().includes(search) ||
        app.owner.toLowerCase().includes(search) ||
        (app.inspector && app.inspector.toLowerCase().includes(search))
      );
    }
    
    // Apply status filter if not "all"
    if (statusFilter !== "all") {
      fsecFiltered = fsecFiltered.filter(app => app.status === statusFilter);
      fsicOccupancyFiltered = fsicOccupancyFiltered.filter(app => app.status === statusFilter);
      fsicBusinessFiltered = fsicBusinessFiltered.filter(app => app.status === statusFilter);
    }
    
    setFilteredApplications({
      fsec: fsecFiltered,
      fsic_occupancy: fsicOccupancyFiltered,
      fsic_business: fsicBusinessFiltered
    } as any);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
  };

  const openScheduleDialog = (applicationId: string) => {
    const app = applications.find(a => a.id === applicationId);
    
    setScheduleDialog({
      isOpen: true,
      applicationId,
      inspectorId: app?.inspectorId || "",
      inspectionDate: app?.inspectionDate || new Date().toISOString().split('T')[0],
      inspectionTime: app?.inspectionTime?.substring(0, 5) || "09:00",
      priority: app?.priority || false
    });
  };

  const scheduleInspection = async () => {
    const { applicationId, inspectorId, inspectionDate, inspectionTime, priority } = scheduleDialog;
    
    if (!inspectorId || !inspectionDate || !inspectionTime) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      // In a real app, this would update the application in Supabase
      // await updateApplication(applicationId, {
      //   status: "for_inspection",
      //   inspector_id: inspectorId,
      //   inspection_date: inspectionDate,
      //   inspection_time: inspectionTime,
      //   priority
      // });
      
      // For demo, update the local state
      const inspector = inspectors.find(i => i.id === inspectorId);
      const updatedApplications = applications.map(app => 
        app.id === applicationId ? 
          {
            ...app,
            status: "for_inspection" as const,
            inspectorId,
            inspector: inspector ? `${inspector.first_name} ${inspector.last_name}` : "Unknown",
            inspectionDate,
            inspectionTime,
            priority
          } : 
          app
      );
      
      setApplications(updatedApplications);
      
      // Update filtered applications
      const fsec = updatedApplications.filter(app => app.type === "fsec");
      const fsicOccupancy = updatedApplications.filter(app => app.type === "fsic_occupancy");
      const fsicBusiness = updatedApplications.filter(app => app.type === "fsic_business");
      
      setFsecApplications(fsec);
      setFsicOccupancyApplications(fsicOccupancy);
      setFsicBusinessApplications(fsicBusiness);
      
      setScheduleDialog(prev => ({ ...prev, isOpen: false }));
      
      toast.success("Inspection scheduled successfully");
    } catch (error) {
      console.error("Error scheduling inspection:", error);
      toast.error("Failed to schedule inspection");
    }
  };

  const viewApplicationDetails = (applicationId: string) => {
    const app = applications.find(a => a.id === applicationId);
    if (app) {
      setViewDetailsDialog({
        isOpen: true,
        application: app
      });
    } else {
      toast.error("Application not found");
    }
  };

  const approveOrRejectApplication = async (applicationId: string, status: "approved" | "rejected") => {
    try {
      // In a real app, this would update the application in Supabase
      // await updateApplication(applicationId, { status });
      
      // For demo, update the local state
      const updatedApplications = applications.map(app => 
        app.id === applicationId ? { ...app, status } : app
      );
      
      setApplications(updatedApplications);
      
      // Update filtered applications
      const fsec = updatedApplications.filter(app => app.type === "fsec");
      const fsicOccupancy = updatedApplications.filter(app => app.type === "fsic_occupancy");
      const fsicBusiness = updatedApplications.filter(app => app.type === "fsic_business");
      
      setFsecApplications(fsec);
      setFsicOccupancyApplications(fsicOccupancy);
      setFsicBusinessApplications(fsicBusiness);
      
      setViewDetailsDialog(prev => ({ ...prev, isOpen: false }));
      
      toast.success(`Application ${status === "approved" ? "approved" : "rejected"} successfully`);
      toast.info(`Notification sent to owner about ${status === "approved" ? "approval" : "rejection"}`);
    } catch (error) {
      console.error(`Error ${status} application:`, error);
      toast.error(`Failed to ${status} application`);
    }
  };

  const getStatusBadge = (status: string, priority?: boolean) => {
    let bgColor = "";
    let textColor = "";
    let label = "";
    
    switch (status) {
      case "pending":
        bgColor = "bg-yellow-50";
        textColor = "text-yellow-600";
        label = "Pending";
        break;
      case "for_inspection":
        bgColor = "bg-blue-50";
        textColor = "text-blue-600";
        label = "For Inspection";
        break;
      case "inspected":
        bgColor = "bg-purple-50";
        textColor = "text-purple-600";
        label = "Inspected";
        break;
      case "approved":
        bgColor = "bg-green-50";
        textColor = "text-green-600";
        label = "Approved";
        break;
      case "rejected":
        bgColor = "bg-red-50";
        textColor = "text-red-600";
        label = "Rejected";
        break;
      default:
        bgColor = "bg-gray-50";
        textColor = "text-gray-600";
        label = status;
    }
    
    return (
      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${bgColor} ${textColor}`}>
        {label}
        {priority && <span className="ml-1 text-fire">★</span>}
      </span>
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
                value={searchTerm}
                onChange={handleSearch}
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
                    {fsecApplications.length > 0 ? (
                      fsecApplications.map((application) => (
                        <TableRow key={application.id}>
                          <TableCell>{application.businessName}</TableCell>
                          <TableCell>{application.dtiNumber}</TableCell>
                          <TableCell>{application.owner}</TableCell>
                          <TableCell>{application.date}</TableCell>
                          <TableCell>{application.time}</TableCell>
                          <TableCell>
                            {getStatusBadge(application.status, application.priority)}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                size="icon" 
                                variant="outline"
                                onClick={() => viewApplicationDetails(application.id)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {application.status === "pending" && (
                                <>
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="text-green-600 hover:text-green-700"
                                    onClick={() => approveOrRejectApplication(application.id, "approved")}
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="text-red-600 hover:text-red-700"
                                    onClick={() => approveOrRejectApplication(application.id, "rejected")}
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          No FSEC applications found
                        </TableCell>
                      </TableRow>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fsic-occupancy" className="space-y-4">
          <div className="flex justify-between items-center">
            <Select defaultValue={statusFilter} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Applications</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="for_inspection">For Inspection</SelectItem>
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
                    {fsicOccupancyApplications.length > 0 ? (
                      fsicOccupancyApplications.map((application) => (
                        <TableRow key={application.id}>
                          <TableCell>{application.businessName}</TableCell>
                          <TableCell>{application.dtiNumber}</TableCell>
                          <TableCell>{application.owner}</TableCell>
                          <TableCell>{application.date}</TableCell>
                          <TableCell>{application.time}</TableCell>
                          <TableCell>
                            {getStatusBadge(application.status, application.priority)}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {(application.status === "pending" || application.status === "for_inspection") && (
                                <Button 
                                  size="icon" 
                                  variant="outline"
                                  onClick={() => openScheduleDialog(application.id)}
                                >
                                  <Calendar className="h-4 w-4" />
                                </Button>
                              )}
                              <Button 
                                size="icon" 
                                variant="outline"
                                onClick={() => viewApplicationDetails(application.id)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {application.status === "inspected" && (
                                <>
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="text-green-600 hover:text-green-700"
                                    onClick={() => approveOrRejectApplication(application.id, "approved")}
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="text-red-600 hover:text-red-700"
                                    onClick={() => approveOrRejectApplication(application.id, "rejected")}
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          No FSIC (Occupancy) applications found
                        </TableCell>
                      </TableRow>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fsic-business" className="space-y-4">
          <div className="flex justify-between items-center">
            <Select defaultValue={statusFilter} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Applications</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="for_inspection">For Inspection</SelectItem>
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
                    {fsicBusinessApplications.length > 0 ? (
                      fsicBusinessApplications.map((application) => (
                        <TableRow key={application.id}>
                          <TableCell>{application.businessName}</TableCell>
                          <TableCell>{application.dtiNumber}</TableCell>
                          <TableCell>{application.owner}</TableCell>
                          <TableCell>{application.date}</TableCell>
                          <TableCell>{application.time}</TableCell>
                          <TableCell>
                            {getStatusBadge(application.status, application.priority)}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {(application.status === "pending" || application.status === "for_inspection") && (
                                <Button 
                                  size="icon" 
                                  variant="outline"
                                  onClick={() => openScheduleDialog(application.id)}
                                >
                                  <Calendar className="h-4 w-4" />
                                </Button>
                              )}
                              <Button 
                                size="icon" 
                                variant="outline"
                                onClick={() => viewApplicationDetails(application.id)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {application.status === "inspected" && (
                                <>
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="text-green-600 hover:text-green-700"
                                    onClick={() => approveOrRejectApplication(application.id, "approved")}
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="text-red-600 hover:text-red-700"
                                    onClick={() => approveOrRejectApplication(application.id, "rejected")}
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          No FSIC (Business) applications found
                        </TableCell>
                      </TableRow>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Schedule Inspection Dialog */}
      <Dialog open={scheduleDialog.isOpen} onOpenChange={(isOpen) => 
        setScheduleDialog(prev => ({ ...prev, isOpen }))}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Inspection</DialogTitle>
            <DialogDescription>
              Assign an inspector and set a date for this inspection.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="inspector">Assign Inspector</Label>
              <Select 
                value={scheduleDialog.inspectorId} 
                onValueChange={(value) => setScheduleDialog(prev => ({ ...prev, inspectorId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an inspector" />
                </SelectTrigger>
                <SelectContent>
                  {inspectors.map((inspector) => (
                    <SelectItem key={inspector.id} value={inspector.id}>
                      {inspector.first_name} {inspector.last_name} ({inspector.position})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="inspectionDate">Inspection Date</Label>
              <Input
                id="inspectionDate"
                type="date"
                value={scheduleDialog.inspectionDate}
                onChange={(e) => setScheduleDialog(prev => ({ ...prev, inspectionDate: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="inspectionTime">Inspection Time</Label>
              <Select 
                value={scheduleDialog.inspectionTime} 
                onValueChange={(value) => setScheduleDialog(prev => ({ ...prev, inspectionTime: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09:00">9:00 AM</SelectItem>
                  <SelectItem value="11:00">11:00 AM</SelectItem>
                  <SelectItem value="13:00">1:00 PM</SelectItem>
                  <SelectItem value="15:00">3:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="priority" 
                checked={scheduleDialog.priority}
                onCheckedChange={(checked) => 
                  setScheduleDialog(prev => ({ ...prev, priority: Boolean(checked) }))
                }
              />
              <Label htmlFor="priority">Mark as Priority Inspection</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setScheduleDialog(prev => ({ ...prev, isOpen: false }))}
            >
              Cancel
            </Button>
            <Button onClick={scheduleInspection}>
              Schedule Inspection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Application Details Dialog */}
      <Dialog open={viewDetailsDialog.isOpen} onOpenChange={(isOpen) => 
        setViewDetailsDialog(prev => ({ ...prev, isOpen }))}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              {viewDetailsDialog.application?.type === "fsec" 
                ? "Fire Safety Evaluation Clearance" 
                : viewDetailsDialog.application?.type === "fsic_occupancy"
                ? "Fire Safety Inspection Certificate (Occupancy)"
                : "Fire Safety Inspection Certificate (Business)"}
            </DialogDescription>
          </DialogHeader>
          
          {viewDetailsDialog.application && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Business Name</h4>
                <p className="text-lg">{viewDetailsDialog.application.businessName}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">DTI Certificate Number</h4>
                <p>{viewDetailsDialog.application.dtiNumber}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Owner</h4>
                <p>{viewDetailsDialog.application.owner}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Application Date & Time</h4>
                <p>{viewDetailsDialog.application.date} at {viewDetailsDialog.application.time}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Status</h4>
                <div className="mt-1">
                  {getStatusBadge(viewDetailsDialog.application.status, viewDetailsDialog.application.priority)}
                </div>
              </div>
              
              {viewDetailsDialog.application.inspector && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Assigned Inspector</h4>
                  <p>{viewDetailsDialog.application.inspector}</p>
                </div>
              )}
              
              {viewDetailsDialog.application.inspectionDate && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Scheduled Inspection</h4>
                  <p>{viewDetailsDialog.application.inspectionDate} at {viewDetailsDialog.application.inspectionTime}</p>
                </div>
              )}
              
              {viewDetailsDialog.application.status === "inspected" && (
                <div className="pt-4 flex gap-2">
                  <Button
                    variant="default"
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => approveOrRejectApplication(viewDetailsDialog.application!.id, "approved")}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => approveOrRejectApplication(viewDetailsDialog.application!.id, "rejected")}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setViewDetailsDialog(prev => ({ ...prev, isOpen: false }))}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminApplications;
