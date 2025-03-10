
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const TestAccounts: React.FC = () => {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [createdAccounts, setCreatedAccounts] = useState<{
    admin?: string;
    inspector?: string;
    owner?: string;
  }>({});

  const createTestAccounts = async () => {
    setIsCreating(true);
    
    try {
      // 1. Create Admin Account
      const adminEmail = `admin-${Date.now()}@example.com`;
      const adminPassword = "password123";
      
      const { data: adminData, error: adminError } = await supabase.auth.signUp({
        email: adminEmail,
        password: adminPassword,
        options: {
          data: {
            first_name: "Admin",
            middle_name: null,
            last_name: "User",
            role: "admin"
          }
        }
      });
      
      if (adminError) throw adminError;
      
      // 2. Create Fire Inspector Account
      const inspectorEmail = `inspector-${Date.now()}@example.com`;
      const inspectorPassword = "password123";
      
      const { data: inspectorData, error: inspectorError } = await supabase.auth.signUp({
        email: inspectorEmail,
        password: inspectorPassword,
        options: {
          data: {
            first_name: "Inspector",
            middle_name: null,
            last_name: "User",
            role: "fire_inspector"
          }
        }
      });
      
      if (inspectorError) throw inspectorError;
      
      // 3. Create Establishment Owner Account
      const ownerEmail = `owner-${Date.now()}@example.com`;
      const ownerPassword = "password123";
      
      const { data: ownerData, error: ownerError } = await supabase.auth.signUp({
        email: ownerEmail,
        password: ownerPassword,
        options: {
          data: {
            first_name: "Owner",
            middle_name: null,
            last_name: "User",
            role: "establishment_owner"
          }
        }
      });
      
      if (ownerError) throw ownerError;
      
      // 4. Create a sample establishment for the owner
      if (ownerData.user) {
        const { error: estError } = await supabase
          .from('establishments')
          .insert({
            owner_id: ownerData.user.id,
            name: "Test Establishment",
            dti_cert_no: "TEST-DTI-" + Date.now(),
            status: 'registered'
          });
        
        if (estError) throw estError;
      }
      
      // Show success message and store the created accounts
      setCreatedAccounts({
        admin: `Email: ${adminEmail}, Password: ${adminPassword}`,
        inspector: `Email: ${inspectorEmail}, Password: ${inspectorPassword}`,
        owner: `Email: ${ownerEmail}, Password: ${ownerPassword}`,
      });
      
      toast({
        title: "Test accounts created",
        description: "All test accounts have been created successfully",
        duration: 5000,
      });
      
    } catch (error: any) {
      console.error("Error creating test accounts:", error);
      toast({
        title: "Failed to create test accounts",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="w-full max-w-[700px] mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-red-600">Create Test Accounts</h2>
      <p className="mb-4 text-gray-700">
        This tool will create test accounts for admin, fire inspector, and establishment owner roles.
        Each account will have the password "password123".
      </p>
      
      <button
        onClick={createTestAccounts}
        disabled={isCreating}
        className="w-full py-3 text-white text-lg font-bold bg-[#FE623F] rounded-lg hover:bg-[#e55636] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center mb-6"
      >
        {isCreating ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating Accounts...
          </span>
        ) : "Create Test Accounts"}
      </button>
      
      {Object.keys(createdAccounts).length > 0 && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <h3 className="text-xl font-semibold mb-3 text-gray-800">Created Accounts</h3>
          <div className="space-y-4">
            {createdAccounts.admin && (
              <div className="p-3 bg-blue-50 rounded border border-blue-200">
                <h4 className="font-bold text-blue-800">Admin Account</h4>
                <p className="font-mono text-sm break-all">{createdAccounts.admin}</p>
              </div>
            )}
            {createdAccounts.inspector && (
              <div className="p-3 bg-green-50 rounded border border-green-200">
                <h4 className="font-bold text-green-800">Fire Inspector Account</h4>
                <p className="font-mono text-sm break-all">{createdAccounts.inspector}</p>
              </div>
            )}
            {createdAccounts.owner && (
              <div className="p-3 bg-orange-50 rounded border border-orange-200">
                <h4 className="font-bold text-orange-800">Establishment Owner Account</h4>
                <p className="font-mono text-sm break-all">{createdAccounts.owner}</p>
              </div>
            )}
          </div>
          <p className="mt-4 text-sm text-gray-600">
            Note: You may need to manually confirm these accounts in the Supabase dashboard if email confirmation is enabled.
          </p>
        </div>
      )}
    </div>
  );
};

export default TestAccounts;
