
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck, Eye } from "lucide-react";
import { AssignedInspection } from "@/hooks/use-assigned-inspections";

interface InspectionListProps {
  inspections: AssignedInspection[];
  onStartInspection: (inspection: AssignedInspection) => void;
  onViewReport: (inspection: AssignedInspection) => void;
}

export const InspectionList: React.FC<InspectionListProps> = ({ 
  inspections,
  onStartInspection,
  onViewReport
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Assigned Inspections</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Establishment</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Inspection Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inspections.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No inspections assigned
                </TableCell>
              </TableRow>
            ) : (
              inspections.map((inspection) => (
                <TableRow key={inspection.id}>
                  <TableCell>{inspection.inspectionId}</TableCell>
                  <TableCell>{inspection.establishmentName}</TableCell>
                  <TableCell>{inspection.owner}</TableCell>
                  <TableCell>
                    {inspection.inspectionDate === "Not scheduled" ? (
                      "Not scheduled"
                    ) : (
                      <>
                        {inspection.inspectionDate}
                        <br />
                        <span className="text-sm text-gray-500">
                          {inspection.inspectionTime}
                        </span>
                      </>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={
                        inspection.status === 'for_inspection' 
                          ? "bg-amber-500" 
                          : "bg-green-500"
                      }
                    >
                      {inspection.status === 'for_inspection' ? 'For Inspection' : 'Inspected'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {inspection.status === 'for_inspection' ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onStartInspection(inspection)}
                        className="flex items-center"
                      >
                        <ClipboardCheck size={16} className="mr-1" />
                        Inspect
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onViewReport(inspection)}
                        className="flex items-center"
                      >
                        <Eye size={16} className="mr-1" />
                        View Report
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
