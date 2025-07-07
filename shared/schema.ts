import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  decimal,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").notNull().default("customer"), // admin, delivery_agent, customer
  phone: varchar("phone"),
  address: text("address"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  name: varchar("name").notNull(),
  email: varchar("email"),
  phone: varchar("phone").notNull(),
  address: text("address").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const deliveryAgents = pgTable("delivery_agents", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  name: varchar("name").notNull(),
  phone: varchar("phone").notNull(),
  vehicleInfo: text("vehicle_info"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: varchar("order_number").notNull().unique(),
  customerId: integer("customer_id").references(() => customers.id),
  customerName: varchar("customer_name").notNull(),
  customerPhone: varchar("customer_phone").notNull(),
  deliveryAddress: text("delivery_address").notNull(),
  quantity: integer("quantity").notNull(), // number of bags
  totalLitres: integer("total_litres").notNull(),
  status: varchar("status").notNull().default("pending"), // pending, assigned, in_transit, delivered, cancelled
  deliveryAgentId: integer("delivery_agent_id").references(() => deliveryAgents.id),
  preferredDeliveryTime: varchar("preferred_delivery_time"),
  notes: text("notes"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }),
  deliveredAt: timestamp("delivered_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const inventory = pgTable("inventory", {
  id: serial("id").primaryKey(),
  itemName: varchar("item_name").notNull(),
  currentStock: integer("current_stock").notNull().default(0),
  minThreshold: integer("min_threshold").notNull().default(10),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }),
  lastRestocked: timestamp("last_restocked"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const deliveries = pgTable("deliveries", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id),
  deliveryAgentId: integer("delivery_agent_id").references(() => deliveryAgents.id),
  status: varchar("status").notNull().default("assigned"), // assigned, picked_up, in_transit, delivered, failed
  pickupTime: timestamp("pickup_time"),
  deliveryTime: timestamp("delivery_time"),
  notes: text("notes"),
  customerSignature: text("customer_signature"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orderFeedback = pgTable("order_feedback", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id),
  customerId: integer("customer_id").references(() => customers.id),
  rating: integer("rating").notNull(), // 1-5 stars
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
}));

export const customersRelations = relations(customers, ({ one, many }) => ({
  user: one(users, {
    fields: [customers.userId],
    references: [users.id],
  }),
  orders: many(orders),
  feedback: many(orderFeedback),
}));

export const deliveryAgentsRelations = relations(deliveryAgents, ({ one, many }) => ({
  user: one(users, {
    fields: [deliveryAgents.userId],
    references: [users.id],
  }),
  orders: many(orders),
  deliveries: many(deliveries),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id],
  }),
  deliveryAgent: one(deliveryAgents, {
    fields: [orders.deliveryAgentId],
    references: [deliveryAgents.id],
  }),
  deliveries: many(deliveries),
  feedback: many(orderFeedback),
}));

export const deliveriesRelations = relations(deliveries, ({ one }) => ({
  order: one(orders, {
    fields: [deliveries.orderId],
    references: [orders.id],
  }),
  deliveryAgent: one(deliveryAgents, {
    fields: [deliveries.deliveryAgentId],
    references: [deliveryAgents.id],
  }),
}));

export const orderFeedbackRelations = relations(orderFeedback, ({ one }) => ({
  order: one(orders, {
    fields: [orderFeedback.orderId],
    references: [orders.id],
  }),
  customer: one(customers, {
    fields: [orderFeedback.customerId],
    references: [customers.id],
  }),
}));

// Schema types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = typeof customers.$inferInsert;
export type DeliveryAgent = typeof deliveryAgents.$inferSelect;
export type InsertDeliveryAgent = typeof deliveryAgents.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;
export type Inventory = typeof inventory.$inferSelect;
export type InsertInventory = typeof inventory.$inferInsert;
export type Delivery = typeof deliveries.$inferSelect;
export type InsertDelivery = typeof deliveries.$inferInsert;
export type OrderFeedback = typeof orderFeedback.$inferSelect;
export type InsertOrderFeedback = typeof orderFeedback.$inferInsert;

// Zod schemas
export const insertUserSchema = createInsertSchema(users);
export const insertCustomerSchema = createInsertSchema(customers);
export const insertDeliveryAgentSchema = createInsertSchema(deliveryAgents);
export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  orderNumber: true,
  createdAt: true,
  updatedAt: true,
});
export const insertInventorySchema = createInsertSchema(inventory);
export const insertDeliverySchema = createInsertSchema(deliveries);
export const insertOrderFeedbackSchema = createInsertSchema(orderFeedback);
