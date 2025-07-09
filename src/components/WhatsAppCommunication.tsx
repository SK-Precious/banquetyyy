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
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { MessageCircle, Send, Phone, Clock, FileText, Camera, Bot, Settings, Activity, CheckCircle, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface WhatsAppMessage {
  id: string;
  leadName: string;
  phone: string;
  message: string;
  type: "welcome" | "pricing" | "confirmation" | "reminder" | "gallery" | "feedback" | "custom";
  status: "sent" | "delivered" | "read" | "failed";
  timestamp: string;
  language: string;
  agentUsed: string;
}

interface MessageTemplate {
  id: string;
  name: string;
  type: string;
  content: string;
  language: string;
  variables: string[];
  isActive: boolean;
}

export function WhatsAppCommunication() {
  const [messages] = useState<WhatsAppMessage[]>([
    {
      id: "1",
      leadName: "Sarah & John Wedding",
      phone: "+91 9876543210",
      message: "Welcome to Banquety! Thank you for your interest. Here's our venue brochure and sample menu...",
      type: "welcome",
      status: "read",
      timestamp: "2024-01-15T10:30:00Z",
      language: "English",
      agentUsed: "Welcome Agent"
    },
    {
      id: "2",
      leadName: "Sharma Family Function",
      phone: "+91 9123456789",
      message: "Here's your personalized price quote for your family function on Feb 28th...",
      type: "pricing",
      status: "delivered",
      timestamp: "2024-01-15T11:45:00Z",
      language: "Hindi",
      agentUsed: "Price Quote Agent"
    },
    {
      id: "3",
      leadName: "Patel Reception",
      phone: "+91 9988776655",
      message: "Congratulations! Your booking is confirmed for March 15th. Here are the next steps...",
      type: "confirmation",
      status: "sent",
      timestamp: "2024-01-15T14:20:00Z",
      language: "Gujarati",
      agentUsed: "Booking Confirmation Agent"
    }
  ]);

  const [templates] = useState<MessageTemplate[]>([
    {
      id: "welcome_en",
      name: "Welcome Message - English",
      type: "welcome",
      content: "Welcome to Banquety! Thank you for your interest in our venue. We specialize in creating memorable events. Here's our brochure and sample menu: {brochure_link}",
      language: "English",
      variables: ["brochure_link", "contact_name"],
      isActive: true
    },
    {
      id: "welcome_hi",
      name: "Welcome Message - Hindi",
      type: "welcome",
      content: "बैंक्वेटी में आपका स्वागत है! हमारे venue में आपकी रुचि के लिए धन्यवाद। यहाँ हमारा brochure है: {brochure_link}",
      language: "Hindi",
      variables: ["brochure_link", "contact_name"],
      isActive: true
    },
    {
      id: "pricing_en",
      name: "Price Quote - English",
      type: "pricing",
      content: "Thank you for choosing Banquety! Here's your personalized quote for {event_date}: Base Price: ₹{base_price}, GST: ₹{gst_amount}, Total: ₹{total_amount}",
      language: "English",
      variables: ["event_date", "base_price", "gst_amount", "total_amount"],
      isActive: true
    }
  ]);

  const [newMessage, setNewMessage] = useState({
    leadName: "",
    phone: "",
    message: "",
    type: "custom",
    language: "english"
  });

  const [isConfiguring, setIsConfiguring] = useState(false);
  const [whatsappConfig, setWhatsappConfig] = useState({
    apiKey: "",
    phoneNumber: "",
    webhookUrl: "",
    isConnected: false
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent": return <Send className="w-4 h-4 text-blue-500" />;
      case "delivered": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "read": return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "failed": return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "welcome": return "bg-blue-100 text-blue-800";
      case "pricing": return "bg-green-100 text-green-800";
      case "confirmation": return "bg-purple-100 text-purple-800";
      case "reminder": return "bg-yellow-100 text-yellow-800";
      case "gallery": return "bg-pink-100 text-pink-800";
      case "feedback": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const sendMessage = async () => {
    if (!newMessage.leadName || !newMessage.phone || !newMessage.message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('send-whatsapp-message', {
        body: {
          name: newMessage.leadName,
          phone: newMessage.phone,
          type: newMessage.type,
          data: { customMessage: newMessage.message }
        }
      });

      if (error) throw error;

      if (data?.success) {
        toast({
          title: "Message Sent",
          description: `WhatsApp message sent to ${newMessage.leadName}`,
        });

        setNewMessage({
          leadName: "",
          phone: "",
          message: "",
          type: "custom",
          language: "english"
        });
      } else {
        throw new Error(data?.error || 'Failed to send message');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to send message: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const sendBulkMessage = () => {
    toast({
      title: "Bulk Messages Sent",
      description: "Messages sent to all active leads",
    });
  };

  const configureWhatsApp = () => {
    if (!whatsappConfig.apiKey || !whatsappConfig.phoneNumber) {
      toast({
        title: "Error",
        description: "Please provide API key and phone number",
        variant: "destructive",
      });
      return;
    }

    setWhatsappConfig(prev => ({ ...prev, isConnected: true }));
    setIsConfiguring(false);
    
    toast({
      title: "WhatsApp Connected",
      description: "WhatsApp Business API has been configured successfully",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">WhatsApp Communication</h2>
          <p className="text-muted-foreground">Manage automated WhatsApp messaging with leads and clients</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Send WhatsApp Message</DialogTitle>
                <DialogDescription>
                  Send a custom message to a lead or client
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="leadName">Lead/Client Name</Label>
                  <Input
                    id="leadName"
                    value={newMessage.leadName}
                    onChange={(e) => setNewMessage(prev => ({ ...prev, leadName: e.target.value }))}
                    placeholder="Enter name"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={newMessage.phone}
                    onChange={(e) => setNewMessage(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+91 9876543210"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Message Type</Label>
                  <Select value={newMessage.type} onValueChange={(value) => setNewMessage(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="custom">Custom Message</SelectItem>
                      <SelectItem value="welcome">Welcome</SelectItem>
                      <SelectItem value="pricing">Price Quote</SelectItem>
                      <SelectItem value="confirmation">Booking Confirmation</SelectItem>
                      <SelectItem value="reminder">Reminder</SelectItem>
                      <SelectItem value="gallery">Photo Gallery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select value={newMessage.language} onValueChange={(value) => setNewMessage(prev => ({ ...prev, language: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="hindi">Hindi</SelectItem>
                      <SelectItem value="gujarati">Gujarati</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="message">Message Content</Label>
                  <Textarea
                    id="message"
                    value={newMessage.message}
                    onChange={(e) => setNewMessage(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Enter your message..."
                    rows={4}
                  />
                </div>
                <Button onClick={sendMessage} className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" onClick={sendBulkMessage}>
            <MessageCircle className="w-4 h-4 mr-2" />
            Bulk Message
          </Button>
          
          <Dialog open={isConfiguring} onOpenChange={setIsConfiguring}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Configure API
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>WhatsApp Business API Configuration</DialogTitle>
                <DialogDescription>
                  Configure your WhatsApp Business API settings
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    This requires a WhatsApp Business API provider like Twilio or Gupshup. For production use, connect to Supabase to securely store API keys.
                  </AlertDescription>
                </Alert>
                <div>
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    value={whatsappConfig.apiKey}
                    onChange={(e) => setWhatsappConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                    placeholder="Enter your WhatsApp API key"
                  />
                </div>
                <div>
                  <Label htmlFor="phoneNumber">Business Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    value={whatsappConfig.phoneNumber}
                    onChange={(e) => setWhatsappConfig(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    placeholder="+91 9876543210"
                  />
                </div>
                <div>
                  <Label htmlFor="webhookUrl">Webhook URL</Label>
                  <Input
                    id="webhookUrl"
                    value={whatsappConfig.webhookUrl}
                    onChange={(e) => setWhatsappConfig(prev => ({ ...prev, webhookUrl: e.target.value }))}
                    placeholder="https://yourapp.com/webhook"
                  />
                </div>
                <Button onClick={configureWhatsApp} className="w-full">
                  Connect WhatsApp API
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            WhatsApp Business API Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${whatsappConfig.isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="font-medium">
                {whatsappConfig.isConnected ? 'Connected' : 'Not Connected'}
              </span>
              {whatsappConfig.isConnected && (
                <Badge variant="outline">{whatsappConfig.phoneNumber}</Badge>
              )}
            </div>
            {!whatsappConfig.isConnected && (
              <Button variant="outline" onClick={() => setIsConfiguring(true)}>
                Setup Connection
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages Today</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">+12% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">Messages delivered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Read Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">Messages read</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Templates</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{templates.filter(t => t.isActive).length}</div>
            <p className="text-xs text-muted-foreground">Ready to use</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Messages */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Messages</CardTitle>
          <CardDescription>Latest WhatsApp communications with leads and clients</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead/Client</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Message Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Language</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map((msg) => (
                <TableRow key={msg.id}>
                  <TableCell className="font-medium">{msg.leadName}</TableCell>
                  <TableCell>{msg.phone}</TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(msg.type)}>
                      {msg.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(msg.status)}
                      <span className="capitalize">{msg.status}</span>
                    </div>
                  </TableCell>
                  <TableCell>{msg.language}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{msg.agentUsed}</Badge>
                  </TableCell>
                  <TableCell>{new Date(msg.timestamp).toLocaleString()}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Message Details</DialogTitle>
                          <DialogDescription>
                            Full message content and details
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-3">
                          <div>
                            <Label>Message Content</Label>
                            <div className="mt-1 p-3 bg-muted rounded-lg text-sm">
                              {msg.message}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <Label>Status</Label>
                              <p className="mt-1 capitalize">{msg.status}</p>
                            </div>
                            <div>
                              <Label>Agent Used</Label>
                              <p className="mt-1">{msg.agentUsed}</p>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Message Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Message Templates</CardTitle>
          <CardDescription>Manage automated message templates for different scenarios</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Template Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Language</TableHead>
                <TableHead>Variables</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell className="font-medium">{template.name}</TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(template.type)}>
                      {template.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{template.language}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {template.variables.map((variable, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {variable}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Switch checked={template.isActive} />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm">
                        Test
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}