import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Calendar as CalendarIcon, Clock, Users, MapPin, ExternalLink, Plus } from "lucide-react";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: "booking" | "tasting" | "meeting" | "other";
  guestCount?: number;
  location: string;
  description: string;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  clientName: string;
}

interface CalendarIntegrationProps {
  isRestrictedView?: boolean;
}

export function CalendarIntegration({ isRestrictedView = false }: CalendarIntegrationProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: "1",
      title: "Sarah & John Wedding",
      date: "2024-03-15",
      time: "18:00",
      type: "booking",
      guestCount: 250,
      location: "Main Hall",
      description: "Premium wedding package with live counters",
      status: "confirmed",
      clientName: "Sarah & John"
    },
    {
      id: "2",
      title: "Food Tasting - Sharma Family",
      date: "2024-02-10",
      time: "14:00",
      type: "tasting",
      guestCount: 4,
      location: "Tasting Room",
      description: "Menu tasting for anniversary celebration",
      status: "confirmed",
      clientName: "Sharma Family"
    },
    {
      id: "3",
      title: "Vendor Meeting - Decorators",
      date: "2024-02-08",
      time: "11:00",
      type: "meeting",
      location: "Office",
      description: "Discuss decoration requirements for upcoming events",
      status: "confirmed",
      clientName: "Royal Decorators"
    },
    {
      id: "4",
      title: "Kumar Family Reception",
      date: "2024-02-28",
      time: "19:00",
      type: "booking",
      guestCount: 150,
      location: "Main Hall",
      description: "Reception party with DJ and dance floor",
      status: "confirmed",
      clientName: "Kumar Family"
    }
  ]);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "booking": return "bg-blue-100 text-blue-800";
      case "tasting": return "bg-green-100 text-green-800";
      case "meeting": return "bg-purple-100 text-purple-800";
      case "other": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateStr);
  };

  const getUpcomingEvents = () => {
    const today = new Date().toISOString().split('T')[0];
    return events
      .filter(event => event.date >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);
  };

  const syncWithGoogleCalendar = () => {
    toast({
      title: "Google Calendar Sync",
      description: "Events have been synced with Google Calendar",
    });
  };

  const generateTastingSlots = () => {
    toast({
      title: "Tasting Slots Generated",
      description: "Available food tasting slots have been generated based on existing bookings",
    });
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];
  const upcomingEvents = getUpcomingEvents();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Calendar Integration</h2>
          <p className="text-muted-foreground">Manage events, bookings, and tasting appointments</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={syncWithGoogleCalendar}>
            <ExternalLink className="w-4 h-4 mr-2" />
            Sync with Google Calendar
          </Button>
          <Button variant="outline" onClick={generateTastingSlots}>
            Generate Tasting Slots
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Event Calendar</CardTitle>
              <CardDescription>Select a date to view events</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                modifiers={{
                  hasEvents: (date) => getEventsForDate(date).length > 0
                }}
                modifiersStyles={{
                  hasEvents: { backgroundColor: 'hsl(var(--primary))', color: 'white' }
                }}
              />
              
              <div className="mt-4">
                <h4 className="font-medium mb-2">
                  Events for {selectedDate?.toLocaleDateString()}
                </h4>
                {selectedDateEvents.length > 0 ? (
                  <div className="space-y-2">
                    {selectedDateEvents.map((event) => (
                      <div key={event.id} className="p-2 border rounded-md">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{event.title}</span>
                          <Badge className={getEventTypeColor(event.type)}>
                            {event.type}
                          </Badge>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <Clock className="w-3 h-3 mr-1" />
                          {event.time}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No events scheduled</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Next 5 scheduled events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      <CalendarIcon className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium">{event.title}</h3>
                        <Badge className={getEventTypeColor(event.type)}>
                          {event.type}
                        </Badge>
                        <Badge className={getStatusColor(event.status)}>
                          {event.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <CalendarIcon className="w-4 h-4 mr-1" />
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {event.time}
                        </div>
                        {event.guestCount && (
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {event.guestCount} guests
                          </div>
                        )}
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {event.location}
                        </div>
                      </div>
                    </div>
                    <div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedEvent(event)}
                          >
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Event Details</DialogTitle>
                            <DialogDescription>
                              Complete information for {event.title}
                            </DialogDescription>
                          </DialogHeader>
                          {selectedEvent && (
                            <div className="grid gap-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium">Event Title</h4>
                                  <p className="text-sm mt-1">{selectedEvent.title}</p>
                                </div>
                                <div>
                                  <h4 className="font-medium">Client Name</h4>
                                  <p className="text-sm mt-1">{selectedEvent.clientName}</p>
                                </div>
                                <div>
                                  <h4 className="font-medium">Date & Time</h4>
                                  <p className="text-sm mt-1">
                                    {new Date(selectedEvent.date).toLocaleDateString()} at {selectedEvent.time}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="font-medium">Event Type</h4>
                                  <Badge className={getEventTypeColor(selectedEvent.type)}>
                                    {selectedEvent.type}
                                  </Badge>
                                </div>
                                <div>
                                  <h4 className="font-medium">Location</h4>
                                  <p className="text-sm mt-1">{selectedEvent.location}</p>
                                </div>
                                <div>
                                  <h4 className="font-medium">Status</h4>
                                  <Badge className={getStatusColor(selectedEvent.status)}>
                                    {selectedEvent.status}
                                  </Badge>
                                </div>
                                {selectedEvent.guestCount && (
                                  <div>
                                    <h4 className="font-medium">Guest Count</h4>
                                    <p className="text-sm mt-1">{selectedEvent.guestCount}</p>
                                  </div>
                                )}
                              </div>
                              <div>
                                <h4 className="font-medium">Description</h4>
                                <p className="text-sm mt-1">{selectedEvent.description}</p>
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm">
                                  Edit Event
                                </Button>
                                <Button size="sm" variant="outline">
                                  Add to Google Calendar
                                </Button>
                                {selectedEvent.type === "booking" && (
                                  <Button size="sm" variant="outline">
                                    View Booking Details
                                  </Button>
                                )}
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
                <CardDescription>Calendar overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Total Events</span>
                    <span className="font-medium">{events.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Bookings</span>
                    <span className="font-medium">
                      {events.filter(e => e.type === "booking").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Tastings</span>
                    <span className="font-medium">
                      {events.filter(e => e.type === "tasting").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Confirmed</span>
                    <span className="font-medium text-green-600">
                      {events.filter(e => e.status === "confirmed").length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Available Actions</CardTitle>
                <CardDescription>Quick calendar management</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule New Event
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={generateTastingSlots}>
                  <Clock className="w-4 h-4 mr-2" />
                  Generate Tasting Slots
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Block Unavailable Dates
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={syncWithGoogleCalendar}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Sync with Google Calendar
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}