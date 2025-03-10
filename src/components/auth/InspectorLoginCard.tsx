
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { InputField } from "./InputField";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface LoginFormData {
  email: string;
  password: string;
}

export const LoginCard: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: ""
    }
  });
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setErrorMessage("");
    
    try {
      // Login with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      
      if (authError) throw authError;
      
      if (authData.user) {
        // Fetch user profile to check role
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', authData.user.id)
          .single();
          
        if (profileError) throw profileError;
        
        if (profileData?.role === 'fire_inspector') {
          toast({
            title: "Login successful",
            description: "Welcome, Fire Inspector!",
            duration: 3000,
          });
          navigate("/inspector/dashboard");
        } else {
          throw new Error("You do not have fire inspector privileges");
        }
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setErrorMessage(error.message || "Failed to login. Please check your credentials.");
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[605px] border flex flex-col items-center bg-white p-10 rounded-[20px] border-solid border-[#524F4F] max-md:w-[90%] max-md:max-w-[605px] max-sm:p-5">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/3ee06004c0875245644f1df0278e61e66cf96a47"
        alt="Logo"
        className="w-[88px] h-[131px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] mb-5 rounded-[20px]"
      />
      <div className="text-[#F00] text-[40px] font-bold mb-10 max-sm:text-3xl">
        FIRE INSPECTOR LOG IN
      </div>
      {errorMessage && (
        <div className="w-full p-4 mb-4 text-center bg-red-100 border border-red-400 text-red-700 rounded">
          {errorMessage}
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[498px]">
        <InputField
          label="E-mail:"
          icon="https://cdn.builder.io/api/v1/image/assets/TEMP/a72892b6b437fca9a6a8553a12c65cba9a584f37"
          type="email"
          placeholder="Enter your E-mail"
          {...register("email", { 
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address"
            }
          })}
        />
        {errors.email && <p className="text-red-500 text-sm mt-1 mb-3">{errors.email.message}</p>}
        
        <InputField
          label="Password :"
          icon="https://cdn.builder.io/api/v1/image/assets/TEMP/3f4e72fc7fc5f3567fcbbdd6e4e01073d6e4afd8"
          type="password"
          placeholder="Enter your Password"
          showPasswordToggle
          {...register("password", { required: "Password is required" })}
        />
        {errors.password && <p className="text-red-500 text-sm mt-1 mb-3">{errors.password.message}</p>}
        
        <div className="text-black text-base italic font-medium cursor-pointer mb-5 max-sm:text-sm hover:text-[#FE623F] transition-colors">
          Forgot Password?
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-40 h-[54px] text-white text-xl font-bold cursor-pointer bg-[#FE623F] mx-auto my-0 rounded-[20px] border-[none] max-sm:w-[140px] max-sm:h-[45px] max-sm:text-lg hover:bg-[#e55636] transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              LOGGING IN
            </span>
          ) : "LOG IN"}
        </button>
      </form>
    </div>
  );
};
