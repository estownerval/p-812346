
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

// This is a placeholder component since we can't integrate actual maps
// In a real implementation, you would use a library like Mapbox or Google Maps
const Map = () => {
  const { profile, getEstablishments } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [establishments, setEstablishments] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEstablishments, setFilteredEstablishments] = useState<any[]>([]);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchEstablishments = async () => {
      setIsLoading(true);
      try {
        const data = await getEstablishments();
        const validEstablishments = data.filter(est => est.address);
        setEstablishments(validEstablishments);
        setFilteredEstablishments(validEstablishments);
      } catch (error) {
        console.error("Error fetching establishments:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (profile) {
      fetchEstablishments();
    }
  }, [profile, getEstablishments]);

  useEffect(() => {
    // Filter establishments based on search query
    const filtered = establishments.filter(
      est => est.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
             est.address?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredEstablishments(filtered);
  }, [searchQuery, establishments]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'registered':
        return 'bg-green-100 border-green-200 text-green-800';
      case 'rejected':
        return 'bg-red-100 border-red-200 text-red-800';
      default:
        return 'bg-yellow-100 border-yellow-200 text-yellow-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-fire" />
        <span className="ml-2">Loading map data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Location Map</h2>
        <p className="text-muted-foreground">
          View establishments on the map
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Establishments Map</CardTitle>
          <CardDescription>
            View all registered establishments on the map
          </CardDescription>
          <div className="mt-2">
            <Input
              placeholder="Search by name or address"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-4">
            <div 
              ref={mapContainerRef}
              className="bg-gray-100 rounded-lg h-[500px] flex items-center justify-center"
            >
              <div className="text-center">
                <p className="text-muted-foreground">
                  Map visualization would be rendered here using Mapbox or Google Maps API
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Showing {filteredEstablishments.length} establishments
                </p>
              </div>
            </div>
            
            <div className="overflow-y-auto h-[500px] border rounded-lg">
              <div className="p-4 border-b">
                <h3 className="font-medium">Establishments</h3>
                <p className="text-sm text-muted-foreground">
                  {filteredEstablishments.length} locations
                </p>
              </div>
              <div className="divide-y">
                {filteredEstablishments.map(est => (
                  <div key={est.id} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{est.name}</h4>
                      <Badge className={getStatusColor(est.status)}>
                        {est.status.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {est.address || 'No address provided'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      DTI: {est.dti_number}
                    </p>
                  </div>
                ))}
                
                {filteredEstablishments.length === 0 && (
                  <div className="p-4 text-center">
                    <p className="text-muted-foreground">
                      No establishments found
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Map;
