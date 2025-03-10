
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Json } from "@/integrations/supabase/types";

interface AssignedInspection {
  id: string;
  inspectionId?: number;
  establishmentName: string;
  owner: string;
  inspectionDate: string;
  inspectionTime: string;
  status: 'for_inspection' | 'inspected';
  applicationId: string;
  applicationType: string;
}

interface ChecklistItem {
  label: string;
  value: string;
}

interface ChecklistSection {
  title: string;
  items: ChecklistItem[];
}

interface ChecklistFormData {
  sections: ChecklistSection[];
  comments: string;
  images: File[];
  inspectorName: string;
  isCompleted: boolean;
}

const InspectorDashboard: React.FC = () => {
  const [assignedInspections, setAssignedInspections] = useState<AssignedInspection[]>([]);
  const [showChecklistModal, setShowChecklistModal] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [checklistData, setChecklistData] = useState<ChecklistFormData>({
    sections: [
      {
        title: "Fire Safety Equipment",
        items: [
          { label: "Fire Extinguishers are properly installed and maintained", value: "" },
          { label: "Fire alarm system is working properly", value: "" },
          { label: "Sprinkler system is working properly", value: "" }
        ]
      },
      {
        title: "Evacuation Routes",
        items: [
          { label: "Exit signs are properly illuminated", value: "" },
          { label: "Evacuation routes are clear and unobstructed", value: "" },
          { label: "Emergency lighting is functional", value: "" }
        ]
      }
    ],
    comments: "",
    images: [],
    inspectorName: "",
    isCompleted: false
  });
  const [selectedInspection, setSelectedInspection] = useState<AssignedInspection | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please login to access the dashboard",
          duration: 3000,
        });
        navigate("/inspector/login");
        return;
      }
      
      // Fetch current user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
        
      if (profileError || !profileData || profileData.role !== 'fire_inspector') {
        toast({
          title: "Access denied",
          description: "You don't have permission to access this page",
          duration: 3000,
        });
        await supabase.auth.signOut();
        navigate("/inspector/login");
        return;
      }
      
      setCurrentUser(profileData);
      
      // Now fetch assigned inspections
      fetchAssignedInspections(session.user.id);
    };
    
    checkAuth();
  }, [navigate, toast]);

  const fetchAssignedInspections = async (inspectorId: string) => {
    setLoading(true);
    
    // Fetch FSIC Business applications assigned to this inspector
    const { data: businessApps, error: businessError } = await supabase
      .from('fsic_business_applications')
      .select(`
        id,
        inspection_date,
        inspection_time,
        status,
        establishments(name, owner_id)
      `)
      .eq('inspector_id', inspectorId);
      
    // Fetch FSIC Occupancy applications assigned to this inspector
    const { data: occupancyApps, error: occupancyError } = await supabase
      .from('fsic_occupancy_applications')
      .select(`
        id,
        inspection_date,
        inspection_time,
        status,
        establishments(name, owner_id)
      `)
      .eq('inspector_id', inspectorId);
    
    if (businessError || occupancyError) {
      toast({
        title: "Error fetching assignments",
        description: businessError?.message || occupancyError?.message,
        duration: 3000,
      });
      setLoading(false);
      return;
    }
    
    // Fetch owner profiles separately
    const ownerProfiles: Record<string, string> = {};
    
    if (businessApps?.length || occupancyApps?.length) {
      const ownerIds = new Set<string>();
      
      // Collect all owner IDs
      businessApps?.forEach(app => {
        if (app.establishments?.owner_id) ownerIds.add(app.establishments.owner_id);
      });
      
      occupancyApps?.forEach(app => {
        if (app.establishments?.owner_id) ownerIds.add(app.establishments.owner_id);
      });
      
      // Fetch all profiles at once
      if (ownerIds.size > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, first_name, last_name')
          .in('id', Array.from(ownerIds));
          
        if (profiles) {
          profiles.forEach(profile => {
            ownerProfiles[profile.id] = `${profile.first_name} ${profile.last_name}`;
          });
        }
      }
    }
    
    const formattedBusinessApps = businessApps ? businessApps.map((app, index) => {
      const ownerId = app.establishments?.owner_id || "";
      return {
        id: app.id,
        inspectionId: index + 1,
        establishmentName: app.establishments?.name || "Unknown",
        owner: ownerProfiles[ownerId] || "Unknown",
        inspectionDate: app.inspection_date || "Not scheduled",
        inspectionTime: app.inspection_time || "Not scheduled",
        status: app.status as 'for_inspection' | 'inspected',
        applicationId: app.id,
        applicationType: 'fsic_business'
      };
    }) : [];
    
    const formattedOccupancyApps = occupancyApps ? occupancyApps.map((app, index) => {
      const ownerId = app.establishments?.owner_id || "";
      return {
        id: app.id,
        inspectionId: formattedBusinessApps.length + index + 1,
        establishmentName: app.establishments?.name || "Unknown",
        owner: ownerProfiles[ownerId] || "Unknown",
        inspectionDate: app.inspection_date || "Not scheduled",
        inspectionTime: app.inspection_time || "Not scheduled",
        status: app.status as 'for_inspection' | 'inspected',
        applicationId: app.id,
        applicationType: 'fsic_occupancy'
      };
    }) : [];
    
    setAssignedInspections([...formattedBusinessApps, ...formattedOccupancyApps]);
    setLoading(false);
  };

  const handleIssueChecklist = (inspection: AssignedInspection) => {
    console.log(`Issuing checklist for inspection ${inspection.id}`);
    setShowChecklistModal(inspection.id);
    setSelectedInspection(inspection);
    setCurrentStep(1);
    
    // Reset checklist data
    setChecklistData({
      sections: [
        {
          title: "Fire Safety Equipment",
          items: [
            { label: "Fire Extinguishers are properly installed and maintained", value: "" },
            { label: "Fire alarm system is working properly", value: "" },
            { label: "Sprinkler system is working properly", value: "" }
          ]
        },
        {
          title: "Evacuation Routes",
          items: [
            { label: "Exit signs are properly illuminated", value: "" },
            { label: "Evacuation routes are clear and unobstructed", value: "" },
            { label: "Emergency lighting is functional", value: "" }
          ]
        }
      ],
      comments: "",
      images: [],
      inspectorName: `${currentUser?.first_name || ""} ${currentUser?.last_name || ""}`,
      isCompleted: false
    });
    
    setImageUrls([]);
  };

  const handleViewChecklist = async (id: string, applicationType: string) => {
    console.log(`Viewing checklist for inspection ${id}`);
    
    try {
      const { data, error } = await supabase
        .from('inspection_checklists')
        .select('*')
        .eq('application_id', id)
        .eq('application_type', applicationType)
        .single();
        
      if (error) throw error;
      
      if (data) {
        // Display checklist data in a modal or navigate to checklist view page
        toast({
          title: "Checklist Loaded",
          description: "Inspection checklist loaded successfully",
          duration: 3000,
        });
        
        // Here you could set state to show a modal with the checklist data
      }
    } catch (error: any) {
      toast({
        title: "Error loading checklist",
        description: error.message,
        duration: 3000,
      });
    }
  };

  const handleInputChange = (sectionIndex: number, itemIndex: number, value: string) => {
    const updatedSections = [...checklistData.sections];
    updatedSections[sectionIndex].items[itemIndex].value = value;
    setChecklistData({
      ...checklistData,
      sections: updatedSections
    });
  };

  const handleCommentsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setChecklistData({
      ...checklistData,
      comments: e.target.value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      setChecklistData({
        ...checklistData,
        images: [...checklistData.images, ...selectedFiles]
      });
      
      // Create preview URLs
      const newImageUrls = selectedFiles.map(file => URL.createObjectURL(file));
      setImageUrls([...imageUrls, ...newImageUrls]);
    }
  };

  const handleInspectorNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecklistData({
      ...checklistData,
      inspectorName: e.target.value
    });
  };

  const handleCompletedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecklistData({
      ...checklistData,
      isCompleted: e.target.checked
    });
  };

  const handleChecklistSubmit = async () => {
    if (!selectedInspection || !currentUser) {
      toast({
        title: "Error",
        description: "Missing inspection or user data",
        duration: 3000,
      });
      return;
    }
    
    try {
      setSubmitting(true);
      
      // 1. Upload images to storage
      const uploadedImageUrls: string[] = [];
      
      for (const image of checklistData.images) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${selectedInspection.applicationId}/${fileName}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('application_files')
          .upload(filePath, image);
          
        if (uploadError) throw uploadError;
        
        const { data: urlData } = supabase.storage
          .from('application_files')
          .getPublicUrl(filePath);
          
        uploadedImageUrls.push(urlData.publicUrl);
      }
      
      // 2. Save checklist data
      const checklistFormData = {
        application_id: selectedInspection.applicationId,
        application_type: selectedInspection.applicationType,
        inspector_id: currentUser.id,
        inspector_name: checklistData.inspectorName,
        checklist_data: {
          sections: checklistData.sections,
          comments: checklistData.comments
        } as unknown as Json,
        images: uploadedImageUrls,
      };
      
      const { error: insertError } = await supabase
        .from('inspection_checklists')
        .insert(checklistFormData);
        
      if (insertError) throw insertError;
      
      // 3. Update application status to 'inspected'
      let updateError;
      if (selectedInspection.applicationType === 'fsic_business') {
        const { error } = await supabase
          .from('fsic_business_applications')
          .update({ status: 'inspected' })
          .eq('id', selectedInspection.applicationId);
        updateError = error;
      } else {
        const { error } = await supabase
          .from('fsic_occupancy_applications')
          .update({ status: 'inspected' })
          .eq('id', selectedInspection.applicationId);
        updateError = error;
      }
      
      if (updateError) throw updateError;
      
      // 4. Create notification for admin
      const { error: notifError } = await supabase
        .from('notifications')
        .insert({
          user_id: selectedInspection.applicationId, // This should be the admin ID, but for now using application ID
          title: 'Inspection Completed',
          message: `Inspection for ${selectedInspection.establishmentName} has been completed.`
        });
        
      if (notifError) console.error('Error creating notification:', notifError);
      
      toast({
        title: "Checklist Submitted",
        description: "The inspection checklist has been submitted successfully.",
        duration: 3000,
      });
      
      // Refresh data
      fetchAssignedInspections(currentUser.id);
      
      setShowChecklistModal(null);
      setCurrentStep(1);
    } catch (error: any) {
      toast({
        title: "Error submitting checklist",
        description: error.message,
        duration: 3000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const renderChecklistStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-medium mb-4">Establishment Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Establishment Name</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100" 
                  value={selectedInspection?.establishmentName || ""}
                  disabled 
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Owner</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100" 
                  value={selectedInspection?.owner || ""}
                  disabled 
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Inspection Date</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100" 
                  value={selectedInspection?.inspectionDate || ""}
                  disabled 
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Inspection Time</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100" 
                  value={selectedInspection?.inspectionTime || ""}
                  disabled 
                />
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Next
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-medium mb-4">Inspection Checklist</h4>
            <div className="space-y-4">
              {checklistData.sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="border rounded-md p-4">
                  <h5 className="font-medium mb-2">{section.title}</h5>
                  <div className="space-y-2">
                    {section.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center justify-between">
                        <label className="text-sm font-medium">{item.label}</label>
                        <select 
                          className="px-3 py-1 border border-gray-300 rounded-md"
                          value={item.value}
                          onChange={(e) => handleInputChange(sectionIndex, itemIndex, e.target.value)}
                        >
                          <option value="">Select...</option>
                          <option value="pass">Pass</option>
                          <option value="fail">Fail</option>
                          <option value="na">N/A</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="border rounded-md p-4">
                <h5 className="font-medium mb-2">Additional Comments</h5>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                  rows={4}
                  placeholder="Enter any comments or observations here"
                  value={checklistData.comments}
                  onChange={handleCommentsChange}
                ></textarea>
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Next
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-medium mb-4">Upload Images</h4>
            <div className="border-dashed border-2 border-gray-300 rounded-md p-6 text-center">
              <input
                type="file"
                className="hidden"
                id="fileUpload"
                multiple
                accept="image/*"
                onChange={handleFileChange}
              />
              <label htmlFor="fileUpload" className="cursor-pointer">
                <div className="flex flex-col items-center justify-center">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  <p className="mt-2 text-sm text-gray-500">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </label>
            </div>
            
            {imageUrls.length > 0 && (
              <div className="grid grid-cols-4 gap-4 mt-4">
                {imageUrls.map((url, index) => (
                  <div key={index} className="border rounded-md p-2 bg-gray-100 h-24 flex items-center justify-center">
                    <img src={url} alt={`Image ${index + 1}`} className="max-h-full" />
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Next
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-medium mb-4">Finalize Inspection</h4>
            <div className="border rounded-md p-4">
              <h5 className="font-medium mb-2">Inspector Information</h5>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Inspector Name</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                    placeholder="Digital Printed Name"
                    value={checklistData.inspectorName}
                    onChange={handleInspectorNameChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Position</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100" 
                    value={currentUser?.position || "Fire Inspector"} 
                    disabled 
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="form-checkbox h-5 w-5 text-blue-600" 
                    checked={checklistData.isCompleted}
                    onChange={handleCompletedChange}
                  />
                  <span className="ml-2 text-gray-700">Mark inspection as completed</span>
                </label>
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setCurrentStep(3)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                disabled={submitting}
              >
                Back
              </button>
              <button
                onClick={handleChecklistSubmit}
                disabled={!checklistData.isCompleted || submitting}
                className={`px-4 py-2 bg-green-600 text-white rounded-md flex items-center ${
                  !checklistData.isCompleted || submitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
                }`}
              >
                {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Submit Inspection
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/3ee06004c0875245644f1df0278e61e66cf96a47"
              alt="Logo"
              className="w-12 h-16 shadow-sm rounded-lg mr-4"
            />
            <h1 className="text-3xl font-bold text-[#F00]">Fire Inspector Dashboard</h1>
          </div>
          <nav className="flex items-center space-x-6">
            <span className="text-lg font-medium">
              {currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : ""}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-[#FE623F] text-white rounded-lg hover:bg-[#e55636] transition-colors"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Assigned Establishments</h2>
          
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-[#FE623F]" />
            </div>
          ) : assignedInspections.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-500">No establishments assigned for inspection yet.</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inspection ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Establishment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inspection Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inspection Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {assignedInspections.map((inspection) => (
                    <tr key={inspection.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{inspection.inspectionId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{inspection.establishmentName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{inspection.owner}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{inspection.inspectionDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{inspection.inspectionTime}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          inspection.status === 'inspected' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {inspection.status === 'for_inspection' ? 'For Inspection' : 'Inspected'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {inspection.status === 'for_inspection' ? (
                          <button 
                            onClick={() => handleIssueChecklist(inspection)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Issue Checklist
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleViewChecklist(inspection.applicationId, inspection.applicationType)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            View Checklist
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Checklist Modal */}
      {showChecklistModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Inspection Checklist</h3>
              <button
                onClick={() => {
                  setShowChecklistModal(null);
                  setCurrentStep(1);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  1
                </div>
                <div className={`flex-1 h-1 mx-2 ${
                  currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'
                }`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  2
                </div>
                <div className={`flex-1 h-1 mx-2 ${
                  currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-300'
                }`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  3
                </div>
                <div className={`flex-1 h-1 mx-2 ${
                  currentStep >= 4 ? 'bg-blue-600' : 'bg-gray-300'
                }`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 4 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  4
                </div>
              </div>
              <div className="flex justify-between mt-2 text-sm text-gray-600">
                <span>Details</span>
                <span>Checklist</span>
                <span>Photos</span>
                <span>Submit</span>
              </div>
            </div>
            
            {renderChecklistStep()}
          </div>
        </div>
      )}
    </div>
  );
};

export default InspectorDashboard;
