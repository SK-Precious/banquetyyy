import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { Plus, Eye, Download, Calendar, Users, DollarSign } from "lucide-react";

interface Booking {
  id: string;
  clientName: string;
  eventDate: string;
  eventType: string;
  guestCount: number;
  menuPackage: string;
  totalAmount: number;
  advanceReceived: number;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  addOns: string[];
  specialRequests: string;
  createdAt: string;
}

interface MenuItem {
  id: string;
  name: string;
  type: "starter" | "main" | "dessert" | "beverage";
  price: number;
  description: string;
}

export function BookingSystem() {
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: "1",
      clientName: "Sarah & John Wedding",
      eventDate: "2024-03-15",
      eventType: "Wedding",
      guestCount: 250,
      menuPackage: "Premium Wedding Package",
      totalAmount: 650000,
      advanceReceived: 200000,
      status: "confirmed",
      addOns: ["Live Counter", "Premium Decoration", "DJ Services"],
      specialRequests: "Jain food counter required",
      createdAt: "2024-01-15"
    },
    {
      id: "2",
      clientName: "Sharma Family Function",
      eventDate: "2024-02-28",
      eventType: "Anniversary",
      guestCount: 150,
      menuPackage: "Standard Package",
      totalAmount: 350000,
      advanceReceived: 100000,
      status: "confirmed",
      addOns: ["Decoration"],
      specialRequests: "Vegetarian only, afternoon timing",
      createdAt: "2024-01-12"
    }
  ]);

  const [showNewBooking, setShowNewBooking] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  
  const [newBooking, setNewBooking] = useState({
    clientName: "",
    eventDate: "",
    eventType: "",
    guestCount: "",
    menuPackage: "",
    totalAmount: "",
    advanceAmount: "",
    addOns: [] as string[],
    specialRequests: ""
  });

  const menuPackages = [
    { id: "basic", name: "Basic Package", price: 800, description: "Standard menu with 4 items" },
    { id: "standard", name: "Standard Package", price: 1200, description: "Enhanced menu with 6 items" },
    { id: "premium", name: "Premium Package", price: 1800, description: "Luxury menu with 8 items + live counters" },
    { id: "deluxe", name: "Deluxe Package", price: 2500, description: "Complete luxury experience" }
  ];

  const addOnOptions = [
    "Live Counter", "Premium Decoration", "DJ Services", "Photography", 
    "Videography", "Special Lighting", "Flower Arrangements", "Welcome Drink"
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newBooking.clientName || !newBooking.eventDate || !newBooking.guestCount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const booking: Booking = {
      id: Date.now().toString(),
      clientName: newBooking.clientName,
      eventDate: newBooking.eventDate,
      eventType: newBooking.eventType,
      guestCount: parseInt(newBooking.guestCount),
      menuPackage: newBooking.menuPackage,
      totalAmount: parseInt(newBooking.totalAmount) || 0,
      advanceReceived: parseInt(newBooking.advanceAmount) || 0,
      status: "confirmed",
      addOns: newBooking.addOns,
      specialRequests: newBooking.specialRequests,
      createdAt: new Date().toISOString()
    };

    setBookings([...bookings, booking]);
    setShowNewBooking(false);
    
    // Reset form
    setNewBooking({
      clientName: "",
      eventDate: "",
      eventType: "",
      guestCount: "",
      menuPackage: "",
      totalAmount: "",
      advanceAmount: "",
      addOns: [],
      specialRequests: ""
    });

    toast({
      title: "Booking Created",
      description: "New booking has been successfully created and added to calendar",
    });
  };

  const generateBookingForm = (booking: Booking) => {
    toast({
      title: "Booking Form Generated",
      description: "Printable booking form is ready for download",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Booking System</h2>
          <p className="text-muted-foreground">Manage event bookings and reservations</p>
        </div>
        <Button onClick={() => setShowNewBooking(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Booking
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookings.length}</div>
            <p className="text-xs text-muted-foreground">Active bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Guests</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bookings.reduce((sum, booking) => sum + booking.guestCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Across all events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{bookings.reduce((sum, booking) => sum + booking.totalAmount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Total booking value</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
          <CardDescription>View and manage event bookings</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client Name</TableHead>
                <TableHead>Event Date</TableHead>
                <TableHead>Event Type</TableHead>
                <TableHead>Guests</TableHead>
                <TableHead>Package</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.clientName}</TableCell>
                  <TableCell>{new Date(booking.eventDate).toLocaleDateString()}</TableCell>
                  <TableCell>{booking.eventType}</TableCell>
                  <TableCell>{booking.guestCount}</TableCell>
                  <TableCell>{booking.menuPackage}</TableCell>
                  <TableCell>₹{booking.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => generateBookingForm(booking)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedBooking(booking)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Booking Details</DialogTitle>
                            <DialogDescription>
                              Complete booking information for {booking.clientName}
                            </DialogDescription>
                          </DialogHeader>
                          {selectedBooking && (
                            <div className="grid gap-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Client Name</Label>
                                  <p className="text-sm mt-1">{selectedBooking.clientName}</p>
                                </div>
                                <div>
                                  <Label>Event Date</Label>
                                  <p className="text-sm mt-1">{new Date(selectedBooking.eventDate).toLocaleDateString()}</p>
                                </div>
                                <div>
                                  <Label>Event Type</Label>
                                  <p className="text-sm mt-1">{selectedBooking.eventType}</p>
                                </div>
                                <div>
                                  <Label>Guest Count</Label>
                                  <p className="text-sm mt-1">{selectedBooking.guestCount}</p>
                                </div>
                                <div>
                                  <Label>Menu Package</Label>
                                  <p className="text-sm mt-1">{selectedBooking.menuPackage}</p>
                                </div>
                                <div>
                                  <Label>Total Amount</Label>
                                  <p className="text-sm mt-1">₹{selectedBooking.totalAmount.toLocaleString()}</p>
                                </div>
                              </div>
                              <div>
                                <Label>Add-ons</Label>
                                <p className="text-sm mt-1">{selectedBooking.addOns.join(", ") || "None"}</p>
                              </div>
                              <div>
                                <Label>Special Requests</Label>
                                <p className="text-sm mt-1">{selectedBooking.specialRequests || "None"}</p>
                              </div>
                              <Button onClick={() => generateBookingForm(selectedBooking)}>
                                <Download className="w-4 h-4 mr-2" />
                                Generate Booking Form
                              </Button>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showNewBooking} onOpenChange={setShowNewBooking}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Booking</DialogTitle>
            <DialogDescription>
              Enter details for a new event booking
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmitBooking} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clientName">Client Name *</Label>
                <Input
                  id="clientName"
                  value={newBooking.clientName}
                  onChange={(e) => setNewBooking({...newBooking, clientName: e.target.value})}
                  placeholder="Enter client name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="eventDate">Event Date *</Label>
                <Input
                  id="eventDate"
                  type="date"
                  value={newBooking.eventDate}
                  onChange={(e) => setNewBooking({...newBooking, eventDate: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="eventType">Event Type</Label>
                <Select value={newBooking.eventType} onValueChange={(value) => setNewBooking({...newBooking, eventType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Wedding">Wedding</SelectItem>
                    <SelectItem value="Anniversary">Anniversary</SelectItem>
                    <SelectItem value="Birthday">Birthday</SelectItem>
                    <SelectItem value="Corporate">Corporate Event</SelectItem>
                    <SelectItem value="Reception">Reception</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="guestCount">Guest Count *</Label>
                <Input
                  id="guestCount"
                  type="number"
                  value={newBooking.guestCount}
                  onChange={(e) => setNewBooking({...newBooking, guestCount: e.target.value})}
                  placeholder="150"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="menuPackage">Menu Package</Label>
                <Select value={newBooking.menuPackage} onValueChange={(value) => setNewBooking({...newBooking, menuPackage: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select menu package" />
                  </SelectTrigger>
                  <SelectContent>
                    {menuPackages.map((pkg) => (
                      <SelectItem key={pkg.id} value={pkg.name}>
                        {pkg.name} - ₹{pkg.price}/person
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="totalAmount">Total Amount</Label>
                <Input
                  id="totalAmount"
                  type="number"
                  value={newBooking.totalAmount}
                  onChange={(e) => setNewBooking({...newBooking, totalAmount: e.target.value})}
                  placeholder="500000"
                />
              </div>
            </div>
            
            <div>
              <Label>Add-ons</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {addOnOptions.map((addon) => (
                  <div key={addon} className="flex items-center space-x-2">
                    <Checkbox
                      id={addon}
                      checked={newBooking.addOns.includes(addon)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setNewBooking({...newBooking, addOns: [...newBooking.addOns, addon]});
                        } else {
                          setNewBooking({...newBooking, addOns: newBooking.addOns.filter(a => a !== addon)});
                        }
                      }}
                    />
                    <Label htmlFor={addon} className="text-sm">{addon}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Label htmlFor="specialRequests">Special Requests</Label>
              <Textarea
                id="specialRequests"
                value={newBooking.specialRequests}
                onChange={(e) => setNewBooking({...newBooking, specialRequests: e.target.value})}
                placeholder="Any special dietary requirements or preferences..."
                rows={3}
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                Create Booking
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowNewBooking(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}