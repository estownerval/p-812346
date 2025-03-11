
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Footer } from "@/components/layout/Footer";
import { ChevronRight, ClipboardCheck, FactoryIcon, Shield, Flame } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Flame className="h-6 w-6 text-fire" />
            <span className="font-bold text-xl text-red-500">VFire
            <span className="font-bold text-x2 text-black"> inspect</span></span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex gap-6">
              <Link to="/about" className="text-sm font-medium hover:text-fire">
                About
              </Link>
              <Link to="/features" className="text-sm font-medium hover:text-fire">
                Features
              </Link>
              <Link to="/contact" className="text-sm font-medium hover:text-fire">
                Contact
              </Link>
            </div>
            <div className="flex items-center gap-2">
              {/* <div className="dropdown dropdown-end">
                <Button variant="outline" className="text-sm">
                  Login
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
                <div className="dropdown-content bg-white rounded-md shadow-md p-2 mt-2">
                  <Link to="/login/admin" className="block px-4 py-2 text-sm hover:bg-gray-100 rounded-md">
                    Admin
                  </Link>
                  <Link to="/login/inspector" className="block px-4 py-2 text-sm hover:bg-gray-100 rounded-md">
                    Fire Inspector
                  </Link>
                  <Link to="/login/owner" className="block px-4 py-2 text-sm hover:bg-gray-100 rounded-md">
                    Establishment Owner
                  </Link>
                </div>
              </div> */}
              
              <Link to="/login/owner">
                <Button className="bg-fire hover:bg-fire/90 text-white">Login</Button>
              </Link>

              <Link to="/signup/owner">
                <Button className="bg-fire hover:bg-fire/90 text-white">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Fire Safety Management System
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Streamlining fire safety inspections, certifications, and compliance for businesses and fire departments.
                </p>
              </div>
              {/* <div className="space-x-4">
                <Link to="/signup/owner">
                  <Button className="bg-fire hover:bg-fire/90 text-white" size="lg">
                    Register Your Business
                  </Button>
                </Link>
                <Link to="/login/owner">
                  <Button variant="outline" size="lg">
                    Existing Business Login
                  </Button>
                </Link>
              </div> */}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="p-3 rounded-full bg-fire/10">
                      <FactoryIcon className="h-8 w-8 text-fire" />
                    </div>
                    <h3 className="text-xl font-bold">Register Establishment</h3>
                    <p className="text-gray-500">
                      Sign up and register your business establishment with required documentation.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="p-3 rounded-full bg-fire/10">
                      <ClipboardCheck className="h-8 w-8 text-fire" />
                    </div>
                    <h3 className="text-xl font-bold">Apply for Certification</h3>
                    <p className="text-gray-500">
                      Apply for FSEC, FSIC (Occupancy), or FSIC (Business) certification.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="p-3 rounded-full bg-fire/10">
                      <Shield className="h-8 w-8 text-fire" />
                    </div>
                    <h3 className="text-xl font-bold">Get Certified</h3>
                    <p className="text-gray-500">
                      After inspection, receive your fire safety certification to comply with regulations.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
