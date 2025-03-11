
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Routes, Route, Link, useParams } from "react-router-dom";
import { Eye, FileText } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Placeholder data
const applications = [
  {
    id: 1,
    type: "FSEC",
    establishment: "ABC Restaurant",
    dtiCertNo: "DTI-12345-2023",
    applicationDate: "2023-05-10",
    applicationTime: "09:30 AM",
    status: "pending"
  },
  {
    id: 2,
    type: "FSIC (Occupancy)",
    establishment: "ABC Restaurant",
    dtiCertNo: "DTI-12345-2023",
    applicationDate: "2023-05-15",
    applicationTime: "10:45 AM",
    status: "rejected"
  },
  {
    id: 3,
    type: "FSIC (Business)",
    establishment: "XYZ Cafe",
    dtiCertNo: "DTI-67890-2023",
    applicationDate: "2023-05-20",
    applicationTime: "02:15 PM",
    status: "approved"
  }
];

const ApplicationsList = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Certification Applications</h1>
        <p className="text-muted-foreground">
          Manage your fire safety certification applications
        </p>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Applications</TabsTrigger>
          <TabsTrigger value="fsec">FSEC</TabsTrigger>
          <TabsTrigger value="fsic-occupancy">FSIC (Occupancy)</TabsTrigger>
          <TabsTrigger value="fsic-business">FSIC (Business)</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <Table>
            <TableCaption>List of all your certification applications</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Establishment</TableHead>
                <TableHead>DTI Certificate</TableHead>
                <TableHead>Application Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell>{application.id}</TableCell>
                  <TableCell>{application.type}</TableCell>
                  <TableCell>{application.establishment}</TableCell>
                  <TableCell>{application.dtiCertNo}</TableCell>
                  <TableCell>{`${application.applicationDate} ${application.applicationTime}`}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        application.status === "approved" 
                          ? "secondary" 
                          : application.status === "rejected" 
                          ? "destructive" 
                          : "default"
                      }
                    >
                      {application.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/dashboard/owner/applications/${application.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="fsec" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>FSEC Applications</CardTitle>
              <CardDescription>
                Fire Safety Evaluation Clearance for new constructions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Filter for FSEC applications will be available soon.
              </p>
              <Button asChild>
                <Link to="/dashboard/owner/applications/new/fsec">
                  <FileText className="mr-2 h-4 w-4" />
                  New FSEC Application
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="fsic-occupancy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>FSIC (Occupancy) Applications</CardTitle>
              <CardDescription>
                Fire Safety Inspection Certificate for new occupancy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Filter for FSIC (Occupancy) applications will be available soon.
              </p>
              <Button asChild>
                <Link to="/dashboard/owner/applications/new/fsic-occupancy">
                  <FileText className="mr-2 h-4 w-4" />
                  New FSIC (Occupancy) Application
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="fsic-business" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>FSIC (Business) Applications</CardTitle>
              <CardDescription>
                Fire Safety Inspection Certificate for business operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Filter for FSIC (Business) applications will be available soon.
              </p>
              <Button asChild>
                <Link to="/dashboard/owner/applications/new/fsic-business">
                  <FileText className="mr-2 h-4 w-4" />
                  New FSIC (Business) Application
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const ApplicationDetail = () => {
  const { id } = useParams();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Application Details</h1>
          <p className="text-muted-foreground">
            Application ID: {id}
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/dashboard/owner/applications">
            Back to Applications
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Application Information</CardTitle>
          <CardDescription>
            Detailed information about this application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Detailed application view will be available soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

const NewApplication = () => {
  const { type } = useParams();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Application</h1>
          <p className="text-muted-foreground">
            Application Type: {type?.toUpperCase()}
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/dashboard/owner/applications">
            Cancel
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Application Form</CardTitle>
          <CardDescription>
            Complete the form to submit your application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Application form will be available soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

const OwnerApplications = () => {
  return (
    <Routes>
      <Route path="/" element={<ApplicationsList />} />
      <Route path="/:id" element={<ApplicationDetail />} />
      <Route path="/new/:type" element={<NewApplication />} />
    </Routes>
  );
};

export default OwnerApplications;
