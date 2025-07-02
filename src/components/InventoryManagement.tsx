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
import { Plus, Package, AlertTriangle, TrendingDown, ShoppingCart } from "lucide-react";

interface InventoryItem {
  id: string;
  name: string;
  category: "vegetables" | "grains" | "spices" | "dairy" | "meat" | "beverages" | "other";
  currentStock: number;
  unit: string;
  reorderLevel: number;
  costPerUnit: number;
  supplier: string;
  lastUpdated: string;
  consumptionRate: number; // per guest
}

export function InventoryManagement() {
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: "1",
      name: "Basmati Rice",
      category: "grains",
      currentStock: 50,
      unit: "kg",
      reorderLevel: 100,
      costPerUnit: 120,
      supplier: "Grain Suppliers Ltd",
      lastUpdated: "2024-01-15",
      consumptionRate: 0.2
    },
    {
      id: "2",
      name: "Tomatoes",
      category: "vegetables",
      currentStock: 25,
      unit: "kg",
      reorderLevel: 50,
      costPerUnit: 40,
      supplier: "Fresh Vegetable Market",
      lastUpdated: "2024-01-16",
      consumptionRate: 0.15
    },
    {
      id: "3",
      name: "Chicken",
      category: "meat",
      currentStock: 30,
      unit: "kg",
      reorderLevel: 40,
      costPerUnit: 250,
      supplier: "Premium Meat Suppliers",
      lastUpdated: "2024-01-16",
      consumptionRate: 0.25
    },
    {
      id: "4",
      name: "Milk",
      category: "dairy",
      currentStock: 15,
      unit: "liters",
      reorderLevel: 30,
      costPerUnit: 50,
      supplier: "Dairy Fresh",
      lastUpdated: "2024-01-17",
      consumptionRate: 0.1
    }
  ]);

  const [showNewItem, setShowNewItem] = useState(false);
  const [showStockUpdate, setShowStockUpdate] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [guestCalculator, setGuestCalculator] = useState({ guestCount: "", eventDate: "" });
  
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    currentStock: "",
    unit: "",
    reorderLevel: "",
    costPerUnit: "",
    supplier: "",
    consumptionRate: ""
  });

  const [stockUpdate, setStockUpdate] = useState({
    quantity: "",
    type: "add" as "add" | "remove",
    notes: ""
  });

  const getLowStockItems = () => {
    return inventory.filter(item => item.currentStock <= item.reorderLevel);
  };

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock <= item.reorderLevel * 0.5) return "critical";
    if (item.currentStock <= item.reorderLevel) return "low";
    return "good";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical": return "bg-red-100 text-red-800";
      case "low": return "bg-yellow-100 text-yellow-800";
      case "good": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const calculateRequirement = () => {
    if (!guestCalculator.guestCount) return;
    
    const guests = parseInt(guestCalculator.guestCount);
    const requirements = inventory.map(item => ({
      ...item,
      required: Math.ceil(item.consumptionRate * guests),
      shortfall: Math.max(0, Math.ceil(item.consumptionRate * guests) - item.currentStock)
    }));

    toast({
      title: "Requirements Calculated",
      description: `Inventory requirements calculated for ${guests} guests`,
    });

    return requirements;
  };

  const updateStock = () => {
    if (!selectedItem || !stockUpdate.quantity) return;

    const quantity = parseInt(stockUpdate.quantity);
    const newStock = stockUpdate.type === "add" 
      ? selectedItem.currentStock + quantity
      : selectedItem.currentStock - quantity;

    setInventory(inventory.map(item => 
      item.id === selectedItem.id 
        ? { ...item, currentStock: Math.max(0, newStock), lastUpdated: new Date().toISOString().split('T')[0] }
        : item
    ));

    setShowStockUpdate(false);
    setStockUpdate({ quantity: "", type: "add", notes: "" });
    
    toast({
      title: "Stock Updated",
      description: `${selectedItem.name} stock has been updated`,
    });
  };

  const handleSubmitItem = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newItem.name || !newItem.category || !newItem.currentStock) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const item: InventoryItem = {
      id: Date.now().toString(),
      name: newItem.name,
      category: newItem.category as any,
      currentStock: parseInt(newItem.currentStock),
      unit: newItem.unit,
      reorderLevel: parseInt(newItem.reorderLevel) || 10,
      costPerUnit: parseFloat(newItem.costPerUnit) || 0,
      supplier: newItem.supplier,
      lastUpdated: new Date().toISOString().split('T')[0],
      consumptionRate: parseFloat(newItem.consumptionRate) || 0.1
    };

    setInventory([...inventory, item]);
    setShowNewItem(false);
    
    // Reset form
    setNewItem({
      name: "",
      category: "",
      currentStock: "",
      unit: "",
      reorderLevel: "",
      costPerUnit: "",
      supplier: "",
      consumptionRate: ""
    });

    toast({
      title: "Inventory Item Added",
      description: "New item has been added to inventory",
    });
  };

  const lowStockItems = getLowStockItems();
  const totalValue = inventory.reduce((sum, item) => sum + (item.currentStock * item.costPerUnit), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Inventory Management</h2>
          <p className="text-muted-foreground">Track and manage food & beverage inventory</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowNewItem(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
          <Button variant="outline">
            Generate Order List
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.length}</div>
            <p className="text-xs text-muted-foreground">Inventory items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alert</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{lowStockItems.length}</div>
            <p className="text-xs text-muted-foreground">Items need reorder</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Current stock value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reorder Value</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{lowStockItems.reduce((sum, item) => sum + (item.reorderLevel * item.costPerUnit), 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">For low stock items</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Items</CardTitle>
              <CardDescription>All items in stock with current levels</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Reorder Level</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.map((item) => {
                    const status = getStockStatus(item);
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="capitalize">{item.category}</TableCell>
                        <TableCell>{item.currentStock} {item.unit}</TableCell>
                        <TableCell>{item.reorderLevel} {item.unit}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(status)}>
                            {status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedItem(item);
                              setShowStockUpdate(true);
                            }}
                          >
                            Update Stock
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Guest Calculator</CardTitle>
              <CardDescription>Calculate inventory requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="guestCount">Guest Count</Label>
                <Input
                  id="guestCount"
                  type="number"
                  value={guestCalculator.guestCount}
                  onChange={(e) => setGuestCalculator({...guestCalculator, guestCount: e.target.value})}
                  placeholder="250"
                />
              </div>
              <div>
                <Label htmlFor="eventDate">Event Date</Label>
                <Input
                  id="eventDate"
                  type="date"
                  value={guestCalculator.eventDate}
                  onChange={(e) => setGuestCalculator({...guestCalculator, eventDate: e.target.value})}
                />
              </div>
              <Button onClick={calculateRequirement} className="w-full">
                Calculate Requirements
              </Button>
            </CardContent>
          </Card>

          {lowStockItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Low Stock Alert</CardTitle>
                <CardDescription>Items requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {lowStockItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-2 bg-red-50 rounded">
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.currentStock} {item.unit} remaining
                        </p>
                      </div>
                      <Badge variant="destructive">Low</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={showNewItem} onOpenChange={setShowNewItem}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Inventory Item</DialogTitle>
            <DialogDescription>
              Add a new item to your inventory
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmitItem} className="space-y-4">
            <div>
              <Label htmlFor="name">Item Name *</Label>
              <Input
                id="name"
                value={newItem.name}
                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                placeholder="e.g., Basmati Rice"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={newItem.category} onValueChange={(value) => setNewItem({...newItem, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vegetables">Vegetables</SelectItem>
                  <SelectItem value="grains">Grains</SelectItem>
                  <SelectItem value="spices">Spices</SelectItem>
                  <SelectItem value="dairy">Dairy</SelectItem>
                  <SelectItem value="meat">Meat</SelectItem>
                  <SelectItem value="beverages">Beverages</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="currentStock">Current Stock *</Label>
                <Input
                  id="currentStock"
                  type="number"
                  value={newItem.currentStock}
                  onChange={(e) => setNewItem({...newItem, currentStock: e.target.value})}
                  placeholder="50"
                  required
                />
              </div>
              <div>
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  value={newItem.unit}
                  onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                  placeholder="kg"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="reorderLevel">Reorder Level</Label>
                <Input
                  id="reorderLevel"
                  type="number"
                  value={newItem.reorderLevel}
                  onChange={(e) => setNewItem({...newItem, reorderLevel: e.target.value})}
                  placeholder="20"
                />
              </div>
              <div>
                <Label htmlFor="costPerUnit">Cost/Unit</Label>
                <Input
                  id="costPerUnit"
                  type="number"
                  value={newItem.costPerUnit}
                  onChange={(e) => setNewItem({...newItem, costPerUnit: e.target.value})}
                  placeholder="120"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="supplier">Supplier</Label>
              <Input
                id="supplier"
                value={newItem.supplier}
                onChange={(e) => setNewItem({...newItem, supplier: e.target.value})}
                placeholder="Supplier name"
              />
            </div>
            
            <div>
              <Label htmlFor="consumptionRate">Consumption Rate (per guest)</Label>
              <Input
                id="consumptionRate"
                type="number"
                step="0.01"
                value={newItem.consumptionRate}
                onChange={(e) => setNewItem({...newItem, consumptionRate: e.target.value})}
                placeholder="0.2"
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                Add Item
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowNewItem(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showStockUpdate} onOpenChange={setShowStockUpdate}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Stock</DialogTitle>
            <DialogDescription>
              Update stock level for {selectedItem?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="updateType">Update Type</Label>
              <Select value={stockUpdate.type} onValueChange={(value) => setStockUpdate({...stockUpdate, type: value as any})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="add">Add Stock</SelectItem>
                  <SelectItem value="remove">Remove Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={stockUpdate.quantity}
                onChange={(e) => setStockUpdate({...stockUpdate, quantity: e.target.value})}
                placeholder="10"
              />
            </div>
            
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={stockUpdate.notes}
                onChange={(e) => setStockUpdate({...stockUpdate, notes: e.target.value})}
                placeholder="Reason for update..."
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button onClick={updateStock} className="flex-1">
                Update Stock
              </Button>
              <Button variant="outline" onClick={() => setShowStockUpdate(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}