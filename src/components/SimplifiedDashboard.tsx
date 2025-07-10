import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, Building, LogOut } from "lucide-react";
import { LeadManagement } from "@/components/LeadManagement";

interface User {
  code: string;
  name: string;
  isAdmin: boolean;
}

interface SimplifiedDashboardProps {
  user: User;
  onLogout: () => void;
}

export const SimplifiedDashboard = ({ user, onLogout }: SimplifiedDashboardProps) => {
  const [activeView, setActiveView] = useState<'dashboard' | 'leads'>('dashboard');

  const stats = {
    myLeads: 8,
    hotLeads: 3,
    todayFollowups: 2,
  };

  if (activeView === 'leads') {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Building className="h-6 w-6 text-primary" />
                <div>
                  <h1 className="text-xl font-bold text-foreground">BANQUETY</h1>
                  <p className="text-sm text-muted-foreground">Employee Portal</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{user.name}</Badge>
                <Button variant="outline" size="sm" onClick={() => setActiveView('dashboard')}>
                  Dashboard
                </Button>
                <Button variant="outline" size="sm" onClick={onLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-6">
          <LeadManagement />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Building className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground">BANQUETY</h1>
                <p className="text-sm text-muted-foreground">Employee Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{user.name}</Badge>
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">My Leads</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.myLeads}</div>
                <p className="text-xs text-muted-foreground">Assigned to you</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hot Leads</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-500">{stats.hotLeads}</div>
                <p className="text-xs text-muted-foreground">Need immediate attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Follow-ups</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.todayFollowups}</div>
                <p className="text-xs text-muted-foreground">Scheduled for today</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your leads and follow-ups</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setActiveView('leads')}
              >
                <Users className="mr-2 h-4 w-4" />
                Manage My Leads
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};