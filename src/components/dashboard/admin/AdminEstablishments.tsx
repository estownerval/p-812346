
import { useEffect, useState } from "react";
import { 
  Table, TableBody, TableCaption, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Card, CardContent, CardDescription, CardFooter, 
  CardHeader, CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle 
} from "@/components/ui/dialog";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Eye, Search, CheckCircle, XCircle, AlertCircle, 
  Building, Loader2 
} from "lucide-react";
import { toast } from "sonner";

interface OwnerInfo {
  first_name: string;
  last_name: string;
  email: string;
}

interface Establishment {
  id: string;
  name: string;
  dti_number: string;
  status: 'unregistered' | 'registered' | 'rejected' | 'pending';
  address?: string;
  created_at: string;
  updated_at: string;
  owner_id: string;
  owner: OwnerInfo | null;
}

const AdminEstablishments = () => {
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [filteredEstablishments, setFilteredEstablishments] = useState<Establishment[]>([]);
  const [pendingRegistrations, setPendingRegistrations] = useState<Establishment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedEstablishment, setSelectedEstablishment] = useState<Establishment | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [confirmationDialog, setConfirmationDialog] = useState({
    isOpen: false,
    type: "", // "approve" or "reject"
    establishmentId: "",
  });
  const [rejectionReason, setRejectionReason] = useState("");

  const { getEstablishments, updateApplication } = useAuth();

  useEffect(() => {
    fetchEstablishments();
  }, []);

  useEffect(() => {
    filterEstablishments();
  }, [searchTerm, statusFilter, establishments]);

  const fetchEstablishments = async () => {
    setIsLoading(true);
    try {
      const data = await getEstablishments();
      
      // Process the data to ensure it matches our Establishment type
      const processedData = data.map((est: any) => ({
        ...est,
        owner: est.owner && !est.owner.error ? {
          first_name: est.owner.first_name || '',
          last_name: est.owner.last_name || '',
          email: est.owner.email || '',
        } : null
      }));
      
      setEstablishments(processedData);
      
      // Filter pending registrations
      const pending = processedData.filter((est: Establishment) => est.status === 'pending');
      setPendingRegistrations(pending);
      
      setFilteredEstablishments(processedData);
    } catch (error) {
      console.error("Error fetching establishments:", error);
      toast.error("Failed to fetch establishments");
      
      // Mock data for demonstration
      const mockEstablishments: Establishment[] = [
        {
          id: "1",
          name: "ABC Restaurant",
          dti_number: "DTI-123456",
          status: "registered",
          address: "123 Main St, Quezon City",
          created_at: "2023-05-15T10:30:00Z",
          updated_at: "2023-05-15T10:30:00Z",
          owner_id: "user-1",
          owner: {
            first_name: "John",
            last_name: "Doe",
            email: "john.doe@example.com"
          }
        },
        {
          id: "2",
          name: "XYZ Cafe",
          dti_number: "DTI-789012",
          status: "pending",
          address: "456 Park Ave, Makati City",
          created_at: "2023-05-14T14:15:00Z",
          updated_at: "2023-05-14T14:15:00Z",
          owner_id: "user-2",
          owner: {
            first_name: "Jane",
            last_name: "Smith",
            email: "jane.smith@example.com"
          }
        },
        {
          id: "3",
          name: "Grand Hotel",
          dti_number: "DTI-345678",
          status: "rejected",
          address: "789 Beach Rd, Manila",
          created_at: "2023-05-13T09:00:00Z",
          updated_at: "2023-05-13T09:00:00Z",
          owner_id: "user-3",
          owner: {
            first_name: "Bob",
            last_name: "Johnson",
            email: "bob.johnson@example.com"
          }
        },
        {
          id: "4",
          name: "City Mall",
          dti_number: "DTI-567890",
          status: "unregistered",
          created_at: "2023-05-12T11:45:00Z",
          updated_at: "2023-05-12T11:45:00Z",
          owner_id: "user-4",
          owner: {
            first_name: "Alice",
            last_name: "Brown",
            email: "alice.brown@example.com"
          }
        },
        {
          id: "5",
          name: "Tech Hub",
          dti_number: "DTI-901234",
          status: "pending",
          address: "321 Innovation St, Pasig City",
          created_at: "2023-05-11T16:20:00Z",
          updated_at: "2023-05-11T16:20:00Z",
          owner_id: "user-5",
          owner: {
            first_name: "Mike",
            last_name: "Wilson",
            email: "mike.wilson@example.com"
          }
        }
      ];
      setEstablishments(mockEstablishments);
      
      // Filter pending registrations
      const pending = mockEstablishments.filter(est => est.status === 'pending');
      setPendingRegistrations(pending);
      
      setFilteredEstablishments(mockEstablishments);
    } finally {
      setIsLoading(false);
    }
  };

  const filterEstablishments = () => {
    let filtered = [...establishments];
    
    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(est => est.status === statusFilter);
    }
    
    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(est => 
        est.name.toLowerCase().includes(search) || 
        est.dti_number.toLowerCase().includes(search) ||
        (est.address && est.address.toLowerCase().includes(search)) ||
        (est.owner && (
          est.owner.first_name.toLowerCase().includes(search) ||
          est.owner.last_name.toLowerCase().includes(search) ||
          est.owner.email.toLowerCase().includes(search)
        ))
      );
    }
    
    setFilteredEstablishments(filtered);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
  };

  const viewEstablishment = (establishment: Establishment) => {
    setSelectedEstablishment(establishment);
    setIsViewDialogOpen(true);
  };

  const handleApproveOrReject = (type: "approve" | "reject", id: string) => {
    setConfirmationDialog({
      isOpen: true,
      type,
      establishmentId: id
    });
    setRejectionReason("");
  };

  const confirmApproveOrReject = async () => {
    try {
      const { type, establishmentId } = confirmationDialog;
      
      // In a real app, this would update the Supabase database
      // For now, we'll update the local state
      const updatedEstablishments = establishments.map(est => 
        est.id === establishmentId ? 
          { ...est, status: type === "approve" ? "registered" : "rejected" } : 
          est
      );
      
      setEstablishments(updatedEstablishments);
      
      // Filter updated pending registrations
      const pending = updatedEstablishments.filter(est => est.status === 'pending');
      setPendingRegistrations(pending);
      
      // Reset dialogs
      setConfirmationDialog({ isOpen: false, type: "", establishmentId: "" });
      
      // Show success message
      toast.success(`Establishment ${type === "approve" ? "approved" : "rejected"} successfully`);
      
      // Simulate notification to owner
      toast.info(`Notification sent to owner about ${type === "approve" ? "approval" : "rejection"}`);
    } catch (error) {
      console.error(`Error ${confirmationDialog.type}ing establishment:`, error);
      toast.error(`Failed to ${confirmationDialog.type} establishment`);
    }
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
        <h2 className="text-3xl font-bold tracking-tight">Establishments</h2>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">All Establishments</TabsTrigger>
            <TabsTrigger value="registrations">Pending Registrations ({pendingRegistrations.length})</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="registered">Registered</SelectItem>
                <SelectItem value="unregistered">Unregistered</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search establishments..."
                className="w-[250px] pl-8"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
        </div>

        <TabsContent value="all">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>DTI Number</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEstablishments.length > 0 ? (
                    filteredEstablishments.map((establishment) => (
                      <TableRow key={establishment.id}>
                        <TableCell className="font-medium">{establishment.name}</TableCell>
                        <TableCell>{establishment.dti_number}</TableCell>
                        <TableCell>
                          {establishment.owner ? 
                            `${establishment.owner.first_name} ${establishment.owner.last_name}` : 
                            "N/A"}
                        </TableCell>
                        <TableCell>{establishment.address || "Not provided"}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              establishment.status === "registered" 
                                ? "default" 
                                : establishment.status === "pending"
                                ? "secondary"
                                : establishment.status === "rejected"
                                ? "destructive"
                                : "outline"
                            }
                          >
                            {establishment.status === "registered" 
                              ? "Registered" 
                              : establishment.status === "pending"
                              ? "Pending Approval"
                              : establishment.status === "rejected"
                              ? "Rejected"
                              : "Unregistered"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => viewEstablishment(establishment)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        No establishments found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="registrations">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>DTI Number</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Submission Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingRegistrations.length > 0 ? (
                    pendingRegistrations.map((establishment) => (
                      <TableRow key={establishment.id}>
                        <TableCell className="font-medium">{establishment.name}</TableCell>
                        <TableCell>{establishment.dti_number}</TableCell>
                        <TableCell>
                          {establishment.owner ? 
                            `${establishment.owner.first_name} ${establishment.owner.last_name}` : 
                            "N/A"}
                        </TableCell>
                        <TableCell>{establishment.address || "Not provided"}</TableCell>
                        <TableCell>
                          {new Date(establishment.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => viewEstablishment(establishment)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button 
                              variant="default" 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleApproveOrReject("approve", establishment.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleApproveOrReject("reject", establishment.id)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        No pending registrations.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Establishment Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Establishment Details</DialogTitle>
          </DialogHeader>
          {selectedEstablishment && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Name</h4>
                <p className="text-lg">{selectedEstablishment.name}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">DTI Certificate Number</h4>
                <p>{selectedEstablishment.dti_number}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Owner</h4>
                <p>
                  {selectedEstablishment.owner ? 
                    `${selectedEstablishment.owner.first_name} ${selectedEstablishment.owner.last_name}` : 
                    "N/A"}
                </p>
                {selectedEstablishment.owner && (
                  <p className="text-sm text-muted-foreground">
                    {selectedEstablishment.owner.email}
                  </p>
                )}
              </div>
              
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Address</h4>
                <p>{selectedEstablishment.address || "Not provided"}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Status</h4>
                <Badge 
                  variant={
                    selectedEstablishment.status === "registered" 
                      ? "default" 
                      : selectedEstablishment.status === "pending"
                      ? "secondary"
                      : selectedEstablishment.status === "rejected"
                      ? "destructive"
                      : "outline"
                  }
                  className="mt-1"
                >
                  {selectedEstablishment.status === "registered" 
                    ? "Registered" 
                    : selectedEstablishment.status === "pending"
                    ? "Pending Approval"
                    : selectedEstablishment.status === "rejected"
                    ? "Rejected"
                    : "Unregistered"}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Submission Date</h4>
                  <p>{new Date(selectedEstablishment.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Last Updated</h4>
                  <p>{new Date(selectedEstablishment.updated_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmationDialog.isOpen} onOpenChange={(isOpen) => 
        setConfirmationDialog({ ...confirmationDialog, isOpen })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {confirmationDialog.type === "approve" ? "Approve" : "Reject"} Establishment
            </DialogTitle>
            <DialogDescription>
              {confirmationDialog.type === "approve" 
                ? "Are you sure you want to approve this establishment registration?" 
                : "Please provide a reason for rejecting this establishment registration."}
            </DialogDescription>
          </DialogHeader>
          
          {confirmationDialog.type === "reject" && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="rejectionReason">Rejection Reason</Label>
                <Input
                  id="rejectionReason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Enter reason for rejection"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setConfirmationDialog({ isOpen: false, type: "", establishmentId: "" })}
            >
              Cancel
            </Button>
            <Button 
              variant={confirmationDialog.type === "approve" ? "default" : "destructive"}
              onClick={confirmApproveOrReject}
              disabled={confirmationDialog.type === "reject" && !rejectionReason}
            >
              Confirm {confirmationDialog.type === "approve" ? "Approval" : "Rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminEstablishments;
