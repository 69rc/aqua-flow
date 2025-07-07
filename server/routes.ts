import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./localAuth";
import { insertOrderSchema, insertCustomerSchema, insertDeliveryAgentSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard routes
  app.get('/api/dashboard/stats', isAuthenticated, async (req: any, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Order routes
  app.get('/api/orders', isAuthenticated, async (req: any, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get('/api/orders/today', isAuthenticated, async (req: any, res) => {
    try {
      const orders = await storage.getTodaysOrders();
      res.json(orders);
    } catch (error) {
      console.error("Error fetching today's orders:", error);
      res.status(500).json({ message: "Failed to fetch today's orders" });
    }
  });

  app.get('/api/orders/customer/:customerId', isAuthenticated, async (req: any, res) => {
    try {
      const customerId = parseInt(req.params.customerId);
      const orders = await storage.getOrdersByCustomer(customerId);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching customer orders:", error);
      res.status(500).json({ message: "Failed to fetch customer orders" });
    }
  });

  app.get('/api/orders/agent/:agentId', isAuthenticated, async (req: any, res) => {
    try {
      const agentId = parseInt(req.params.agentId);
      const orders = await storage.getOrdersByAgent(agentId);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching agent orders:", error);
      res.status(500).json({ message: "Failed to fetch agent orders" });
    }
  });

  app.post('/api/orders', isAuthenticated, async (req: any, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid order data", errors: error.errors });
      } else {
        console.error("Error creating order:", error);
        res.status(500).json({ message: "Failed to create order" });
      }
    }
  });

  app.patch('/api/orders/:id', isAuthenticated, async (req: any, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const updateData = req.body;
      const order = await storage.updateOrder(orderId, updateData);
      res.json(order);
    } catch (error) {
      console.error("Error updating order:", error);
      res.status(500).json({ message: "Failed to update order" });
    }
  });

  app.patch('/api/orders/:id/assign/:agentId', isAuthenticated, async (req: any, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const agentId = parseInt(req.params.agentId);
      const order = await storage.assignOrderToAgent(orderId, agentId);
      res.json(order);
    } catch (error) {
      console.error("Error assigning order:", error);
      res.status(500).json({ message: "Failed to assign order" });
    }
  });

  // Customer authentication routes
  app.post('/api/customers/register', async (req, res) => {
    try {
      const { name, email, phone, address, password } = req.body;
      
      // Check if customer already exists
      const existingCustomers = await storage.getCustomers();
      const existingCustomer = existingCustomers.find(c => c.email === email);
      if (existingCustomer) {
        return res.status(400).json({ message: "Customer with this email already exists" });
      }

      // Create user and customer records
      const userId = `customer-${Date.now()}`;
      await storage.upsertUser({
        id: userId,
        email,
        firstName: name.split(' ')[0],
        lastName: name.split(' ').slice(1).join(' '),
        role: 'customer',
      });

      const customer = await storage.createCustomer({
        userId,
        name,
        email,
        phone,
        address,
        password, // In production, hash this password
        isActive: true,
      });

      res.status(201).json({ message: "Customer registered successfully", customer });
    } catch (error) {
      console.error("Error registering customer:", error);
      res.status(500).json({ message: "Failed to register customer" });
    }
  });

  app.post('/api/customers/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const customers = await storage.getCustomers();
      const customer = customers.find(c => c.email === email);
      if (!customer || (customer as any).password !== password) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Set session
      (req.session as any).user = {
        id: customer.userId,
        email: customer.email,
        role: 'customer',
        firstName: customer.name.split(' ')[0],
        lastName: customer.name.split(' ').slice(1).join(' '),
      };

      res.json({ message: "Login successful", customer });
    } catch (error) {
      console.error("Error logging in customer:", error);
      res.status(500).json({ message: "Failed to login" });
    }
  });

  // Customer routes
  app.get('/api/customers', isAuthenticated, async (req: any, res) => {
    try {
      const customers = await storage.getCustomers();
      res.json(customers);
    } catch (error) {
      console.error("Error fetching customers:", error);
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  });

  app.post('/api/customers', isAuthenticated, async (req: any, res) => {
    try {
      const customerData = insertCustomerSchema.parse(req.body);
      const customer = await storage.createCustomer(customerData);
      res.status(201).json(customer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid customer data", errors: error.errors });
      } else {
        console.error("Error creating customer:", error);
        res.status(500).json({ message: "Failed to create customer" });
      }
    }
  });

  // Delivery Agent routes
  app.get('/api/delivery-agents', isAuthenticated, async (req: any, res) => {
    try {
      const agents = await storage.getDeliveryAgents();
      res.json(agents);
    } catch (error) {
      console.error("Error fetching delivery agents:", error);
      res.status(500).json({ message: "Failed to fetch delivery agents" });
    }
  });

  app.post('/api/delivery-agents', isAuthenticated, async (req: any, res) => {
    try {
      const agentData = insertDeliveryAgentSchema.parse(req.body);
      const agent = await storage.createDeliveryAgent(agentData);
      res.status(201).json(agent);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid agent data", errors: error.errors });
      } else {
        console.error("Error creating delivery agent:", error);
        res.status(500).json({ message: "Failed to create delivery agent" });
      }
    }
  });

  // Inventory routes
  app.get('/api/inventory', isAuthenticated, async (req: any, res) => {
    try {
      const inventory = await storage.getInventory();
      res.json(inventory);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      res.status(500).json({ message: "Failed to fetch inventory" });
    }
  });

  app.patch('/api/inventory/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const { stock } = req.body;
      const inventory = await storage.updateInventoryStock(id, stock);
      res.json(inventory);
    } catch (error) {
      console.error("Error updating inventory:", error);
      res.status(500).json({ message: "Failed to update inventory" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
