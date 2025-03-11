
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
import { Routes, Route, Link, useParams, useNavigate } from "react-router-dom";
import { Eye, FileText, Upload, ArrowLeft, File, Save, Loader2 } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const ApplicationsList = () => {
  const { getApplications } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true);
      try {
        const data = await getApplications();
        setApplications(data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [getApplications]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-fire" />
      </div>
    );
  }

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
              {applications.length > 0 ? (
                applications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>{application.id.substring(0, 8)}</TableCell>
                    <TableCell>{application.application_type.toUpperCase()}</TableCell>
                    <TableCell>{application.establishment?.name || "N/A"}</TableCell>
                    <TableCell>{application.establishment?.dti_number || "N/A"}</TableCell>
                    <TableCell>{`${application.application_date || "N/A"} ${application.application_time || ""}`}</TableCell>
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
                        {application.status.replace(/_/g, ' ')}
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
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No applications found. Create a new application to get started.
                  </TableCell>
                </TableRow>
              )}
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
                FSEC is required for building permit applications for new construction.
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
                FSIC for Occupancy is required for occupancy permit applications.
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
                FSIC for Business is required for business permit applications.
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
  const { getApplication } = useAuth();
  const [application, setApplication] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplication = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const data = await getApplication(id);
        if (data) {
          setApplication(data);
        }
      } catch (error) {
        console.error("Error fetching application:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplication();
  }, [id, getApplication]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-fire" />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Application Not Found</h1>
            <p className="text-muted-foreground">
              The application you are looking for does not exist or you do not have permission to view it.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/dashboard/owner/applications">
              Back to Applications
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Application Details</h1>
          <p className="text-muted-foreground">
            Application ID: {id?.substring(0, 8)}
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/dashboard/owner/applications">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Applications
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Application Information</CardTitle>
          <CardDescription>
            Details about this certification application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Application Type</h3>
              <p className="text-lg">{application.application_type.toUpperCase()}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
              <Badge 
                className="mt-1"
                variant={
                  application.status === "approved" 
                    ? "secondary" 
                    : application.status === "rejected" 
                    ? "destructive" 
                    : "default"
                }
              >
                {application.status.replace(/_/g, ' ')}
              </Badge>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Establishment Name</h3>
              <p className="text-lg">{application.establishment?.name || "N/A"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">DTI Certificate Number</h3>
              <p className="text-lg">{application.establishment?.dti_number || "N/A"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Application Date</h3>
              <p className="text-lg">{application.application_date || "N/A"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Application Time</h3>
              <p className="text-lg">{application.application_time || "N/A"}</p>
            </div>
          </div>
          
          {application.status === "rejected" && application.rejection_reason && (
            <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-md">
              <h3 className="text-sm font-medium text-red-800">Rejection Reason</h3>
              <p className="text-red-700">{application.rejection_reason}</p>
            </div>
          )}
          
          {application.status === "for_inspection" && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-md">
              <h3 className="text-sm font-medium text-blue-800">Inspection Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-sm text-blue-700">Scheduled Date: {application.inspection_date || "Not scheduled yet"}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-700">Scheduled Time: {application.inspection_time || "Not scheduled yet"}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Application Form Step 1: Basic Information
const Step1 = ({ formData, setFormData, establishment, onNext }: any) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="establishmentName">Establishment Name</Label>
        <Input
          id="establishmentName"
          value={establishment.name}
          readOnly
          disabled
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="dtiNumber">DTI Certificate Number</Label>
        <Input
          id="dtiNumber"
          value={establishment.dti_number}
          readOnly
          disabled
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={establishment.address || ""}
          readOnly
          disabled
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="contactInfo">Contact Information</Label>
        <Input
          id="contactInfo"
          value={formData.contactInfo}
          onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
          placeholder="Phone number or email"
          required
        />
      </div>
      
      <div className="pt-4 flex justify-end">
        <Button onClick={onNext}>
          Next Step
        </Button>
      </div>
    </div>
  );
};

// Application Form Step 2: Document Upload
const Step2 = ({ formData, setFormData, onPrevious, onNext }: any) => {
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    buildingPlan: null,
    fireProtectionPlan: null,
    businessPermit: null,
    occupancyPermit: null
  });
  
  const [fileNames, setFileNames] = useState<{ [key: string]: string }>({
    buildingPlan: "",
    fireProtectionPlan: "",
    businessPermit: "",
    occupancyPermit: ""
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFiles({ ...files, [fileType]: file });
      setFileNames({ ...fileNames, [fileType]: file.name });
      
      // Update form data for submission
      const updatedDocs = [...formData.documents];
      const existingIndex = updatedDocs.findIndex(doc => doc.type === fileType);
      
      if (existingIndex >= 0) {
        updatedDocs[existingIndex] = { type: fileType, file, name: file.name };
      } else {
        updatedDocs.push({ type: fileType, file, name: file.name });
      }
      
      setFormData({ ...formData, documents: updatedDocs });
    }
  };

  const requiredDocuments = 
    formData.applicationType === 'fsec' ? ['buildingPlan', 'fireProtectionPlan'] : 
    formData.applicationType === 'fsic_occupancy' ? ['buildingPlan', 'occupancyPermit'] : 
    ['businessPermit', 'occupancyPermit'];

  const isNextDisabled = !requiredDocuments.every(docType => files[docType]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Required Documents</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Please upload the following required documents
        </p>
      </div>
      
      {(formData.applicationType === 'fsec' || formData.applicationType === 'fsic_occupancy') && (
        <div className="space-y-4">
          <div className="border rounded-md p-4">
            <Label htmlFor="buildingPlan" className="block mb-2">Building Plan</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="buildingPlan"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileChange(e, 'buildingPlan')}
                className="flex-1"
                required
              />
              {files.buildingPlan && (
                <Badge variant="secondary">
                  <File className="h-3 w-3 mr-1" />
                  Uploaded
                </Badge>
              )}
            </div>
            {fileNames.buildingPlan && (
              <p className="text-sm text-muted-foreground mt-1">{fileNames.buildingPlan}</p>
            )}
          </div>
          
          {formData.applicationType === 'fsec' && (
            <div className="border rounded-md p-4">
              <Label htmlFor="fireProtectionPlan" className="block mb-2">Fire Protection Plan</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="fireProtectionPlan"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(e, 'fireProtectionPlan')}
                  className="flex-1"
                  required
                />
                {files.fireProtectionPlan && (
                  <Badge variant="secondary">
                    <File className="h-3 w-3 mr-1" />
                    Uploaded
                  </Badge>
                )}
              </div>
              {fileNames.fireProtectionPlan && (
                <p className="text-sm text-muted-foreground mt-1">{fileNames.fireProtectionPlan}</p>
              )}
            </div>
          )}
          
          {formData.applicationType === 'fsic_occupancy' && (
            <div className="border rounded-md p-4">
              <Label htmlFor="occupancyPermit" className="block mb-2">Occupancy Permit</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="occupancyPermit"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(e, 'occupancyPermit')}
                  className="flex-1"
                  required
                />
                {files.occupancyPermit && (
                  <Badge variant="secondary">
                    <File className="h-3 w-3 mr-1" />
                    Uploaded
                  </Badge>
                )}
              </div>
              {fileNames.occupancyPermit && (
                <p className="text-sm text-muted-foreground mt-1">{fileNames.occupancyPermit}</p>
              )}
            </div>
          )}
        </div>
      )}
      
      {formData.applicationType === 'fsic_business' && (
        <div className="space-y-4">
          <div className="border rounded-md p-4">
            <Label htmlFor="businessPermit" className="block mb-2">Business Permit</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="businessPermit"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileChange(e, 'businessPermit')}
                className="flex-1"
                required
              />
              {files.businessPermit && (
                <Badge variant="secondary">
                  <File className="h-3 w-3 mr-1" />
                  Uploaded
                </Badge>
              )}
            </div>
            {fileNames.businessPermit && (
              <p className="text-sm text-muted-foreground mt-1">{fileNames.businessPermit}</p>
            )}
          </div>
          
          <div className="border rounded-md p-4">
            <Label htmlFor="occupancyPermit" className="block mb-2">Occupancy Permit</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="occupancyPermit"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileChange(e, 'occupancyPermit')}
                className="flex-1"
                required
              />
              {files.occupancyPermit && (
                <Badge variant="secondary">
                  <File className="h-3 w-3 mr-1" />
                  Uploaded
                </Badge>
              )}
            </div>
            {fileNames.occupancyPermit && (
              <p className="text-sm text-muted-foreground mt-1">{fileNames.occupancyPermit}</p>
            )}
          </div>
        </div>
      )}
      
      <div className="pt-4 flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Previous Step
        </Button>
        <Button onClick={onNext} disabled={isNextDisabled}>
          Next Step
        </Button>
      </div>
    </div>
  );
};

// Application Form Step 3: Summary and Submission
const Step3 = ({ formData, onPrevious, onSubmit, isSubmitting }: any) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Application Summary</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Please review your application details before submitting
        </p>
      </div>
      
      <div className="border rounded-md p-4 space-y-4">
        <div>
          <h4 className="text-sm font-medium">Application Type</h4>
          <p>{formData.applicationType.replace(/_/g, ' ').toUpperCase()}</p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium">Establishment Information</h4>
          <p>{formData.establishmentName}</p>
          <p className="text-sm text-muted-foreground">DTI: {formData.dtiNumber}</p>
          <p className="text-sm text-muted-foreground">{formData.address}</p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium">Contact Information</h4>
          <p>{formData.contactInfo}</p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium">Uploaded Documents</h4>
          <ul className="list-disc pl-5 text-sm">
            {formData.documents.map((doc: any, index: number) => (
              <li key={index}>
                {doc.type.charAt(0).toUpperCase() + doc.type.slice(1)}: {doc.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="additionalNotes">Additional Notes (Optional)</Label>
        <Textarea
          id="additionalNotes"
          placeholder="Add any additional information that might be relevant for your application"
          rows={3}
        />
      </div>
      
      <div className="pt-4 flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Previous Step
        </Button>
        <Button onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Submit Application
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

const NewApplication = () => {
  const { type, establishmentId } = useParams();
  const { getEstablishments, submitApplication } = useAuth();
  const [step, setStep] = useState(1);
  const [establishment, setEstablishment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    establishmentId: establishmentId || '',
    establishmentName: '',
    dtiNumber: '',
    address: '',
    contactInfo: '',
    applicationType: type === 'fsec' ? 'fsec' : 
                     type === 'fsic-occupancy' ? 'fsic_occupancy' : 
                     'fsic_business',
    documents: []
  });

  useEffect(() => {
    const fetchEstablishment = async () => {
      if (!establishmentId) return;
      
      setIsLoading(true);
      try {
        const establishments = await getEstablishments();
        const found = establishments.find(est => est.id === establishmentId);
        
        if (found) {
          setEstablishment(found);
          setFormData(prev => ({
            ...prev,
            establishmentName: found.name,
            dtiNumber: found.dti_number,
            address: found.address || ''
          }));
        }
      } catch (error) {
        console.error("Error fetching establishment:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEstablishment();
  }, [establishmentId, getEstablishments]);

  const handleNext = () => {
    setStep(step + 1);
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await submitApplication(formData);
      toast.success("Application submitted successfully!");
      navigate("/dashboard/owner/applications");
    } catch (error) {
      console.error("Error submitting application:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-fire" />
      </div>
    );
  }

  if (!establishment) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Establishment Not Found</h1>
            <p className="text-muted-foreground">
              The establishment you are trying to apply for does not exist or you do not have permission to access it.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/dashboard/owner/establishments">
              Go to Establishments
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Application</h1>
          <p className="text-muted-foreground">
            Application Type: {type?.replace('-', ' ').toUpperCase()}
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/dashboard/owner/applications">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancel
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Application Form</CardTitle>
          <CardDescription>
            Complete the form to submit your {type?.replace('-', ' ').toUpperCase()} application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative after:absolute after:inset-x-0 after:top-1/2 after:block after:h-0.5 after:-translate-y-1/2 after:rounded-lg after:bg-gray-100">
              <ol className="relative z-10 flex justify-between text-sm font-medium text-gray-500">
                <li className="flex items-center gap-2 bg-white p-2">
                  <span className={`h-6 w-6 rounded-full text-center text-[10px]/6 font-bold ${step >= 1 ? 'bg-fire text-white' : 'bg-gray-100'}`}>
                    1
                  </span>
                  <span className={`hidden sm:block ${step >= 1 ? 'text-gray-900' : ''}`}>Details</span>
                </li>

                <li className="flex items-center gap-2 bg-white p-2">
                  <span className={`h-6 w-6 rounded-full text-center text-[10px]/6 font-bold ${step >= 2 ? 'bg-fire text-white' : 'bg-gray-100'}`}>
                    2
                  </span>
                  <span className={`hidden sm:block ${step >= 2 ? 'text-gray-900' : ''}`}>Documents</span>
                </li>

                <li className="flex items-center gap-2 bg-white p-2">
                  <span className={`h-6 w-6 rounded-full text-center text-[10px]/6 font-bold ${step >= 3 ? 'bg-fire text-white' : 'bg-gray-100'}`}>
                    3
                  </span>
                  <span className={`hidden sm:block ${step >= 3 ? 'text-gray-900' : ''}`}>Summary</span>
                </li>
              </ol>
            </div>
          </div>
          
          {step === 1 && (
            <Step1 
              formData={formData} 
              setFormData={setFormData} 
              establishment={establishment}
              onNext={handleNext}
            />
          )}
          
          {step === 2 && (
            <Step2 
              formData={formData} 
              setFormData={setFormData}
              onPrevious={handlePrevious}
              onNext={handleNext}
            />
          )}
          
          {step === 3 && (
            <Step3 
              formData={formData}
              onPrevious={handlePrevious}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          )}
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
      <Route path="/new/:type/:establishmentId" element={<NewApplication />} />
    </Routes>
  );
};

export default OwnerApplications;
