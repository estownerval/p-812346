
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Eye, Check, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Define types for our data
interface Owner {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface Establishment {
  id: string;
  name: string;
  dti_number: string;
  address?: string;
  status: "pending" | "approved" | "rejected";
  owner_id: string;
  created_at: string;
  owner: Owner;
  submittedDate?: string; // For UI display
}

const AdminEstablishments = () => {
  const [pendingRegistrations, setPendingRegistrations] = useState<Establishment[]>([]);
  const [approvedRegistrations, setApprovedRegistrations] = useState<Establishment[]>([]);
  const [rejectedRegistrations, setRejectedRegistrations] = useState<Establishment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedEstablishment, setSelectedEstablishment] = useState<Establishment | null>(null);

  useEffect(() => {
    fetchEstablishments();
  }, []);

  const fetchEstablishments = async () => {
    setIsLoading(true);
    
    try {
      // Mock data for demonstration purposes
      const mockEstablishments: Establishment[] = [
        { 
          id: "1", 
          name: "ABC Restaurant", 
          dti_number: "DTI-123456", 
          address: "123 Main St, Makati City",
          status: "pending", 
          owner_id: "user1",
          created_at: "2023-05-15T10:30:00Z",
          submittedDate: "2023-05-15",
          owner: {
            id: "user1",
            first_name: "Jane",
            last_name: "Smith",
            email: "jane.smith@example.com"
          }
        },
        { 
          id: "2", 
          name: "XYZ Mall", 
          dti_number: "DTI-789012", 
          address: "456 Shopping Ave, Pasay City",
          status: "pending", 
          owner_id: "user2",
          created_at: "2023-05-14T14:15:00Z",
          submittedDate: "2023-05-14",
          owner: {
            id: "user2",
            first_name: "John",
            last_name: "Doe",
            email: "john.doe@example.com"
          }
        },
        { 
          id: "3", 
          name: "Grand Hotel", 
          dti_number: "DTI-345678", 
          address: "789 Luxury Blvd, Manila",
          status: "approved", 
          owner_id: "user3",
          created_at: "2023-05-10T09:00:00Z",
          submittedDate: "2023-05-10",
          owner: {
            id: "user3",
            first_name: "Alice",
            last_name: "Johnson",
            email: "alice.johnson@example.com"
          }
        },
        { 
          id: "4", 
          name: "Small Cafe", 
          dti_number: "DTI-987654", 
          address: "321 Coffee St, Quezon City",
          status: "rejected", 
          owner_id: "user4",
          created_at: "2023-05-16T15:00:00Z",
          submittedDate: "2023-05-16",
          owner: {
            id: "user4",
            first_name: "Dave",
            last_name: "Brown",
            email: "dave.brown@example.com"
          }
        },
      ];

      // Filter establishments by status
      setPendingRegistrations(mockEstablishments.filter(est => est.status === "pending"));
      setApprovedRegistrations(mockEstablishments.filter(est => est.status === "approved"));
      setRejectedRegistrations(mockEstablishments.filter(est => est.status === "rejected"));
    } catch (error) {
      console.error("Error fetching establishments:", error);
      toast({
        title: "Error",
        description: "Failed to fetch establishments.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = (id: string) => {
    // Find the establishment to approve
    const establishment = pendingRegistrations.find(est => est.id === id);
    if (!establishment) return;
    
    // Update status locally for demonstration
    const updatedEstablishment = { ...establishment, status: "approved" as const };
    
    // Remove from pending and add to approved
    setPendingRegistrations(pendingRegistrations.filter(est => est.id !== id));
    setApprovedRegistrations([...approvedRegistrations, updatedEstablishment]);
    
    toast({
      title: "Registration Approved",
      description: `${establishment.name} has been approved.`,
    });
    
    // In a real app, you would update the Supabase database here
  };

  const handleReject = (id: string) => {
    // Find the establishment to reject
    const establishment = pendingRegistrations.find(est => est.id === id);
    if (!establishment) return;
    
    // Update status locally for demonstration
    const updatedEstablishment = { ...establishment, status: "rejected" as const };
    
    // Remove from pending and add to rejected
    setPendingRegistrations(pendingRegistrations.filter(est => est.id !== id));
    setRejectedRegistrations([...rejectedRegistrations, updatedEstablishment]);
    
    toast({
      title: "Registration Rejected",
      description: `${establishment.name} has been rejected.`,
      variant: "destructive",
    });
    
    // In a real app, you would update the Supabase database here
  };

  const handleViewDetails = (establishment: Establishment) => {
    setSelectedEstablishment(establishment);
    setViewDialogOpen(true);
  };

  const filteredPendingRegistrations = pendingRegistrations.filter(
    reg => reg.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           reg.dti_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
           reg.owner.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           reg.owner.last_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredApprovedRegistrations = approvedRegistrations.filter(
    reg => reg.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           reg.dti_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
           reg.owner.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           reg.owner.last_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRejectedRegistrations = rejectedRegistrations.filter(
    reg => reg.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           reg.dti_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
           reg.owner.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           reg.owner.last_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                    {filteredPendingRegistrations.length > 0 ? (
                      filteredPendingRegistrations.map((registration) => (
                        <tr key={registration.id} className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle">{registration.name}</td>
                          <td className="p-4 align-middle">{registration.dti_number}</td>
                          <td className="p-4 align-middle">{`${registration.owner.first_name} ${registration.owner.last_name}`}</td>
                          <td className="p-4 align-middle">{registration.submittedDate}</td>
                          <td className="p-4 align-middle">
                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-yellow-50 text-yellow-600">
                              Pending
                            </span>
                          </td>
                          <td className="p-4 align-middle">
                            <div className="flex gap-2">
                              <Button 
                                size="icon" 
                                variant="outline"
                                onClick={() => handleViewDetails(registration)}
                              >
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
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-4 text-center text-muted-foreground">
                          No pending registrations found.
                        </td>
                      </tr>
                    )}
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
                      <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApprovedRegistrations.length > 0 ? (
                      filteredApprovedRegistrations.map((registration) => (
                        <tr key={registration.id} className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle">{registration.name}</td>
                          <td className="p-4 align-middle">{registration.dti_number}</td>
                          <td className="p-4 align-middle">{`${registration.owner.first_name} ${registration.owner.last_name}`}</td>
                          <td className="p-4 align-middle">{registration.submittedDate}</td>
                          <td className="p-4 align-middle">
                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-50 text-green-600">
                              Approved
                            </span>
                          </td>
                          <td className="p-4 align-middle">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleViewDetails(registration)}
                            >
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-4 text-center text-muted-foreground">
                          No approved establishments found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
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
                    {filteredRejectedRegistrations.length > 0 ? (
                      filteredRejectedRegistrations.map((registration) => (
                        <tr key={registration.id} className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle">{registration.name}</td>
                          <td className="p-4 align-middle">{registration.dti_number}</td>
                          <td className="p-4 align-middle">{`${registration.owner.first_name} ${registration.owner.last_name}`}</td>
                          <td className="p-4 align-middle">{registration.submittedDate}</td>
                          <td className="p-4 align-middle">
                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-red-50 text-red-600">
                              Rejected
                            </span>
                          </td>
                          <td className="p-4 align-middle">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleViewDetails(registration)}
                            >
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-4 text-center text-muted-foreground">
                          No rejected registrations found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Establishment Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Establishment Details</DialogTitle>
            <DialogDescription>
              Details of the establishment registration.
            </DialogDescription>
          </DialogHeader>
          
          {selectedEstablishment && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Establishment Name</h4>
                <p>{selectedEstablishment.name}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">DTI Certificate Number</h4>
                <p>{selectedEstablishment.dti_number}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">Address</h4>
                <p>{selectedEstablishment.address || "Not provided"}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">Owner</h4>
                <p>{`${selectedEstablishment.owner.first_name} ${selectedEstablishment.owner.last_name} (${selectedEstablishment.owner.email})`}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">Status</h4>
                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                  selectedEstablishment.status === 'pending' 
                    ? 'bg-yellow-50 text-yellow-600' 
                    : selectedEstablishment.status === 'approved'
                      ? 'bg-green-50 text-green-600'
                      : 'bg-red-50 text-red-600'
                }`}>
                  {selectedEstablishment.status.charAt(0).toUpperCase() + selectedEstablishment.status.slice(1)}
                </span>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">Submitted Date</h4>
                <p>{selectedEstablishment.submittedDate}</p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminEstablishments;
