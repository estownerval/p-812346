
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Routes, Route, Link } from "react-router-dom";
import { Eye, ClipboardCheck } from "lucide-react";

// Placeholder - would come from API in a real app
const inspections = [
  {
    id: 1,
    establishment: "ABC Restaurant",
    owner: "John Doe",
    date: "2023-06-15",
    time: "09:00 AM",
    status: "for inspection"
  },
  {
    id: 2,
    establishment: "XYZ Cafe",
    owner: "Jane Smith",
    date: "2023-06-16",
    time: "10:30 AM",
    status: "for inspection"
  },
  {
    id: 3,
    establishment: "City Mall",
    owner: "Robert Johnson",
    date: "2023-06-14",
    time: "01:00 PM", 
    status: "inspected"
  }
];

const InspectionsList = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assigned Inspections</h1>
          <p className="text-muted-foreground">
            Manage your inspection assignments and reports
          </p>
        </div>
      </div>

      <Table>
        <TableCaption>List of assigned establishments for inspection</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Establishment</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inspections.map((inspection) => (
            <TableRow key={inspection.id}>
              <TableCell>{inspection.id}</TableCell>
              <TableCell>{inspection.establishment}</TableCell>
              <TableCell>{inspection.owner}</TableCell>
              <TableCell>{inspection.date}</TableCell>
              <TableCell>{inspection.time}</TableCell>
              <TableCell>
                <Badge variant={inspection.status === "inspected" ? "secondary" : "default"}>
                  {inspection.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/dashboard/inspector/inspections/${inspection.id}`}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Link>
                  </Button>
                  {inspection.status === "for inspection" && (
                    <Button variant="default" size="sm" asChild>
                      <Link to={`/dashboard/inspector/inspections/${inspection.id}/checklist`}>
                        <ClipboardCheck className="h-4 w-4 mr-1" />
                        Checklist
                      </Link>
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const InspectionDetail = () => {
  return <div className="p-6">Inspection Detail (Coming Soon)</div>;
};

const InspectionChecklist = () => {
  return <div className="p-6">Inspection Checklist (Coming Soon)</div>;
};

const InspectorInspections = () => {
  return (
    <Routes>
      <Route path="/" element={<InspectionsList />} />
      <Route path="/:id" element={<InspectionDetail />} />
      <Route path="/:id/checklist" element={<InspectionChecklist />} />
    </Routes>
  );
};

export default InspectorInspections;
