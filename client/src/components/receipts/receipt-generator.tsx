import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, Printer, Calendar, MapPin, Phone, Mail } from "lucide-react";
import { OrderWithDetails } from "@/types";
import { format } from "date-fns";

interface ReceiptGeneratorProps {
  order: OrderWithDetails;
  onDownload?: () => void;
  onPrint?: () => void;
}

export default function ReceiptGenerator({ order, onDownload, onPrint }: ReceiptGeneratorProps) {
  const handlePrint = () => {
    window.print();
    onPrint?.();
  };

  const handleDownload = () => {
    // Generate receipt as downloadable content
    const receiptContent = generateReceiptHTML(order);
    const blob = new Blob([receiptContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${order.orderNumber}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onDownload?.();
  };

  const receiptDate = order.deliveredAt 
    ? new Date(order.deliveredAt) 
    : new Date(order.createdAt);

  const tax = parseFloat(order.totalAmount || "0") * 0.05; // 5% tax
  const subtotal = parseFloat(order.totalAmount || "0") - tax;

  return (
    <div className="max-w-md mx-auto">
      <Card className="receipt-container">
        <CardHeader className="text-center pb-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-blue-600">AquaFlow</h1>
            <p className="text-sm text-gray-600">Pure Water Delivery Service</p>
            <p className="text-xs text-gray-500">
              📧 support@aquaflow.com | 📱 +1-800-AQUA-FLOW
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Receipt Header */}
          <div className="text-center">
            <h2 className="text-lg font-semibold">DELIVERY RECEIPT</h2>
            <p className="text-sm text-gray-600">Order #{order.orderNumber}</p>
          </div>

          <Separator />

          {/* Order Details */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Date:</span>
              <span className="text-sm font-medium">
                {format(receiptDate, "MMM dd, yyyy 'at' hh:mm a")}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Status:</span>
              <Badge 
                variant={order.status === 'delivered' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {order.status === 'delivered' ? 'Delivered' : order.status.toUpperCase()}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Customer Information */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm">Customer Information</h3>
            <div className="space-y-1">
              <p className="text-sm">{order.customerName}</p>
              <div className="flex items-start text-xs text-gray-600">
                <Phone className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                <span>{order.customerPhone}</span>
              </div>
              <div className="flex items-start text-xs text-gray-600">
                <MapPin className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                <span>{order.deliveryAddress}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Order Items */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm">Order Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">20L Water Bags</span>
                <span className="text-sm">x{order.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Litres:</span>
                <span className="text-sm font-medium">{order.totalLitres}L</span>
              </div>
              {order.preferredDeliveryTime && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Delivery Time:</span>
                  <span className="text-sm">{order.preferredDeliveryTime}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Payment Details */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm">Payment Summary</h3>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (5%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Delivery Fee:</span>
                <span>$0.00</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>${order.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Delivery Agent */}
          {order.agentName && (
            <>
              <Separator />
              <div className="space-y-1">
                <h3 className="font-medium text-sm">Delivered By</h3>
                <p className="text-sm text-gray-600">{order.agentName}</p>
              </div>
            </>
          )}

          {/* Notes */}
          {order.notes && (
            <>
              <Separator />
              <div className="space-y-1">
                <h3 className="font-medium text-sm">Special Instructions</h3>
                <p className="text-xs text-gray-600">{order.notes}</p>
              </div>
            </>
          )}

          <Separator />

          {/* Footer */}
          <div className="text-center space-y-2">
            <p className="text-xs text-gray-500">
              Thank you for choosing AquaFlow!
            </p>
            <p className="text-xs text-gray-500">
              For support, contact us at support@aquaflow.com
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button 
              onClick={handlePrint} 
              variant="outline" 
              size="sm"
              className="flex-1"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button 
              onClick={handleDownload} 
              variant="outline" 
              size="sm"
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function generateReceiptHTML(order: OrderWithDetails): string {
  const receiptDate = order.deliveredAt 
    ? new Date(order.deliveredAt) 
    : new Date(order.createdAt);
  
  const tax = parseFloat(order.totalAmount || "0") * 0.05;
  const subtotal = parseFloat(order.totalAmount || "0") - tax;

  return `
<!DOCTYPE html>
<html>
<head>
  <title>Receipt - ${order.orderNumber}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
    .company-name { font-size: 24px; font-weight: bold; color: #2563eb; }
    .section { margin: 15px 0; }
    .row { display: flex; justify-content: space-between; margin: 5px 0; }
    .total-row { font-weight: bold; border-top: 1px solid #000; padding-top: 5px; }
    .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="header">
    <div class="company-name">AquaFlow</div>
    <div>Pure Water Delivery Service</div>
    <div style="font-size: 12px;">support@aquaflow.com | +1-800-AQUA-FLOW</div>
  </div>
  
  <div style="text-align: center; margin-bottom: 20px;">
    <h2>DELIVERY RECEIPT</h2>
    <div>Order #${order.orderNumber}</div>
    <div>${format(receiptDate, "MMM dd, yyyy 'at' hh:mm a")}</div>
  </div>
  
  <div class="section">
    <strong>Customer:</strong><br>
    ${order.customerName}<br>
    📱 ${order.customerPhone}<br>
    📍 ${order.deliveryAddress}
  </div>
  
  <div class="section">
    <strong>Order Details:</strong><br>
    <div class="row">
      <span>20L Water Bags x${order.quantity}</span>
      <span>${order.totalLitres}L</span>
    </div>
    ${order.preferredDeliveryTime ? `<div>Delivery Time: ${order.preferredDeliveryTime}</div>` : ''}
  </div>
  
  <div class="section">
    <div class="row"><span>Subtotal:</span><span>$${subtotal.toFixed(2)}</span></div>
    <div class="row"><span>Tax (5%):</span><span>$${tax.toFixed(2)}</span></div>
    <div class="row"><span>Delivery Fee:</span><span>$0.00</span></div>
    <div class="row total-row"><span>Total:</span><span>$${order.totalAmount}</span></div>
  </div>
  
  ${order.agentName ? `<div class="section"><strong>Delivered By:</strong> ${order.agentName}</div>` : ''}
  ${order.notes ? `<div class="section"><strong>Notes:</strong> ${order.notes}</div>` : ''}
  
  <div class="footer">
    Thank you for choosing AquaFlow!<br>
    For support, contact us at support@aquaflow.com
  </div>
</body>
</html>
  `;
}