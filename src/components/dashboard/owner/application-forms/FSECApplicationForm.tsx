
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { 
  FileText, 
  Upload, 
  CheckCircle, 
  ArrowLeft, 
  ArrowRight, 
  File,
  X,
  Building
} from "lucide-react";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

const FSECApplicationForm = () => {
  const navigate = useNavigate();
  const { establishmentId } = useParams<{ establishmentId: string }>();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    establishmentName: "ABC Restaurant", // Pre-filled for demo
    dtiNumber: "DTI-123456", // Pre-filled for demo
    address: "123 Main St, Makati City",
    contactPerson: "",
    contactNumber: "",
    email: "",
    buildingType: "",
    projectType: "",
    projectDescription: "",
  });
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [fileErrors, setFileErrors] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles) return;

    const newErrors: string[] = [];
    const newFiles: UploadedFile[] = [];

    // Check if we already have 2 files
    if (files.length + uploadedFiles.length > 2) {
      newErrors.push("You can only upload a maximum of 2 files.");
      setFileErrors(newErrors);
      return;
    }

    Array.from(uploadedFiles).forEach(file => {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        newErrors.push(`File ${file.name} exceeds 5MB size limit.`);
        return;
      }

      // Check file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        newErrors.push(`File ${file.name} is not a supported file type. Please upload PDF, JPEG, or PNG.`);
        return;
      }

      // Create URL for preview
      const fileUrl = URL.createObjectURL(file);
      
      newFiles.push({
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        url: fileUrl,
      });
    });

    setFileErrors(newErrors);
    if (newFiles.length > 0) {
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const goToNextStep = () => {
    // Validate current step
    if (currentStep === 1) {
      if (!formData.contactPerson || !formData.contactNumber || !formData.email || 
          !formData.buildingType || !formData.projectType || !formData.projectDescription) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }
    } else if (currentStep === 2) {
      if (files.length < 1) {
        toast({
          title: "Validation Error",
          description: "Please upload at least one file.",
          variant: "destructive",
        });
        return;
      }
    }

    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const goToPreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    // Here you would submit the form data to your backend
    // For demo purposes, we'll just show a success toast
    toast({
      title: "Application Submitted",
      description: "Your FSEC application has been submitted successfully.",
    });
    
    // Navigate back to applications list
    navigate("/dashboard/owner/applications");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">FSEC Application</h2>
          <p className="text-muted-foreground">
            Apply for a Fire Safety Evaluation Clearance (FSEC)
          </p>
        </div>
      </div>

      <Tabs value={`step-${currentStep}`} className="space-y-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="step-1" disabled>Step 1: Application Details</TabsTrigger>
          <TabsTrigger value="step-2" disabled>Step 2: Document Upload</TabsTrigger>
          <TabsTrigger value="step-3" disabled>Step 3: Review & Submit</TabsTrigger>
        </TabsList>

        <TabsContent value={`step-${currentStep}`} className="space-y-4">
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Application Details</CardTitle>
                <CardDescription>
                  Provide details about your establishment and building project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="establishmentName">Establishment Name</Label>
                      <div className="flex items-center space-x-2 p-2 bg-gray-50 border rounded-md">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span>{formData.establishmentName}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="dtiNumber">DTI Certificate Number</Label>
                      <div className="flex items-center space-x-2 p-2 bg-gray-50 border rounded-md">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>{formData.dtiNumber}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Complete Address</Label>
                    <Textarea 
                      id="address" 
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter the complete address"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactPerson">Contact Person</Label>
                      <Input 
                        id="contactPerson" 
                        name="contactPerson"
                        value={formData.contactPerson}
                        onChange={handleInputChange}
                        placeholder="Name of contact person"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contactNumber">Contact Number</Label>
                      <Input 
                        id="contactNumber" 
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleInputChange}
                        placeholder="Phone number"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email address"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="buildingType">Building Type</Label>
                      <select
                        id="buildingType"
                        name="buildingType"
                        value={formData.buildingType}
                        onChange={handleInputChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="">Select building type</option>
                        <option value="commercial">Commercial</option>
                        <option value="residential">Residential</option>
                        <option value="industrial">Industrial</option>
                        <option value="institutional">Institutional</option>
                        <option value="mixed">Mixed Use</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="projectType">Project Type</Label>
                      <select
                        id="projectType"
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleInputChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="">Select project type</option>
                        <option value="new">New Construction</option>
                        <option value="renovation">Renovation</option>
                        <option value="addition">Addition</option>
                        <option value="alteration">Alteration</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="projectDescription">Project Description</Label>
                    <Textarea 
                      id="projectDescription" 
                      name="projectDescription"
                      value={formData.projectDescription}
                      onChange={handleInputChange}
                      placeholder="Briefly describe your project"
                      rows={4}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button 
                    type="button" 
                    onClick={goToNextStep}
                    className="bg-fire hover:bg-fire/90"
                  >
                    Next Step <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Document Upload</CardTitle>
                <CardDescription>
                  Upload required documents for your FSEC application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-base font-medium">Upload your documents</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Drag and drop your files here, or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Upload architectural plans, building plans, fire safety plans, or other relevant documents (PDF, JPEG, PNG, max 5MB each)
                    </p>
                    <Button variant="outline" className="relative">
                      Browse Files
                      <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleFileUpload}
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                    </Button>
                  </div>
                  
                  {fileErrors.length > 0 && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                      <ul className="list-disc list-inside text-sm">
                        {fileErrors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {files.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Uploaded Documents ({files.length}/2)</h4>
                      <div className="space-y-2">
                        {files.map((file) => (
                          <div 
                            key={file.id}
                            className="flex items-center justify-between p-3 bg-gray-50 border rounded-md"
                          >
                            <div className="flex items-center space-x-3">
                              <File className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">{file.name}</p>
                                <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => window.open(file.url, '_blank')}
                              >
                                View
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => removeFile(file.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between pt-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={goToPreviousStep}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button 
                    type="button" 
                    onClick={goToNextStep}
                    className="bg-fire hover:bg-fire/90"
                  >
                    Next Step <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Review & Submit</CardTitle>
                <CardDescription>
                  Review your application before submitting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-medium">Establishment Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Establishment Name</p>
                        <p>{formData.establishmentName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">DTI Certificate Number</p>
                        <p>{formData.dtiNumber}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm font-medium text-muted-foreground">Address</p>
                        <p>{formData.address}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-base font-medium">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Contact Person</p>
                        <p>{formData.contactPerson}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Contact Number</p>
                        <p>{formData.contactNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Email Address</p>
                        <p>{formData.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-base font-medium">Project Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Building Type</p>
                        <p>{formData.buildingType.charAt(0).toUpperCase() + formData.buildingType.slice(1)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Project Type</p>
                        <p>{formData.projectType.charAt(0).toUpperCase() + formData.projectType.slice(1)}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm font-medium text-muted-foreground">Project Description</p>
                        <p>{formData.projectDescription}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-base font-medium">Uploaded Documents</h3>
                    <div className="space-y-2 mt-2">
                      {files.map((file) => (
                        <div 
                          key={file.id}
                          className="flex items-center justify-between p-2 bg-gray-50 border rounded-md"
                        >
                          <div className="flex items-center space-x-3">
                            <File className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm">{file.name}</p>
                              <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => window.open(file.url, '_blank')}
                          >
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between pt-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={goToPreviousStep}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button 
                    type="button" 
                    className="bg-fire hover:bg-fire/90"
                    onClick={handleSubmit}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" /> Submit Application
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FSECApplicationForm;
