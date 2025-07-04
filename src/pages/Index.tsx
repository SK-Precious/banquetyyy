import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, DollarSign, Package, UserCheck, Phone, Building } from "lucide-react";
import { LeadManagement } from "@/components/LeadManagement";
import { BookingSystem } from "@/components/BookingSystem";
import { PaymentTracking } from "@/components/PaymentTracking";
import { InventoryManagement } from "@/components/InventoryManagement";
import { VendorManagement } from "@/components/VendorManagement";
import { CalendarIntegration } from "@/components/CalendarIntegration";
import { WalkInCapture } from "@/components/WalkInCapture";

interface IndexProps {
  onBackToEmployeePortal?: () => void;
}

const Index = ({ onBackToEmployeePortal }: IndexProps) => {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Mock stats for dashboard
  const stats = {
    totalLeads: 45,
    activeBookings: 12,
    monthlyRevenue: 85000,
    lowStockItems: 3,
    pendingPayments: 8,
    upcomingEvents: 5
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-3 lg:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 lg:space-x-3">
              <Building className="h-6 w-6 lg:h-8 lg:w-8 text-primary" />
              <div>
                <h1 className="text-lg lg:text-2xl font-bold text-foreground">BANQUETY</h1>
                <p className="text-xs lg:text-sm text-muted-foreground hidden sm:block">Banquet Hall Management System</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">Manager</Badge>
              {onBackToEmployeePortal && (
                <Button variant="outline" size="sm" onClick={onBackToEmployeePortal} className="hidden sm:flex">
                  Back to Employee Portal
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 lg:py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 mb-4 lg:mb-6 overflow-x-auto">
            <TabsTrigger value="dashboard" className="text-xs lg:text-sm">Dashboard</TabsTrigger>
            <TabsTrigger value="leads" className="text-xs lg:text-sm hidden lg:block">Leads</TabsTrigger>
            <TabsTrigger value="bookings" className="text-xs lg:text-sm">Bookings</TabsTrigger>
            <TabsTrigger value="payments" className="text-xs lg:text-sm">Payments</TabsTrigger>
            <TabsTrigger value="inventory" className="text-xs lg:text-sm hidden lg:block">Inventory</TabsTrigger>
            <TabsTrigger value="vendors" className="text-xs lg:text-sm hidden lg:block">Vendors</TabsTrigger>
            <TabsTrigger value="calendar" className="text-xs lg:text-sm">Calendar</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="space-y-6">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalLeads}</div>
                    <p className="text-xs text-muted-foreground">+12 from last month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.activeBookings}</div>
                    <p className="text-xs text-muted-foreground">Next 3 months</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">₹{stats.monthlyRevenue.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">+18% from last month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-destructive">{stats.lowStockItems}</div>
                    <p className="text-xs text-muted-foreground">Require immediate attention</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.pendingPayments}</div>
                    <p className="text-xs text-muted-foreground">Total: ₹2,45,000</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.upcomingEvents}</div>
                    <p className="text-xs text-muted-foreground">Next 7 days</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common daily tasks</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setActiveTab("leads")}
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      Add Walk-in Client
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setActiveTab("bookings")}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Create New Booking
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setActiveTab("inventory")}
                    >
                      <Package className="mr-2 h-4 w-4" />
                      Update Inventory
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activities</CardTitle>
                    <CardDescription>Latest updates across modules</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <p className="text-sm">New lead from WeddingWire - Sarah & John</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-accent rounded-full"></div>
                        <p className="text-sm">Payment received for Sharma wedding</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-secondary rounded-full"></div>
                        <p className="text-sm">Low stock alert: Basmati rice</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="leads">
            <LeadManagement />
          </TabsContent>

          <TabsContent value="bookings">
            <BookingSystem />
          </TabsContent>

          <TabsContent value="payments">
            <PaymentTracking />
          </TabsContent>

          <TabsContent value="inventory">
            <InventoryManagement />
          </TabsContent>

          <TabsContent value="vendors">
            <VendorManagement />
          </TabsContent>

          <TabsContent value="calendar">
            <CalendarIntegration />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;