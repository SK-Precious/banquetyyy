import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Printer } from "lucide-react";

interface Booking {
  id: string;
  serialNumber: string;
  customerName: string;
  address: string;
  phone: string;
  email: string;
  eventDate: string;
  slot: string;
  menuPreference: string;
  liquorService: boolean;
  flowerDecoration: string;
  djService: boolean;
  bookingDate: string;
  grossAmount: number;
  gst: number;
  extras: number;
  netAmount: number;
  advance: number;
}

interface BookingReceiptPrintProps {
  booking: Booking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookingReceiptPrint({ booking, open, onOpenChange }: BookingReceiptPrintProps) {
  const handlePrint = () => {
    window.print();
  };

  if (!booking) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Booking Receipt
            <Button onClick={handlePrint} size="sm">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div id="receipt-content" className="print:p-0 p-4">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">BANQUETY</h1>
            <p className="text-sm text-muted-foreground">Banquet Hall Management</p>
            <p className="text-xs mt-2">Booking Receipt</p>
          </div>

          <div className="border-t border-b py-4 mb-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Serial Number:</strong> {booking.serialNumber}</p>
                <p><strong>Booking Date:</strong> {new Date(booking.bookingDate).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p><strong>Event Date:</strong> {new Date(booking.eventDate).toLocaleDateString()}</p>
                <p><strong>Time Slot:</strong> {booking.slot}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Customer Details</h3>
            <div className="text-sm space-y-1">
              <p><strong>Name:</strong> {booking.customerName}</p>
              <p><strong>Address:</strong> {booking.address}</p>
              <p><strong>Phone:</strong> {booking.phone}</p>
              <p><strong>Email:</strong> {booking.email}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Event Details</h3>
            <div className="text-sm space-y-1">
              <p><strong>Menu:</strong> {booking.menuPreference}</p>
              <p><strong>Liquor Service:</strong> {booking.liquorService ? "Yes" : "No"}</p>
              <p><strong>Flower Decoration:</strong> {booking.flowerDecoration}</p>
              <p><strong>DJ Service:</strong> {booking.djService ? "Yes" : "No"}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Financial Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Gross Amount:</span>
                <span>₹{booking.grossAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>GST:</span>
                <span>₹{booking.gst.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Extras:</span>
                <span>₹{booking.extras.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-semibold">
                <span>Net Amount:</span>
                <span>₹{booking.netAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Advance Paid:</span>
                <span>₹{booking.advance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-destructive font-semibold">
                <span>Balance Due:</span>
                <span>₹{(booking.netAmount - booking.advance).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t text-center text-xs text-muted-foreground">
            <p>Thank you for choosing BANQUETY!</p>
            <p>For any queries, please contact us.</p>
          </div>
        </div>
      </DialogContent>

      <style>{`
        @media print {
          @page {
            margin: 0.5in;
          }
          
          body * {
            visibility: hidden;
          }
          
          #receipt-content,
          #receipt-content * {
            visibility: visible;
          }
          
          #receipt-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </Dialog>
  );
}