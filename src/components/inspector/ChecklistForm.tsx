
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AlertCircle, Camera, Check, UploadCloud } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";

export interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

export interface ChecklistSection {
  id: string;
  title: string;
  items: ChecklistItem[];
}

export interface ChecklistFormData {
  sections: ChecklistSection[];
  comments: string;
}

interface ChecklistFormProps {
  applicationId: string;
  applicationType: string;
  inspectorId: string;
  inspectorName: string;
  onSubmitSuccess: () => void;
  onCancel: () => void;
}

export const ChecklistForm: React.FC<ChecklistFormProps> = ({
  applicationId,
  applicationType,
  inspectorId,
  inspectorName,
  onSubmitSuccess,
  onCancel
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imageURLs, setImageURLs] = useState<string[]>([]);
  const [checklistData, setChecklistData] = useState<ChecklistFormData>({
    sections: [
      {
        id: "1",
        title: "Fire Extinguishers",
        items: [
          { id: "1-1", label: "Appropriate type and size for the hazard", checked: false },
          { id: "1-2", label: "Properly mounted and labeled", checked: false },
          { id: "1-3", label: "Easily accessible and not obstructed", checked: false },
          { id: "1-4", label: "Pressure gauge in operable range", checked: false },
          { id: "1-5", label: "Annual maintenance tag present and current", checked: false }
        ]
      },
      {
        id: "2",
        title: "Exit Routes and Emergency Lighting",
        items: [
          { id: "2-1", label: "Exit paths clear and unobstructed", checked: false },
          { id: "2-2", label: "Exit signs visible, illuminated, and functioning", checked: false },
          { id: "2-3", label: "Emergency lighting operational", checked: false },
          { id: "2-4", label: "Exit doors open easily and not locked", checked: false }
        ]
      },
      {
        id: "3",
        title: "Fire Alarm and Detection Systems",
        items: [
          { id: "3-1", label: "Smoke/heat detectors present and operational", checked: false },
          { id: "3-2", label: "Manual pull stations accessible", checked: false },
          { id: "3-3", label: "Alarm system tested and maintained", checked: false },
          { id: "3-4", label: "Fire alarm panel shows no trouble signals", checked: false }
        ]
      },
      {
        id: "4",
        title: "General Fire Safety",
        items: [
          { id: "4-1", label: "No excessive storage of combustible materials", checked: false },
          { id: "4-2", label: "Electrical panels accessible with 3-foot clearance", checked: false },
          { id: "4-3", label: "Extension cords not used as permanent wiring", checked: false },
          { id: "4-4", label: "Flammable liquids properly stored", checked: false },
          { id: "4-5", label: "Emergency action plan available and up to date", checked: false }
        ]
      }
    ],
    comments: ""
  });

  const handleCheckboxChange = (sectionId: string, itemId: string, checked: boolean) => {
    setChecklistData(prevData => ({
      ...prevData,
      sections: prevData.sections.map(section => 
        section.id === sectionId
          ? {
              ...section,
              items: section.items.map(item => 
                item.id === itemId ? { ...item, checked } : item
              )
            }
          : section
      )
    }));
  };

  const handleCommentsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setChecklistData(prevData => ({
      ...prevData,
      comments: e.target.value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages(prev => [...prev, ...newFiles]);
      
      // Create object URLs for preview
      const newURLs = newFiles.map(file => URL.createObjectURL(file));
      setImageURLs(prev => [...prev, ...newURLs]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    
    // Revoke object URL to avoid memory leaks
    URL.revokeObjectURL(imageURLs[index]);
    setImageURLs(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImagesToStorage = async () => {
    const uploadedURLs: string[] = [];
    
    for (const image of images) {
      const fileName = `${applicationId}/${Date.now()}-${image.name}`;
      
      const { data, error } = await supabase.storage
        .from('application_files')
        .upload(fileName, image);
        
      if (error) {
        throw error;
      }
      
      const { data: urlData } = supabase.storage
        .from('application_files')
        .getPublicUrl(fileName);
        
      uploadedURLs.push(urlData.publicUrl);
    }
    
    return uploadedURLs;
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Upload images to storage
      const uploadedImageUrls = await uploadImagesToStorage();
      
      // Save checklist data
      const checklistRecord = {
        application_id: applicationId,
        application_type: applicationType,
        inspector_id: inspectorId,
        inspector_name: inspectorName,
        checklist_data: {
          sections: checklistData.sections,
          comments: checklistData.comments
        } as unknown as Json,
        images: uploadedImageUrls,
      };
      
      const { error } = await supabase
        .from('inspection_checklists')
        .insert(checklistRecord);
        
      if (error) throw error;
      
      // Update application status
      const { error: updateError } = await supabase
        .from(applicationType === 'fsic_business' ? 'fsic_business_applications' : 'fsic_occupancy_applications')
        .update({ status: 'inspected' })
        .eq('id', applicationId);
        
      if (updateError) throw updateError;
      
      toast({
        title: "Inspection submitted successfully",
        description: "The inspection checklist has been saved.",
      });
      
      onSubmitSuccess();
    } catch (error: any) {
      console.error("Error submitting inspection:", error);
      toast({
        title: "Failed to submit inspection",
        description: error.message || "An error occurred while submitting the inspection.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Inspection Checklist</CardTitle>
      </CardHeader>
      <CardContent>
        {checklistData.sections.map(section => (
          <div key={section.id} className="mb-6">
            <h3 className="text-lg font-semibold mb-3">{section.title}</h3>
            <div className="space-y-3">
              {section.items.map(item => (
                <div key={item.id} className="flex items-start space-x-2">
                  <Checkbox 
                    id={`${section.id}-${item.id}`}
                    checked={item.checked}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange(section.id, item.id, checked === true)
                    }
                  />
                  <Label 
                    htmlFor={`${section.id}-${item.id}`}
                    className="text-sm"
                  >
                    {item.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Comments and Observations</h3>
          <Textarea
            value={checklistData.comments}
            onChange={handleCommentsChange}
            placeholder="Enter any additional comments or observations..."
            rows={5}
          />
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Upload Photos</h3>
          <div className="mb-4">
            <Label htmlFor="image-upload" className="block">
              <div className="border-2 border-dashed border-gray-300 p-4 text-center rounded-md cursor-pointer hover:bg-gray-50">
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-1 text-sm text-gray-600">Click to upload inspection photos</p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </Label>
            <input
              id="image-upload"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
          
          {imageURLs.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {imageURLs.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Inspection photo ${index + 1}`}
                    className="h-40 w-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    <AlertCircle size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-4">
        <Button variant="outline" disabled={isSubmitting} onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          disabled={isSubmitting} 
          onClick={handleSubmit}
          className="bg-[#FE623F] hover:bg-[#e55636]"
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin mr-2">
                <Camera size={16} />
              </span>
              Submitting...
            </>
          ) : (
            <>
              <Check size={16} className="mr-2" />
              Submit Inspection
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
