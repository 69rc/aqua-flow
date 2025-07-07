import { Card, CardContent } from "@/components/ui/card";
import { Package, Users, Droplets, Truck } from "lucide-react";
import type { DashboardStats } from "@/types";

interface OverviewCardsProps {
  stats?: DashboardStats;
  isLoading: boolean;
}

export default function OverviewCards({ stats, isLoading }: OverviewCardsProps) {
  const cards = [
    {
      title: "Total Orders Today",
      value: stats?.todayOrders || 0,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      change: "+12%",
      changeText: "vs yesterday",
    },
    {
      title: "Active Customers",
      value: stats?.activeCustomers || 0,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100",
      change: "+8",
      changeText: "new this week",
    },
    {
      title: "Litres Delivered",
      value: `${stats?.totalLitresDelivered || 0}L`,
      icon: Droplets,
      color: "text-primary",
      bgColor: "bg-primary/10",
      change: "This month",
      changeText: "",
    },
    {
      title: "Delivery Success",
      value: `${stats?.deliverySuccessRate || 0}%`,
      icon: Truck,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      change: "+2.1%",
      changeText: "this week",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gray-200 rounded-md"></div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      {cards.map((card, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 ${card.bgColor} rounded-md flex items-center justify-center`}>
                  <card.icon className={`w-5 h-5 ${card.color}`} />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">{card.title}</dt>
                  <dd className="text-lg font-medium text-gray-900">{card.value}</dd>
                </dl>
              </div>
            </div>
          </CardContent>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              {card.change && (
                <span className="font-medium text-green-600">{card.change}</span>
              )}
              {card.changeText && (
                <span className="text-gray-500"> {card.changeText}</span>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
