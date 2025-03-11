import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

export type UserRole = "admin" | "inspector" | "owner";
export type ApplicationType = Database["public"]["Enums"]["application_type"];

export interface UserProfile {
  id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  role: UserRole;
  position?: string;
}

export interface Application {
  id: string;
  establishment_id: string;
  application_type: ApplicationType;
  status: string;
  application_date: string;
  application_time: string;
  inspector_id?: string;
  inspection_date?: string;
  inspection_time?: string;
  rejection_reason?: string;
  priority?: boolean;
  establishment?: any;
}

interface AuthContextType {
  isLoading: boolean;
  user: any | null;
  profile: UserProfile | null;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  addEstablishment: (establishment: any) => Promise<void>;
  getEstablishments: () => Promise<any[]>;
  registerEstablishment: (id: string, address: string) => Promise<void>;
  submitApplication: (data: any) => Promise<void>;
  getApplications: () => Promise<Application[]>;
  createInspectorAccount: (inspectorData: any) => Promise<void>;
  getInspectors: () => Promise<any[]>;
  getOwners: () => Promise<any[]>;
  getProfiles: () => Promise<any[]>;
  updateApplication: (id: string, data: any) => Promise<void>;
  getApplication: (id: string) => Promise<Application | null>;
  getInspections: () => Promise<any[]>;
  submitInspectionChecklist: (data: any) => Promise<void>;
  getOwnedEstablishments: () => Promise<any[]>;
  getApplicationsByOwner: () => Promise<Application[]>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profileError) {
            console.error('Error fetching profile:', profileError);
          } else if (profileData) {
            setProfile(profileData as UserProfile);
          }
        }
      } catch (error) {
        console.error('Error fetching user session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profileError) {
            console.error('Error fetching profile:', profileError);
          } else if (profileData) {
            setProfile(profileData as UserProfile);
          }
        } else {
          setUser(null);
          setProfile(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, userData: any) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.firstName,
            middle_name: userData.middleName || null,
            last_name: userData.lastName,
            role: 'owner',
          },
        }
      });

      if (error) {
        throw error;
      }

      if (data.user && userData.establishments && userData.establishments.length > 0) {
        const establishmentPromises = userData.establishments.map((est: any) => {
          return supabase.from('establishments').insert({
            owner_id: data.user!.id,
            name: est.name,
            dti_number: est.dtiNumber,
            status: 'unregistered'
          });
        });

        await Promise.all(establishmentPromises);
      }

      toast.success('Account created successfully! You can now log in.');
      
      navigate('/login/owner');
    } catch (error: any) {
      toast.error(`Error during signup: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (profileError) {
          throw profileError;
        }

        const role = profileData.role;
        toast.success('Login successful!');
        
        if (role === 'admin') {
          navigate('/dashboard/admin');
        } else if (role === 'inspector') {
          navigate('/dashboard/inspector');
        } else {
          navigate('/dashboard/owner');
        }
      }
    } catch (error: any) {
      toast.error(`Login failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('You have been logged out');
      navigate('/');
    } catch (error: any) {
      toast.error(`Error during sign out: ${error.message}`);
    }
  };

  const addEstablishment = async (establishment: any) => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase.from('establishments').insert({
        owner_id: user.id,
        name: establishment.name,
        dti_number: establishment.dtiNumber,
        status: 'unregistered'
      });

      if (error) throw error;
      
      toast.success('Establishment added successfully');
    } catch (error: any) {
      toast.error(`Error adding establishment: ${error.message}`);
      throw error;
    }
  };

  const getEstablishments = async () => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      let query = supabase.from('establishments').select('*');
      
      if (profile?.role === 'owner') {
        query = query.eq('owner_id', user.id);
      }
      
      const { data, error } = await query;

      if (error) throw error;
      
      return data || [];
    } catch (error: any) {
      toast.error(`Error fetching establishments: ${error.message}`);
      return [];
    }
  };

  const registerEstablishment = async (id: string, address: string) => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('establishments')
        .update({
          status: 'registered',
          address
        })
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Establishment registration submitted for approval');
    } catch (error: any) {
      toast.error(`Error registering establishment: ${error.message}`);
      throw error;
    }
  };

  const submitApplication = async (data: any): Promise<void> => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      const { data: applicationData, error } = await supabase
        .from('applications')
        .insert({
          establishment_id: data.establishmentId,
          application_type: data.applicationType,
          status: 'pending',
          application_date: new Date().toISOString().split('T')[0],
          application_time: new Date().toLocaleTimeString()
        })
        .select()
        .single();

      if (error) throw error;
      
      if (data.documents && data.documents.length > 0) {
        for (const doc of data.documents) {
          const fileName = `${user.id}/${applicationData.id}/${Date.now()}_${doc.name}`;
          
          const { error: uploadError } = await supabase.storage
            .from('documents')
            .upload(fileName, doc.file);

          if (uploadError) throw uploadError;
          
          const { data: publicUrlData } = supabase.storage
            .from('documents')
            .getPublicUrl(fileName);
          
          const { error: docError } = await supabase
            .from('application_documents')
            .insert({
              application_id: applicationData.id,
              document_type: doc.type,
              file_path: publicUrlData.publicUrl
            });

          if (docError) throw docError;
        }
      }
      
      toast.success('Application submitted successfully');
    } catch (error: any) {
      toast.error(`Error submitting application: ${error.message}`);
      throw error;
    }
  };

  const getApplications = async () => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      let query = supabase
        .from('applications')
        .select(`
          *,
          establishment:establishments(*),
          inspector:profiles(*)
        `);
      
      if (profile?.role === 'owner') {
        const { data: establishments } = await supabase
          .from('establishments')
          .select('id')
          .eq('owner_id', user.id);
        
        if (establishments && establishments.length > 0) {
          const establishmentIds = establishments.map(e => e.id);
          query = query.in('establishment_id', establishmentIds);
        } else {
          return [];
        }
      }
      
      if (profile?.role === 'inspector') {
        query = query.eq('inspector_id', user.id);
      }
      
      const { data, error } = await query;

      if (error) throw error;
      
      return data || [];
    } catch (error: any) {
      toast.error(`Error fetching applications: ${error.message}`);
      return [];
    }
  };

  const createInspectorAccount = async (inspectorData: any) => {
    try {
      if (!user || profile?.role !== 'admin') throw new Error('Not authorized');
      
      const { data, error } = await supabase.auth.admin.createUser({
        email: inspectorData.email,
        password: inspectorData.password,
        email_confirm: true,
        user_metadata: {
          first_name: inspectorData.firstName,
          middle_name: inspectorData.middleName || null,
          last_name: inspectorData.lastName,
          role: 'inspector',
          position: inspectorData.position
        }
      });

      if (error) throw error;
      
      toast.success('Inspector account created successfully');
    } catch (error: any) {
      toast.error(`Error creating inspector account: ${error.message}`);
      throw error;
    }
  };

  const getInspectors = async () => {
    try {
      if (!user || profile?.role !== 'admin') throw new Error('Not authorized');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'inspector');

      if (error) throw error;
      
      return data || [];
    } catch (error: any) {
      toast.error(`Error fetching inspectors: ${error.message}`);
      return [];
    }
  };

  const getOwners = async () => {
    try {
      if (!user || profile?.role !== 'admin') throw new Error('Not authorized');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'owner');

      if (error) throw error;
      
      return data || [];
    } catch (error: any) {
      toast.error(`Error fetching owners: ${error.message}`);
      return [];
    }
  };

  const getProfiles = async () => {
    try {
      if (!user || profile?.role !== 'admin') throw new Error('Not authorized');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) throw error;
      
      return data || [];
    } catch (error: any) {
      toast.error(`Error fetching profiles: ${error.message}`);
      return [];
    }
  };

  const updateApplication = async (id: string, data: any) => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('applications')
        .update(data)
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Application updated successfully');
    } catch (error: any) {
      toast.error(`Error updating application: ${error.message}`);
      throw error;
    }
  };

  const getApplication = async (id: string) => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          establishment:establishments(*),
          inspector:profiles(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      
      return data;
    } catch (error: any) {
      toast.error(`Error fetching application: ${error.message}`);
      return null;
    }
  };

  const getInspections = async () => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      let query = supabase
        .from('applications')
        .select(`
          *,
          establishment:establishments(*),
          inspector:profiles(*)
        `)
        .in('status', ['for_inspection', 'inspected']);
      
      if (profile?.role === 'inspector') {
        query = query.eq('inspector_id', user.id);
      }
      
      const { data, error } = await query;

      if (error) throw error;
      
      return data || [];
    } catch (error: any) {
      toast.error(`Error fetching inspections: ${error.message}`);
      return [];
    }
  };

  const submitInspectionChecklist = async (data: any) => {
    try {
      if (!user || profile?.role !== 'inspector') throw new Error('Not authorized');
      
      const { data: checklist, error } = await supabase
        .from('inspection_checklists')
        .insert({
          application_id: data.applicationId,
          inspector_id: user.id,
          inspector_name: `${profile.first_name} ${profile.last_name}`,
          notes: data.notes || null,
          inspection_date: new Date().toISOString().split('T')[0]
        })
        .select()
        .single();

      if (error) throw error;
      
      if (data.items && data.items.length > 0) {
        for (const item of data.items) {
          let imagePath = null;
          if (item.image) {
            const fileName = `inspections/${checklist.id}/${Date.now()}_${item.image.name}`;
            
            const { error: uploadError } = await supabase.storage
              .from('documents')
              .upload(fileName, item.image);

            if (uploadError) throw uploadError;
            
            const { data: publicUrlData } = supabase.storage
              .from('documents')
              .getPublicUrl(fileName);
            
            imagePath = publicUrlData.publicUrl;
          }
          
          const { error: itemError } = await supabase
            .from('checklist_items')
            .insert({
              checklist_id: checklist.id,
              item_name: item.name,
              is_compliant: item.isCompliant,
              notes: item.notes || null,
              image_path: imagePath
            });

          if (itemError) throw itemError;
        }
      }
      
      const { error: updateError } = await supabase
        .from('applications')
        .update({ status: 'inspected' })
        .eq('id', data.applicationId);

      if (updateError) throw updateError;
      
      toast.success('Inspection checklist submitted successfully');
    } catch (error: any) {
      toast.error(`Error submitting inspection checklist: ${error.message}`);
      throw error;
    }
  };

  const getOwnedEstablishments = async () => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('establishments')
        .select('*')
        .eq('owner_id', user.id);

      if (error) throw error;
      
      return data || [];
    } catch (error: any) {
      toast.error(`Error fetching owned establishments: ${error.message}`);
      return [];
    }
  };

  const getApplicationsByOwner = async () => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      const { data: establishments, error: estError } = await supabase
        .from('establishments')
        .select('id')
        .eq('owner_id', user.id);
      
      if (estError) throw estError;
      
      if (!establishments || establishments.length === 0) {
        return [];
      }
      
      const establishmentIds = establishments.map(e => e.id);
      const { data: applications, error: appError } = await supabase
        .from('applications')
        .select(`
          *,
          establishment:establishments(*)
        `)
        .in('establishment_id', establishmentIds);
      
      if (appError) throw appError;
      
      return applications || [];
    } catch (error: any) {
      toast.error(`Error fetching applications by owner: ${error.message}`);
      return [];
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        user,
        profile,
        signUp,
        signIn,
        signOut,
        addEstablishment,
        getEstablishments,
        registerEstablishment,
        submitApplication,
        getApplications,
        createInspectorAccount,
        getInspectors,
        getOwners,
        getProfiles,
        updateApplication,
        getApplication,
        getInspections,
        submitInspectionChecklist,
        getOwnedEstablishments,
        getApplicationsByOwner
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
