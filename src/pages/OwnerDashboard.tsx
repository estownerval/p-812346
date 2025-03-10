
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, BuildingIcon, ClipboardCheck, Eye } from "lucide-react";

interface Establishment {
  id: string;
  name: string;
  dtiCertNo: string;
  status: 'unregistered' | 'pending' | 'registered' | 'rejected';
  dateCreated: string;
}

const mockEstablishments: Establishment[] = [
  {
    id: "1",
    name: "ABC Restaurant",
    dtiCertNo: "DTI-12345",
    status: "unregistered",
    dateCreated: "2023-05-10"
  },
  {
    id: "2",
    name: "XYZ Cafe",
    dtiCertNo: "DTI-67890",
    status: "pending",
    dateCreated: "2023-06-15"
  },
  {
    id: "3",
    name: "123 Pharmacy",
    dtiCertNo: "DTI-54321",
    status: "registered",
    dateCreated: "2023-04-20"
  },
  {
    id: "4",
    name: "Quick Mart",
    dtiCertNo: "DTI-98765",
    status: "rejected",
    dateCreated: "2023-07-05"
  }
];

const certificateTypes = ["FSEC", "FSIC (Occupancy)", "FSIC (Business)"];

const OwnerDashboard: React.FC = () => {
  const [establishments] = useState<Establishment[]>(mockEstablishments);
  const [showRegisterForm, setShowRegisterForm] = useState<string | null>(null);
  const [selectedCertType, setSelectedCertType] = useState<string | null>(null);
  const [selectedEstablishment, setSelectedEstablishment] = useState<string | null>(null);

  const handleRegisterClick = (id: string) => {
    setShowRegisterForm(id);
  };

  const handleRegisterSubmit = (id: string) => {
    console.log(`Registering establishment ${id}`);
    setShowRegisterForm(null);
    // Here you would submit the registration to the backend
  };

  const handleCertificateTypeSelect = (establishmentId: string, certType: string) => {
    console.log(`Selected ${certType} for establishment ${establishmentId}`);
    setSelectedCertType(null);
    // Here you would navigate to the specific certificate application form
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
            <h1 className="text-3xl font-bold text-[#F00]">Establishment Owner Dashboard</h1>
          </div>
          <nav className="flex items-center space-x-6">
            <span className="text-lg font-medium">John Doe</span>
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
          <h2 className="text-2xl font-bold mb-6">My Establishments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {establishments.map((est) => (
              <div key={est.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-xl font-semibold mb-2">{est.name}</h3>
                <p className="text-gray-600 mb-4">DTI Cert: {est.dtiCertNo}</p>
                
                <div className="flex items-center mb-4">
                  <span className="mr-2">Status:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    est.status === 'registered' ? 'bg-green-100 text-green-800' :
                    est.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    est.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {est.status.charAt(0).toUpperCase() + est.status.slice(1)}
                  </span>
                </div>
                
                {est.status === 'unregistered' && (
                  <button
                    onClick={() => handleRegisterClick(est.id)}
                    className="w-full mb-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <BuildingIcon size={18} className="mr-2" />
                    Register Establishment
                  </button>
                )}
                
                {est.status === 'registered' && (
                  <div className="space-y-3">
                    <button
                      onClick={() => setSelectedEstablishment(est.id === selectedEstablishment ? null : est.id)}
                      className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
                    >
                      <ClipboardCheck size={18} className="mr-2" />
                      Apply for Certification
                      {selectedEstablishment === est.id ? <ChevronLeft size={18} className="ml-2" /> : <ChevronRight size={18} className="ml-2" />}
                    </button>
                    
                    {selectedEstablishment === est.id && (
                      <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                        <h4 className="text-sm font-medium mb-2">Select Certificate Type:</h4>
                        <div className="space-y-2">
                          {certificateTypes.map((type) => (
                            <button
                              key={type}
                              onClick={() => handleCertificateTypeSelect(est.id, type)}
                              className="w-full py-1.5 px-3 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-left text-sm"
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <button
                      className="w-full py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center"
                    >
                      <Eye size={18} className="mr-2" />
                      View Establishment Info
                    </button>
                  </div>
                )}
                
                {showRegisterForm === est.id && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                      <h3 className="text-xl font-bold mb-4">Register Establishment</h3>
                      <form>
                        <div className="mb-4">
                          <label className="block text-gray-700 text-sm font-bold mb-2">
                            Establishment Name
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            value={est.name}
                            disabled
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-700 text-sm font-bold mb-2">
                            DTI Certificate No.
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            value={est.dtiCertNo}
                            disabled
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-700 text-sm font-bold mb-2">
                            Address
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="Enter establishment address"
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-700 text-sm font-bold mb-2">
                            Contact Number
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="Enter contact number"
                          />
                        </div>
                        <div className="flex justify-end space-x-3">
                          <button
                            type="button"
                            onClick={() => setShowRegisterForm(null)}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRegisterSubmit(est.id)}
                            className="px-4 py-2 bg-[#FE623F] text-white rounded-md hover:bg-[#e55636]"
                          >
                            Register
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">My Applications</h2>
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Establishment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Certificate Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Applied</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">APP-001</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">ABC Restaurant</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">FSEC</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2023-07-10</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-4">View</button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">APP-002</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">123 Pharmacy</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">FSIC (Business)</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2023-06-15</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Approved
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-4">View</button>
                    <button className="text-green-600 hover:text-green-900">Certificate</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OwnerDashboard;
