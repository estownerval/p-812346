
import React from "react";
import { Link } from "react-router-dom";
import TestAccounts from "@/components/TestAccounts";

const Index = () => {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <main className="flex flex-col justify-center items-center min-h-screen bg-white p-5">
        <div className="w-[605px] border flex flex-col items-center bg-white p-10 rounded-[20px] border-solid border-[#524F4F] max-md:w-[90%] max-md:max-w-[605px] max-sm:p-5">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/3ee06004c0875245644f1df0278e61e66cf96a47"
            alt="Logo"
            className="w-[88px] h-[131px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] mb-5 rounded-[20px]"
          />
          <div className="text-[#F00] text-[40px] font-bold mb-10 max-sm:text-3xl">
            FIRE INSPECTION SYSTEM
          </div>
          <div className="flex flex-col gap-4 w-full max-w-[400px]">
            <Link 
              to="/admin/login" 
              className="w-full h-[54px] text-white text-xl font-bold cursor-pointer bg-[#FE623F] rounded-[20px] border-[none] max-sm:h-[45px] max-sm:text-lg hover:bg-[#e55636] transition-colors flex items-center justify-center"
            >
              ADMIN LOGIN
            </Link>
            <Link 
              to="/inspector/login" 
              className="w-full h-[54px] text-white text-xl font-bold cursor-pointer bg-[#FE623F] rounded-[20px] border-[none] max-sm:h-[45px] max-sm:text-lg hover:bg-[#e55636] transition-colors flex items-center justify-center"
            >
              FIRE INSPECTOR LOGIN
            </Link>
            <Link 
              to="/owner/login" 
              className="w-full h-[54px] text-white text-xl font-bold cursor-pointer bg-[#FE623F] rounded-[20px] border-[none] max-sm:h-[45px] max-sm:text-lg hover:bg-[#e55636] transition-colors flex items-center justify-center"
            >
              ESTABLISHMENT OWNER LOGIN
            </Link>
            <div className="text-center mt-4">
              <span className="text-black text-base font-medium">New establishment owner? </span>
              <Link to="/owner/signup" className="text-[#FE623F] text-base font-medium hover:underline">
                Sign up here
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-10 w-full max-w-[605px]">
          <TestAccounts />
        </div>
      </main>
    </>
  );
};

export default Index;
