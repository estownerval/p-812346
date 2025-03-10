
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export interface AssignedInspection {
  id: string;
  inspectionId: number;
  establishmentName: string;
  owner: string;
  inspectionDate: string;
  inspectionTime: string;
  status: 'for_inspection' | 'inspected';
  applicationId: string;
  applicationType: 'fsic_business' | 'fsic_occupancy';
}

export const useAssignedInspections = (inspectorId: string | null) => {
  const [assignedInspections, setAssignedInspections] = useState<AssignedInspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!inspectorId) {
      setLoading(false);
      return;
    }

    const fetchAssignedInspections = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch business applications
        const { data: businessApps, error: businessError } = await supabase
          .from('fsic_business_applications')
          .select(`
            id,
            establishment_id,
            inspection_date,
            inspection_time,
            status,
            establishments(name, owner_id)
          `)
          .eq('inspector_id', inspectorId);
        
        // Fetch occupancy applications
        const { data: occupancyApps, error: occupancyError } = await supabase
          .from('fsic_occupancy_applications')
          .select(`
            id,
            establishment_id,
            inspection_date,
            inspection_time,
            status,
            establishments(name, owner_id)
          `)
          .eq('inspector_id', inspectorId);
        
        if (businessError) throw businessError;
        if (occupancyError) throw occupancyError;
        
        // Fetch owner profiles separately
        const ownerProfiles: Record<string, string> = {};
        
        if ((businessApps && businessApps.length > 0) || (occupancyApps && occupancyApps.length > 0)) {
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
        
        // Format business applications
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
            applicationType: 'fsic_business' as const
          };
        }) : [];
        
        // Format occupancy applications
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
            applicationType: 'fsic_occupancy' as const
          };
        }) : [];
        
        setAssignedInspections([...formattedBusinessApps, ...formattedOccupancyApps]);
      } catch (err: any) {
        console.error("Error fetching assigned inspections:", err);
        setError(err.message || "Failed to fetch assigned inspections");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedInspections();
  }, [inspectorId]);

  return { assignedInspections, loading, error };
};
