import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface WalkInCaptureProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (lead: any) => void;
}

export function WalkInCapture({ open, onOpenChange, onSave }: WalkInCaptureProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    eventDate: "",
    guestCount: "",
    budget: "",
    notes: "",
    source: "Walk-in",
    status: "new"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) {
      toast({
        title: "Error",
        description: "Name and phone number are required",
        variant: "destructive",
      });
      return;
    }

    onSave({
      ...formData,
      guestCount: parseInt(formData.guestCount) || 0,
    });

    toast({
      title: "Walk-in Client Added",
      description: "Client information saved and WhatsApp message will be sent",
    });

    // Reset form
    setFormData({
      name: "",
      phone: "",
      email: "",
      eventDate: "",
      guestCount: "",
      budget: "",
      notes: "",
      source: "Walk-in",
      status: "new"
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Walk-in Client</DialogTitle>
          <DialogDescription>
            Capture details for clients who visit in person
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="name">Client Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter client name"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="+91 9876543210"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="client@email.com"
              />
            </div>
            
            <div>
              <Label htmlFor="eventDate">Event Date</Label>
              <Input
                id="eventDate"
                type="date"
                value={formData.eventDate}
                onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="guestCount">Expected Guest Count</Label>
              <Input
                id="guestCount"
                type="number"
                value={formData.guestCount}
                onChange={(e) => setFormData({...formData, guestCount: e.target.value})}
                placeholder="150"
              />
            </div>
            
            <div>
              <Label htmlFor="budget">Budget Range</Label>
              <Select value={formData.budget} onValueChange={(value) => setFormData({...formData, budget: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="₹1,00,000 - ₹2,50,000">₹1,00,000 - ₹2,50,000</SelectItem>
                  <SelectItem value="₹2,50,000 - ₹5,00,000">₹2,50,000 - ₹5,00,000</SelectItem>
                  <SelectItem value="₹5,00,000 - ₹7,50,000">₹5,00,000 - ₹7,50,000</SelectItem>
                  <SelectItem value="₹7,50,000 - ₹10,00,000">₹7,50,000 - ₹10,00,000</SelectItem>
                  <SelectItem value="₹10,00,000+">₹10,00,000+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Any specific requirements or preferences..."
                rows={3}
              />
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              Save & Send WhatsApp
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}