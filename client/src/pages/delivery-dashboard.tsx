import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Package, CheckCircle, XCircle } from "lucide-react";
import type { OrderWithDetails } from "@/types";
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from "@/types";

export default function DeliveryDashboard() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Mock agent ID - in real app, this would come from user profile
  const agentId = 1;
  
  const { data: assignedOrders, isLoading: ordersLoading } = useQuery<OrderWithDetails[]>({
    queryKey: ["/api/orders/agent", agentId],
    retry: false,
    enabled: !!user && user.role === "delivery_agent",
  });

  const todaysOrders = assignedOrders?.filter(order => {
    const today = new Date().toDateString();
    const orderDate = new Date(order.createdAt).toDateString();
    return orderDate === today && (order.status === "assigned" || order.status === "in_transit");
  }) || [];

  const handleMarkDelivered = (orderId: number) => {
    // TODO: Implement order status update
    toast({
      title: "Order Updated",
      description: "Order marked as delivered successfully",
    });
  };

  const handleMarkFailed = (orderId: number) => {
    // TODO: Implement order status update
    toast({
      title: "Order Updated", 
      description: "Order marked as failed",
      variant: "destructive",
    });
  };

  const openMaps = (address: string) => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(mapsUrl, '_blank');
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white shadow">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-primary mr-3" />
              <h1 className="text-2xl font-semibold text-gray-900">Delivery Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Welcome, {user?.firstName || "Delivery Agent"}
              </span>
              <Button
                variant="outline"
                onClick={() => window.location.href = "/api/logout"}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Deliveries</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todaysOrders.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {assignedOrders?.filter(o => o.status === "delivered").length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <XCircle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {todaysOrders.filter(o => o.status === "assigned" || o.status === "in_transit").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Deliveries */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Assigned Deliveries</h2>
          
          {ordersLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : todaysOrders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No deliveries assigned for today</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {todaysOrders.map((order) => (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {order.orderNumber}
                          </h3>
                          <Badge className={ORDER_STATUS_COLORS[order.status]}>
                            {ORDER_STATUS_LABELS[order.status]}
                          </Badge>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <p className="font-medium text-gray-900">{order.customerName}</p>
                            <div className="flex items-center text-sm text-gray-600 mt-1">
                              <Phone className="h-4 w-4 mr-1" />
                              {order.customerPhone}
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex items-start text-sm text-gray-600">
                              <MapPin className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                              <span>{order.deliveryAddress}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-3 text-sm text-gray-600">
                          <span className="font-medium">Quantity:</span> {order.quantity} bags ({order.totalLitres}L)
                        </div>
                        
                        {order.notes && (
                          <div className="mt-2 text-sm text-gray-600">
                            <span className="font-medium">Notes:</span> {order.notes}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col space-y-2 lg:ml-6">
                        <Button
                          onClick={() => openMaps(order.deliveryAddress)}
                          variant="outline"
                          size="sm"
                          className="w-full lg:w-auto"
                        >
                          <MapPin className="h-4 w-4 mr-2" />
                          View Map
                        </Button>
                        
                        {order.status !== "delivered" && (
                          <>
                            <Button
                              onClick={() => handleMarkDelivered(order.id)}
                              size="sm"
                              className="w-full lg:w-auto bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark Delivered
                            </Button>
                            
                            <Button
                              onClick={() => handleMarkFailed(order.id)}
                              variant="outline"
                              size="sm"
                              className="w-full lg:w-auto text-red-600 border-red-600 hover:bg-red-50"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Mark Failed
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
