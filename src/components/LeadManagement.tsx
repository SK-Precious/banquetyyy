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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { Phone, Mail, MessageCircle, Plus, Eye, Calendar } from "lucide-react";
import { WalkInCapture } from "./WalkInCapture";
import { supabase } from "@/integrations/supabase/client";

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: string;
  eventDate: string;
  guestCount: number;
  budget: string;
  status: "new" | "contacted" | "interested" | "quoted" | "closed";
  notes: string;
  createdAt: string;
}

export function LeadManagement() {
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: "1",
      name: "Sarah & John Wedding",
      phone: "+91 9876543210",
      email: "sarah.john@email.com",
      source: "WeddingWire",
      eventDate: "2024-03-15",
      guestCount: 250,
      budget: "₹5,00,000 - ₹7,50,000",
      status: "new",
      notes: "Looking for premium package with live counter",
      createdAt: "2024-01-15"
    },
    {
      id: "2",
      name: "Sharma Family Function",
      phone: "+91 9123456789",
      email: "sharma.family@email.com",
      source: "Referral",
      eventDate: "2024-02-28",
      guestCount: 150,
      budget: "₹2,50,000 - ₹4,00,000",
      status: "contacted",
      notes: "Vegetarian menu required, afternoon slot preferred",
      createdAt: "2024-01-12"
    }
  ]);

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showWalkIn, setShowWalkIn] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-100 text-blue-800";
      case "contacted": return "bg-yellow-100 text-yellow-800";
      case "interested": return "bg-green-100 text-green-800";
      case "quoted": return "bg-purple-100 text-purple-800";
      case "closed": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const sendWhatsAppMessage = async (lead: Lead, messageType: 'welcome' | 'quote' | 'reminder' = 'welcome') => {
    try {
      const { data, error } = await supabase.functions.invoke('send-whatsapp-message', {
        body: {
          name: lead.name,
          phone: lead.phone,
          type: messageType,
          data: {
            eventDate: lead.eventDate,
            guestCount: lead.guestCount,
            budget: lead.budget
          }
        }
      });

      if (error) throw error;

      if (data?.success) {
        toast({
          title: "WhatsApp Message Sent",
          description: `${messageType} message sent to ${lead.name}`,
        });
      } else {
        throw new Error(data?.error || 'Failed to send message');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to send WhatsApp message: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const scheduleCallback = (lead: Lead) => {
    toast({
      title: "Callback Scheduled",
      description: `Follow-up reminder set for ${lead.name}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Lead Management</h2>
          <p className="text-muted-foreground">Manage and track potential clients</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowWalkIn(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Walk-in Client
          </Button>
          <Button variant="outline">
            Import from WeddingWire
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Leads</CardTitle>
          <CardDescription>View and manage all potential clients</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Event Date</TableHead>
                <TableHead>Guests</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Phone className="w-3 h-3 mr-1" />
                        {lead.phone}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Mail className="w-3 h-3 mr-1" />
                        {lead.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(lead.eventDate).toLocaleDateString()}</TableCell>
                  <TableCell>{lead.guestCount}</TableCell>
                  <TableCell>{lead.budget}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{lead.source}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(lead.status)}>
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="ghost">
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => sendWhatsAppMessage(lead, 'welcome')}>
                            Send Welcome Message
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => sendWhatsAppMessage(lead, 'quote')}>
                            Send Price Quote
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => sendWhatsAppMessage(lead, 'reminder')}>
                            Send Reminder
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => scheduleCallback(lead)}
                      >
                        <Calendar className="w-4 h-4" />
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedLead(lead)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Lead Details</DialogTitle>
                            <DialogDescription>
                              Complete information for {lead.name}
                            </DialogDescription>
                          </DialogHeader>
                          {selectedLead && (
                            <div className="grid gap-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Client Name</Label>
                                  <p className="text-sm mt-1">{selectedLead.name}</p>
                                </div>
                                <div>
                                  <Label>Event Date</Label>
                                  <p className="text-sm mt-1">{new Date(selectedLead.eventDate).toLocaleDateString()}</p>
                                </div>
                                <div>
                                  <Label>Phone</Label>
                                  <p className="text-sm mt-1">{selectedLead.phone}</p>
                                </div>
                                <div>
                                  <Label>Email</Label>
                                  <p className="text-sm mt-1">{selectedLead.email}</p>
                                </div>
                                <div>
                                  <Label>Guest Count</Label>
                                  <p className="text-sm mt-1">{selectedLead.guestCount}</p>
                                </div>
                                <div>
                                  <Label>Budget Range</Label>
                                  <p className="text-sm mt-1">{selectedLead.budget}</p>
                                </div>
                              </div>
                              <div>
                                <Label>Notes</Label>
                                <p className="text-sm mt-1">{selectedLead.notes}</p>
                              </div>
                              <div className="flex gap-2">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button>
                                      <MessageCircle className="w-4 h-4 mr-2" />
                                      Send WhatsApp
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => sendWhatsAppMessage(selectedLead, 'welcome')}>
                                      Welcome Message
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => sendWhatsAppMessage(selectedLead, 'quote')}>
                                      Price Quote
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => sendWhatsAppMessage(selectedLead, 'reminder')}>
                                      Send Reminder
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                                <Button variant="outline">
                                  Convert to Booking
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

      <WalkInCapture 
        open={showWalkIn} 
        onOpenChange={setShowWalkIn}
        onSave={(newLead) => {
          setLeads([...leads, { ...newLead, id: Date.now().toString(), createdAt: new Date().toISOString() }]);
          setShowWalkIn(false);
        }}
      />
    </div>
  );
}