import {
  users,
  customers,
  deliveryAgents,
  orders,
  inventory,
  deliveries,
  orderFeedback,
  type User,
  type UpsertUser,
  type Customer,
  type InsertCustomer,
  type DeliveryAgent,
  type InsertDeliveryAgent,
  type Order,
  type InsertOrder,
  type Inventory,
  type InsertInventory,
  type Delivery,
  type InsertDelivery,
  type OrderFeedback,
  type InsertOrderFeedback,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, count, sum, gte, lte, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (IMPORTANT: mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Customer operations
  getCustomers(): Promise<Customer[]>;
  getCustomer(id: number): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: number, customer: Partial<InsertCustomer>): Promise<Customer>;
  
  // Delivery Agent operations
  getDeliveryAgents(): Promise<DeliveryAgent[]>;
  getDeliveryAgent(id: number): Promise<DeliveryAgent | undefined>;
  createDeliveryAgent(agent: InsertDeliveryAgent): Promise<DeliveryAgent>;
  updateDeliveryAgent(id: number, agent: Partial<InsertDeliveryAgent>): Promise<DeliveryAgent>;
  
  // Order operations
  getOrders(): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  getOrdersByCustomer(customerId: number): Promise<Order[]>;
  getOrdersByAgent(agentId: number): Promise<Order[]>;
  getTodaysOrders(): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: number, order: Partial<InsertOrder>): Promise<Order>;
  assignOrderToAgent(orderId: number, agentId: number): Promise<Order>;
  
  // Dashboard analytics
  getDashboardStats(): Promise<{
    todayOrders: number;
    activeCustomers: number;
    totalLitresDelivered: number;
    deliverySuccessRate: number;
  }>;
  
  // Inventory operations
  getInventory(): Promise<Inventory[]>;
  updateInventoryStock(id: number, stock: number): Promise<Inventory>;
}

export class DatabaseStorage implements IStorage {
  // User operations (IMPORTANT: mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Customer operations
  async getCustomers(): Promise<Customer[]> {
    return await db.select().from(customers).orderBy(desc(customers.createdAt));
  }

  async getCustomer(id: number): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.id, id));
    return customer;
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const [newCustomer] = await db.insert(customers).values(customer).returning();
    return newCustomer;
  }

  async updateCustomer(id: number, customer: Partial<InsertCustomer>): Promise<Customer> {
    const [updatedCustomer] = await db
      .update(customers)
      .set(customer)
      .where(eq(customers.id, id))
      .returning();
    return updatedCustomer;
  }

  // Delivery Agent operations
  async getDeliveryAgents(): Promise<DeliveryAgent[]> {
    return await db.select().from(deliveryAgents).where(eq(deliveryAgents.isActive, true));
  }

  async getDeliveryAgent(id: number): Promise<DeliveryAgent | undefined> {
    const [agent] = await db.select().from(deliveryAgents).where(eq(deliveryAgents.id, id));
    return agent;
  }

  async createDeliveryAgent(agent: InsertDeliveryAgent): Promise<DeliveryAgent> {
    const [newAgent] = await db.insert(deliveryAgents).values(agent).returning();
    return newAgent;
  }

  async updateDeliveryAgent(id: number, agent: Partial<InsertDeliveryAgent>): Promise<DeliveryAgent> {
    const [updatedAgent] = await db
      .update(deliveryAgents)
      .set(agent)
      .where(eq(deliveryAgents.id, id))
      .returning();
    return updatedAgent;
  }

  // Order operations
  async getOrders(): Promise<Order[]> {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async getOrdersByCustomer(customerId: number): Promise<Order[]> {
    return await db
      .select()
      .from(orders)
      .where(eq(orders.customerId, customerId))
      .orderBy(desc(orders.createdAt));
  }

  async getOrdersByAgent(agentId: number): Promise<Order[]> {
    return await db
      .select()
      .from(orders)
      .where(eq(orders.deliveryAgentId, agentId))
      .orderBy(desc(orders.createdAt));
  }

  async getTodaysOrders(): Promise<Order[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return await db
      .select()
      .from(orders)
      .where(and(
        gte(orders.createdAt, today),
        lte(orders.createdAt, tomorrow)
      ))
      .orderBy(desc(orders.createdAt));
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    // Generate order number
    const orderCount = await db.select({ count: count() }).from(orders);
    const orderNumber = `WO-${new Date().getFullYear()}-${String(orderCount[0].count + 1).padStart(3, '0')}`;
    
    const [newOrder] = await db
      .insert(orders)
      .values({
        ...order,
        orderNumber,
      })
      .returning();
    return newOrder;
  }

  async updateOrder(id: number, order: Partial<InsertOrder>): Promise<Order> {
    const [updatedOrder] = await db
      .update(orders)
      .set({
        ...order,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }

  async assignOrderToAgent(orderId: number, agentId: number): Promise<Order> {
    const [updatedOrder] = await db
      .update(orders)
      .set({
        deliveryAgentId: agentId,
        status: "assigned",
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId))
      .returning();
    return updatedOrder;
  }

  // Dashboard analytics
  async getDashboardStats(): Promise<{
    todayOrders: number;
    activeCustomers: number;
    totalLitresDelivered: number;
    deliverySuccessRate: number;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Today's orders count
    const [todayOrdersResult] = await db
      .select({ count: count() })
      .from(orders)
      .where(and(
        gte(orders.createdAt, today),
        lte(orders.createdAt, tomorrow)
      ));

    // Active customers count
    const [activeCustomersResult] = await db
      .select({ count: count() })
      .from(customers)
      .where(eq(customers.isActive, true));

    // Total litres delivered this month
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    
    const [totalLitresResult] = await db
      .select({ total: sum(orders.totalLitres) })
      .from(orders)
      .where(and(
        eq(orders.status, "delivered"),
        gte(orders.createdAt, thisMonth)
      ));

    // Delivery success rate (this week)
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);
    
    const [totalOrdersThisWeek] = await db
      .select({ count: count() })
      .from(orders)
      .where(gte(orders.createdAt, thisWeek));

    const [deliveredOrdersThisWeek] = await db
      .select({ count: count() })
      .from(orders)
      .where(and(
        eq(orders.status, "delivered"),
        gte(orders.createdAt, thisWeek)
      ));

    const successRate = totalOrdersThisWeek.count > 0 
      ? (deliveredOrdersThisWeek.count / totalOrdersThisWeek.count) * 100 
      : 0;

    return {
      todayOrders: todayOrdersResult.count,
      activeCustomers: activeCustomersResult.count,
      totalLitresDelivered: Number(totalLitresResult.total) || 0,
      deliverySuccessRate: Math.round(successRate * 10) / 10,
    };
  }

  // Inventory operations
  async getInventory(): Promise<Inventory[]> {
    return await db.select().from(inventory);
  }

  async updateInventoryStock(id: number, stock: number): Promise<Inventory> {
    const [updatedInventory] = await db
      .update(inventory)
      .set({
        currentStock: stock,
        lastRestocked: new Date(),
      })
      .where(eq(inventory.id, id))
      .returning();
    return updatedInventory;
  }
}

export const storage = new DatabaseStorage();
