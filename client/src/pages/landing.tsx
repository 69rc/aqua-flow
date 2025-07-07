import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Droplets, Truck, Users, BarChart3 } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light to-white">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Droplets className="h-12 w-12 text-primary mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">AquaFlow</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Complete Pure Water Delivery & Management System for water companies and their customers
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="text-center">
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Admin Dashboard</CardTitle>
              <CardDescription>
                Comprehensive analytics, order management, and business insights
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Truck className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Delivery Management</CardTitle>
              <CardDescription>
                Efficient route planning and real-time delivery tracking
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Customer Portal</CardTitle>
              <CardDescription>
                Easy ordering, tracking, and feedback system for customers
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Login Section */}
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle>Access Your Dashboard</CardTitle>
            <CardDescription>
              Sign in to manage your water delivery operations
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Button 
              onClick={() => window.location.href = "/api/login"}
              className="w-full"
              size="lg"
            >
              Sign In (Admin/Agent)
            </Button>
            
            <div className="text-sm text-gray-500">or</div>
            
            <div className="space-y-2">
              <Button 
                onClick={() => window.location.href = "/customer-login"}
                variant="outline"
                className="w-full"
                size="lg"
              >
                Customer Login
              </Button>
              <Button 
                onClick={() => window.location.href = "/customer-register"}
                variant="ghost"
                className="w-full"
                size="sm"
              >
                Create Customer Account
              </Button>
            </div>
            
            <p className="text-sm text-gray-500 mt-4">
              Local development mode • Sample data included
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
