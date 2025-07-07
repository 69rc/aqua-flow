import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/sidebar";
import TopBar from "@/components/layout/top-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Package, AlertTriangle, TrendingUp, Plus } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { Inventory } from "@shared/schema";

export default function InventoryManagement() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [stockUpdates, setStockUpdates] = useState<{ [key: number]: number }>({});
  const queryClient = useQueryClient();

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

  const { data: inventory, isLoading: inventoryLoading } = useQuery<Inventory[]>({
    queryKey: ["/api/inventory"],
    retry: false,
  });

  const updateStockMutation = useMutation({
    mutationFn: async ({ id, stock }: { id: number; stock: number }) => {
      const response = await apiRequest("PATCH", `/api/inventory/${id}`, { stock });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Stock Updated",
        description: "Inventory stock updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
      setStockUpdates({});
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update stock",
        variant: "destructive",
      });
    },
  });

  const handleStockUpdate = (itemId: number) => {
    const newStock = stockUpdates[itemId];
    if (newStock !== undefined && newStock >= 0) {
      updateStockMutation.mutate({ id: itemId, stock: newStock });
    }
  };

  const lowStockItems = inventory?.filter(item => item.currentStock <= item.minThreshold) || [];
  const totalValue = inventory?.reduce((sum, item) => sum + (item.currentStock * parseFloat(item.unitPrice || "0")), 0) || 0;

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <TopBar title="Inventory Management" />
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{inventory?.length || 0}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">{lowStockItems.length}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Stock Value</CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Units</CardTitle>
                    <Package className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {inventory?.reduce((sum, item) => sum + item.currentStock, 0) || 0}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Low Stock Alerts */}
              {lowStockItems.length > 0 && (
                <Card className="mb-6 border-yellow-200 bg-yellow-50">
                  <CardHeader>
                    <CardTitle className="text-yellow-800 flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      Low Stock Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {lowStockItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-center p-2 bg-white rounded-md">
                          <span className="font-medium">{item.itemName}</span>
                          <Badge variant="outline" className="text-yellow-700 border-yellow-300">
                            {item.currentStock} / {item.minThreshold} units
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Inventory Table */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Inventory Items</CardTitle>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </CardHeader>
                <CardContent>
                  {inventoryLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    </div>
                  ) : !inventory || inventory.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No inventory items found</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Item Name</TableHead>
                            <TableHead>Current Stock</TableHead>
                            <TableHead>Min Threshold</TableHead>
                            <TableHead>Unit Price</TableHead>
                            <TableHead>Total Value</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {inventory.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">{item.itemName}</TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Input
                                    type="number"
                                    min="0"
                                    className="w-20"
                                    placeholder={item.currentStock.toString()}
                                    value={stockUpdates[item.id] ?? ""}
                                    onChange={(e) => 
                                      setStockUpdates(prev => ({
                                        ...prev,
                                        [item.id]: parseInt(e.target.value) || 0
                                      }))
                                    }
                                  />
                                  <span className="text-sm text-gray-500">
                                    (Current: {item.currentStock})
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>{item.minThreshold}</TableCell>
                              <TableCell>${parseFloat(item.unitPrice || "0").toFixed(2)}</TableCell>
                              <TableCell>
                                ${(item.currentStock * parseFloat(item.unitPrice || "0")).toFixed(2)}
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  variant={item.currentStock <= item.minThreshold ? "destructive" : "default"}
                                >
                                  {item.currentStock <= item.minThreshold ? "Low Stock" : "In Stock"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button
                                  size="sm"
                                  onClick={() => handleStockUpdate(item.id)}
                                  disabled={stockUpdates[item.id] === undefined || updateStockMutation.isPending}
                                >
                                  Update
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}