import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Building, LogOut, Users, Calendar, Package, Receipt, Settings } from "lucide-react";
import { LeadManagement } from "@/components/LeadManagement";
import { BookingSystem } from "@/components/BookingSystem";
import { PaymentTracking } from "@/components/PaymentTracking";
import { InventoryManagement } from "@/components/InventoryManagement";
import { CalendarIntegration } from "@/components/CalendarIntegration";
import { InventoryReceipts } from "@/components/InventoryReceipts";
import { PasswordChangeDialog } from "@/components/PasswordChangeDialog";
import { AIAgentsManagement } from "@/components/AIAgentsManagement";
import { DecisionIntelligence } from "@/components/DecisionIntelligence";
import { WhatsAppCommunication } from "@/components/WhatsAppCommunication";

interface EmployeeDashboardProps {
  employeeCode: string;
  onLogout: () => void;
}

export function EmployeeDashboard({ employeeCode, onLogout }: EmployeeDashboardProps) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  const getEmployeeType = (code: string) => {
    if (code === "000") return "Administrator";
    const codeNum = parseInt(code);
    if (codeNum >= 1 && codeNum <= 3) return "Booking Office";
    if (codeNum >= 4 && codeNum <= 5) return "Inventory Staff";
    return "Vendor Employee";
  };

  const getEmployeePermissions = (code: string) => {
    // Admin has full access
    if (code === "000") {
      return {
        canAccessBookings: true,
        canAccessLeads: true,
        canAccessPayments: true, // Only admin can access payments
        canAccessInventory: true,
        canAccessReceipts: true,
        canAccessFinancials: true,
        canAccessAI: true, // AI features only for admin
        canAccessWhatsApp: true,
        canAccessIntelligence: true
      };
    }
    
    const codeNum = parseInt(code);
    if (codeNum >= 1 && codeNum <= 3) {
      return {
        canAccessBookings: true,
        canAccessLeads: true,
        canAccessPayments: false, // Removed for employees
        canAccessInventory: false,
        canAccessReceipts: false,
        canAccessFinancials: false,
        canAccessAI: false,
        canAccessWhatsApp: false,
        canAccessIntelligence: false
      };
    }
    if (codeNum >= 4 && codeNum <= 5) {
      return {
        canAccessBookings: false,
        canAccessLeads: false,
        canAccessPayments: false,
        canAccessInventory: true,
        canAccessReceipts: true,
        canAccessFinancials: false,
        canAccessAI: false,
        canAccessWhatsApp: false,
        canAccessIntelligence: false
      };
    }
    return {
      canAccessBookings: false,
      canAccessLeads: false,
      canAccessPayments: false,
      canAccessInventory: false,
      canAccessReceipts: false,
      canAccessFinancials: false,
      canAccessAI: false,
      canAccessWhatsApp: false,
      canAccessIntelligence: false
    };
  };

  const permissions = getEmployeePermissions(employeeCode);
  const employeeType = getEmployeeType(employeeCode);

  const getAvailableTabs = () => {
    const tabs = [{ value: "dashboard", label: "Dashboard" }];
    
    if (permissions.canAccessLeads) {
      tabs.push({ value: "leads", label: "Leads" });
    }
    if (permissions.canAccessBookings) {
      tabs.push({ value: "bookings", label: "Bookings" });
    }
    if (permissions.canAccessPayments) {
      tabs.push({ value: "payments", label: "Payments" });
    }
    if (permissions.canAccessInventory) {
      tabs.push({ value: "inventory", label: "Inventory" });
    }
    if (permissions.canAccessReceipts) {
      tabs.push({ value: "receipts", label: "Receipts" });
    }
    if (permissions.canAccessAI) {
      tabs.push({ value: "ai-agents", label: "AI Agents" });
    }
    if (permissions.canAccessWhatsApp) {
      tabs.push({ value: "whatsapp", label: "WhatsApp" });
    }
    if (permissions.canAccessIntelligence) {
      tabs.push({ value: "intelligence", label: "Intelligence" });
    }
    
    // Calendar is available to all
    tabs.push({ value: "calendar", label: "Calendar" });
    
    return tabs;
  };

  const availableTabs = getAvailableTabs();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-3 lg:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 lg:space-x-3">
              <Building className="h-6 w-6 lg:h-8 lg:w-8 text-primary" />
              <div>
                <h1 className="text-lg lg:text-2xl font-bold text-foreground">BANQUETY</h1>
                <p className="text-xs lg:text-sm text-muted-foreground hidden sm:block">Employee Portal</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 lg:space-x-4">
              <div className="text-right hidden sm:block">
                <Badge variant="outline" className="text-xs">
                  Employee {employeeCode}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">{employeeType}</p>
              </div>
              <div className="sm:hidden">
                <Badge variant="outline" className="text-xs">
                  {employeeCode}
                </Badge>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowPasswordDialog(true)}
                className="mr-2"
              >
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-0 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 lg:py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`grid w-full mb-4 lg:mb-6 overflow-x-auto`} style={{gridTemplateColumns: `repeat(${availableTabs.length}, minmax(0, 1fr))`}}>
            {availableTabs.map(tab => (
              <TabsTrigger key={tab.value} value={tab.value} className="text-xs lg:text-sm whitespace-nowrap">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="dashboard">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome, Employee {employeeCode}</CardTitle>
                  <CardDescription>
                    Role: {employeeType} | Access Level: {employeeCode}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Your Permissions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {permissions.canAccessLeads && (
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-green-600" />
                            <span className="text-sm">Lead Management</span>
                          </div>
                        )}
                        {permissions.canAccessBookings && (
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-green-600" />
                            <span className="text-sm">Booking Management</span>
                          </div>
                        )}
                        {permissions.canAccessPayments && (
                          <div className="flex items-center space-x-2">
                            <Receipt className="h-4 w-4 text-green-600" />
                            <span className="text-sm">Payment Tracking</span>
                          </div>
                        )}
                        {permissions.canAccessInventory && (
                          <div className="flex items-center space-x-2">
                            <Package className="h-4 w-4 text-green-600" />
                            <span className="text-sm">Inventory Management</span>
                          </div>
                        )}
                        {permissions.canAccessReceipts && (
                          <div className="flex items-center space-x-2">
                            <Receipt className="h-4 w-4 text-green-600" />
                            <span className="text-sm">Receipt Management</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Calendar View (Limited)</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Quick Actions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {permissions.canAccessLeads && (
                          <Button 
                            variant="outline" 
                            className="w-full justify-start"
                            onClick={() => setActiveTab("leads")}
                          >
                            <Users className="mr-2 h-4 w-4" />
                            View Leads
                          </Button>
                        )}
                        {permissions.canAccessBookings && (
                          <Button 
                            variant="outline" 
                            className="w-full justify-start"
                            onClick={() => setActiveTab("bookings")}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            Manage Bookings
                          </Button>
                        )}
                        {permissions.canAccessInventory && (
                          <Button 
                            variant="outline" 
                            className="w-full justify-start"
                            onClick={() => setActiveTab("inventory")}
                          >
                            <Package className="mr-2 h-4 w-4" />
                            Update Inventory
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          className="w-full justify-start"
                          onClick={() => setActiveTab("calendar")}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          View Calendar
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {permissions.canAccessLeads && (
            <TabsContent value="leads">
              <LeadManagement />
            </TabsContent>
          )}

          {permissions.canAccessBookings && (
            <TabsContent value="bookings">
              <BookingSystem employeeCode={employeeCode} />
            </TabsContent>
          )}

          {permissions.canAccessPayments && (
            <TabsContent value="payments">
              <PaymentTracking />
            </TabsContent>
          )}

          {permissions.canAccessInventory && (
            <TabsContent value="inventory">
              <InventoryManagement />
            </TabsContent>
          )}

          {permissions.canAccessReceipts && (
            <TabsContent value="receipts">
              <InventoryReceipts />
            </TabsContent>
          )}

          {permissions.canAccessAI && (
            <TabsContent value="ai-agents">
              <AIAgentsManagement />
            </TabsContent>
          )}

          {permissions.canAccessWhatsApp && (
            <TabsContent value="whatsapp">
              <WhatsAppCommunication />
            </TabsContent>
          )}

          {permissions.canAccessIntelligence && (
            <TabsContent value="intelligence">
              <DecisionIntelligence />
            </TabsContent>
          )}

          <TabsContent value="calendar">
            <CalendarIntegration isRestrictedView={true} />
          </TabsContent>
        </Tabs>
      </div>

      <PasswordChangeDialog
        open={showPasswordDialog}
        onOpenChange={setShowPasswordDialog}
        employeeCode={employeeCode}
      />
    </div>
  );
}