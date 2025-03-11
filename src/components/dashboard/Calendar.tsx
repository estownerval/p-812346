
import { useState, useEffect } from 'react';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface Event {
  id: string;
  title: string;
  date: Date;
  type: 'inspection' | 'application';
  status: string;
}

const Calendar = () => {
  const { profile, getApplications, getInspections } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDayEvents, setSelectedDayEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const allEvents: Event[] = [];
        
        // Fetch applications
        const applications = await getApplications();
        applications.forEach((app: any) => {
          if (app.application_date) {
            allEvents.push({
              id: app.id,
              title: `${app.application_type.toUpperCase()} - ${app.establishment?.name || 'Unknown'}`,
              date: new Date(app.application_date),
              type: 'application',
              status: app.status
            });
          }
          
          if (app.inspection_date) {
            allEvents.push({
              id: `insp-${app.id}`,
              title: `Inspection - ${app.establishment?.name || 'Unknown'}`,
              date: new Date(app.inspection_date),
              type: 'inspection',
              status: app.status
            });
          }
        });
        
        // If inspector, also fetch assigned inspections
        if (profile?.role === 'inspector') {
          const inspections = await getInspections();
          inspections.forEach((insp: any) => {
            if (insp.inspection_date && !allEvents.some(e => e.id === `insp-${insp.id}`)) {
              allEvents.push({
                id: `insp-${insp.id}`,
                title: `Inspection - ${insp.establishment?.name || 'Unknown'}`,
                date: new Date(insp.inspection_date),
                type: 'inspection',
                status: insp.status
              });
            }
          });
        }
        
        setEvents(allEvents);
        updateSelectedDayEvents(date, allEvents);
      } catch (error) {
        console.error("Error fetching calendar events:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (profile) {
      fetchEvents();
    }
  }, [profile, getApplications, getInspections]);

  const updateSelectedDayEvents = (date: Date, eventsList: Event[] = events) => {
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    
    const filteredEvents = eventsList.filter(event => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate.getTime() === selectedDate.getTime();
    });
    
    setSelectedDayEvents(filteredEvents);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setDate(date);
      updateSelectedDayEvents(date);
    }
  };

  const getEventClassName = (type: string, status: string) => {
    if (type === 'inspection') {
      return 'bg-blue-100 border-blue-200 text-blue-800';
    }
    
    switch (status) {
      case 'approved':
        return 'bg-green-100 border-green-200 text-green-800';
      case 'rejected':
        return 'bg-red-100 border-red-200 text-red-800';
      case 'pending':
        return 'bg-yellow-100 border-yellow-200 text-yellow-800';
      case 'for_inspection':
        return 'bg-purple-100 border-purple-200 text-purple-800';
      case 'inspected':
        return 'bg-indigo-100 border-indigo-200 text-indigo-800';
      default:
        return 'bg-gray-100 border-gray-200 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-fire" />
        <span className="ml-2">Loading calendar...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Calendar</h2>
        <p className="text-muted-foreground">
          View and manage your schedule
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-[400px_1fr]">
        <Card>
          <CardContent className="pt-6">
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              className="rounded-md border"
              modifiers={{
                event: (date) => {
                  const dateStr = date.toDateString();
                  return events.some(event => event.date.toDateString() === dateStr);
                }
              }}
              modifiersStyles={{
                event: {
                  fontWeight: 'bold',
                  backgroundColor: '#f3f4f6',
                  textDecoration: 'underline'
                }
              }}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>
              Events for {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </CardTitle>
            <CardDescription>
              {selectedDayEvents.length} events scheduled for this day
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedDayEvents.length === 0 ? (
              <p className="text-muted-foreground text-center py-6">
                No events scheduled for this day
              </p>
            ) : (
              <div className="space-y-4">
                {selectedDayEvents.map(event => (
                  <div 
                    key={event.id} 
                    className={`p-4 rounded-lg border ${getEventClassName(event.type, event.status)}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        <p className="text-sm">
                          {event.date.toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {event.type === 'inspection' ? 'Inspection' : event.status.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Calendar;
