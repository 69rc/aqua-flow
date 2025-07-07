import { db } from "./server/db";
import {
  users,
  customers,
  deliveryAgents,
  orders,
  inventory,
  deliveries,
  orderFeedback,
  sessions,
} from "./shared/schema";

async function initDatabase() {
  try {
    console.log("🗄️ Initializing SQLite database...");

    // Create tables by running a simple query on each
    // This will create the tables if they don't exist
    console.log("📋 Creating tables...");
    
    // Insert a test record and delete it to ensure table creation
    await db.insert(users).values({
      id: "test",
      email: "test@test.com",
      role: "customer",
    }).onConflictDoNothing();
    await db.delete(users).where({ id: "test" } as any);

    await db.insert(customers).values({
      name: "test",
      phone: "test",
      address: "test",
    }).onConflictDoNothing();
    await db.delete(customers).where({ name: "test" } as any);

    await db.insert(deliveryAgents).values({
      name: "test",
      phone: "test",
    }).onConflictDoNothing();
    await db.delete(deliveryAgents).where({ name: "test" } as any);

    await db.insert(inventory).values({
      itemName: "test",
    }).onConflictDoNothing();
    await db.delete(inventory).where({ itemName: "test" } as any);

    await db.insert(orders).values({
      orderNumber: "test",
      customerName: "test",
      customerPhone: "test",
      deliveryAddress: "test",
      quantity: 1,
      totalLitres: 1,
    }).onConflictDoNothing();
    await db.delete(orders).where({ orderNumber: "test" } as any);

    console.log("✅ Database initialized successfully!");
    console.log("🎯 You can now run: tsx seed.ts");

  } catch (error) {
    console.error("❌ Error initializing database:", error);
    throw error;
  }
}

// Run the initialization
initDatabase()
  .then(() => {
    console.log("🎉 Database initialization completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Database initialization failed:", error);
    process.exit(1);
  });