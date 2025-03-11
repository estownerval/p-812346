
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Eye, Check, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

// Dialogs for confirmation and rejection reason
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
  owner_id: string;
  address: string | null;
  status: "registered" | "unregistered" | "rejected";
  created_at: string;
  owner?: {
    first_name: string;
    last_name: string;
    email: string;
  } | null;
}

const AdminEstablishments = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [pendingRegistrations, setPendingRegistrations] = useState<Establishment[]>([]);
  const [approvedEstablishments, setApprovedEstablishments] = useState<Establishment[]>([]);
  const [rejectedRegistrations, setRejectedRegistrations] = useState<Establishment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedEstablishment, setSelectedEstablishment] = useState<Establishment | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const { getEstablishments } = useAuth();

  useEffect(() => {
    fetchEstablishments();
  }, []);

  const fetchEstablishments = async () => {
    setIsLoading(true);
    try {
      // Fetch establishments with owner information
      const { data, error } = await supabase
        .from('establishments')
        .select(`
          *,
          owner:profiles!owner_id(first_name, last_name, email)
        `);

      if (error) throw error;

      if (data) {
        // Process data to ensure it matches our Establishment type
        const processedData: Establishment[] = data.map(item => ({
          ...item,
          owner: item.owner && typeof item.owner !== 'string' ? item.owner : null
        }));

        // Filter establishments by status
        setPendingRegistrations(processedData.filter(est => 
          est.status === "unregistered" && est.address !== null
        ));
        setApprovedEstablishments(processedData.filter(est => est.status === "registered"));
        setRejectedRegistrations(processedData.filter(est => est.status === "rejected"));
      }
    } catch (error: any) {
      toast.error(`Error fetching establishments: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveClick = (establishment: Establishment) => {
    setSelectedEstablishment(establishment);
    setApproveDialogOpen(true);
  };

  const handleRejectClick = (establishment: Establishment) => {
    setSelectedEstablishment(establishment);
    setRejectionReason("");
    setRejectDialogOpen(true);
  };

  const confirmApprove = async () => {
    if (!selectedEstablishment) return;

    try {
      const { error } = await supabase
        .from('establishments')
        .update({ status: 'registered' })
        .eq('id', selectedEstablishment.id);

      if (error) throw error;

      toast.success("Establishment registration approved");
      fetchEstablishments();
      setApproveDialogOpen(false);
    } catch (error: any) {
      toast.error(`Error approving registration: ${error.message}`);
    }
  };

  const confirmReject = async () => {
    if (!selectedEstablishment || !rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    try {
      const { error } = await supabase
        .from('establishments')
        .update({ 
          status: 'rejected', 
          // In a real app, you might want to store rejection reasons in a separate table
        })
        .eq('id', selectedEstablishment.id);

      if (error) throw error;

      // Send notification to the owner (in a real app this would be a more sophisticated notification system)
      toast.success("Establishment registration rejected");
      fetchEstablishments();
      setRejectDialogOpen(false);
    } catch (error: any) {
      toast.error(`Error rejecting registration: ${error.message}`);
    }
  };

  const filterEstablishments = (establishments: Establishment[]) => {
    if (!searchQuery) return establishments;
    
    return establishments.filter(est => 
      est.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      est.dti_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      est.owner?.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      est.owner?.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      est.owner?.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
                      <th className="h-12 px-4 text-left align-middle font-medium">Address</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Owner</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Submitted Date</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterEstablishments(pendingRegistrations).length > 0 ? (
                      filterEstablishments(pendingRegistrations).map((establishment) => (
                        <tr key={establishment.id} className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle">{establishment.name}</td>
                          <td className="p-4 align-middle">{establishment.dti_number}</td>
                          <td className="p-4 align-middle">{establishment.address || "N/A"}</td>
                          <td className="p-4 align-middle">
                            {establishment.owner ? 
                              `${establishment.owner.first_name} ${establishment.owner.last_name}` : 
                              "Unknown"}
                          </td>
                          <td className="p-4 align-middle">
                            {new Date(establishment.created_at).toLocaleDateString()}
                          </td>
                          <td className="p-4 align-middle">
                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-yellow-50 text-yellow-600">
                              Pending Approval
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
                                onClick={() => handleApproveClick(establishment)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="destructive"
                                onClick={() => handleRejectClick(establishment)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="p-4 text-center text-muted-foreground">
                          No pending registrations found
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
                      <th className="h-12 px-4 text-left align-middle font-medium">Address</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Owner</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Registered Date</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterEstablishments(approvedEstablishments).length > 0 ? (
                      filterEstablishments(approvedEstablishments).map((establishment) => (
                        <tr key={establishment.id} className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle">{establishment.name}</td>
                          <td className="p-4 align-middle">{establishment.dti_number}</td>
                          <td className="p-4 align-middle">{establishment.address || "N/A"}</td>
                          <td className="p-4 align-middle">
                            {establishment.owner ? 
                              `${establishment.owner.first_name} ${establishment.owner.last_name}` : 
                              "Unknown"}
                          </td>
                          <td className="p-4 align-middle">
                            {new Date(establishment.created_at).toLocaleDateString()}
                          </td>
                          <td className="p-4 align-middle">
                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-50 text-green-600">
                              Registered
                            </span>
                          </td>
                          <td className="p-4 align-middle">
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="p-4 text-center text-muted-foreground">
                          No approved establishments found
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
                      <th className="h-12 px-4 text-left align-middle font-medium">Address</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Owner</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Rejected Date</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterEstablishments(rejectedRegistrations).length > 0 ? (
                      filterEstablishments(rejectedRegistrations).map((establishment) => (
                        <tr key={establishment.id} className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle">{establishment.name}</td>
                          <td className="p-4 align-middle">{establishment.dti_number}</td>
                          <td className="p-4 align-middle">{establishment.address || "N/A"}</td>
                          <td className="p-4 align-middle">
                            {establishment.owner ? 
                              `${establishment.owner.first_name} ${establishment.owner.last_name}` : 
                              "Unknown"}
                          </td>
                          <td className="p-4 align-middle">
                            {new Date(establishment.created_at).toLocaleDateString()}
                          </td>
                          <td className="p-4 align-middle">
                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-red-50 text-red-600">
                              Rejected
                            </span>
                          </td>
                          <td className="p-4 align-middle">
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="p-4 text-center text-muted-foreground">
                          No rejected registrations found
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

      {/* Approval Confirmation Dialog */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Establishment Registration</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve the registration for {selectedEstablishment?.name}?
              This will change the establishment status to "Registered".
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveDialogOpen(false)}>Cancel</Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={confirmApprove}>
              Confirm Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Establishment Registration</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting the registration for {selectedEstablishment?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rejectionReason">Rejection Reason</Label>
              <Textarea
                id="rejectionReason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter reason for rejection"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmReject}>
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminEstablishments;
