# AquaFlow - Pure Water Delivery Management System

## Overview

AquaFlow is a comprehensive pure water delivery and management system designed for water companies to efficiently manage their operations. The application serves three distinct user roles: Admins (water company staff), Delivery Agents (drivers), and Customers (water buyers), each with tailored interfaces and functionality.

The system is built as a full-stack web application using modern technologies with a focus on responsive design, real-time updates, and intuitive user experience. **Status: FULLY FUNCTIONAL** - All core features implemented and tested with sample data.

### Completed Features
- **Authentication**: Role-based access with Replit Auth integration
- **Admin Dashboard**: Complete management interface with analytics, order assignment, and oversight
- **Delivery Dashboard**: Mobile-optimized interface for drivers with delivery tracking
- **Customer Portal**: Order placement, tracking, and history viewing
- **Order Management**: Full CRUD operations with status tracking and agent assignment
- **Inventory Management**: Stock tracking, low-stock alerts, and restocking features
- **Customer Management**: Customer database with contact information and order history
- **Agent Management**: Delivery agent profiles and assignment tracking
- **Analytics**: Comprehensive reporting with charts and key performance indicators
- **Database**: Fully populated with sample data for immediate testing

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with CSS variables for theming
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite with custom configuration

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL store

### Project Structure
```
├── client/          # Frontend React application
├── server/          # Backend Express server
├── shared/          # Shared TypeScript schemas and types
├── migrations/      # Database migration files
└── attached_assets/ # Documentation and assets
```

## Key Components

### Authentication System
- **Provider**: Replit Auth with OpenID Connect integration
- **Session Storage**: PostgreSQL-backed sessions with connect-pg-simple
- **Authorization**: Role-based access control (admin, delivery_agent, customer)
- **Security**: HTTP-only cookies, CSRF protection, secure session handling

### Database Schema
- **Users**: Core user management with role-based permissions
- **Customers**: Customer profile and contact information
- **Delivery Agents**: Driver profiles and assignment tracking
- **Orders**: Order management with status tracking and relationships
- **Inventory**: Stock management for water products
- **Deliveries**: Delivery tracking and completion records
- **Order Feedback**: Customer feedback and rating system

### User Interfaces
- **Admin Dashboard**: Comprehensive management interface with sidebar navigation
- **Delivery Dashboard**: Mobile-optimized interface for drivers
- **Customer Portal**: Simple ordering and tracking interface
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints

### API Architecture
- **RESTful Design**: Structured endpoints following REST conventions
- **Type Safety**: Shared schemas between frontend and backend
- **Error Handling**: Consistent error responses and client-side handling
- **Data Validation**: Zod schemas for request/response validation

## Data Flow

### Order Management Flow
1. **Customer Places Order**: Via customer dashboard or mobile interface
2. **Admin Reviews**: Orders appear in admin dashboard for processing
3. **Agent Assignment**: Admin assigns orders to delivery agents
4. **Delivery Tracking**: Real-time status updates throughout delivery process
5. **Completion**: Delivery confirmation and customer feedback collection

### Authentication Flow
1. **Login Request**: User initiates login via Replit Auth
2. **OpenID Connect**: Authentication handled by Replit's OIDC provider
3. **Session Creation**: Server creates secure session with role information
4. **Route Protection**: Client-side route guards based on user role
5. **API Authorization**: Server validates sessions for API access

### Real-time Updates
- **Query Invalidation**: TanStack Query handles data freshness
- **Optimistic Updates**: Immediate UI feedback for user actions
- **Error Recovery**: Automatic retry and fallback mechanisms

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/react-***: Headless UI components
- **react-hook-form**: Form state management
- **zod**: Runtime type validation

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Static type checking
- **Tailwind CSS**: Utility-first styling
- **drizzle-kit**: Database schema management

### Authentication
- **openid-client**: OpenID Connect implementation
- **passport**: Authentication middleware
- **express-session**: Session management
- **connect-pg-simple**: PostgreSQL session store

## Deployment Strategy

### Build Process
- **Client Build**: Vite bundles React application for production
- **Server Build**: esbuild creates optimized Node.js bundle
- **Type Checking**: TypeScript compilation verification
- **Asset Optimization**: Automatic code splitting and minification

### Environment Configuration
- **Database**: PostgreSQL connection via DATABASE_URL
- **Authentication**: Replit Auth configuration
- **Sessions**: Secure session secret management
- **CORS**: Configured for Replit environment

### Database Management
- **Migrations**: Drizzle Kit handles schema migrations
- **Schema Push**: Direct schema updates for development
- **Connection Pooling**: Neon serverless with WebSocket support

## Changelog

```
Changelog:
- July 07, 2025. Initial setup
- July 07, 2025. Complete water delivery management system implemented:
  * Full authentication system with Replit Auth
  * Database schema with all necessary tables (users, customers, agents, orders, inventory)
  * Admin dashboard with overview cards and management features
  * Delivery agent dashboard for managing assigned deliveries
  * Customer portal for placing and tracking orders
  * Order management with assignment functionality
  * Inventory management with stock tracking and alerts
  * Customer and agent management with CRUD operations
  * Analytics dashboard with charts and performance metrics
  * Sample data populated for testing
  * All LSP errors resolved and functionality working
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```