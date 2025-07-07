# AquaFlow - Local Setup Guide

This guide will help you run the AquaFlow water delivery management system locally on your computer using SQLite database.

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

## Installation Steps

1. **Clone or Download the Project**
   ```bash
   # If you have git
   git clone <your-repo-url>
   cd aquaflow

   # Or download and extract the ZIP file
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   SESSION_SECRET=your-super-secret-session-key-change-this-in-production
   NODE_ENV=development
   ```

4. **Database Setup**
   The app will automatically create a SQLite database file (`aquaflow.db`) in the project root.
   
   Initialize the database schema:
   ```bash
   # This creates the database tables
   npm run db:push
   ```

   Seed the database with sample data:
   ```bash
   # This adds sample customers, agents, orders, etc.
   npm run db:seed
   ```

5. **Start the Application**
   ```bash
   npm run dev
   ```

6. **Access the Application**
   Open your browser and go to: `http://localhost:5000`

## Sample Login Credentials

The seeded database includes these test users:

### Admin User
- **Role**: Admin (Full access to all features)
- **Login**: Use any admin account through the login system

### Delivery Agent
- **Role**: Delivery Agent (Access to delivery dashboard)
- **Login**: Use any delivery agent account

### Customer
- **Role**: Customer (Access to customer portal)
- **Login**: Use any customer account

## Features Available

### Admin Dashboard
- Order management and assignment
- Inventory tracking and stock management
- Customer and delivery agent management
- Analytics and reporting
- Complete system oversight

### Delivery Agent Dashboard
- View assigned orders
- Update delivery status
- Mobile-optimized interface
- Real-time order tracking

### Customer Portal
- Place new water orders
- Track existing orders
- View order history
- Account management

## Database Location

The SQLite database file (`aquaflow.db`) will be created in your project root directory. This file contains all your data and can be backed up or moved as needed.

## Sample Data

The system comes pre-loaded with:
- 5 users (admin, agents, customers)
- 5 customers with full contact information
- 4 delivery agents with vehicle details
- 6 inventory items with stock levels
- 6 sample orders in various states
- 4 delivery records
- 2 customer feedback entries

## Troubleshooting

### Database Issues
If you encounter database errors:
```bash
# Delete the database file and recreate
rm aquaflow.db
npm run db:push
npm run db:seed
```

### Port Already in Use
If port 5000 is busy:
```bash
# Kill the process using port 5000
npx kill-port 5000
npm run dev
```

### Missing Dependencies
If you get module not found errors:
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## Development

### Adding New Features
1. Update database schema in `shared/schema.ts`
2. Run `npm run db:push` to apply changes
3. Update the seed file if needed
4. Restart the development server

### Folder Structure
```
aquaflow/
├── client/          # Frontend React application
├── server/          # Backend Express server
├── shared/          # Shared TypeScript types and schemas
├── aquaflow.db      # SQLite database (created automatically)
├── seed.ts          # Database seeding script
└── package.json     # Dependencies and scripts
```

## Production Deployment

For production deployment:
1. Set proper environment variables
2. Use a production-ready database (PostgreSQL recommended)
3. Enable HTTPS
4. Set up proper logging and monitoring
5. Configure backup strategies

## Support

If you encounter any issues:
1. Check the console for error messages
2. Verify all dependencies are installed
3. Ensure Node.js version is compatible
4. Check that no other services are using port 5000

The application is designed to work out of the box with minimal setup required!