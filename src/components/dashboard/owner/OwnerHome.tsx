
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, FileText, AlertCircle, Plus, CalendarClock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth, Application } from "@/contexts/AuthContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface DashboardStats {
  registeredEstablishments: number;
  applications: number;
  requireAttention: number;
}

interface Establishment {
  id: string;
  name: string;
  dti_number: string;
  status: "unregistered" | "registered" | "rejected" | "pending";
  address?: string;
  created_at?: string;
}

const OwnerHome = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    registeredEstablishments: 0,
    applications: 0,
    requireAttention: 0,
  });
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isRegistrationDialogOpen, setIsRegistrationDialogOpen] = useState(false);
  const [selectedEstablishment, setSelectedEstablishment] = useState<Establishment | null>(null);
  const [address, setAddress] = useState("");
  const [isApplicationDialogOpen, setIsApplicationDialogOpen] = useState(false);
  const [selectedApplicationType, setSelectedApplicationType] = useState<"fsec" | "fsic_occupancy" | "fsic_business" | null>(null);
  
  const navigate = useNavigate();
  const { getEstablishments, getApplications, registerEstablishment } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Try to fetch real data from Supabase
      const establishmentsData = await getEstablishments();
      const applicationsData = await getApplications();
      
      // Process the data for establishments
      if (establishmentsData && establishmentsData.length > 0) {
        setEstablishments(establishmentsData);
      } else {
        // Mock establishments if real data fails or is empty
        const mockEstablishments: Establishment[] = [
          {
            id: "1",
            name: "ABC Restaurant",
            dti_number: "DTI-123456",
            status: "registered",
            address: "123 Main St, Makati City",
            created_at: "2023-05-15T10:30:00Z"
          },
          {
            id: "2",
            name: "XYZ Cafe",
            dti_number: "DTI-789012",
            status: "unregistered",
            created_at: "2023-05-14T14:15:00Z"
          },
          {
            id: "3",
            name: "New Bakery",
            dti_number: "DTI-456789",
            status: "pending",
            address: "456 Park Ave, Quezon City",
            created_at: "2023-05-13T09:00:00Z"
          },
          {
            id: "4",
            name: "Corner Store",
            dti_number: "DTI-234567",
            status: "rejected",
            address: "789 Beach Rd, Manila",
            created_at: "2023-05-12T11:45:00Z"
          },
        ];
        setEstablishments(mockEstablishments);
      }
      
      // Process the data for applications
      if (applicationsData && applicationsData.length > 0) {
        setApplications(applicationsData);
      } else {
        // Mock applications if real data fails or is empty
        const mockApplications: Application[] = [
          {
            id: "1",
            establishment_id: "1",
            application_type: "fsec",
            status: "pending",
            application_date: "2023-05-15",
            application_time: "10:30 AM",
            establishment: {
              id: "1",
              name: "ABC Restaurant"
            }
          },
          {
            id: "2",
            establishment_id: "1",
            application_type: "fsic_business",
            status: "for_inspection",
            application_date: "2023-05-10",
            application_time: "02:15 PM",
            inspector_id: "inspector-1",
            inspection_date: "2023-05-20",
            inspection_time: "09:00 AM",
            establishment: {
              id: "1",
              name: "ABC Restaurant"
            }
          },
        ];
        setApplications(mockApplications);
      }
      
      // Calculate stats based on the data we have
      const registeredCount = establishments.filter(e => e.status === "registered").length;
      const applicationsCount = applications.length;
      const attentionCount = applications.filter(a => a.status === "rejected").length +
                             establishments.filter(e => e.status === "rejected").length;
      
      setStats({
        registeredEstablishments: registeredCount,
        applications: applicationsCount,
        requireAttention: attentionCount
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to fetch dashboard data");
      
      // Use mock data if fetching fails
      const mockEstablishments: Establishment[] = [
        {
          id: "1",
          name: "ABC Restaurant",
          dti_number: "DTI-123456",
          status: "registered",
          address: "123 Main St, Makati City",
          created_at: "2023-05-15T10:30:00Z"
        },
        {
          id: "2",
          name: "XYZ Cafe",
          dti_number: "DTI-789012",
          status: "unregistered",
          created_at: "2023-05-14T14:15:00Z"
        },
        {
          id: "3",
          name: "New Bakery",
          dti_number: "DTI-456789",
          status: "pending",
          address: "456 Park Ave, Quezon City",
          created_at: "2023-05-13T09:00:00Z"
        },
        {
          id: "4",
          name: "Corner Store",
          dti_number: "DTI-234567",
          status: "rejected",
          address: "789 Beach Rd, Manila",
          created_at: "2023-05-12T11:45:00Z"
        },
      ];
      setEstablishments(mockEstablishments);
      
      const mockApplications: Application[] = [
        {
          id: "1",
          establishment_id: "1",
          application_type: "fsec",
          status: "pending",
          application_date: "2023-05-15",
          application_time: "10:30 AM",
          establishment: {
            id: "1",
            name: "ABC Restaurant"
          }
        },
        {
          id: "2",
          establishment_id: "1",
          application_type: "fsic_business",
          status: "for_inspection",
          application_date: "2023-05-10",
          application_time: "02:15 PM",
          inspector_id: "inspector-1",
          inspection_date: "2023-05-20",
          inspection_time: "09:00 AM",
          establishment: {
            id: "1",
            name: "ABC Restaurant"
          }
        },
      ];
      setApplications(mockApplications);
      
      setStats({
        registeredEstablishments: 1,
        applications: 2,
        requireAttention: 1,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterEstablishment = (establishment: Establishment) => {
    setSelectedEstablishment(establishment);
    setAddress(establishment.address || "");
    setIsRegistrationDialogOpen(true);
  };

  const submitRegistration = async () => {
    if (!selectedEstablishment || !address) {
      toast.error("Please provide the establishment address");
      return;
    }

    try {
      // Try to use the real function
      await registerEstablishment(selectedEstablishment.id, address);
      
      // Update the establishments list with the updated status
      const updatedEstablishments = establishments.map(est => 
        est.id === selectedEstablishment.id ? 
          { ...est, status: "pending" as const, address } : 
          est
      );
      setEstablishments(updatedEstablishments);
      
      setIsRegistrationDialogOpen(false);
      
      toast.success("Establishment registration submitted for approval");
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error("Error registering establishment:", error);
      toast.error("Failed to register establishment");
    }
  };

  const handleApplyForCertification = (establishment: Establishment) => {
    setSelectedEstablishment(establishment);
    setIsApplicationDialogOpen(true);
  };

  const handleSelectApplicationType = (type: "fsec" | "fsic_occupancy" | "fsic_business") => {
    setSelectedApplicationType(type);
    setIsApplicationDialogOpen(false);
    
    if (selectedEstablishment) {
      navigate(`/dashboard/owner/applications/new/${selectedEstablishment.id}?type=${type}`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome to your establishment owner dashboard.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
              {establishments.filter(e => e.status === "registered").length} approved, {establishments.filter(e => e.status === "pending").length} pending
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Applications
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.applications}</div>
            <p className="text-xs text-muted-foreground">
              {applications.filter(a => a.status === "pending").length} pending, {applications.filter(a => a.status === "approved").length} approved
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
              Action needed
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">My Establishments</h3>
          <Link to="/dashboard/owner/establishments">
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
                <CardDescription>DTI: {est.dti_number}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                    est.status === 'registered' 
                      ? 'bg-green-50 text-green-600 border-green-200'
                      : est.status === 'pending'
                      ? 'bg-blue-50 text-blue-600 border-blue-200'
                      : est.status === 'rejected'
                      ? 'bg-red-50 text-red-600 border-red-200'
                      : 'bg-yellow-50 text-yellow-600 border-yellow-200'
                  }`}>
                    {est.status === 'registered' ? 'Registered' :
                     est.status === 'pending' ? 'Pending Approval' :
                     est.status === 'rejected' ? 'Registration Rejected' : 'Unregistered'}
                  </span>
                </div>
                
                {est.status === 'registered' ? (
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button 
                      className="bg-fire hover:bg-fire/90 w-full" 
                      size="sm"
                      onClick={() => handleApplyForCertification(est)}
                    >
                      Apply for Certification
                    </Button>
                  </div>
                ) : est.status === 'pending' ? (
                  <Button className="w-full" variant="outline" size="sm" disabled>
                    <CalendarClock className="mr-2 h-4 w-4" />
                    Awaiting Approval
                  </Button>
                ) : est.status === 'rejected' ? (
                  <Button 
                    className="w-full bg-fire hover:bg-fire/90" 
                    size="sm"
                    onClick={() => handleRegisterEstablishment(est)}
                  >
                    Resubmit Registration
                  </Button>
                ) : (
                  <Button 
                    className="w-full bg-fire hover:bg-fire/90" 
                    size="sm"
                    onClick={() => handleRegisterEstablishment(est)}
                  >
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Application Type</TableHead>
                  <TableHead>Establishment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.length > 0 ? (
                  applications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell>
                        {app.application_type === 'fsec' ? 'FSEC' :
                        app.application_type === 'fsic_occupancy' ? 'FSIC (Occupancy)' :
                        'FSIC (Business)'}
                      </TableCell>
                      <TableCell>{app.establishment?.name || "Unknown"}</TableCell>
                      <TableCell>{app.application_date}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                          app.status === 'pending' ? 'bg-yellow-50 text-yellow-600' :
                          app.status === 'for_inspection' ? 'bg-blue-50 text-blue-600' :
                          app.status === 'approved' ? 'bg-green-50 text-green-600' :
                          'bg-red-50 text-red-600'
                        }`}>
                          {app.status === 'pending' ? 'Pending' :
                           app.status === 'for_inspection' ? 'For Inspection' :
                           app.status === 'approved' ? 'Approved' : 'Rejected'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/dashboard/owner/applications/${app.id}`}>
                            View
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      No applications found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Registration Dialog */}
      <Dialog open={isRegistrationDialogOpen} onOpenChange={setIsRegistrationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Register Establishment</DialogTitle>
            <DialogDescription>
              Provide your establishment's address to register it with the fire department.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="establishmentName">Establishment Name</Label>
              <div className="p-2 bg-gray-50 border rounded-md">
                {selectedEstablishment?.name}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dtiCertificate">DTI Certificate Number</Label>
              <div className="p-2 bg-gray-50 border rounded-md">
                {selectedEstablishment?.dti_number}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Complete Address</Label>
              <Textarea 
                id="address" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter the complete address of your establishment"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRegistrationDialogOpen(false)}>Cancel</Button>
            <Button onClick={submitRegistration}>Register Establishment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Application Type Dialog */}
      <Dialog open={isApplicationDialogOpen} onOpenChange={setIsApplicationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Certification Type</DialogTitle>
            <DialogDescription>
              Choose the type of fire safety certification you need to apply for.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Button 
              onClick={() => handleSelectApplicationType("fsec")}
              className="w-full justify-start text-left h-auto py-3"
              variant="outline"
            >
              <div>
                <div className="font-medium">Fire Safety Evaluation Clearance (FSEC)</div>
                <div className="text-sm text-muted-foreground">Required for building construction or renovation</div>
              </div>
            </Button>
            
            <Button 
              onClick={() => handleSelectApplicationType("fsic_occupancy")}
              className="w-full justify-start text-left h-auto py-3"
              variant="outline"
            >
              <div>
                <div className="font-medium">Fire Safety Inspection Certificate (Occupancy)</div>
                <div className="text-sm text-muted-foreground">Required before occupying a building</div>
              </div>
            </Button>
            
            <Button 
              onClick={() => handleSelectApplicationType("fsic_business")}
              className="w-full justify-start text-left h-auto py-3"
              variant="outline"
            >
              <div>
                <div className="font-medium">Fire Safety Inspection Certificate (Business)</div>
                <div className="text-sm text-muted-foreground">Required for business permit application or renewal</div>
              </div>
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApplicationDialogOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OwnerHome;
