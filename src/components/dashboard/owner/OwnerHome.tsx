
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, FileText, AlertCircle, Plus, CalendarClock } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
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

interface Establishment {
  id: string;
  name: string;
  dti_number: string;
  status: "unregistered" | "registered" | "rejected" | "pending";
  address?: string;
}

interface Application {
  id: string;
  establishment_id: string;
  establishment: {
    name: string;
  };
  application_type: "fsec" | "fsic_occupancy" | "fsic_business";
  status: "pending" | "for-inspection" | "approved" | "rejected";
  date: string;
}

const OwnerHome = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Mock data for the owner's dashboard
      
      // Mock stats
      const mockStats = {
        registeredEstablishments: 1,
        applications: 3,
        requireAttention: 1,
      };
      setStats(mockStats);

      // Mock establishments
      const mockEstablishments: Establishment[] = [
        {
          id: "1",
          name: "ABC Restaurant",
          dti_number: "DTI-123456",
          status: "registered",
          address: "123 Main St, Makati City",
        },
        {
          id: "2",
          name: "XYZ Cafe",
          dti_number: "DTI-789012",
          status: "unregistered",
        },
        {
          id: "3",
          name: "New Bakery",
          dti_number: "DTI-456789",
          status: "pending",
        },
        {
          id: "4",
          name: "Corner Store",
          dti_number: "DTI-234567",
          status: "rejected",
        },
      ];
      setEstablishments(mockEstablishments);

      // Mock applications
      const mockApplications: Application[] = [
        {
          id: "1",
          establishment_id: "1",
          establishment: {
            name: "ABC Restaurant",
          },
          application_type: "fsec",
          status: "pending",
          date: "May 15, 2023",
        },
        {
          id: "2",
          establishment_id: "1",
          establishment: {
            name: "ABC Restaurant",
          },
          application_type: "fsic_business",
          status: "for-inspection",
          date: "May 10, 2023",
        },
      ];
      setApplications(mockApplications);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data.",
        variant: "destructive",
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
      toast({
        title: "Error",
        description: "Please provide the establishment address",
        variant: "destructive",
      });
      return;
    }

    try {
      // In a real app, this would update the Supabase database
      // For now, just update the local state for demonstration
      const updatedEstablishments = establishments.map(est => 
        est.id === selectedEstablishment.id ? 
          { ...est, status: "pending" as const, address } : 
          est
      );
      setEstablishments(updatedEstablishments);
      
      setIsRegistrationDialogOpen(false);
      
      toast({
        title: "Registration Submitted",
        description: "Your establishment registration has been submitted for approval.",
      });
    } catch (error) {
      console.error("Error registering establishment:", error);
      toast({
        title: "Error",
        description: "Failed to register establishment.",
        variant: "destructive",
      });
    }
  };

  const handleApplyForCertification = (establishment: Establishment) => {
    setSelectedEstablishment(establishment);
    setIsApplicationDialogOpen(true);
  };

  const handleSelectApplicationType = (type: "fsec" | "fsic_occupancy" | "fsic_business") => {
    setSelectedApplicationType(type);
    setIsApplicationDialogOpen(false);
    
    // In a real app, this would navigate to the application form page
    // For now, just show a toast notification
    toast({
      title: "Application Type Selected",
      description: `You selected ${
        type === 'fsec' ? 'Fire Safety Evaluation Clearance' :
        type === 'fsic_occupancy' ? 'Fire Safety Inspection Certificate (Occupancy)' :
        'Fire Safety Inspection Certificate (Business)'
      }. Proceeding to application form.`,
    });
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
                  {applications.map((app) => (
                    <tr key={app.id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4 align-middle">
                        {app.application_type === 'fsec' ? 'FSEC' :
                        app.application_type === 'fsic_occupancy' ? 'FSIC (Occupancy)' :
                        'FSIC (Business)'}
                      </td>
                      <td className="p-4 align-middle">{app.establishment.name}</td>
                      <td className="p-4 align-middle">{app.date}</td>
                      <td className="p-4 align-middle">
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                          app.status === 'pending' ? 'bg-yellow-50 text-yellow-600' :
                          app.status === 'for-inspection' ? 'bg-blue-50 text-blue-600' :
                          app.status === 'approved' ? 'bg-green-50 text-green-600' :
                          'bg-red-50 text-red-600'
                        }`}>
                          {app.status === 'pending' ? 'Pending' :
                           app.status === 'for-inspection' ? 'For Inspection' :
                           app.status === 'approved' ? 'Approved' : 'Rejected'}
                        </span>
                      </td>
                      <td className="p-4 align-middle">
                        <Button variant="outline" size="sm">View</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
