export interface DashboardStats {
  todayOrders: number;
  activeCustomers: number;
  totalLitresDelivered: number;
  deliverySuccessRate: number;
}

export interface OrderWithDetails {
  id: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  quantity: number;
  totalLitres: number;
  status: "pending" | "assigned" | "in_transit" | "delivered" | "cancelled";
  deliveryAgentId?: number;
  agentName?: string;
  preferredDeliveryTime?: string;
  notes?: string;
  totalAmount?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  role: "admin" | "delivery_agent" | "customer";
  phone?: string;
  address?: string;
}

export const ORDER_STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800",
  assigned: "bg-blue-100 text-blue-800",
  in_transit: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export const ORDER_STATUS_LABELS = {
  pending: "Pending",
  assigned: "Assigned",
  in_transit: "In Transit",
  delivered: "Delivered",
  cancelled: "Cancelled",
};
