import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Search, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  lead_id: string;
  type: string;
  status: string;
  content: string;
  sent_by: string;
  timestamp: string;
  lead_name?: string;
  sender_name?: string;
}

export const AdminWhatsAppHistory = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          leads(name),
          users(name)
        `)
        .order('timestamp', { ascending: false });

      if (error) throw error;

      const formattedMessages = data?.map(msg => ({
        ...msg,
        lead_name: msg.leads?.name || 'Unknown Lead',
        sender_name: msg.users?.name || 'System'
      })) || [];

      setMessages(formattedMessages);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch message history",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.lead_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.content?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || message.status === statusFilter;
    const matchesType = typeFilter === "all" || message.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: any } = {
      'sent': 'default',
      'delivered': 'default',
      'failed': 'destructive',
    };
    return <Badge variant={variants[status] || 'default'}>{status.toUpperCase()}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const variants: { [key: string]: any } = {
      'welcome': 'default',
      'quote': 'secondary',
      'reminder': 'outline',
      'feedback': 'default',
      'followup': 'secondary',
    };
    return <Badge variant={variants[type] || 'default'}>{type.toUpperCase()}</Badge>;
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (isLoading) {
    return <div className="p-6">Loading message history...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">WhatsApp Message History</h2>
        <p className="text-muted-foreground">Track all automated and manual WhatsApp communications</p>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by lead name or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="welcome">Welcome</SelectItem>
            <SelectItem value="quote">Quote</SelectItem>
            <SelectItem value="reminder">Reminder</SelectItem>
            <SelectItem value="feedback">Feedback</SelectItem>
            <SelectItem value="followup">Follow-up</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="mr-2 h-5 w-5" />
            Message History ({filteredMessages.length})
          </CardTitle>
          <CardDescription>Complete log of WhatsApp automation activities</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sent By</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMessages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No messages found
                  </TableCell>
                </TableRow>
              ) : (
                filteredMessages.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell className="font-medium">{message.lead_name}</TableCell>
                    <TableCell>{getTypeBadge(message.type)}</TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={message.content}>
                        {message.content || 'No content'}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(message.status)}</TableCell>
                    <TableCell>{message.sender_name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatTimestamp(message.timestamp)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{messages.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {messages.filter(m => m.status === 'delivered').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {messages.filter(m => m.status === 'failed').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {messages.filter(m => 
                new Date(m.timestamp).getMonth() === new Date().getMonth()
              ).length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};