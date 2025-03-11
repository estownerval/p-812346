
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface AddInspectorFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

const AddInspectorForm = ({ onCancel, onSuccess }: AddInspectorFormProps) => {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [position, setPosition] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!firstName || !lastName || !email || !password || !position) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real application, this would be an API call to create the user
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSuccess();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
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
          <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="mb-6">
        <Label htmlFor="position">Position <span className="text-red-500">*</span></Label>
        <Select value={position} onValueChange={setPosition} required>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a position" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="FS01">FS01</SelectItem>
            <SelectItem value="FS02">FS02</SelectItem>
            <SelectItem value="FS03">FS03</SelectItem>
            <SelectItem value="FS04">FS04</SelectItem>
            <SelectItem value="FS05">FS05</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          className="bg-fire hover:bg-fire/90"
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Register Account"}
        </Button>
      </div>
    </form>
  );
};

export default AddInspectorForm;
