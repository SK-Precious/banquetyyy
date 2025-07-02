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
import { toast } from "@/hooks/use-toast";
import { Plus, Eye, Phone, Mail, Users, DollarSign, Star, TrendingUp } from "lucide-react";

interface Vendor {
  id: string;
  name: string;
  category: "decoration" | "photography" | "music" | "beauty" | "attire" | "transport" | "other";
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  services: string[];
  rating: number;
  commissionRate: number;
  totalCommissionEarned: number;
  eventsWorked: number;
  lastEventDate: string;
  status: "active" | "inactive" | "blacklisted";
  notes: string;
}

export function VendorManagement() {
  const [vendors, setVendors] = useState<Vendor[]>([
    {
      id: "1",
      name: "Royal Decorators",
      category: "decoration",
      contact: {
        phone: "+91 9876543210",
        email: "contact@royaldecorators.com",
        address: "123 Decoration Street, City"
      },
      services: ["Stage Decoration", "Flower Arrangements", "Lighting"],
      rating: 4.5,
      commissionRate: 15,
      totalCommissionEarned: 45000,
      eventsWorked: 12,
      lastEventDate: "2024-01-10",
      status: "active",
      notes: "Excellent work quality, always on time"
    },
    {
      id: "2",
      name: "Capture Moments Photography",
      category: "photography",
      contact: {
        phone: "+91 9123456789",
        email: "info@capturemoments.com",
        address: "456 Camera Lane, City"
      },
      services: ["Wedding Photography", "Videography", "Album Design"],
      rating: 4.8,
      commissionRate: 10,
      totalCommissionEarned: 32000,
      eventsWorked: 8,
      lastEventDate: "2024-01-05",
      status: "active",
      notes: "Professional and creative team"
    },
    {
      id: "3",
      name: "Glamour Beauty Salon",
      category: "beauty",
      contact: {
        phone: "+91 9234567890",
        email: "booking@glamourbeauty.com",
        address: "789 Beauty Boulevard, City"
      },
      services: ["Bridal Makeup", "Hair Styling", "Mehendi"],
      rating: 4.2,
      commissionRate: 20,
      totalCommissionEarned: 28000,
      eventsWorked: 15,
      lastEventDate: "2023-12-28",
      status: "active",
      notes: "Popular for bridal makeup"
    }
  ]);

  const [showNewVendor, setShowNewVendor] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  
  const [newVendor, setNewVendor] = useState({
    name: "",
    category: "",
    phone: "",
    email: "",
    address: "",
    services: "",
    commissionRate: "",
    notes: ""
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      case "blacklisted": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryStats = () => {
    const stats = vendors.reduce((acc, vendor) => {
      acc[vendor.category] = (acc[vendor.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return stats;
  };

  const getTopPerformers = () => {
    return vendors
      .filter(vendor => vendor.status === "active")
      .sort((a, b) => b.totalCommissionEarned - a.totalCommissionEarned)
      .slice(0, 3);
  };

  const handleSubmitVendor = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newVendor.name || !newVendor.category || !newVendor.phone) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const vendor: Vendor = {
      id: Date.now().toString(),
      name: newVendor.name,
      category: newVendor.category as any,
      contact: {
        phone: newVendor.phone,
        email: newVendor.email,
        address: newVendor.address
      },
      services: newVendor.services.split(",").map(s => s.trim()),
      rating: 0,
      commissionRate: parseFloat(newVendor.commissionRate) || 10,
      totalCommissionEarned: 0,
      eventsWorked: 0,
      lastEventDate: "",
      status: "active",
      notes: newVendor.notes
    };

    setVendors([...vendors, vendor]);
    setShowNewVendor(false);
    
    // Reset form
    setNewVendor({
      name: "",
      category: "",
      phone: "",
      email: "",
      address: "",
      services: "",
      commissionRate: "",
      notes: ""
    });

    toast({
      title: "Vendor Added",
      description: "New vendor has been added to your directory",
    });
  };

  const updateVendorStatus = (vendorId: string, status: Vendor['status']) => {
    setVendors(vendors.map(vendor => 
      vendor.id === vendorId ? { ...vendor, status } : vendor
    ));
    
    toast({
      title: "Status Updated",
      description: "Vendor status has been updated",
    });
  };

  const categoryStats = getCategoryStats();
  const topPerformers = getTopPerformers();
  const totalCommission = vendors.reduce((sum, vendor) => sum + vendor.totalCommissionEarned, 0);
  const activeVendors = vendors.filter(vendor => vendor.status === "active").length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Vendor Management</h2>
          <p className="text-muted-foreground">Manage wedding service vendors and track commissions</p>
        </div>
        <Button onClick={() => setShowNewVendor(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Vendor
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vendors.length}</div>
            <p className="text-xs text-muted-foreground">{activeVendors} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission Earned</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalCommission.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total from all vendors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(vendors.reduce((sum, vendor) => sum + vendor.rating, 0) / vendors.length || 0).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">Across all vendors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events Handled</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {vendors.reduce((sum, vendor) => sum + vendor.eventsWorked, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Total events</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Directory</CardTitle>
              <CardDescription>All registered vendors and their information</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendors.map((vendor) => (
                    <TableRow key={vendor.id}>
                      <TableCell className="font-medium">{vendor.name}</TableCell>
                      <TableCell className="capitalize">{vendor.category}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Phone className="w-3 h-3 mr-1" />
                            {vendor.contact.phone}
                          </div>
                          {vendor.contact.email && (
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Mail className="w-3 h-3 mr-1" />
                              {vendor.contact.email}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          {vendor.rating.toFixed(1)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{vendor.commissionRate}% rate</div>
                          <div className="text-muted-foreground">₹{vendor.totalCommissionEarned.toLocaleString()}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(vendor.status)}>
                          {vendor.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setSelectedVendor(vendor)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Vendor Details</DialogTitle>
                                <DialogDescription>
                                  Complete information for {vendor.name}
                                </DialogDescription>
                              </DialogHeader>
                              {selectedVendor && (
                                <div className="grid gap-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Vendor Name</Label>
                                      <p className="text-sm mt-1">{selectedVendor.name}</p>
                                    </div>
                                    <div>
                                      <Label>Category</Label>
                                      <p className="text-sm mt-1 capitalize">{selectedVendor.category}</p>
                                    </div>
                                    <div>
                                      <Label>Phone</Label>
                                      <p className="text-sm mt-1">{selectedVendor.contact.phone}</p>
                                    </div>
                                    <div>
                                      <Label>Email</Label>
                                      <p className="text-sm mt-1">{selectedVendor.contact.email || "Not provided"}</p>
                                    </div>
                                    <div>
                                      <Label>Rating</Label>
                                      <p className="text-sm mt-1">{selectedVendor.rating.toFixed(1)}/5.0</p>
                                    </div>
                                    <div>
                                      <Label>Commission Rate</Label>
                                      <p className="text-sm mt-1">{selectedVendor.commissionRate}%</p>
                                    </div>
                                  </div>
                                  <div>
                                    <Label>Services</Label>
                                    <p className="text-sm mt-1">{selectedVendor.services.join(", ")}</p>
                                  </div>
                                  <div>
                                    <Label>Address</Label>
                                    <p className="text-sm mt-1">{selectedVendor.contact.address || "Not provided"}</p>
                                  </div>
                                  <div>
                                    <Label>Notes</Label>
                                    <p className="text-sm mt-1">{selectedVendor.notes || "No notes"}</p>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button 
                                      size="sm"
                                      onClick={() => updateVendorStatus(selectedVendor.id, "active")}
                                      disabled={selectedVendor.status === "active"}
                                    >
                                      Mark Active
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => updateVendorStatus(selectedVendor.id, "inactive")}
                                      disabled={selectedVendor.status === "inactive"}
                                    >
                                      Mark Inactive
                                    </Button>
                                  </div>
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
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
              <CardDescription>Vendors by service category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(categoryStats).map(([category, count]) => (
                  <div key={category} className="flex justify-between items-center">
                    <span className="text-sm capitalize">{category}</span>
                    <Badge variant="outline">{count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Performers</CardTitle>
              <CardDescription>Highest commission earners</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topPerformers.map((vendor, index) => (
                  <div key={vendor.id} className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{vendor.name}</p>
                      <p className="text-xs text-muted-foreground">
                        ₹{vendor.totalCommissionEarned.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showNewVendor} onOpenChange={setShowNewVendor}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Vendor</DialogTitle>
            <DialogDescription>
              Add a new vendor to your directory
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmitVendor} className="space-y-4">
            <div>
              <Label htmlFor="name">Vendor Name *</Label>
              <Input
                id="name"
                value={newVendor.name}
                onChange={(e) => setNewVendor({...newVendor, name: e.target.value})}
                placeholder="Royal Decorators"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={newVendor.category} onValueChange={(value) => setNewVendor({...newVendor, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="decoration">Decoration</SelectItem>
                  <SelectItem value="photography">Photography</SelectItem>
                  <SelectItem value="music">Music & DJ</SelectItem>
                  <SelectItem value="beauty">Beauty & Salon</SelectItem>
                  <SelectItem value="attire">Attire & Fashion</SelectItem>
                  <SelectItem value="transport">Transport</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={newVendor.phone}
                onChange={(e) => setNewVendor({...newVendor, phone: e.target.value})}
                placeholder="+91 9876543210"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={newVendor.email}
                onChange={(e) => setNewVendor({...newVendor, email: e.target.value})}
                placeholder="contact@vendor.com"
              />
            </div>
            
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={newVendor.address}
                onChange={(e) => setNewVendor({...newVendor, address: e.target.value})}
                placeholder="Business address"
              />
            </div>
            
            <div>
              <Label htmlFor="services">Services (comma-separated)</Label>
              <Input
                id="services"
                value={newVendor.services}
                onChange={(e) => setNewVendor({...newVendor, services: e.target.value})}
                placeholder="Service 1, Service 2, Service 3"
              />
            </div>
            
            <div>
              <Label htmlFor="commissionRate">Commission Rate (%)</Label>
              <Input
                id="commissionRate"
                type="number"
                value={newVendor.commissionRate}
                onChange={(e) => setNewVendor({...newVendor, commissionRate: e.target.value})}
                placeholder="15"
              />
            </div>
            
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={newVendor.notes}
                onChange={(e) => setNewVendor({...newVendor, notes: e.target.value})}
                placeholder="Additional information about the vendor..."
                rows={3}
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                Add Vendor
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowNewVendor(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}