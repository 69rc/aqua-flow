import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Droplets, Shield, Truck, User } from "lucide-react";

export default function LocalLogin() {
  const handleLogin = (userType: string) => {
    // For local development, just redirect to login endpoint
    window.location.href = "/api/login";
  };

  const demoUsers = [
    {
      type: "admin",
      title: "Admin Dashboard",
      description: "Full access to all features: order management, inventory, analytics, and user management",
      icon: Shield,
      color: "bg-blue-500",
    },
    {
      type: "delivery_agent", 
      title: "Delivery Agent",
      description: "Access to delivery dashboard: view assigned orders, update delivery status",
      icon: Truck,
      color: "bg-green-500",
    },
    {
      type: "customer",
      title: "Customer Portal", 
      description: "Place orders, track deliveries, view order history and manage account",
      icon: User,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Droplets className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">AquaFlow</h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
            Pure Water Delivery Management System
          </p>
          <Badge variant="secondary" className="text-sm">
            Local Development Mode
          </Badge>
        </div>

        {/* Demo Login Options */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Choose Your Role
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Select a role to explore the system with pre-loaded sample data
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {demoUsers.map((user) => {
              const IconComponent = user.icon;
              return (
                <Card key={user.type} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 ${user.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-lg">{user.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {user.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => handleLogin(user.type)}
                      className="w-full"
                      variant={user.type === "admin" ? "default" : "outline"}
                    >
                      Login as {user.title}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Sample Data Info */}
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Droplets className="h-5 w-5 mr-2 text-blue-600" />
                Sample Data Included
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">5</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Users</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">6</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Orders</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">5</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Customers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">4</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Agents</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Setup Instructions */}
          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>For production deployment, replace this with proper authentication.</p>
            <p>Database: SQLite (aquaflow.db) • Sample data already loaded</p>
          </div>
        </div>
      </div>
    </div>
  );
}