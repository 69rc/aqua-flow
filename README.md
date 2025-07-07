# AquaFlow - Pure Water Delivery Management System

A comprehensive water delivery management system with role-based dashboards for admins, delivery agents, and customers.

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment**
   ```bash
   # Environment file is already included (.env.local)
   # No additional setup needed for local development
   ```

3. **Initialize database**
   ```bash
   # Create SQLite database with tables
   tsx setup-db.ts
   
   # Seed with sample data
   tsx seed.ts
   ```

4. **Start the application**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5000
   ```

## 📋 Features

### 🔐 Role-Based Access
- **Admin**: Complete system management
- **Delivery Agent**: Order fulfillment and tracking
- **Customer**: Order placement and tracking

### 🏢 Admin Dashboard
- Order management and assignment
- Inventory tracking with low-stock alerts
- Customer and agent management
- Analytics and performance metrics
- Real-time dashboard overview

### 🚚 Delivery Agent Dashboard
- View assigned deliveries
- Update order status (picked up, in transit, delivered)
- Mobile-optimized interface
- Order details and customer information

### 👤 Customer Portal
- Place water delivery orders
- Track order status in real-time
- View order history
- Account management

### 📊 Analytics & Reporting
- Revenue trends and performance metrics
- Order status distribution
- Delivery success rates
- Customer satisfaction tracking

## 🗄️ Database Schema

The system uses SQLite with these main entities:

- **Users**: Authentication and role management
- **Customers**: Customer profiles and contact information
- **Delivery Agents**: Driver profiles and vehicle details
- **Orders**: Order lifecycle from creation to delivery
- **Inventory**: Stock management with alerts
- **Deliveries**: Delivery tracking and history
- **Feedback**: Customer satisfaction ratings

## 🔧 Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS + shadcn/ui components
- TanStack Query for state management
- Wouter for routing
- React Hook Form + Zod validation

### Backend
- Node.js + Express
- TypeScript
- Drizzle ORM
- SQLite database
- Session-based authentication

## 📁 Project Structure

```
aquaflow/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Route components
│   │   ├── hooks/       # Custom React hooks
│   │   └── lib/         # Utilities and config
├── server/              # Express backend
│   ├── db.ts           # Database connection
│   ├── routes.ts       # API endpoints
│   ├── storage.ts      # Data access layer
│   └── auth.ts         # Authentication logic
├── shared/             # Shared types and schemas
│   └── schema.ts       # Database schema and types
├── seed.ts             # Database seeding script
└── aquaflow.db         # SQLite database (auto-created)
```

## 🎯 Sample Data

The seeded database includes:

- **5 Users** (admin, agents, customers)
- **5 Customers** with complete profiles
- **4 Delivery Agents** with vehicle information
- **6 Inventory Items** (water bags, bottles, equipment)
- **6 Sample Orders** in various states
- **4 Delivery Records** with tracking history
- **2 Customer Reviews** with ratings

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run db:push      # Apply database schema changes
tsx seed.ts          # Seed database with sample data
```

### Adding New Features

1. Update database schema in `shared/schema.ts`
2. Run `npm run db:push` to apply changes
3. Update seed data if needed
4. Implement frontend/backend changes
5. Test with sample data

## 🚀 Production Deployment

For production:

1. Use PostgreSQL or MySQL instead of SQLite
2. Set proper environment variables
3. Enable HTTPS and security headers
4. Configure logging and monitoring
5. Set up database backups

## 🐛 Troubleshooting

### Database Issues
```bash
# Reset database
rm aquaflow.db
npm run db:push
tsx seed.ts
```

### Port Conflicts
```bash
# Kill process on port 5000
npx kill-port 5000
npm run dev
```

### Module Errors
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## 📄 License

This project is built for demonstration and educational purposes.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

---

**Built with ❤️ for efficient water delivery management**