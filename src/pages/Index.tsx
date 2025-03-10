import React from "react";
import { LoginCard } from "@/components/auth/LoginCard";

const Index = () => {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <main className="flex justify-center items-center min-h-screen bg-white p-5">
        <LoginCard />
      </main>
    </>
  );
};

export default Index;
