import { db } from "./server/db";
import {
  users,
  customers,
  deliveryAgents,
  orders,
  inventory,
  deliveries,
  orderFeedback,
} from "./shared/schema";

async function seed() {
  try {
    console.log("🌱 Starting database seeding...");

    // Clear existing data (skip if tables are empty)
    console.log("🧹 Clearing existing data...");
    try {
      await db.delete(orderFeedback);
      await db.delete(deliveries);
      await db.delete(orders);
      await db.delete(inventory);
      await db.delete(deliveryAgents);
      await db.delete(customers);
      await db.delete(users);
    } catch (error) {
      console.log("ℹ️ Tables are empty or don't exist yet, continuing...");
    }

    // Insert users
    console.log("👥 Seeding users...");
    const adminUser = await db.insert(users).values({
      id: "admin-001",
      email: "admin@aquaflow.com",
      firstName: "John",
      lastName: "Admin",
      role: "admin",
    }).returning();

    const agentUser1 = await db.insert(users).values({
      id: "agent-001",
      email: "agent1@aquaflow.com",
      firstName: "Mike",
      lastName: "Driver",
      role: "delivery_agent",
    }).returning();

    const agentUser2 = await db.insert(users).values({
      id: "agent-002",
      email: "agent2@aquaflow.com",
      firstName: "Sarah",
      lastName: "Wheeler",
      role: "delivery_agent",
    }).returning();

    const customerUser1 = await db.insert(users).values({
      id: "customer-001",
      email: "customer1@example.com",
      firstName: "Alice",
      lastName: "Johnson",
      role: "customer",
    }).returning();

    const customerUser2 = await db.insert(users).values({
      id: "customer-002",
      email: "customer2@example.com",
      firstName: "Bob",
      lastName: "Smith",
      role: "customer",
    }).returning();

    // Insert customers
    console.log("🏠 Seeding customers...");
    const customerRecords = await db.insert(customers).values([
      {
        userId: customerUser1[0].id,
        name: "Alice Johnson",
        email: "alice@example.com",
        phone: "+1234567890",
        address: "123 Main Street, Downtown City",
        password: "password123",
        isActive: true,
      },
      {
        userId: customerUser2[0].id,
        name: "Bob Smith",
        email: "bob@example.com",
        phone: "+1234567891",
        address: "456 Oak Avenue, Westside",
        password: "password123",
        isActive: true,
      },
      {
        name: "Carol Davis",
        email: "carol@example.com",
        phone: "+1234567892",
        address: "789 Pine Road, Northtown",
        password: "password123",
        isActive: true,
      },
      {
        name: "David Wilson",
        email: "david@example.com",
        phone: "+1234567893",
        address: "321 Elm Street, Southside",
        password: "password123",
        isActive: true,
      },
      {
        name: "Emma Brown",
        email: "emma@example.com",
        phone: "+1234567894",
        address: "654 Maple Drive, East Village",
        password: "password123",
        isActive: true,
      },
    ]).returning();

    // Insert delivery agents
    console.log("🚚 Seeding delivery agents...");
    const agentRecords = await db.insert(deliveryAgents).values([
      {
        userId: agentUser1[0].id,
        name: "Mike Driver",
        phone: "+1555000001",
        vehicleInfo: "Toyota Hilux - ABC123",
        isActive: true,
      },
      {
        userId: agentUser2[0].id,
        name: "Sarah Wheeler",
        phone: "+1555000002",
        vehicleInfo: "Honda CRV - XYZ789",
        isActive: true,
      },
      {
        name: "Carlos Rodriguez",
        phone: "+1555000003",
        vehicleInfo: "Ford Transit - DEF456",
        isActive: true,
      },
      {
        name: "Lisa Chen",
        phone: "+1555000004",
        vehicleInfo: "Nissan Pickup - GHI789",
        isActive: false,
      },
    ]).returning();

    // Insert inventory
    console.log("📦 Seeding inventory...");
    await db.insert(inventory).values([
      {
        itemName: "20L Water Bags",
        currentStock: 150,
        minThreshold: 50,
        unitPrice: "5.00",
      },
      {
        itemName: "10L Water Bottles",
        currentStock: 80,
        minThreshold: 30,
        unitPrice: "3.50",
      },
      {
        itemName: "5L Water Bottles",
        currentStock: 120,
        minThreshold: 40,
        unitPrice: "2.00",
      },
      {
        itemName: "Delivery Bags",
        currentStock: 25,
        minThreshold: 10,
        unitPrice: "15.00",
      },
      {
        itemName: "Bottle Caps",
        currentStock: 500,
        minThreshold: 100,
        unitPrice: "0.10",
      },
      {
        itemName: "Water Pumps",
        currentStock: 15,
        minThreshold: 5,
        unitPrice: "25.00",
      },
    ]);

    // Insert orders
    console.log("📋 Seeding orders...");
    const orderRecords = await db.insert(orders).values([
      {
        orderNumber: "WO-2025-001",
        customerId: customerRecords[0].id,
        customerName: "Alice Johnson",
        customerPhone: "+1234567890",
        deliveryAddress: "123 Main Street, Downtown City",
        quantity: 3,
        totalLitres: 60,
        status: "delivered",
        deliveryAgentId: agentRecords[0].id,
        preferredDeliveryTime: "Morning (9AM - 12PM)",
        notes: "Please call before delivery",
        totalAmount: "15.00",
        deliveredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
      {
        orderNumber: "WO-2025-002",
        customerId: customerRecords[1].id,
        customerName: "Bob Smith",
        customerPhone: "+1234567891",
        deliveryAddress: "456 Oak Avenue, Westside",
        quantity: 5,
        totalLitres: 100,
        status: "in_transit",
        deliveryAgentId: agentRecords[1].id,
        preferredDeliveryTime: "Afternoon (12PM - 6PM)",
        totalAmount: "25.00",
      },
      {
        orderNumber: "WO-2025-003",
        customerId: customerRecords[2].id,
        customerName: "Carol Davis",
        customerPhone: "+1234567892",
        deliveryAddress: "789 Pine Road, Northtown",
        quantity: 2,
        totalLitres: 40,
        status: "assigned",
        deliveryAgentId: agentRecords[0].id,
        preferredDeliveryTime: "Evening (6PM - 9PM)",
        notes: "Gate code: 1234",
        totalAmount: "10.00",
      },
      {
        orderNumber: "WO-2025-004",
        customerId: customerRecords[3].id,
        customerName: "David Wilson",
        customerPhone: "+1234567893",
        deliveryAddress: "321 Elm Street, Southside",
        quantity: 4,
        totalLitres: 80,
        status: "pending",
        preferredDeliveryTime: "Morning (9AM - 12PM)",
        totalAmount: "20.00",
      },
      {
        orderNumber: "WO-2025-005",
        customerId: customerRecords[4].id,
        customerName: "Emma Brown",
        customerPhone: "+1234567894",
        deliveryAddress: "654 Maple Drive, East Village",
        quantity: 6,
        totalLitres: 120,
        status: "delivered",
        deliveryAgentId: agentRecords[1].id,
        preferredDeliveryTime: "Afternoon (12PM - 6PM)",
        notes: "Leave at front door if no answer",
        totalAmount: "30.00",
        deliveredAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        orderNumber: "WO-2025-006",
        customerId: customerRecords[0].id,
        customerName: "Alice Johnson",
        customerPhone: "+1234567890",
        deliveryAddress: "123 Main Street, Downtown City",
        quantity: 2,
        totalLitres: 40,
        status: "pending",
        preferredDeliveryTime: "Morning (9AM - 12PM)",
        totalAmount: "10.00",
      },
    ]).returning();

    // Insert deliveries
    console.log("🚛 Seeding deliveries...");
    await db.insert(deliveries).values([
      {
        orderId: orderRecords[0].id,
        deliveryAgentId: agentRecords[0].id,
        status: "delivered",
        pickupTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
        deliveryTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
        notes: "Delivery completed successfully",
      },
      {
        orderId: orderRecords[1].id,
        deliveryAgentId: agentRecords[1].id,
        status: "in_transit",
        pickupTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
        notes: "En route to customer",
      },
      {
        orderId: orderRecords[2].id,
        deliveryAgentId: agentRecords[0].id,
        status: "assigned",
        notes: "Ready for pickup",
      },
      {
        orderId: orderRecords[4].id,
        deliveryAgentId: agentRecords[1].id,
        status: "delivered",
        pickupTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000),
        deliveryTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
        notes: "Left at front door as requested",
      },
    ]);

    // Insert order feedback
    console.log("⭐ Seeding feedback...");
    await db.insert(orderFeedback).values([
      {
        orderId: orderRecords[0].id,
        customerId: customerRecords[0].id,
        rating: 5,
        comment: "Excellent service! Water was delivered on time and the driver was very professional.",
      },
      {
        orderId: orderRecords[4].id,
        customerId: customerRecords[4].id,
        rating: 4,
        comment: "Good service, but delivery was a bit delayed. Overall satisfied.",
      },
    ]);

    console.log("✅ Database seeding completed successfully!");
    console.log(`
📊 Seeded data summary:
- ${adminUser.length + agentUser1.length + agentUser2.length + customerUser1.length + customerUser2.length} users
- ${customerRecords.length} customers
- ${agentRecords.length} delivery agents
- 6 inventory items
- ${orderRecords.length} orders
- 4 deliveries
- 2 feedback entries
    `);

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run the seed function
seed()
  .then(() => {
    console.log("🎉 Seeding process completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Seeding failed:", error);
    process.exit(1);
  });

export { seed };