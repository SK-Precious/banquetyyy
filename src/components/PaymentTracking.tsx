import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Plus, Eye, DollarSign, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";

interface Payment {
  id: string;
  bookingId: string;
  clientName: string;
  eventDate: string;
  stage: "advance" | "part1" | "part2" | "final" | "addon";
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  status: "pending" | "received" | "overdue";
  dueDate: string;
  notes: string;
}

interface PaymentSummary {
  totalDue: number;
  totalReceived: number;
  pendingAmount: number;
  overdueCount: number;
}

export function PaymentTracking() {
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: "1",
      bookingId: "1",
      clientName: "Sarah & John Wedding",
      eventDate: "2024-03-15",
      stage: "advance",
      amount: 200000,
      paymentDate: "2024-01-15",
      paymentMethod: "Bank Transfer",
      status: "received",
      dueDate: "2024-01-15",
      notes: "Advance payment received"
    },
    {
      id: "2",
      bookingId: "1",
      clientName: "Sarah & John Wedding",
      eventDate: "2024-03-15",
      stage: "part1",
      amount: 200000,
      paymentDate: "",
      paymentMethod: "",
      status: "pending",
      dueDate: "2024-02-15",
      notes: "First installment due"
    },
    {
      id: "3",
      bookingId: "2",
      clientName: "Sharma Family Function",
      eventDate: "2024-02-28",
      stage: "advance",
      amount: 100000,
      paymentDate: "2024-01-12",
      paymentMethod: "Cash",
      status: "received",
      dueDate: "2024-01-12",
      notes: "Advance payment received"
    }
  ]);

  const [showNewPayment, setShowNewPayment] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  
  const [newPayment, setNewPayment] = useState({
    clientName: "",
    stage: "",
    amount: "",
    paymentMethod: "",
    dueDate: "",
    notes: ""
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "received": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "overdue": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStageLabel = (stage: string) => {
    switch (stage) {
      case "advance": return "Advance";
      case "part1": return "Part 1";
      case "part2": return "Part 2";
      case "final": return "Final";
      case "addon": return "Add-on";
      default: return stage;
    }
  };

  const calculateSummary = (): PaymentSummary => {
    const totalDue = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const totalReceived = payments
      .filter(payment => payment.status === "received")
      .reduce((sum, payment) => sum + payment.amount, 0);
    const pendingAmount = totalDue - totalReceived;
    const overdueCount = payments.filter(payment => 
      payment.status === "pending" && new Date(payment.dueDate) < new Date()
    ).length;

    return { totalDue, totalReceived, pendingAmount, overdueCount };
  };

  const summary = calculateSummary();

  const markPaymentReceived = (paymentId: string) => {
    setPayments(payments.map(payment => 
      payment.id === paymentId 
        ? { ...payment, status: "received" as const, paymentDate: new Date().toISOString().split('T')[0] }
        : payment
    ));
    
    toast({
      title: "Payment Marked as Received",
      description: "Payment status has been updated",
    });
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPayment.clientName || !newPayment.amount || !newPayment.stage) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const payment: Payment = {
      id: Date.now().toString(),
      bookingId: "new",
      clientName: newPayment.clientName,
      eventDate: "2024-03-01", // This should come from booking
      stage: newPayment.stage as any,
      amount: parseInt(newPayment.amount),
      paymentDate: "",
      paymentMethod: newPayment.paymentMethod,
      status: "pending",
      dueDate: newPayment.dueDate,
      notes: newPayment.notes
    };

    setPayments([...payments, payment]);
    setShowNewPayment(false);
    
    // Reset form
    setNewPayment({
      clientName: "",
      stage: "",
      amount: "",
      paymentMethod: "",
      dueDate: "",
      notes: ""
    });

    toast({
      title: "Payment Record Added",
      description: "New payment record has been created",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Payment Tracking</h2>
          <p className="text-muted-foreground">Manage and track all payment stages</p>
        </div>
        <Button onClick={() => setShowNewPayment(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Payment Record
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Due</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{summary.totalDue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All pending payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Received</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{summary.totalReceived.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Payments collected</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">₹{summary.pendingAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Outstanding payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{summary.overdueCount}</div>
            <p className="text-xs text-muted-foreground">Past due date</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Records</CardTitle>
          <CardDescription>Track all payment stages and status</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client Name</TableHead>
                <TableHead>Event Date</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.clientName}</TableCell>
                  <TableCell>{new Date(payment.eventDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{getStageLabel(payment.stage)}</Badge>
                  </TableCell>
                  <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                  <TableCell>{new Date(payment.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(payment.status)}>
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {payment.status === "pending" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markPaymentReceived(payment.id)}
                        >
                          Mark Received
                        </Button>
                      )}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedPayment(payment)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Payment Details</DialogTitle>
                            <DialogDescription>
                              Complete payment information
                            </DialogDescription>
                          </DialogHeader>
                          {selectedPayment && (
                            <div className="grid gap-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Client Name</Label>
                                  <p className="text-sm mt-1">{selectedPayment.clientName}</p>
                                </div>
                                <div>
                                  <Label>Payment Stage</Label>
                                  <p className="text-sm mt-1">{getStageLabel(selectedPayment.stage)}</p>
                                </div>
                                <div>
                                  <Label>Amount</Label>
                                  <p className="text-sm mt-1">₹{selectedPayment.amount.toLocaleString()}</p>
                                </div>
                                <div>
                                  <Label>Due Date</Label>
                                  <p className="text-sm mt-1">{new Date(selectedPayment.dueDate).toLocaleDateString()}</p>
                                </div>
                                <div>
                                  <Label>Payment Method</Label>
                                  <p className="text-sm mt-1">{selectedPayment.paymentMethod || "Not specified"}</p>
                                </div>
                                <div>
                                  <Label>Status</Label>
                                  <Badge className={getStatusColor(selectedPayment.status)}>
                                    {selectedPayment.status}
                                  </Badge>
                                </div>
                              </div>
                              <div>
                                <Label>Notes</Label>
                                <p className="text-sm mt-1">{selectedPayment.notes || "No notes"}</p>
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

      <Dialog open={showNewPayment} onOpenChange={setShowNewPayment}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Payment Record</DialogTitle>
            <DialogDescription>
              Create a new payment tracking record
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmitPayment} className="space-y-4">
            <div>
              <Label htmlFor="clientName">Client Name *</Label>
              <Input
                id="clientName"
                value={newPayment.clientName}
                onChange={(e) => setNewPayment({...newPayment, clientName: e.target.value})}
                placeholder="Enter client name"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="stage">Payment Stage *</Label>
              <Select value={newPayment.stage} onValueChange={(value) => setNewPayment({...newPayment, stage: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="advance">Advance</SelectItem>
                  <SelectItem value="part1">Part 1</SelectItem>
                  <SelectItem value="part2">Part 2</SelectItem>
                  <SelectItem value="final">Final</SelectItem>
                  <SelectItem value="addon">Add-on</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                type="number"
                value={newPayment.amount}
                onChange={(e) => setNewPayment({...newPayment, amount: e.target.value})}
                placeholder="100000"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select value={newPayment.paymentMethod} onValueChange={(value) => setNewPayment({...newPayment, paymentMethod: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="UPI">UPI</SelectItem>
                  <SelectItem value="Card">Card</SelectItem>
                  <SelectItem value="Cheque">Cheque</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={newPayment.dueDate}
                onChange={(e) => setNewPayment({...newPayment, dueDate: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={newPayment.notes}
                onChange={(e) => setNewPayment({...newPayment, notes: e.target.value})}
                placeholder="Payment notes..."
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                Add Payment Record
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowNewPayment(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}