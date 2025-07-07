import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import AdminDashboard from "@/pages/admin-dashboard";
import DeliveryDashboard from "@/pages/delivery-dashboard";
import CustomerDashboard from "@/pages/customer-dashboard";
import OrderManagement from "@/pages/order-management";
import InventoryManagement from "@/pages/inventory-management";
import AgentManagement from "@/pages/agent-management";
import CustomerManagement from "@/pages/customer-management";
import Analytics from "@/pages/analytics";
import CustomerRegister from "@/pages/customer-register";
import CustomerLogin from "@/pages/customer-login";

function Router() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/customer-register" component={CustomerRegister} />
        <Route path="/customer-login" component={CustomerLogin} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  // Role-based routing for authenticated users
  const userRole = (user as any)?.role;

  return (
    <Switch>
      {userRole === "admin" && (
        <>
          <Route path="/" component={AdminDashboard} />
          <Route path="/orders" component={OrderManagement} />
          <Route path="/inventory" component={InventoryManagement} />
          <Route path="/agents" component={AgentManagement} />
          <Route path="/customers" component={CustomerManagement} />
          <Route path="/analytics" component={Analytics} />
        </>
      )}
      {userRole === "delivery_agent" && (
        <>
          <Route path="/" component={DeliveryDashboard} />
        </>
      )}
      {userRole === "customer" && (
        <>
          <Route path="/" component={CustomerDashboard} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
