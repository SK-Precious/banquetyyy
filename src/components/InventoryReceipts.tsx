import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Upload, Receipt, Eye, Download, Camera, Plus } from "lucide-react";

interface InventoryReceipt {
  id: string;
  vendor: string;
  items: string[];
  totalAmount: number;
  date: string;
  receiptImage: string;
  status: "pending" | "verified" | "approved";
  uploadedBy: string;
  notes: string;
}

export function InventoryReceipts() {
  const [receipts, setReceipts] = useState<InventoryReceipt[]>([
    {
      id: "RCP001",
      vendor: "Fresh Vegetables Co.",
      items: ["Tomatoes - 50kg", "Onions - 30kg", "Potatoes - 40kg"],
      totalAmount: 12500,
      date: "2024-07-02",
      receiptImage: "/api/placeholder/400/600",
      status: "verified",
      uploadedBy: "004",
      notes: "Fresh produce delivery for weekend events"
    }
  ]);

  const [showNewReceipt, setShowNewReceipt] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<InventoryReceipt | null>(null);
  const [newReceipt, setNewReceipt] = useState({
    vendor: "",
    items: "",
    totalAmount: "",
    date: new Date().toISOString().split('T')[0],
    notes: ""
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload to a server
      const mockUrl = URL.createObjectURL(file);
      console.log("File uploaded:", file.name);
      toast({
        title: "Receipt Uploaded",
        description: "Receipt image has been uploaded successfully",
      });
    }
  };

  const handleSubmitReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newReceipt.vendor || !newReceipt.items || !newReceipt.totalAmount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const receipt: InventoryReceipt = {
      id: `RCP${(receipts.length + 1).toString().padStart(3, '0')}`,
      vendor: newReceipt.vendor,
      items: newReceipt.items.split(',').map(item => item.trim()),
      totalAmount: parseFloat(newReceipt.totalAmount),
      date: newReceipt.date,
      receiptImage: "/api/placeholder/400/600", // Mock image
      status: "pending",
      uploadedBy: "004", // Current employee
      notes: newReceipt.notes
    };

    setReceipts([...receipts, receipt]);
    setShowNewReceipt(false);
    
    // Reset form
    setNewReceipt({
      vendor: "",
      items: "",
      totalAmount: "",
      date: new Date().toISOString().split('T')[0],
      notes: ""
    });

    toast({
      title: "Receipt Added",
      description: "Receipt has been successfully recorded",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "approved": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Inventory Receipts</h2>
          <p className="text-muted-foreground">Upload and manage purchase receipts</p>
        </div>
        <Button onClick={() => setShowNewReceipt(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Receipt
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Receipts</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{receipts.length}</div>
            <p className="text-xs text-muted-foreground">Uploaded receipts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Verification</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {receipts.filter(r => r.status === "pending").length}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{receipts.reduce((sum, receipt) => sum + receipt.totalAmount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Receipts</CardTitle>
          <CardDescription>View and manage inventory purchase receipts</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Receipt ID</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Uploaded By</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {receipts.map((receipt) => (
                <TableRow key={receipt.id}>
                  <TableCell className="font-medium">{receipt.id}</TableCell>
                  <TableCell>{receipt.vendor}</TableCell>
                  <TableCell>{new Date(receipt.date).toLocaleDateString()}</TableCell>
                  <TableCell>₹{receipt.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(receipt.status)}>
                      {receipt.status}
                    </Badge>
                  </TableCell>
                  <TableCell>Employee {receipt.uploadedBy}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedReceipt(receipt)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Receipt Details - {receipt.id}</DialogTitle>
                            <DialogDescription>
                              Complete receipt information
                            </DialogDescription>
                          </DialogHeader>
                          {selectedReceipt && (
                            <div className="grid gap-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Vendor</Label>
                                  <p className="text-sm mt-1">{selectedReceipt.vendor}</p>
                                </div>
                                <div>
                                  <Label>Date</Label>
                                  <p className="text-sm mt-1">{new Date(selectedReceipt.date).toLocaleDateString()}</p>
                                </div>
                                <div>
                                  <Label>Total Amount</Label>
                                  <p className="text-sm mt-1">₹{selectedReceipt.totalAmount.toLocaleString()}</p>
                                </div>
                                <div>
                                  <Label>Status</Label>
                                  <Badge className={getStatusColor(selectedReceipt.status)}>
                                    {selectedReceipt.status}
                                  </Badge>
                                </div>
                              </div>
                              <div>
                                <Label>Items</Label>
                                <ul className="text-sm mt-1 list-disc list-inside">
                                  {selectedReceipt.items.map((item, index) => (
                                    <li key={index}>{item}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <Label>Notes</Label>
                                <p className="text-sm mt-1">{selectedReceipt.notes || "No notes"}</p>
                              </div>
                              <div>
                                <Label>Receipt Image</Label>
                                <div className="mt-2">
                                  <img 
                                    src={selectedReceipt.receiptImage} 
                                    alt="Receipt" 
                                    className="max-w-full h-auto border rounded"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button size="sm" variant="ghost">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* New Receipt Dialog */}
      <Dialog open={showNewReceipt} onOpenChange={setShowNewReceipt}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Receipt</DialogTitle>
            <DialogDescription>
              Upload a new inventory purchase receipt
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitReceipt} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vendor">Vendor Name *</Label>
                <Input
                  id="vendor"
                  value={newReceipt.vendor}
                  onChange={(e) => setNewReceipt({...newReceipt, vendor: e.target.value})}
                  placeholder="Enter vendor name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={newReceipt.date}
                  onChange={(e) => setNewReceipt({...newReceipt, date: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="items">Items *</Label>
              <Textarea
                id="items"
                value={newReceipt.items}
                onChange={(e) => setNewReceipt({...newReceipt, items: e.target.value})}
                placeholder="Enter items separated by commas (e.g., Tomatoes - 50kg, Onions - 30kg)"
                required
              />
            </div>

            <div>
              <Label htmlFor="totalAmount">Total Amount *</Label>
              <Input
                id="totalAmount"
                type="number"
                value={newReceipt.totalAmount}
                onChange={(e) => setNewReceipt({...newReceipt, totalAmount: e.target.value})}
                placeholder="Enter total amount"
                required
              />
            </div>

            <div>
              <Label htmlFor="receiptImage">Receipt Image</Label>
              <div className="mt-2">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Camera className="w-8 h-8 mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> receipt image
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG or PDF (MAX. 10MB)</p>
                  </div>
                  <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*,.pdf" />
                </label>
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={newReceipt.notes}
                onChange={(e) => setNewReceipt({...newReceipt, notes: e.target.value})}
                placeholder="Additional notes (optional)"
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                <Upload className="w-4 h-4 mr-2" />
                Add Receipt
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowNewReceipt(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}