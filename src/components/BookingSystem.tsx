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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Plus, Eye, Download, Calendar, Users, DollarSign, CreditCard } from "lucide-react";

interface Booking {
  id: string;
  clientName: string;
  address: string;
  contactDetails: string;
  eventDate: string;
  slot: string;
  menuPreference: string;
  liquorService: boolean;
  flowerDecoration: string;
  customFlowerDetails?: string;
  djService: boolean;
  bookingDate: string;
  grossAmount: number;
  gst: number;
  extras: number;
  netBooking: number;
  advance: number;
  partPayments: PartPayment[];
  status: "confirmed" | "pending" | "completed" | "cancelled";
  createdAt: string;
}

interface PartPayment {
  id: string;
  bookingId: string;
  amount: number;
  date: string;
  description: string;
}

export function BookingSystem() {
  const [activeTab, setActiveTab] = useState("bookings");
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: "1",
      clientName: "Sarah & John Wedding",
      address: "123 Wedding Street, Mumbai",
      contactDetails: "+91 9876543210",
      eventDate: "2024-03-15",
      slot: "dinner",
      menuPreference: "veg platinum",
      liquorService: true,
      flowerDecoration: "wedding flower package",
      djService: true,
      bookingDate: "2024-01-15",
      grossAmount: 600000,
      gst: 108000,
      extras: 50000,
      netBooking: 758000,
      advance: 200000,
      partPayments: [
        {
          id: "pp1",
          bookingId: "1",
          amount: 150000,
          date: "2024-02-15",
          description: "First EMI payment"
        }
      ],
      status: "confirmed",
      createdAt: "2024-01-15"
    }
  ]);

  const [allPartPayments, setAllPartPayments] = useState<PartPayment[]>([
    {
      id: "pp1",
      bookingId: "1",
      amount: 150000,
      date: "2024-02-15",
      description: "First EMI payment"
    }
  ]);

  const [showNewBooking, setShowNewBooking] = useState(false);
  const [showNewPartPayment, setShowNewPartPayment] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  
  const [newBooking, setNewBooking] = useState({
    clientName: "",
    address: "",
    contactDetails: "",
    eventDate: "",
    slot: "",
    menuPreference: "",
    liquorService: false,
    flowerDecoration: "",
    customFlowerDetails: "",
    djService: false,
    bookingDate: new Date().toISOString().split('T')[0],
    grossAmount: "",
    gst: "",
    extras: "",
    netBooking: "",
    advance: ""
  });

  const [newPartPayment, setNewPartPayment] = useState({
    bookingId: "",
    amount: "",
    date: "",
    description: ""
  });

  const menuOptions = [
    "Veg Gold",
    "Veg Platinum", 
    "Non-Veg Gold",
    "Non-Veg Platinum"
  ];

  const slotOptions = [
    "Breakfast",
    "Lunch", 
    "Dinner"
  ];

  const flowerDecorationOptions = [
    "Wedding Flower Package",
    "Sagan (R/T+C/T, Stage)",
    "Custom"
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
    
    if (!newBooking.clientName || !newBooking.eventDate || !newBooking.contactDetails) {
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
      address: newBooking.address,
      contactDetails: newBooking.contactDetails,
      eventDate: newBooking.eventDate,
      slot: newBooking.slot,
      menuPreference: newBooking.menuPreference,
      liquorService: newBooking.liquorService,
      flowerDecoration: newBooking.flowerDecoration,
      customFlowerDetails: newBooking.customFlowerDetails,
      djService: newBooking.djService,
      bookingDate: newBooking.bookingDate,
      grossAmount: parseInt(newBooking.grossAmount) || 0,
      gst: parseInt(newBooking.gst) || 0,
      extras: parseInt(newBooking.extras) || 0,
      netBooking: parseInt(newBooking.netBooking) || 0,
      advance: parseInt(newBooking.advance) || 0,
      partPayments: [],
      status: "confirmed",
      createdAt: new Date().toISOString()
    };

    setBookings([...bookings, booking]);
    setShowNewBooking(false);
    
    // Reset form
    setNewBooking({
      clientName: "",
      address: "",
      contactDetails: "",
      eventDate: "",
      slot: "",
      menuPreference: "",
      liquorService: false,
      flowerDecoration: "",
      customFlowerDetails: "",
      djService: false,
      bookingDate: new Date().toISOString().split('T')[0],
      grossAmount: "",
      gst: "",
      extras: "",
      netBooking: "",
      advance: ""
    });

    toast({
      title: "Booking Created",
      description: "New booking has been successfully created",
    });
  };

  const handleSubmitPartPayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPartPayment.bookingId || !newPartPayment.amount || !newPartPayment.date) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const partPayment: PartPayment = {
      id: Date.now().toString(),
      bookingId: newPartPayment.bookingId,
      amount: parseInt(newPartPayment.amount),
      date: newPartPayment.date,
      description: newPartPayment.description
    };

    setAllPartPayments([...allPartPayments, partPayment]);
    
    // Update the booking with this part payment
    setBookings(bookings.map(booking => 
      booking.id === newPartPayment.bookingId 
        ? { ...booking, partPayments: [...booking.partPayments, partPayment] }
        : booking
    ));

    setShowNewPartPayment(false);
    
    // Reset form
    setNewPartPayment({
      bookingId: "",
      amount: "",
      date: "",
      description: ""
    });

    toast({
      title: "Part Payment Added",
      description: "Part payment has been successfully added to the booking",
    });
  };

  const generateBookingForm = (booking: Booking) => {
    toast({
      title: "Booking Form Generated",
      description: "Printable booking form is ready for download",
    });
  };

  const calculateTotalPaid = (booking: Booking) => {
    const partPaymentTotal = booking.partPayments.reduce((sum, payment) => sum + payment.amount, 0);
    return booking.advance + partPaymentTotal;
  };

  const calculateBalance = (booking: Booking) => {
    return booking.netBooking - calculateTotalPaid(booking);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Booking System</h2>
          <p className="text-muted-foreground">Manage event bookings and payments</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="part-payments">Part Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">All Bookings</h3>
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
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₹{bookings.reduce((sum, booking) => sum + booking.netBooking, 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Total booking value</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Balance</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₹{bookings.reduce((sum, booking) => sum + calculateBalance(booking), 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Outstanding payments</p>
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
                    <TableHead>Slot</TableHead>
                    <TableHead>Menu</TableHead>
                    <TableHead>Net Amount</TableHead>
                    <TableHead>Paid</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.clientName}</TableCell>
                      <TableCell>{new Date(booking.eventDate).toLocaleDateString()}</TableCell>
                      <TableCell className="capitalize">{booking.slot}</TableCell>
                      <TableCell>{booking.menuPreference}</TableCell>
                      <TableCell>₹{booking.netBooking.toLocaleString()}</TableCell>
                      <TableCell>₹{calculateTotalPaid(booking).toLocaleString()}</TableCell>
                      <TableCell>₹{calculateBalance(booking).toLocaleString()}</TableCell>
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
                            <DialogContent className="max-w-3xl">
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
                                      <Label>Contact Details</Label>
                                      <p className="text-sm mt-1">{selectedBooking.contactDetails}</p>
                                    </div>
                                    <div>
                                      <Label>Address</Label>
                                      <p className="text-sm mt-1">{selectedBooking.address}</p>
                                    </div>
                                    <div>
                                      <Label>Event Date</Label>
                                      <p className="text-sm mt-1">{new Date(selectedBooking.eventDate).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                      <Label>Slot</Label>
                                      <p className="text-sm mt-1 capitalize">{selectedBooking.slot}</p>
                                    </div>
                                    <div>
                                      <Label>Menu Preference</Label>
                                      <p className="text-sm mt-1">{selectedBooking.menuPreference}</p>
                                    </div>
                                    <div>
                                      <Label>Liquor Service</Label>
                                      <p className="text-sm mt-1">{selectedBooking.liquorService ? "Yes" : "No"}</p>
                                    </div>
                                    <div>
                                      <Label>DJ Service</Label>
                                      <p className="text-sm mt-1">{selectedBooking.djService ? "Yes" : "No"}</p>
                                    </div>
                                    <div>
                                      <Label>Flower Decoration</Label>
                                      <p className="text-sm mt-1">{selectedBooking.flowerDecoration}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="border-t pt-4">
                                    <h4 className="font-semibold mb-2">Payment Information (Admin Only)</h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                      <div>
                                        <Label>Gross Amount</Label>
                                        <p className="mt-1">₹{selectedBooking.grossAmount.toLocaleString()}</p>
                                      </div>
                                      <div>
                                        <Label>GST</Label>
                                        <p className="mt-1">₹{selectedBooking.gst.toLocaleString()}</p>
                                      </div>
                                      <div>
                                        <Label>Extras</Label>
                                        <p className="mt-1">₹{selectedBooking.extras.toLocaleString()}</p>
                                      </div>
                                      <div>
                                        <Label>Net Booking</Label>
                                        <p className="mt-1 font-semibold">₹{selectedBooking.netBooking.toLocaleString()}</p>
                                      </div>
                                      <div>
                                        <Label>Advance Paid</Label>
                                        <p className="mt-1">₹{selectedBooking.advance.toLocaleString()}</p>
                                      </div>
                                      <div>
                                        <Label>Total Paid</Label>
                                        <p className="mt-1">₹{calculateTotalPaid(selectedBooking).toLocaleString()}</p>
                                      </div>
                                    </div>
                                  </div>

                                  {selectedBooking.partPayments.length > 0 && (
                                    <div className="border-t pt-4">
                                      <h4 className="font-semibold mb-2">Part Payments</h4>
                                      <div className="space-y-2">
                                        {selectedBooking.partPayments.map((payment) => (
                                          <div key={payment.id} className="flex justify-between text-sm">
                                            <span>{payment.description} - {new Date(payment.date).toLocaleDateString()}</span>
                                            <span>₹{payment.amount.toLocaleString()}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
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
        </TabsContent>

        <TabsContent value="part-payments" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Part Payments</h3>
            <Button onClick={() => setShowNewPartPayment(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Part Payment
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Part Payments</CardTitle>
              <CardDescription>EMI-style payments between booking and event dates</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Client Name</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allPartPayments.map((payment) => {
                    const booking = bookings.find(b => b.id === payment.bookingId);
                    return (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.bookingId}</TableCell>
                        <TableCell>{booking?.clientName || "Unknown"}</TableCell>
                        <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                        <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                        <TableCell>{payment.description}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Booking Dialog */}
      <Dialog open={showNewBooking} onOpenChange={setShowNewBooking}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
                <Label htmlFor="contactDetails">Contact Details *</Label>
                <Input
                  id="contactDetails"
                  value={newBooking.contactDetails}
                  onChange={(e) => setNewBooking({...newBooking, contactDetails: e.target.value})}
                  placeholder="+91 9876543210"
                  required
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={newBooking.address}
                  onChange={(e) => setNewBooking({...newBooking, address: e.target.value})}
                  placeholder="Enter client address"
                  rows={2}
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
                <Label htmlFor="slot">Slot of Event</Label>
                <Select value={newBooking.slot} onValueChange={(value) => setNewBooking({...newBooking, slot: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {slotOptions.map((slot) => (
                      <SelectItem key={slot.toLowerCase()} value={slot.toLowerCase()}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="menuPreference">Menu Preference</Label>
                <Select value={newBooking.menuPreference} onValueChange={(value) => setNewBooking({...newBooking, menuPreference: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select menu preference" />
                  </SelectTrigger>
                  <SelectContent>
                    {menuOptions.map((menu) => (
                      <SelectItem key={menu.toLowerCase().replace(/\s+/g, ' ')} value={menu.toLowerCase()}>
                        {menu}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="flowerDecoration">Flower Decoration</Label>
                <Select value={newBooking.flowerDecoration} onValueChange={(value) => setNewBooking({...newBooking, flowerDecoration: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select flower decoration" />
                  </SelectTrigger>
                  <SelectContent>
                    {flowerDecorationOptions.map((option) => (
                      <SelectItem key={option.toLowerCase().replace(/\s+/g, ' ')} value={option.toLowerCase()}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {newBooking.flowerDecoration === "custom" && (
                <div className="col-span-2">
                  <Label htmlFor="customFlowerDetails">Custom Flower Details</Label>
                  <Textarea
                    id="customFlowerDetails"
                    value={newBooking.customFlowerDetails}
                    onChange={(e) => setNewBooking({...newBooking, customFlowerDetails: e.target.value})}
                    placeholder="Describe custom flower decoration requirements"
                    rows={2}
                  />
                </div>
              )}

              <div>
                <Label>Liquor Service</Label>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="liquorYes"
                      checked={newBooking.liquorService}
                      onCheckedChange={(checked) => setNewBooking({...newBooking, liquorService: !!checked})}
                    />
                    <Label htmlFor="liquorYes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="liquorNo"
                      checked={!newBooking.liquorService}
                      onCheckedChange={(checked) => setNewBooking({...newBooking, liquorService: !checked})}
                    />
                    <Label htmlFor="liquorNo">No</Label>
                  </div>
                </div>
              </div>

              <div>
                <Label>DJ Service</Label>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="djYes"
                      checked={newBooking.djService}
                      onCheckedChange={(checked) => setNewBooking({...newBooking, djService: !!checked})}
                    />
                    <Label htmlFor="djYes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="djNo"
                      checked={!newBooking.djService}
                      onCheckedChange={(checked) => setNewBooking({...newBooking, djService: !checked})}
                    />
                    <Label htmlFor="djNo">No</Label>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="bookingDate">Date of Booking</Label>
                <Input
                  id="bookingDate"
                  type="date"
                  value={newBooking.bookingDate}
                  onChange={(e) => setNewBooking({...newBooking, bookingDate: e.target.value})}
                />
              </div>
            </div>

            {/* Admin-only Booking Amount Section */}
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-4 text-destructive">Booking Amount (Admin Access Only)</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="grossAmount">Gross Amount</Label>
                  <Input
                    id="grossAmount"
                    type="number"
                    value={newBooking.grossAmount}
                    onChange={(e) => setNewBooking({...newBooking, grossAmount: e.target.value})}
                    placeholder="500000"
                  />
                </div>

                <div>
                  <Label htmlFor="gst">GST</Label>
                  <Input
                    id="gst"
                    type="number"
                    value={newBooking.gst}
                    onChange={(e) => setNewBooking({...newBooking, gst: e.target.value})}
                    placeholder="90000"
                  />
                </div>

                <div>
                  <Label htmlFor="extras">Extras</Label>
                  <Input
                    id="extras"
                    type="number"
                    value={newBooking.extras}
                    onChange={(e) => setNewBooking({...newBooking, extras: e.target.value})}
                    placeholder="50000"
                  />
                </div>

                <div>
                  <Label htmlFor="netBooking">Net Booking</Label>
                  <Input
                    id="netBooking"
                    type="number"
                    value={newBooking.netBooking}
                    onChange={(e) => setNewBooking({...newBooking, netBooking: e.target.value})}
                    placeholder="640000"
                  />
                </div>

                <div>
                  <Label htmlFor="advance">Advance</Label>
                  <Input
                    id="advance"
                    type="number"
                    value={newBooking.advance}
                    onChange={(e) => setNewBooking({...newBooking, advance: e.target.value})}
                    placeholder="200000"
                  />
                </div>
              </div>
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

      {/* New Part Payment Dialog */}
      <Dialog open={showNewPartPayment} onOpenChange={setShowNewPartPayment}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Part Payment</DialogTitle>
            <DialogDescription>
              Add an EMI-style payment for an existing booking
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmitPartPayment} className="space-y-4">
            <div>
              <Label htmlFor="partPaymentBookingId">Booking *</Label>
              <Select value={newPartPayment.bookingId} onValueChange={(value) => setNewPartPayment({...newPartPayment, bookingId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select booking" />
                </SelectTrigger>
                <SelectContent>
                  {bookings.map((booking) => (
                    <SelectItem key={booking.id} value={booking.id}>
                      {booking.id} - {booking.clientName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="partPaymentAmount">Amount *</Label>
              <Input
                id="partPaymentAmount"
                type="number"
                value={newPartPayment.amount}
                onChange={(e) => setNewPartPayment({...newPartPayment, amount: e.target.value})}
                placeholder="50000"
                required
              />
            </div>

            <div>
              <Label htmlFor="partPaymentDate">Payment Date *</Label>
              <Input
                id="partPaymentDate"
                type="date"
                value={newPartPayment.date}
                onChange={(e) => setNewPartPayment({...newPartPayment, date: e.target.value})}
                required
              />
            </div>

            <div>
              <Label htmlFor="partPaymentDescription">Description</Label>
              <Input
                id="partPaymentDescription"
                value={newPartPayment.description}
                onChange={(e) => setNewPartPayment({...newPartPayment, description: e.target.value})}
                placeholder="EMI Payment 1"
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                Add Payment
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowNewPartPayment(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}