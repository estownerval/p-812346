
import React from "react";
import { useForm } from "react-hook-form";
import { InputField } from "./InputField";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface LoginFormData {
  email: string;
  password: string;
}

export const LoginCard: React.FC = () => {
  const { register, handleSubmit } = useForm<LoginFormData>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const onSubmit = (data: LoginFormData) => {
    console.log("Inspector Login form submitted:", data);
    // Here you would typically authenticate the user
    // For now, we'll just navigate to the inspector dashboard
    toast({
      title: "Login successful",
      description: "Welcome, Inspector!",
      duration: 3000,
    });
    navigate("/inspector/dashboard");
  };

  return (
    <div className="w-[605px] border flex flex-col items-center bg-white p-10 rounded-[20px] border-solid border-[#524F4F] max-md:w-[90%] max-md:max-w-[605px] max-sm:p-5">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/3ee06004c0875245644f1df0278e61e66cf96a47"
        alt="Logo"
        className="w-[88px] h-[131px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] mb-5 rounded-[20px]"
      />
      <div className="text-[#F00] text-[40px] font-bold mb-10 max-sm:text-3xl">
        INSPECTOR LOG IN
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[498px]">
        <InputField
          label="E-mail:"
          icon="https://cdn.builder.io/api/v1/image/assets/TEMP/a72892b6b437fca9a6a8553a12c65cba9a584f37"
          type="email"
          placeholder="Enter your E-mail"
          {...register("email", { required: true })}
        />
        <InputField
          label="Password :"
          icon="https://cdn.builder.io/api/v1/image/assets/TEMP/3f4e72fc7fc5f3567fcbbdd6e4e01073d6e4afd8"
          type="password"
          placeholder="Enter your Password"
          showPasswordToggle
          {...register("password", { required: true })}
        />
        <div className="text-black text-base italic font-medium cursor-pointer mb-5 max-sm:text-sm hover:text-[#FE623F] transition-colors">
          Forgot Password?
        </div>
        <button
          type="submit"
          className="w-40 h-[54px] text-white text-xl font-bold cursor-pointer bg-[#FE623F] mx-auto my-0 rounded-[20px] border-[none] max-sm:w-[140px] max-sm:h-[45px] max-sm:text-lg hover:bg-[#e55636] transition-colors flex items-center justify-center"
        >
          LOG IN
        </button>
      </form>
    </div>
  );
};
