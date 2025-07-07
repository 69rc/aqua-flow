# Windows Local Setup Guide for AquaFlow

## Complete Setup Instructions for Windows

### Prerequisites
1. **Node.js 16+** - Download from [nodejs.org](https://nodejs.org/)
2. **Git** (optional) - Download from [git-scm.com](https://git-scm.com/)

### Step-by-Step Setup

1. **Download or Clone Project**
   ```cmd
   # If using git
   git clone <your-repo-url>
   cd aqua-flow
   
   # Or download ZIP and extract to a folder
   ```

2. **Install Dependencies**
   ```cmd
   npm install
   ```

3. **Environment is Ready**
   The `.env.local` file is already included with these settings:
   ```
   SESSION_SECRET=your-super-secret-key-change-this-in-production
   NODE_ENV=development
   ```

4. **Initialize Database**
   ```cmd
   # Create database tables
   npx tsx setup-db.ts
   
   # Add sample data  
   npx tsx seed.ts
   ```

5. **Start the Application**
   ```cmd
   npm run dev
   ```

6. **Open in Browser**
   Navigate to: `http://localhost:5000`

### What You'll See

After setup, the application includes:

#### Sample Data
- **5 Users**: 1 admin, 2 delivery agents, 2 customers
- **5 Customers**: Complete profiles with addresses and contact info
- **4 Delivery Agents**: Driver profiles with vehicle information
- **6 Inventory Items**: Water products with current stock levels
- **6 Orders**: Sample orders in different states (pending, delivered, etc.)
- **4 Delivery Records**: Complete delivery tracking history
- **2 Customer Reviews**: Feedback with ratings

#### Authentication
- Click "Sign In" to automatically log in as admin user
- Full access to all features in local development mode
- No external authentication required

#### Available Features
1. **Admin Dashboard**
   - Order management and assignment
   - Inventory tracking with low-stock alerts
   - Customer and delivery agent management
   - Analytics with charts and metrics

2. **Delivery Agent Dashboard**
   - View assigned deliveries
   - Update delivery status
   - Mobile-optimized interface

3. **Customer Portal**
   - Place new orders
   - Track order status
   - View order history

### File Structure After Setup
```
aqua-flow/
├── aquaflow.db          # SQLite database (created automatically)
├── .env.local           # Environment configuration (included)
├── client/              # Frontend React application
├── server/              # Backend Express server
├── shared/              # Shared types and schemas
├── setup-db.ts          # Database initialization script
├── seed.ts              # Sample data seeding script
└── package.json         # Dependencies and scripts
```

### Troubleshooting

#### Error: "REPLIT_DOMAINS not provided"
This is fixed! The local authentication system bypasses Replit Auth.

#### Database Issues
```cmd
# Reset database completely
del aquaflow.db
npx tsx setup-db.ts
npx tsx seed.ts
```

#### Port 5000 Already in Use
```cmd
# Kill any process using port 5000
npx kill-port 5000
npm run dev
```

#### Module Not Found Errors
```cmd
# Clean install
rmdir /s node_modules
del package-lock.json
npm install
```

#### Development Commands
```cmd
npm run dev          # Start development server
npx tsx setup-db.ts  # Initialize database
npx tsx seed.ts      # Seed sample data
npm run build        # Build for production
```

### Next Steps

1. **Explore the System**: Login and navigate through different dashboards
2. **Test Features**: Create orders, update inventory, assign deliveries
3. **Customize**: Modify the code to fit your specific needs
4. **Deploy**: For production, replace SQLite with PostgreSQL/MySQL

### Production Considerations

For production deployment:
- Use PostgreSQL or MySQL instead of SQLite
- Implement proper authentication (OAuth, JWT, etc.)
- Set up HTTPS and security headers
- Configure environment variables properly
- Set up logging and monitoring
- Implement database backups

The system is now ready for local development and testing!