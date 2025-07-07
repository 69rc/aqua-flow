import { Link, useLocation } from "wouter";
import { 
  Home, 
  Package, 
  Truck, 
  Users, 
  BarChart3, 
  Package2, 
  Bell, 
  Settings,
  Droplets,
  User
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Order Management", href: "/orders", icon: Package },
  { name: "Delivery Agents", href: "/agents", icon: Truck },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Inventory", href: "/inventory", icon: Package2 },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 bg-white border-r border-gray-200">
          {/* Logo and Brand */}
          <div className="flex items-center h-16 flex-shrink-0 px-4 bg-primary">
            <div className="flex items-center">
              <Droplets className="h-8 w-8 text-white" />
              <span className="ml-2 text-xl font-semibold text-white">AquaFlow</span>
            </div>
          </div>
          
          {/* Navigation Menu */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            {/* User Profile Section */}
            <div className="px-4 py-4 border-b border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>
            </div>
            
            {/* Navigation Links */}
            <nav className="mt-2 flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = location === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors`}
                  >
                    <item.icon
                      className={`${
                        isActive ? "text-primary" : "text-gray-400 group-hover:text-gray-500"
                      } mr-3 h-5 w-5 transition-colors`}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
