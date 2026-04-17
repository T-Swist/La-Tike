# 🎟️ La-Tike Event Ticketing Platform

A modern, full-stack event ticketing platform with mobile apps, admin dashboard, and backend API.

## 🌟 Overview

**La-Tike** (La Tike) is a comprehensive event ticketing solution that enables:
- 🎫 Seamless event discovery and ticket purchasing
- 📱 Mobile-first experience for customers and hosts
- 🔐 Secure QR-based ticket validation
- 💳 Integrated Stripe payments
- 📊 Real-time analytics for event hosts
- 🛡️ Admin control panel for platform management

## 🏗️ Architecture

### Monorepo Structure

```
La-Tike/
├── server/          # Express + TypeScript + Prisma backend
├── mobile/          # React Native app (Customer & Host)
├── admin/           # Next.js admin dashboard
├── client/          # React web marketing site
├── shared/          # Shared TypeScript types
└── docs/            # Documentation
```

### Tech Stack

**Backend (Server)**:
- Node.js + TypeScript + Express
- PostgreSQL + Prisma ORM
- JWT Authentication
- Stripe Payments
- Cloudinary Image Storage
- Swagger/OpenAPI Documentation

**Mobile App** (Coming Soon):
- React Native + TypeScript
- Redux Toolkit + RTK Query
- React Navigation
- Combined Customer & Host features

**Admin Panel** (Coming Soon):
- Next.js 14+ with App Router
- TypeScript + TailwindCSS
- shadcn/ui components

**Shared**:
- TypeScript types and constants
- Shared across all projects

## 🚀 Quick Start

See [SETUP.md](./SETUP.md) for detailed setup instructions.

### Backend Setup

```bash
cd server
npm install
cp .env.example .env
# Configure .env with your credentials
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

Server runs on `http://localhost:5000`  
API Docs: `http://localhost:5000/api-docs`

## ✨ Features

### Customer Features
- Browse and search events
- Filter by category, date, location
- Purchase tickets with Stripe
- Receive QR code tickets via email
- View ticket history
- Mobile ticket wallet

### Host Features
- Create and manage events
- Configure multiple ticket types
- Upload event images (Cloudinary)
- Scan QR codes for check-in
- View real-time sales analytics
- Track attendee data

### Admin Features
- User management
- Event moderation and approval
- Payment oversight
- Platform analytics
- Dispute resolution

## 🔐 Security

- JWT authentication with refresh tokens
- Bcrypt password hashing
- Rate limiting
- CORS protection
- Helmet.js security headers
- QR code signing and verification
- Role-based access control (CUSTOMER, HOST, ADMIN)

## 📊 Database Schema

- **Users** - Authentication and profiles
- **Events** - Event details and metadata
- **TicketTypes** - Pricing tiers per event
- **Orders** - Purchase records
- **Tickets** - Individual tickets with QR codes
- **Payments** - Stripe payment tracking
- **CheckIns** - Ticket validation logs

## 🎯 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh access token
- `GET /api/v1/auth/profile` - Get user profile

### Events
- `GET /api/v1/events` - List all events
- `GET /api/v1/events/:id` - Get event details
- `POST /api/v1/events` - Create event (HOST)
- `PUT /api/v1/events/:id` - Update event (HOST)
- `DELETE /api/v1/events/:id` - Delete event (HOST)

### Tickets
- `POST /api/v1/tickets/purchase` - Purchase tickets
- `POST /api/v1/tickets/confirm-payment` - Confirm payment
- `POST /api/v1/tickets/scan` - Scan QR code (HOST)
- `GET /api/v1/tickets/my-tickets` - Get user tickets

Full API documentation available at `/api-docs` when server is running.

## 📱 Mobile App (In Development)

The React Native mobile app will serve both customers and hosts:
- Unified authentication
- Role-based UI (Customer vs Host views)
- Redux Toolkit for state management
- RTK Query for API integration
- QR code scanning capability

## 🎨 Admin Dashboard (In Development)

Next.js admin panel with:
- Server-side rendering
- Real-time analytics
- User and event management
- Payment monitoring
- System health dashboard

## 🔄 Development Workflow

1. **Backend Development**: `cd server && npm run dev`
2. **Mobile Development**: `cd mobile && npm start` (coming soon)
3. **Admin Development**: `cd admin && npm run dev` (coming soon)
4. **Web Client**: `cd client && npm run dev`

## 📦 Deployment

### Backend
- Docker containerization
- AWS/DigitalOcean deployment
- PostgreSQL managed database
- Environment-based configuration

### Mobile
- iOS App Store
- Google Play Store
- Over-the-air updates

### Admin & Web
- Vercel/Netlify deployment
- CDN integration
- SSL/HTTPS enabled

## 🧪 Testing

```bash
# Backend tests
cd server
npm test

# Mobile tests
cd mobile
npm test

# Admin tests
cd admin
npm test
```

## 📄 License

ISC

## 🤝 Contributing

This is a private project. For questions or issues, contact the development team.

## 📞 Support

- API Documentation: `http://localhost:5000/api-docs`
- Setup Guide: [SETUP.md](./SETUP.md)
- Database Studio: `npm run prisma:studio` (in server directory)

---

**Built with ❤️ for seamless event experiences**
