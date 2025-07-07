import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'aquaflow.db');
const sqlPath = path.join(process.cwd(), 'migrations.sql');

async function setupDatabase() {
  try {
    console.log("🗄️ Setting up SQLite database...");
    
    // Create database connection
    const db = new Database(dbPath);
    db.pragma('foreign_keys = ON');
    
    // Read and execute SQL file
    console.log("📋 Creating tables from SQL file...");
    const sql = readFileSync(sqlPath, 'utf-8');
    
    // Split SQL into individual statements and execute
    const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (const statement of statements) {
      if (statement.trim()) {
        db.exec(statement.trim() + ';');
      }
    }
    
    console.log("✅ Database setup completed successfully!");
    console.log(`📍 Database location: ${dbPath}`);
    
    db.close();
    
  } catch (error) {
    console.error("❌ Error setting up database:", error);
    throw error;
  }
}

// Run the setup
setupDatabase()
  .then(() => {
    console.log("🎉 Database setup completed! You can now run: tsx seed.ts");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Database setup failed:", error);
    process.exit(1);
  });