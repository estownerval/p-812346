
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
import AddInspectorForm from "./forms/AddInspectorForm";

const AdminUsers = () => {
  const [showAddInspector, setShowAddInspector] = useState(false);

  // Mock data for users
  const establishmentOwners = [
    { id: 1, name: "Jane Smith", email: "jane@example.com", establishments: 2, status: "Active" },
    { id: 2, name: "John Doe", email: "john@example.com", establishments: 1, status: "Active" },
    { id: 3, name: "Alice Johnson", email: "alice@example.com", establishments: 3, status: "Active" },
  ];

  const fireInspectors = [
    { id: 1, name: "Robert Chen", email: "robert@example.com", position: "FS01", inspections: 45, status: "Active" },
    { id: 2, name: "Sarah Williams", email: "sarah@example.com", position: "FS02", inspections: 32, status: "Active" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
      </div>

      <Tabs defaultValue="inspectors" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="inspectors">Fire Inspectors</TabsTrigger>
            <TabsTrigger value="owners">Establishment Owners</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users..."
                className="w-[200px] pl-8"
              />
            </div>
            
            <Button 
              onClick={() => setShowAddInspector(true)}
              className="bg-fire hover:bg-fire/90"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Inspector
            </Button>
          </div>
        </div>

        <TabsContent value="inspectors" className="space-y-4">
          {showAddInspector ? (
            <Card>
              <CardHeader>
                <CardTitle>Add New Fire Inspector</CardTitle>
                <CardDescription>
                  Create a new account for a fire inspector
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AddInspectorForm 
                  onCancel={() => setShowAddInspector(false)}
                  onSuccess={() => {
                    setShowAddInspector(false);
                    toast({
                      title: "Inspector account created",
                      description: "The inspector can now log in using their credentials.",
                    });
                  }}
                />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="rounded-md border">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="border-b bg-muted/50">
                      <tr>
                        <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Email</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Position</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Inspections</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fireInspectors.map((inspector) => (
                        <tr key={inspector.id} className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle">{inspector.name}</td>
                          <td className="p-4 align-middle">{inspector.email}</td>
                          <td className="p-4 align-middle">{inspector.position}</td>
                          <td className="p-4 align-middle">{inspector.inspections}</td>
                          <td className="p-4 align-middle">
                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-50 text-green-600">
                              {inspector.status}
                            </span>
                          </td>
                          <td className="p-4 align-middle">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">View</Button>
                              <Button variant="outline" size="sm">Edit</Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="owners" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <table className="w-full caption-bottom text-sm">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Email</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Establishments</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {establishmentOwners.map((owner) => (
                      <tr key={owner.id} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle">{owner.name}</td>
                        <td className="p-4 align-middle">{owner.email}</td>
                        <td className="p-4 align-middle">{owner.establishments}</td>
                        <td className="p-4 align-middle">
                          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-50 text-green-600">
                            {owner.status}
                          </span>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">View</Button>
                            <Button variant="outline" size="sm">Edit</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminUsers;
