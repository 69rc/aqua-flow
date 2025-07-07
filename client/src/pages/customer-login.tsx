import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Droplets, LogIn, ArrowLeft, UserPlus } from "lucide-react";
import { Link } from "wouter";

const customerLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type CustomerLoginData = z.infer<typeof customerLoginSchema>;

export default function CustomerLogin() {
  const { toast } = useToast();

  const form = useForm<CustomerLoginData>({
    resolver: zodResolver(customerLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: CustomerLoginData) => {
      return await apiRequest("/api/customers/login", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      window.location.href = "/customer-dashboard";
    },
    onError: (error: Error) => {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CustomerLoginData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Droplets className="h-10 w-10 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AquaFlow</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">Customer Portal Login</p>
        </div>

        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center">
                <LogIn className="mr-2 h-5 w-5" />
                Sign In
              </CardTitle>
              <CardDescription className="text-center">
                Access your account to manage orders and deliveries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="Enter your email" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="Enter your password" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </Form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Don't have an account?
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/customer-register">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create Customer Account
                  </Link>
                </Button>
              </div>

              <div className="mt-4">
                <Button asChild variant="ghost" className="w-full">
                  <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                  </Link>
                </Button>
              </div>

              {/* Demo Login Info */}
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-xs text-blue-600 dark:text-blue-400 text-center mb-2">
                  Demo Account (Development)
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-300 text-center">
                  Email: alice@example.com<br />
                  Password: password123
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}