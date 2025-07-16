import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Users, Calendar, Phone, Mail, MoreHorizontal, Plus, Zap, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useWhatsApp } from "@/hooks/useWhatsApp";

interface Lead {
  id: string;
  name: string;
  contact: string;
  email: string;
  event_date: string;
  pax: number;
  budget: string;
  occasion: string;
  status: string;
  assigned_to: string;
  notes: string;
  created_at: string;
}

interface User {
  id: string;
  code: string;
  name: string;
}

export const AdminLeadManagement = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAIQuote, setShowAIQuote] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [aiQuoteResult, setAIQuoteResult] = useState<any>(null);
  const [newLead, setNewLead] = useState({
    name: '',
    contact: '',
    email: '',
    event_date: '',
    pax: 0,
    budget: '',
    occasion: '',
    notes: ''
  });
  const { toast } = useToast();
  const { sendQuote } = useWhatsApp();

  useEffect(() => {
    fetchLeads();
    fetchUsers();
  }, []);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch leads",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, code, name')
        .eq('status', 'active');

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('leads')
        .insert([newLead]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Lead added successfully",
      });

      setNewLead({
        name: '',
        contact: '',
        email: '',
        event_date: '',
        pax: 0,
        budget: '',
        occasion: '',
        notes: ''
      });
      setShowAddForm(false);
      fetchLeads();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add lead",
        variant: "destructive",
      });
    }
  };

  const updateLeadStatus = async (leadId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status })
        .eq('id', leadId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Lead status updated",
      });

      fetchLeads();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update lead status",
        variant: "destructive",
      });
    }
  };

  const assignLead = async (leadId: string, userId: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ assigned_to: userId })
        .eq('id', leadId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Lead assigned successfully",
      });

      fetchLeads();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign lead",
        variant: "destructive",
      });
    }
  };

  const generateAIQuote = async (lead: Lead) => {
    try {
      setSelectedLead(lead);
      setShowAIQuote(true);
      
      const leadTimeInDays = lead.event_date ? 
        Math.ceil((new Date(lead.event_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 30;

      const { data, error } = await supabase.functions.invoke('ai-price-prediction', {
        body: {
          occasion: lead.occasion || 'wedding',
          pax: lead.pax || 100,
          function_date: lead.event_date || new Date().toISOString().split('T')[0],
          menu_type: 'premium',
          lead_time_days: leadTimeInDays,
          lead_source: 'website'
        }
      });

      if (error) throw error;

      setAIQuoteResult(data);
      toast({
        title: "Success",
        description: "AI quote generated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate AI quote",
        variant: "destructive",
      });
    }
  };

  const sendQuoteViaWhatsApp = async () => {
    if (!selectedLead || !aiQuoteResult) return;

    const success = await sendQuote(
      selectedLead.name, 
      selectedLead.contact, 
      {
        guestCount: selectedLead.pax,
        occasion: selectedLead.occasion,
        eventDate: selectedLead.event_date
      },
      selectedLead.id
    );

    if (success) {
      // Log the message
      await supabase.from('messages').insert({
        lead_id: selectedLead.id,
        type: 'quote',
        content: `AI Quote sent: ₹${aiQuoteResult.total_price}`,
        sent_by: (await supabase.from('users').select('id').eq('code', '000').single()).data?.id
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: any } = {
      'new': 'default',
      'hot': 'destructive',
      'warm': 'secondary',
      'cold': 'outline',
      'converted': 'default',
    };
    return <Badge variant={variants[status] || 'default'}>{status.toUpperCase()}</Badge>;
  };

  if (isLoading) {
    return <div className="p-6">Loading leads...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Lead Management</h2>
          <p className="text-muted-foreground">Manage all leads across the system</p>
        </div>
        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Lead
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Lead</DialogTitle>
              <DialogDescription>Create a new lead entry</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddLead} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newLead.name}
                    onChange={(e) => setNewLead({...newLead, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="contact">Contact</Label>
                  <Input
                    id="contact"
                    value={newLead.contact}
                    onChange={(e) => setNewLead({...newLead, contact: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newLead.email}
                    onChange={(e) => setNewLead({...newLead, email: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="event_date">Event Date</Label>
                  <Input
                    id="event_date"
                    type="date"
                    value={newLead.event_date}
                    onChange={(e) => setNewLead({...newLead, event_date: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="pax">Guest Count</Label>
                  <Input
                    id="pax"
                    type="number"
                    value={newLead.pax}
                    onChange={(e) => setNewLead({...newLead, pax: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label htmlFor="occasion">Occasion</Label>
                  <Select value={newLead.occasion} onValueChange={(value) => setNewLead({...newLead, occasion: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select occasion" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wedding">Wedding</SelectItem>
                      <SelectItem value="birthday">Birthday</SelectItem>
                      <SelectItem value="anniversary">Anniversary</SelectItem>
                      <SelectItem value="corporate">Corporate</SelectItem>
                      <SelectItem value="engagement">Engagement</SelectItem>
                      <SelectItem value="reception">Reception</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="budget">Budget Range</Label>
                <Select value={newLead.budget} onValueChange={(value) => setNewLead({...newLead, budget: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50000-100000">₹50,000 - ₹1,00,000</SelectItem>
                    <SelectItem value="100000-200000">₹1,00,000 - ₹2,00,000</SelectItem>
                    <SelectItem value="200000-500000">₹2,00,000 - ₹5,00,000</SelectItem>
                    <SelectItem value="500000+">₹5,00,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newLead.notes}
                  onChange={(e) => setNewLead({...newLead, notes: e.target.value})}
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Lead</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Leads</CardTitle>
          <CardDescription>Complete lead database with AI-powered insights</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Pax</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell>{lead.contact}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{lead.occasion}</div>
                      <div className="text-muted-foreground">{lead.event_date}</div>
                    </div>
                  </TableCell>
                  <TableCell>{lead.pax}</TableCell>
                  <TableCell>{getStatusBadge(lead.status)}</TableCell>
                  <TableCell>
                    <Select
                      value={lead.assigned_to || ''}
                      onValueChange={(value) => assignLead(lead.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Assign" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => generateAIQuote(lead)}
                      >
                        <Zap className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => updateLeadStatus(lead.id, 'hot')}>
                            Mark as Hot
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateLeadStatus(lead.id, 'warm')}>
                            Mark as Warm
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateLeadStatus(lead.id, 'cold')}>
                            Mark as Cold
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateLeadStatus(lead.id, 'converted')}>
                            Mark as Converted
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* AI Quote Dialog */}
      <Dialog open={showAIQuote} onOpenChange={setShowAIQuote}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>AI Price Quote</DialogTitle>
            <DialogDescription>
              Generated for {selectedLead?.name}
            </DialogDescription>
          </DialogHeader>
          {aiQuoteResult && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>Base Price:</div>
                <div className="font-semibold">₹{aiQuoteResult.base_price?.toLocaleString()}</div>
                <div>GST (18%):</div>
                <div className="font-semibold">₹{aiQuoteResult.gst_amount?.toLocaleString()}</div>
                <div>Total Price:</div>
                <div className="font-bold text-lg">₹{aiQuoteResult.total_price?.toLocaleString()}</div>
                <div>Deposit (30%):</div>
                <div className="font-semibold text-green-600">₹{aiQuoteResult.deposit_amount?.toLocaleString()}</div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAIQuote(false)}>
                  Close
                </Button>
                <Button onClick={sendQuoteViaWhatsApp}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Send via WhatsApp
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};