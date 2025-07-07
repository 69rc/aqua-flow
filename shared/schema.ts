import {
  sqliteTable,
  text,
  integer,
  real,
  index,
} from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = sqliteTable(
  "sessions",
  {
    sid: text("sid").primaryKey(),
    sess: text("sess", { mode: "json" }).notNull(),
    expire: integer("expire", { mode: "timestamp" }).notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = sqliteTable("users", {
  id: text("id").primaryKey().notNull(),
  email: text("email"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  role: text("role", { enum: ["admin", "delivery_agent", "customer"] }).notNull().default("customer"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const customers = sqliteTable("customers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").references(() => users.id),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const deliveryAgents = sqliteTable("delivery_agents", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").references(() => users.id),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  vehicleInfo: text("vehicle_info"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const orders = sqliteTable("orders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orderNumber: text("order_number").notNull(),
  customerId: integer("customer_id").references(() => customers.id),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  deliveryAddress: text("delivery_address").notNull(),
  quantity: integer("quantity").notNull(),
  totalLitres: integer("total_litres").notNull(),
  status: text("status", { 
    enum: ["pending", "assigned", "in_transit", "delivered", "cancelled"] 
  }).notNull().default("pending"),
  deliveryAgentId: integer("delivery_agent_id").references(() => deliveryAgents.id),
  preferredDeliveryTime: text("preferred_delivery_time"),
  notes: text("notes"),
  totalAmount: text("total_amount"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  deliveredAt: integer("delivered_at", { mode: "timestamp" }),
});

export const inventory = sqliteTable("inventory", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  itemName: text("item_name").notNull(),
  currentStock: integer("current_stock").notNull().default(0),
  minThreshold: integer("min_threshold").notNull().default(10),
  unitPrice: text("unit_price"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const deliveries = sqliteTable("deliveries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orderId: integer("order_id").notNull().references(() => orders.id),
  deliveryAgentId: integer("delivery_agent_id").notNull().references(() => deliveryAgents.id),
  status: text("status", { 
    enum: ["assigned", "picked_up", "in_transit", "delivered", "failed"] 
  }).notNull().default("assigned"),
  pickupTime: integer("pickup_time", { mode: "timestamp" }),
  deliveryTime: integer("delivery_time", { mode: "timestamp" }),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const orderFeedback = sqliteTable("order_feedback", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orderId: integer("order_id").notNull().references(() => orders.id),
  customerId: integer("customer_id").notNull().references(() => customers.id),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  customers: many(customers),
  deliveryAgents: many(deliveryAgents),
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

// Types
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
  deliveredAt: true,
});
export const insertInventorySchema = createInsertSchema(inventory);
export const insertDeliverySchema = createInsertSchema(deliveries);
export const insertOrderFeedbackSchema = createInsertSchema(orderFeedback);