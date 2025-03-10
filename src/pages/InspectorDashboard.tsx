
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface AssignedInspection {
  id: string;
  inspectionId: number;
  establishmentName: string;
  owner: string;
  inspectionDate: string;
  inspectionTime: string;
  status: 'for_inspection' | 'inspected';
}

const mockAssignedInspections: AssignedInspection[] = [
  {
    id: "1",
    inspectionId: 1,
    establishmentName: "ABC Restaurant",
    owner: "John Doe",
    inspectionDate: "2023-08-15",
    inspectionTime: "09:30 AM",
    status: "for_inspection"
  },
  {
    id: "2",
    inspectionId: 2,
    establishmentName: "XYZ Cafe",
    owner: "Jane Smith",
    inspectionDate: "2023-08-20",
    inspectionTime: "11:00 AM",
    status: "for_inspection"
  },
  {
    id: "3",
    inspectionId: 3,
    establishmentName: "123 Pharmacy",
    owner: "Bob Johnson",
    inspectionDate: "2023-08-10",
    inspectionTime: "02:30 PM",
    status: "inspected"
  }
];

const InspectorDashboard: React.FC = () => {
  const [assignedInspections] = useState<AssignedInspection[]>(mockAssignedInspections);
  const [showChecklistModal, setShowChecklistModal] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();

  const handleIssueChecklist = (id: string) => {
    console.log(`Issuing checklist for inspection ${id}`);
    setShowChecklistModal(id);
    setCurrentStep(1);
  };

  const handleViewChecklist = (id: string) => {
    console.log(`Viewing checklist for inspection ${id}`);
    // Here you would open a modal to view the checklist
  };

  const handleChecklistSubmit = () => {
    console.log(`Submitting checklist`);
    toast({
      title: "Checklist Submitted",
      description: "The inspection checklist has been submitted successfully.",
      duration: 3000,
    });
    setShowChecklistModal(null);
    setCurrentStep(1);
    // Here you would submit the checklist to the backend
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
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100" value="ABC Restaurant" disabled />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">DTI Certificate No.</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100" value="DTI-12345" disabled />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Owner</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100" value="John Doe" disabled />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Inspection Date</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100" value="2023-08-15" disabled />
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
              <div className="border rounded-md p-4">
                <h5 className="font-medium mb-2">Fire Safety Equipment</h5>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Fire Extinguishers are properly installed and maintained</label>
                    <select className="px-3 py-1 border border-gray-300 rounded-md">
                      <option value="">Select...</option>
                      <option value="pass">Pass</option>
                      <option value="fail">Fail</option>
                      <option value="na">N/A</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Fire alarm system is working properly</label>
                    <select className="px-3 py-1 border border-gray-300 rounded-md">
                      <option value="">Select...</option>
                      <option value="pass">Pass</option>
                      <option value="fail">Fail</option>
                      <option value="na">N/A</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Sprinkler system is working properly</label>
                    <select className="px-3 py-1 border border-gray-300 rounded-md">
                      <option value="">Select...</option>
                      <option value="pass">Pass</option>
                      <option value="fail">Fail</option>
                      <option value="na">N/A</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="border rounded-md p-4">
                <h5 className="font-medium mb-2">Evacuation Routes</h5>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Exit signs are properly illuminated</label>
                    <select className="px-3 py-1 border border-gray-300 rounded-md">
                      <option value="">Select...</option>
                      <option value="pass">Pass</option>
                      <option value="fail">Fail</option>
                      <option value="na">N/A</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Evacuation routes are clear and unobstructed</label>
                    <select className="px-3 py-1 border border-gray-300 rounded-md">
                      <option value="">Select...</option>
                      <option value="pass">Pass</option>
                      <option value="fail">Fail</option>
                      <option value="na">N/A</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Emergency lighting is functional</label>
                    <select className="px-3 py-1 border border-gray-300 rounded-md">
                      <option value="">Select...</option>
                      <option value="pass">Pass</option>
                      <option value="fail">Fail</option>
                      <option value="na">N/A</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="border rounded-md p-4">
                <h5 className="font-medium mb-2">Additional Comments</h5>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                  rows={4}
                  placeholder="Enter any comments or observations here"
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
            <div className="grid grid-cols-4 gap-4 mt-4">
              {/* Preview placeholders for uploaded images */}
              <div className="border rounded-md p-2 bg-gray-100 h-24 flex items-center justify-center text-gray-500">
                Image Preview
              </div>
              <div className="border rounded-md p-2 bg-gray-100 h-24 flex items-center justify-center text-gray-500">
                Image Preview
              </div>
            </div>
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
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Position</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100" 
                    value="FS01" 
                    disabled 
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="flex items-center">
                  <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
                  <span className="ml-2 text-gray-700">Mark inspection as completed</span>
                </label>
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setCurrentStep(3)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Back
              </button>
              <button
                onClick={handleChecklistSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
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
            <span className="text-lg font-medium">Mike Johnson</span>
            <Link 
              to="/"
              className="px-4 py-2 bg-[#FE623F] text-white rounded-lg hover:bg-[#e55636] transition-colors"
            >
              Logout
            </Link>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Assigned Establishments</h2>
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
                          onClick={() => handleIssueChecklist(inspection.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Issue Checklist
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleViewChecklist(inspection.id)}
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
