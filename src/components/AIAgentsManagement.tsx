import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { MessageCircle, Bot, Send, Settings, Activity, Users, Calendar, Star, FileText, Camera, Clock, MessageSquare, Languages } from "lucide-react";

interface AIAgent {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  triggers: string[];
  lastUsed: string;
  messagesCount: number;
  successRate: number;
}

export function AIAgentsManagement() {
  const [agents, setAgents] = useState<AIAgent[]>([
    {
      id: "welcome",
      name: "Welcome + Property Info Agent",
      description: "Sends property brochure and gallery on new lead creation",
      isActive: true,
      triggers: ["new_lead"],
      lastUsed: "2024-01-15",
      messagesCount: 45,
      successRate: 92
    },
    {
      id: "price_quote",
      name: "AI Price Quote Sender",
      description: "Sends structured pricing breakdown via WhatsApp",
      isActive: true,
      triggers: ["price_generated"],
      lastUsed: "2024-01-14",
      messagesCount: 23,
      successRate: 88
    },
    {
      id: "booking_confirmation",
      name: "Booking Confirmation Agent",
      description: "Confirms bookings with event summary and payment terms",
      isActive: true,
      triggers: ["booking_confirmed"],
      lastUsed: "2024-01-13",
      messagesCount: 18,
      successRate: 95
    },
    {
      id: "tasting_scheduler",
      name: "Food Tasting Scheduler",
      description: "Schedules food tasting appointments via WhatsApp",
      isActive: true,
      triggers: ["booking_confirmed"],
      lastUsed: "2024-01-12",
      messagesCount: 12,
      successRate: 85
    },
    {
      id: "reminder",
      name: "Reminder Agent",
      description: "Sends payment and appointment reminders",
      isActive: true,
      triggers: ["scheduled_reminder"],
      lastUsed: "2024-01-15",
      messagesCount: 67,
      successRate: 78
    },
    {
      id: "gallery",
      name: "Image Gallery Agent",
      description: "Sends themed photo galleries based on package",
      isActive: false,
      triggers: ["manual_trigger"],
      lastUsed: "2024-01-10",
      messagesCount: 8,
      successRate: 90
    },
    {
      id: "follow_up",
      name: "Lead Follow-Up Bot",
      description: "Automated follow-ups for unconverted leads",
      isActive: true,
      triggers: ["scheduled_followup"],
      lastUsed: "2024-01-14",
      messagesCount: 34,
      successRate: 72
    },
    {
      id: "multilingual",
      name: "Multilingual Support",
      description: "Detects language and sends templates accordingly",
      isActive: true,
      triggers: ["all_messages"],
      lastUsed: "2024-01-15",
      messagesCount: 156,
      successRate: 94
    },
    {
      id: "feedback",
      name: "Feedback Collector Agent",
      description: "Collects post-event feedback via WhatsApp",
      isActive: true,
      triggers: ["event_completed"],
      lastUsed: "2024-01-11",
      messagesCount: 7,
      successRate: 83
    },
    {
      id: "concierge",
      name: "AI Concierge Agent",
      description: "Answers venue questions using GPT-4",
      isActive: true,
      triggers: ["staff_query"],
      lastUsed: "2024-01-15",
      messagesCount: 89,
      successRate: 91
    }
  ]);

  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  const [testMessage, setTestMessage] = useState("");
  const [testLanguage, setTestLanguage] = useState("english");

  const toggleAgent = (agentId: string) => {
    setAgents(agents.map(agent => 
      agent.id === agentId 
        ? { ...agent, isActive: !agent.isActive }
        : agent
    ));
    
    const agent = agents.find(a => a.id === agentId);
    toast({
      title: `Agent ${agent?.isActive ? 'Deactivated' : 'Activated'}`,
      description: `${agent?.name} has been ${agent?.isActive ? 'disabled' : 'enabled'}`,
    });
  };

  const testAgent = () => {
    if (!selectedAgent || !testMessage) {
      toast({
        title: "Error",
        description: "Please select an agent and enter a test message",
        variant: "destructive",
      });
      return;
    }

    // Simulate API call
    toast({
      title: "Test Message Sent",
      description: `${selectedAgent.name} test completed successfully`,
    });
    setTestMessage("");
  };

  const getAgentIcon = (agentId: string) => {
    switch (agentId) {
      case "welcome": return <FileText className="w-4 h-4" />;
      case "price_quote": return <Star className="w-4 h-4" />;
      case "booking_confirmation": return <Calendar className="w-4 h-4" />;
      case "tasting_scheduler": return <Clock className="w-4 h-4" />;
      case "reminder": return <Clock className="w-4 h-4" />;
      case "gallery": return <Camera className="w-4 h-4" />;
      case "follow_up": return <Users className="w-4 h-4" />;
      case "multilingual": return <Languages className="w-4 h-4" />;
      case "feedback": return <MessageSquare className="w-4 h-4" />;
      case "concierge": return <Bot className="w-4 h-4" />;
      default: return <MessageCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">AI Communication Agents</h2>
          <p className="text-muted-foreground">Manage automated WhatsApp communication agents</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Send className="w-4 h-4 mr-2" />
                Test Agent
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Test AI Agent</DialogTitle>
                <DialogDescription>
                  Send a test message to verify agent functionality
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="agent">Select Agent</Label>
                  <Select onValueChange={(value) => {
                    const agent = agents.find(a => a.id === value);
                    setSelectedAgent(agent || null);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an agent" />
                    </SelectTrigger>
                    <SelectContent>
                      {agents.filter(a => a.isActive).map(agent => (
                        <SelectItem key={agent.id} value={agent.id}>
                          {agent.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select value={testLanguage} onValueChange={setTestLanguage}>
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
                  <Label htmlFor="message">Test Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Enter test message content..."
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                  />
                </div>
                <Button onClick={testAgent} className="w-full">
                  Send Test Message
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Configuration
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agents.filter(a => a.isActive).length}</div>
            <p className="text-xs text-muted-foreground">
              Out of {agents.length} total agents
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages Today</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">
              +18% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">
              Average across all agents
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Agent Management</CardTitle>
          <CardDescription>Configure and monitor your AI communication agents</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Messages</TableHead>
                <TableHead>Success Rate</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agents.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      {getAgentIcon(agent.id)}
                      <div>
                        <div className="font-medium">{agent.name}</div>
                        <div className="text-sm text-muted-foreground">{agent.description}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={agent.isActive}
                        onCheckedChange={() => toggleAgent(agent.id)}
                      />
                      <Badge variant={agent.isActive ? "default" : "secondary"}>
                        {agent.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{agent.messagesCount}</TableCell>
                  <TableCell>
                    <Badge variant={agent.successRate > 85 ? "default" : agent.successRate > 75 ? "secondary" : "destructive"}>
                      {agent.successRate}%
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(agent.lastUsed).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="outline">
                        <Settings className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Activity className="w-3 h-3" />
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