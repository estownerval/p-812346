
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { toast } from "sonner";

export type ApplicationType = Database["public"]["Enums"]["application_type"];
export type ApplicationStatus = Database["public"]["Enums"]["application_status"];

// Add the getStatusColor function that is referenced in AdminHome.tsx
export const getStatusColor = (status: string): string => {
  switch (status) {
    case "pending":
      return "#FFBB28"; // Yellow
    case "for_inspection":
      return "#8884d8"; // Purple
    case "inspected":
      return "#00C49F"; // Teal
    case "approved":
      return "#00C49F"; // Green
    case "rejected":
      return "#e45f5a"; // Red
    default:
      return "#999999"; // Gray for unknown status
  }
};

export const fetchApplications = async (type?: ApplicationType, status?: ApplicationStatus) => {
  try {
    let query = supabase
      .from('applications')
      .select(`
        *,
        establishment:establishments(*),
        inspector:profiles(*)
      `);
    
    if (type) {
      query = query.eq('application_type', type);
    }
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data || [];
  } catch (error: any) {
    toast.error(`Error fetching applications: ${error.message}`);
    return [];
  }
};

export const updateApplicationStatus = async (
  id: string, 
  status: ApplicationStatus, 
  rejectionReason?: string,
  inspectorId?: string,
  inspectionDate?: string,
  inspectionTime?: string,
  priority?: boolean
) => {
  try {
    const updateData: any = { status };
    
    if (rejectionReason) {
      updateData.rejection_reason = rejectionReason;
    }
    
    if (inspectorId) {
      updateData.inspector_id = inspectorId;
    }
    
    if (inspectionDate) {
      updateData.inspection_date = inspectionDate;
    }
    
    if (inspectionTime) {
      updateData.inspection_time = inspectionTime;
    }
    
    if (priority !== undefined) {
      updateData.priority = priority;
    }
    
    const { error } = await supabase
      .from('applications')
      .update(updateData)
      .eq('id', id);
    
    if (error) throw error;
    
    toast.success(`Application status updated to ${status}`);
    return true;
  } catch (error: any) {
    toast.error(`Error updating application: ${error.message}`);
    return false;
  }
};

export const createInspectionChecklist = async (
  applicationId: string,
  inspectorId: string,
  inspectorName: string,
  notes?: string
) => {
  try {
    const { data, error } = await supabase
      .from('inspection_checklists')
      .insert({
        application_id: applicationId,
        inspector_id: inspectorId,
        inspector_name: inspectorName,
        inspection_date: new Date().toISOString().split('T')[0],
      })
      .select()
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error: any) {
    toast.error(`Error creating inspection checklist: ${error.message}`);
    return null;
  }
};

export const saveChecklistItem = async (
  checklistId: string,
  itemName: string,
  isCompliant: boolean,
  notes?: string,
  imagePath?: string
) => {
  try {
    const { error } = await supabase
      .from('checklist_items')
      .insert({
        checklist_id: checklistId,
        item_name: itemName,
        is_compliant: isCompliant,
        notes,
        image_path: imagePath
      });
      
    if (error) throw error;
    
    return true;
  } catch (error: any) {
    toast.error(`Error saving checklist item: ${error.message}`);
    return false;
  }
};

export const uploadCertificate = async (
  applicationId: string,
  certificateNumber: string,
  expiryDate: string,
  file: File
) => {
  try {
    // Upload file to storage
    const fileName = `certificates/${applicationId}/${Date.now()}_certificate.pdf`;
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, file);
      
    if (uploadError) throw uploadError;
    
    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('documents')
      .getPublicUrl(fileName);
      
    // Create certificate record
    const { error } = await supabase
      .from('certificates')
      .insert({
        application_id: applicationId,
        certificate_number: certificateNumber,
        expiry_date: expiryDate,
        file_path: publicUrlData.publicUrl,
        issue_date: new Date().toISOString().split('T')[0],
      });
      
    if (error) throw error;
    
    return true;
  } catch (error: any) {
    toast.error(`Error uploading certificate: ${error.message}`);
    return false;
  }
};
