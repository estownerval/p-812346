
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export type UserRole = "admin" | "inspector" | "owner";

export interface UserProfile {
  id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  role: UserRole;
  position?: string;
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
  getApplications: () => Promise<any[]>;
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
          
          // Fetch user profile
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

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          
          // Fetch user profile
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
      // Register the user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // Pass additional user data to the metadata
          data: {
            first_name: userData.firstName,
            middle_name: userData.middleName || null,
            last_name: userData.lastName,
            role: 'owner', // Default role for signup
          },
        }
      });

      if (error) {
        throw error;
      }

      // Create establishments for the user
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
      
      // Redirect to login (user needs to verify email if that's enabled)
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
        // Fetch user profile to determine role
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (profileError) {
          throw profileError;
        }

        // Redirect based on role
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
      
      const { data, error } = await supabase
        .from('establishments')
        .select('*')
        .eq('owner_id', user.id);

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
          status: 'pending',
          address
        })
        .eq('id', id)
        .eq('owner_id', user.id);

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
      
      // Insert the application
      const { data: applicationData, error } = await supabase
        .from('applications')
        .insert({
          establishment_id: data.establishmentId,
          application_type: data.applicationType,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      
      // Upload documents if provided
      if (data.documents && data.documents.length > 0) {
        for (const doc of data.documents) {
          const fileName = `${user.id}/${applicationData.id}/${Date.now()}_${doc.name}`;
          
          // Upload to storage
          const { error: uploadError } = await supabase.storage
            .from('documents')
            .upload(fileName, doc.file);

          if (uploadError) throw uploadError;
          
          // Get public URL
          const { data: publicUrlData } = supabase.storage
            .from('documents')
            .getPublicUrl(fileName);
          
          // Save document reference
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
      
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          establishment:establishments(*)
        `)
        .eq('establishment.owner_id', user.id);

      if (error) throw error;
      
      return data || [];
    } catch (error: any) {
      toast.error(`Error fetching applications: ${error.message}`);
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
        getApplications
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
