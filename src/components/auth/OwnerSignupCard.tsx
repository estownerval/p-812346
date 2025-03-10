
import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { InputField } from "./InputField";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Plus, Minus } from "lucide-react";

interface EstablishmentData {
  name: string;
  dtiCertNo: string;
}

interface SignupFormData {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  establishments: EstablishmentData[];
}

export const SignupCard: React.FC = () => {
  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<SignupFormData>({
    defaultValues: {
      establishments: [{ name: "", dtiCertNo: "" }]
    }
  });
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "establishments",
  });

  const navigate = useNavigate();
  const { toast } = useToast();
  const password = watch("password");

  const onSubmit = (data: SignupFormData) => {
    console.log("Owner Signup form submitted:", data);
    // Here you would typically register the user
    // For now, we'll just navigate to the login page
    toast({
      title: "Registration successful",
      description: "You can now login to your account.",
      duration: 3000,
    });
    navigate("/owner/login");
  };

  return (
    <div className="w-[800px] border flex flex-col items-center bg-white p-10 rounded-[20px] border-solid border-[#524F4F] max-md:w-[90%] max-md:max-w-[800px] max-sm:p-5">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/3ee06004c0875245644f1df0278e61e66cf96a47"
        alt="Logo"
        className="w-[88px] h-[131px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] mb-5 rounded-[20px]"
      />
      <div className="text-[#F00] text-[40px] font-bold mb-10 max-sm:text-3xl">
        ESTABLISHMENT OWNER SIGN UP
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[700px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <InputField
              label="First Name:"
              icon="https://cdn.builder.io/api/v1/image/assets/TEMP/a72892b6b437fca9a6a8553a12c65cba9a584f37"
              type="text"
              placeholder="First Name"
              {...register("firstName", { required: true })}
            />
          </div>
          <div>
            <InputField
              label="Middle Name (Optional):"
              icon="https://cdn.builder.io/api/v1/image/assets/TEMP/a72892b6b437fca9a6a8553a12c65cba9a584f37"
              type="text"
              placeholder="Middle Name"
              {...register("middleName")}
            />
          </div>
          <div>
            <InputField
              label="Last Name:"
              icon="https://cdn.builder.io/api/v1/image/assets/TEMP/a72892b6b437fca9a6a8553a12c65cba9a584f37"
              type="text"
              placeholder="Last Name"
              {...register("lastName", { required: true })}
            />
          </div>
        </div>
        
        <InputField
          label="E-mail:"
          icon="https://cdn.builder.io/api/v1/image/assets/TEMP/a72892b6b437fca9a6a8553a12c65cba9a584f37"
          type="email"
          placeholder="Enter your E-mail"
          {...register("email", { required: true })}
        />
        
        <InputField
          label="Password:"
          icon="https://cdn.builder.io/api/v1/image/assets/TEMP/3f4e72fc7fc5f3567fcbbdd6e4e01073d6e4afd8"
          type="password"
          placeholder="Enter your Password"
          showPasswordToggle
          {...register("password", { 
            required: true, 
            minLength: {
              value: 8,
              message: "Password must have at least 8 characters"
            }
          })}
        />
        
        <InputField
          label="Confirm Password:"
          icon="https://cdn.builder.io/api/v1/image/assets/TEMP/3f4e72fc7fc5f3567fcbbdd6e4e01073d6e4afd8"
          type="password"
          placeholder="Confirm your Password"
          showPasswordToggle
          {...register("confirmPassword", { 
            required: true, 
            validate: value => value === password || "Passwords do not match"
          })}
        />
        
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h3 className="text-black text-xl font-semibold mb-2">Establishments</h3>
            <button 
              type="button"
              onClick={() => append({ name: "", dtiCertNo: "" })}
              className="bg-[#FE623F] text-white p-2 rounded-full hover:bg-[#e55636] transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>
          
          {fields.map((field, index) => (
            <div key={field.id} className="border rounded-lg p-4 mb-4 bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-lg font-medium">Establishment #{index + 1}</h4>
                {index > 0 && (
                  <button 
                    type="button"
                    onClick={() => remove(index)}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <Minus size={20} />
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Establishment Name:"
                  icon="https://cdn.builder.io/api/v1/image/assets/TEMP/a72892b6b437fca9a6a8553a12c65cba9a584f37"
                  type="text"
                  placeholder="Establishment Name"
                  {...register(`establishments.${index}.name` as const, { required: true })}
                />
                
                <InputField
                  label="DTI Certificate No.:"
                  icon="https://cdn.builder.io/api/v1/image/assets/TEMP/a72892b6b437fca9a6a8553a12c65cba9a584f37"
                  type="text"
                  placeholder="DTI Certificate Number"
                  {...register(`establishments.${index}.dtiCertNo` as const, { required: true })}
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="w-40 h-[54px] text-white text-xl font-bold cursor-pointer bg-[#FE623F] rounded-[20px] border-[none] max-sm:w-[140px] max-sm:h-[45px] max-sm:text-lg hover:bg-[#e55636] transition-colors flex items-center justify-center"
          >
            SIGN UP
          </button>
        </div>
        
        <div className="text-center mt-5">
          <span className="text-black text-base font-medium">Already have an account? </span>
          <Link to="/owner/login" className="text-[#FE623F] text-base font-medium hover:underline">
            Log in
          </Link>
        </div>
      </form>
    </div>
  );
};
