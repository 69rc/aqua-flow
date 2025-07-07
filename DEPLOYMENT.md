# Local Deployment Guide for AquaFlow

## Quick Setup Commands

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
echo "SESSION_SECRET=your-super-secret-key-change-this-in-production" > .env.local
echo "NODE_ENV=development" >> .env.local

# 3. Setup database and seed data
tsx setup-db.ts
tsx seed.ts

# 4. Start the application
npm run dev

# 5. Open in browser
# http://localhost:5000
```

## What's Included

After running these commands, you'll have:

### Database (aquaflow.db)
- **5 Users**: Admin, delivery agents, and customers
- **5 Customers**: Complete profiles with addresses
- **4 Delivery Agents**: Driver profiles with vehicle info
- **6 Inventory Items**: Water products with stock levels
- **6 Orders**: Sample orders in different states
- **4 Delivery Records**: Tracking history
- **2 Customer Reviews**: Feedback with ratings

### Features Working
- **Authentication**: Role-based login system
- **Admin Dashboard**: Full management interface
- **Agent Dashboard**: Delivery tracking and updates
- **Customer Portal**: Order placement and tracking
- **Inventory Management**: Stock tracking with alerts
- **Analytics**: Charts and performance metrics

## Files Created
- `aquaflow.db` - SQLite database with all data
- `.env.local` - Environment configuration
- All necessary tables and relationships

## Troubleshooting

### Database Issues
```bash
rm aquaflow.db
tsx setup-db.ts
tsx seed.ts
```

### Port Conflicts
```bash
npx kill-port5100
npm run dev
```

### Module Errors
```bash
rm -rf node_modules package-lock.json
npm install
```

The system is ready for local development and testing!