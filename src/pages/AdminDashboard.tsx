
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface EstablishmentRegistration {
  id: string;
  name: string;
  dtiCertNo: string;
  owner: string;
  dateSubmitted: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface Application {
  id: string;
  establishmentName: string;
  dtiCertNo: string;
  owner: string;
  dateSubmitted: string;
  timeSubmitted: string;
  status: 'unscheduled' | 'for_inspection' | 'inspected' | 'rejected' | 'approved';
  type: 'fsec' | 'fsic_occupancy' | 'fsic_business';
}

interface Inspector {
  id: string;
  name: string;
  email: string;
  position: string;
  dateCreated: string;
}

const mockEstablishmentRegistrations: EstablishmentRegistration[] = [
  {
    id: "1",
    name: "ABC Restaurant",
    dtiCertNo: "DTI-12345",
    owner: "John Doe",
    dateSubmitted: "2023-07-10",
    status: "pending"
  },
  {
    id: "2",
    name: "XYZ Cafe",
    dtiCertNo: "DTI-67890",
    owner: "Jane Smith",
    dateSubmitted: "2023-07-15",
    status: "approved"
  },
  {
    id: "3",
    name: "123 Pharmacy",
    dtiCertNo: "DTI-54321",
    owner: "Bob Johnson",
    dateSubmitted: "2023-07-05",
    status: "rejected"
  }
];

const mockApplications: Application[] = [
  {
    id: "APP-001",
    establishmentName: "ABC Restaurant",
    dtiCertNo: "DTI-12345",
    owner: "John Doe",
    dateSubmitted: "2023-07-10",
    timeSubmitted: "09:30 AM",
    status: "unscheduled",
    type: "fsec"
  },
  {
    id: "APP-002",
    establishmentName: "XYZ Cafe",
    dtiCertNo: "DTI-67890",
    owner: "Jane Smith",
    dateSubmitted: "2023-07-15",
    timeSubmitted: "11:45 AM",
    status: "for_inspection",
    type: "fsic_occupancy"
  },
  {
    id: "APP-003",
    establishmentName: "123 Pharmacy",
    dtiCertNo: "DTI-54321",
    owner: "Bob Johnson",
    dateSubmitted: "2023-07-05",
    timeSubmitted: "02:15 PM",
    status: "inspected",
    type: "fsic_business"
  },
  {
    id: "APP-004",
    establishmentName: "Quick Mart",
    dtiCertNo: "DTI-98765",
    owner: "Alice Brown",
    dateSubmitted: "2023-07-20",
    timeSubmitted: "10:00 AM",
    status: "approved",
    type: "fsec"
  },
  {
    id: "APP-005",
    establishmentName: "City Hotel",
    dtiCertNo: "DTI-24680",
    owner: "Charlie Wilson",
    dateSubmitted: "2023-07-18",
    timeSubmitted: "03:30 PM",
    status: "rejected",
    type: "fsic_occupancy"
  }
];

const mockInspectors: Inspector[] = [
  {
    id: "1",
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    position: "FS01",
    dateCreated: "2023-05-15"
  },
  {
    id: "2",
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    position: "FS02",
    dateCreated: "2023-06-10"
  }
];

const AdminDashboard: React.FC = () => {
  const [registrations] = useState<EstablishmentRegistration[]>(mockEstablishmentRegistrations);
  const [applications] = useState<Application[]>(mockApplications);
  const [inspectors] = useState<Inspector[]>(mockInspectors);
  const [applicationType, setApplicationType] = useState<string>("fsec");
  const [showCreateInspectorForm, setShowCreateInspectorForm] = useState(false);
  const [applicationFilter, setApplicationFilter] = useState<string>("all");
  const [showDetailsModal, setShowDetailsModal] = useState<string | null>(null);
  
  const { toast } = useToast();

  const handleApproveRegistration = (id: string) => {
    console.log(`Approving registration ${id}`);
    toast({
      title: "Registration Approved",
      description: "The establishment registration has been approved.",
      duration: 3000,
    });
    // Here you would update the registration status
  };

  const handleRejectRegistration = (id: string) => {
    console.log(`Rejecting registration ${id}`);
    toast({
      title: "Registration Rejected",
      description: "The establishment registration has been rejected.",
      duration: 3000,
    });
    // Here you would update the registration status
  };

  const handleCreateInspector = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Creating inspector");
    toast({
      title: "Inspector Created",
      description: "The fire inspector account has been created successfully.",
      duration: 3000,
    });
    setShowCreateInspectorForm(false);
    // Here you would create the inspector account
  };

  const handleScheduleInspection = (id: string) => {
    console.log(`Scheduling inspection for application ${id}`);
    // Here you would open a scheduling modal
  };

  const filteredApplications = applications.filter(app => {
    if (app.type !== applicationType.toLowerCase().replace('-', '_') as any) {
      return false;
    }
    
    if (applicationFilter === "all") {
      return true;
    }
    
    return app.status === applicationFilter;
  });

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
            <h1 className="text-3xl font-bold text-[#F00]">Admin Dashboard</h1>
          </div>
          <nav className="flex items-center space-x-6">
            <span className="text-lg font-medium">Admin User</span>
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
        <Tabs defaultValue="users">
          <TabsList className="mb-8">
            <TabsTrigger value="users">User Accounts</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <Tabs defaultValue="owners">
              <TabsList className="mb-6">
                <TabsTrigger value="owners">Establishment Owners</TabsTrigger>
                <TabsTrigger value="inspectors">Fire Inspectors</TabsTrigger>
              </TabsList>
              
              <TabsContent value="owners">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Establishment Registrations</h2>
                </div>
                
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Establishment</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DTI Certificate</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Submitted</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {registrations.map((reg) => (
                        <tr key={reg.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reg.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{reg.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reg.dtiCertNo}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reg.owner}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reg.dateSubmitted}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              reg.status === 'approved' ? 'bg-green-100 text-green-800' :
                              reg.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {reg.status.charAt(0).toUpperCase() + reg.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {reg.status === 'pending' && (
                              <>
                                <button 
                                  onClick={() => handleApproveRegistration(reg.id)}
                                  className="text-green-600 hover:text-green-900 mr-2"
                                >
                                  Approve
                                </button>
                                <button 
                                  onClick={() => handleRejectRegistration(reg.id)}
                                  className="text-red-600 hover:text-red-900 mr-2"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            <button 
                              onClick={() => setShowDetailsModal(reg.id)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              <TabsContent value="inspectors">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Fire Inspectors</h2>
                  <button 
                    onClick={() => setShowCreateInspectorForm(true)}
                    className="px-4 py-2 bg-[#FE623F] text-white rounded-md hover:bg-[#e55636] transition-colors"
                  >
                    Create Inspector Account
                  </button>
                </div>
                
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Created</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {inspectors.map((inspector) => (
                        <tr key={inspector.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{inspector.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{inspector.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{inspector.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{inspector.position}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{inspector.dateCreated}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                            <button className="text-red-600 hover:text-red-900">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {showCreateInspectorForm && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                      <h3 className="text-xl font-bold mb-4">Create Fire Inspector Account</h3>
                      <form onSubmit={handleCreateInspector}>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              First Name
                            </label>
                            <input
                              type="text"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              placeholder="First Name"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Middle Name (Optional)
                            </label>
                            <input
                              type="text"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              placeholder="Middle Name"
                            />
                          </div>
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-700 text-sm font-bold mb-2">
                            Last Name
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="Last Name"
                            required
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-700 text-sm font-bold mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="Email Address"
                            required
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-700 text-sm font-bold mb-2">
                            Password
                          </label>
                          <input
                            type="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="Password"
                            required
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-700 text-sm font-bold mb-2">
                            Position
                          </label>
                          <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            required
                          >
                            <option value="">Select Position</option>
                            <option value="FS01">FS01</option>
                            <option value="FS02">FS02</option>
                            <option value="FS03">FS03</option>
                          </select>
                        </div>
                        <div className="flex justify-end space-x-3">
                          <button
                            type="button"
                            onClick={() => setShowCreateInspectorForm(false)}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-[#FE623F] text-white rounded-md hover:bg-[#e55636]"
                          >
                            Create Account
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </TabsContent>
          
          <TabsContent value="applications">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Applications</h2>
              <div className="flex items-center space-x-4">
                <select 
                  value={applicationType} 
                  onChange={(e) => setApplicationType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="fsec">FSEC</option>
                  <option value="fsic_occupancy">FSIC (Occupancy)</option>
                  <option value="fsic_business">FSIC (Business)</option>
                </select>
                
                {(applicationType === "fsic_occupancy" || applicationType === "fsic_business") && (
                  <div className="flex items-center space-x-2">
                    <select
                      value={applicationFilter}
                      onChange={(e) => setApplicationFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="all">All</option>
                      <option value="unscheduled">Unscheduled</option>
                      <option value="for_inspection">For Inspection</option>
                      <option value="inspected">Inspected</option>
                      <option value="rejected">Rejected</option>
                      <option value="approved">Approved</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Establishment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DTI Certificate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Applied</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Applied</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredApplications.map((app) => (
                    <tr key={app.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.establishmentName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.dtiCertNo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.owner}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.dateSubmitted}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.timeSubmitted}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          app.status === 'approved' ? 'bg-green-100 text-green-800' :
                          app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          app.status === 'inspected' ? 'bg-blue-100 text-blue-800' :
                          app.status === 'for_inspection' ? 'bg-purple-100 text-purple-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {app.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {applicationType === "fsec" && (
                          <>
                            <button 
                              onClick={() => setShowDetailsModal(app.id)}
                              className="text-indigo-600 hover:text-indigo-900 mr-2"
                            >
                              View Details
                            </button>
                            <button 
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </>
                        )}
                        
                        {(applicationType === "fsic_occupancy" || applicationType === "fsic_business") && (
                          <>
                            {(app.status === 'unscheduled' || app.status === 'for_inspection') && (
                              <>
                                <button 
                                  onClick={() => handleScheduleInspection(app.id)}
                                  className="text-purple-600 hover:text-purple-900 mr-2"
                                >
                                  Schedule
                                </button>
                                <button 
                                  onClick={() => setShowDetailsModal(app.id)}
                                  className="text-indigo-600 hover:text-indigo-900"
                                >
                                  View Details
                                </button>
                              </>
                            )}
                            
                            {app.status === 'inspected' && (
                              <>
                                <button 
                                  className="text-green-600 hover:text-green-900 mr-2"
                                >
                                  Approve
                                </button>
                                <button 
                                  className="text-red-600 hover:text-red-900 mr-2"
                                >
                                  Reject
                                </button>
                                <button 
                                  onClick={() => setShowDetailsModal(app.id)}
                                  className="text-indigo-600 hover:text-indigo-900"
                                >
                                  View Details
                                </button>
                              </>
                            )}
                            
                            {app.status === 'rejected' && (
                              <>
                                <button 
                                  onClick={() => setShowDetailsModal(app.id)}
                                  className="text-indigo-600 hover:text-indigo-900 mr-2"
                                >
                                  View Details
                                </button>
                                <button 
                                  className="text-yellow-600 hover:text-yellow-900"
                                >
                                  Form Notice
                                </button>
                              </>
                            )}
                            
                            {app.status === 'approved' && (
                              <>
                                <button 
                                  onClick={() => setShowDetailsModal(app.id)}
                                  className="text-indigo-600 hover:text-indigo-900 mr-2"
                                >
                                  View Details
                                </button>
                                <button 
                                  className="text-blue-600 hover:text-blue-900 mr-2"
                                >
                                  View Result
                                </button>
                                <button 
                                  className="text-green-600 hover:text-green-900"
                                >
                                  View Certificate
                                </button>
                              </>
                            )}
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>

        {/* Details Modal */}
        {showDetailsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Application Details</h3>
                <button
                  onClick={() => setShowDetailsModal(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>
              <div className="space-y-4">
                <p>Details for ID: {showDetailsModal}</p>
                {/* Additional details would be rendered here */}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowDetailsModal(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
