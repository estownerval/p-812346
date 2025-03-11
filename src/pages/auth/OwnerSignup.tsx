
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Plus, Minus } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

// Type for an establishment business
interface Establishment {
  name: string;
  dtiNumber: string;
}

const OwnerSignup = () => {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [establishments, setEstablishments] = useState<Establishment[]>([{ name: "", dtiNumber: "" }]);
  
  const { signUp, isLoading } = useAuth();

  const addEstablishment = () => {
    setEstablishments([...establishments, { name: "", dtiNumber: "" }]);
  };

  const removeEstablishment = (index: number) => {
    if (establishments.length > 1) {
      const newEstablishments = [...establishments];
      newEstablishments.splice(index, 1);
      setEstablishments(newEstablishments);
    }
  };

  const updateEstablishment = (index: number, field: keyof Establishment, value: string) => {
    const newEstablishments = [...establishments];
    newEstablishments[index][field] = value;
    setEstablishments(newEstablishments);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if passwords match
    if (password !== confirmPassword) {
      return;
    }

    // Validate establishments
    const validEstablishments = establishments.every(est => est.name && est.dtiNumber);
    if (!validEstablishments) {
      return;
    }

    await signUp(email, password, {
      firstName,
      middleName,
      lastName,
      establishments
    });
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader className="space-y-1 items-center text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="h-6 w-6 text-fire" />
              <span className="font-bold text-xl">FireInspect</span>
            </div>
            <CardTitle className="text-2xl font-bold">Sign Up as Establishment Owner</CardTitle>
            <CardDescription>Create an account to register your establishments</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name <span className="text-fire">*</span></Label>
                  <Input 
                    id="firstName" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="middleName">Middle Name (Optional)</Label>
                  <Input 
                    id="middleName" 
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name <span className="text-fire">*</span></Label>
                  <Input 
                    id="lastName" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email <span className="text-fire">*</span></Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password <span className="text-fire">*</span></Label>
                  <Input 
                    id="password" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password <span className="text-fire">*</span></Label>
                  <Input 
                    id="confirmPassword" 
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required 
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Establishment Information</h3>
                  <Button 
                    type="button" 
                    variant="outline"
                    size="sm"
                    onClick={addEstablishment}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" /> Add Establishment
                  </Button>
                </div>
                
                {establishments.map((establishment, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Establishment #{index + 1}</h4>
                      {establishments.length > 1 && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => removeEstablishment(index)}
                          className="text-fire hover:text-fire-dark"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`estName-${index}`}>Establishment Name <span className="text-fire">*</span></Label>
                        <Input 
                          id={`estName-${index}`} 
                          value={establishment.name}
                          onChange={(e) => updateEstablishment(index, "name", e.target.value)}
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`dtiNumber-${index}`}>DTI Certificate No. <span className="text-fire">*</span></Label>
                        <Input 
                          id={`dtiNumber-${index}`} 
                          value={establishment.dtiNumber}
                          onChange={(e) => updateEstablishment(index, "dtiNumber", e.target.value)}
                          required 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-fire hover:bg-fire/90"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              <span>Already have an account? </span>
              <Link to="/login/owner" className="text-fire hover:underline">
                Log in
              </Link>
            </div>
            <div className="mt-2 text-center text-sm">
              <Link to="/" className="text-fire hover:underline">
                Back to home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OwnerSignup;
