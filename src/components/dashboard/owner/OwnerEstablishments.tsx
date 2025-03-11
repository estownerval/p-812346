
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { 
  Eye, 
  Plus, 
  Building, 
  ClipboardList, 
  FileText,
  Loader2 
} from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Establishment {
  id: string;
  name: string;
  dti_number: string;
  status: 'unregistered' | 'registered' | 'rejected';
  address?: string;
  created_at: string;
}

const EstablishmentsList = () => {
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newEstablishment, setNewEstablishment] = useState({ name: "", dtiNumber: "" });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRegistrationDialogOpen, setIsRegistrationDialogOpen] = useState(false);
  const [selectedEstablishment, setSelectedEstablishment] = useState<Establishment | null>(null);
  const [address, setAddress] = useState("");
  
  const { getEstablishments, addEstablishment, registerEstablishment } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEstablishments();
  }, []);

  const fetchEstablishments = async () => {
    setIsLoading(true);
    try {
      const data = await getEstablishments();
      setEstablishments(data);
    } catch (error) {
      console.error("Error fetching establishments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEstablishment = async () => {
    if (!newEstablishment.name || !newEstablishment.dtiNumber) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await addEstablishment(newEstablishment);
      setNewEstablishment({ name: "", dtiNumber: "" });
      setIsDialogOpen(false);
      fetchEstablishments();
    } catch (error) {
      console.error("Error adding establishment:", error);
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
      await registerEstablishment(selectedEstablishment.id, address);
      setIsRegistrationDialogOpen(false);
      fetchEstablishments();
    } catch (error) {
      console.error("Error registering establishment:", error);
    }
  };

  const handleApplyForCertification = (id: string) => {
    navigate(`/dashboard/owner/applications/new/${id}`);
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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Establishments</h1>
          <p className="text-muted-foreground">
            Manage your business establishments
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Establishment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Establishment</DialogTitle>
              <DialogDescription>
                Enter the details of your new business establishment.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Establishment Name</Label>
                <Input 
                  id="name" 
                  value={newEstablishment.name}
                  onChange={(e) => setNewEstablishment({...newEstablishment, name: e.target.value})}
                  placeholder="Enter establishment name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dtiNumber">DTI Certificate Number</Label>
                <Input 
                  id="dtiNumber" 
                  value={newEstablishment.dtiNumber}
                  onChange={(e) => setNewEstablishment({...newEstablishment, dtiNumber: e.target.value})}
                  placeholder="Enter DTI certificate number"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddEstablishment}>Add Establishment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

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
              <Input 
                id="establishmentName" 
                value={selectedEstablishment?.name || ""}
                readOnly
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dtiCertificate">DTI Certificate Number</Label>
              <Input 
                id="dtiCertificate" 
                value={selectedEstablishment?.dti_number || ""}
                readOnly
                disabled
              />
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {establishments.length > 0 ? (
          establishments.map((establishment) => (
            <Card key={establishment.id}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="mr-2 h-5 w-5" />
                  {establishment.name}
                </CardTitle>
                <CardDescription>
                  DTI Certificate: {establishment.dti_number}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={
                      establishment.status === "registered" 
                        ? "secondary" 
                        : establishment.status === "rejected"
                        ? "destructive"
                        : "outline"
                    }
                  >
                    {establishment.status === "registered" 
                      ? "Registered" 
                      : establishment.status === "rejected"
                      ? "Registration Rejected"
                      : "Unregistered"}
                  </Badge>
                  {establishment.created_at && (
                    <span className="text-xs text-muted-foreground">
                      Since {new Date(establishment.created_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
                {establishment.address && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {establishment.address}
                  </p>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                {establishment.status === "unregistered" ? (
                  <Button 
                    variant="default" 
                    onClick={() => handleRegisterEstablishment(establishment)}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Register Establishment
                  </Button>
                ) : establishment.status === "registered" ? (
                  <Button 
                    variant="default" 
                    onClick={() => handleApplyForCertification(establishment.id)}
                  >
                    <ClipboardList className="mr-2 h-4 w-4" />
                    Apply for Certification
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => handleRegisterEstablishment(establishment)}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Resubmit Registration
                  </Button>
                )}
                <Button variant="outline" asChild>
                  <Link to={`/dashboard/owner/establishments/${establishment.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Building className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-2 text-lg font-medium">No establishments yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Add your first establishment to get started.
            </p>
            <Button 
              className="mt-4"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Establishment
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const EstablishmentDetail = () => {
  return <div className="p-6">Establishment Detail (Coming Soon)</div>;
};

const OwnerEstablishments = () => {
  return (
    <Routes>
      <Route path="/" element={<EstablishmentsList />} />
      <Route path="/:id" element={<EstablishmentDetail />} />
    </Routes>
  );
};

export default OwnerEstablishments;
