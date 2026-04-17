# 🎟️ La-Tike Event Ticketing Platform - Setup Guide

Complete setup instructions for the full-stack event ticketing platform.

## 📋 Prerequisites

- **Node.js** 20+ and npm
- **PostgreSQL** 15+
- **Git**
- **Stripe Account** (for payments)
- **Cloudinary Account** (for image uploads)
- **Gmail Account** (for email notifications)

## 🏗️ Project Structure

```
La-Tike/
├── server/          # Express + TypeScript backend API
├── mobile/          # React Native app (Customer + Host)
├── admin/           # Next.js admin dashboard
├── client/          # React web marketing site
├── shared/          # Shared TypeScript types
└── SETUP.md         # This file
```

## 🚀 Quick Start

### 1. Backend Setup (Server)

```bash
cd server

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your credentials
# DATABASE_URL, JWT_SECRET, STRIPE keys, CLOUDINARY keys, etc.

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Start development server
npm run dev
```

Server will run on `http://localhost:5000`
API Docs: `http://localhost:5000/api-docs`

### 2. Shared Types Setup

```bash
cd shared

# Install dependencies
npm install

# Build types
npm run build
```

### 3. Mobile App Setup (Coming Next)

The mobile app will be built with:
- React Native + TypeScript
- Redux Toolkit for state management
- RTK Query for API calls
- React Navigation
- Combined Customer & Host app

### 4. Admin Panel Setup (Coming Next)

The admin panel will be built with:
- Next.js 14+ with App Router
- TypeScript
- TailwindCSS + shadcn/ui
- Server-side rendering

## 🔧 Backend Configuration Details

### Environment Variables

Create `server/.env` with the following:

```env
# Server
NODE_ENV=development
PORT=5000
API_VERSION=v1

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/latike

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_REFRESH_SECRET=your-refresh-secret-min-32-characters
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@latike.com

# Frontend URLs
CLIENT_URL=http://localhost:5173
MOBILE_APP_SCHEME=latike://
ADMIN_URL=http://localhost:3001

# Security
BCRYPT_ROUNDS=10
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# QR Code
QR_SECRET_KEY=your-qr-signing-secret-key-min-32-characters
```

### Database Setup

1. **Install PostgreSQL**:
   ```bash
   # Windows (using Chocolatey)
   choco install postgresql

   # Or download from https://www.postgresql.org/download/
   ```

2. **Create Database**:
   ```sql
   CREATE DATABASE latike;
   CREATE USER latike_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE latike TO latike_user;
   ```

3. **Update DATABASE_URL** in `.env`:
   ```
   DATABASE_URL=postgresql://latike_user:your_password@localhost:5432/latike
   ```

### Stripe Setup

1. Go to [stripe.com](https://stripe.com) and create an account
2. Get your test API keys from Dashboard → Developers → API keys
3. Add keys to `.env`:
   - `STRIPE_SECRET_KEY` (starts with `sk_test_`)
   - `STRIPE_PUBLISHABLE_KEY` (starts with `pk_test_`)

### Cloudinary Setup

1. Go to [cloudinary.com](https://cloudinary.com) and create account
2. Get credentials from Dashboard
3. Add to `.env`:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

### Email Setup (Gmail)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Add to `.env`:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=generated-app-password
   ```

## 📚 API Documentation

Once the server is running, visit:
- **Swagger UI**: `http://localhost:5000/api-docs`
- **Health Check**: `http://localhost:5000/health`

### Key Endpoints

**Authentication**:
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh token
- `GET /api/v1/auth/profile` - Get profile

**Events**:
- `GET /api/v1/events` - List events
- `GET /api/v1/events/:id` - Get event
- `POST /api/v1/events` - Create event (HOST)
- `PUT /api/v1/events/:id` - Update event (HOST)
- `DELETE /api/v1/events/:id` - Delete event (HOST)

**Tickets**:
- `POST /api/v1/tickets/purchase` - Purchase tickets
- `POST /api/v1/tickets/confirm-payment` - Confirm payment
- `POST /api/v1/tickets/scan` - Scan QR code (HOST)
- `GET /api/v1/tickets/my-tickets` - Get user tickets

## 🧪 Testing

### Manual Testing with Swagger

1. Start server: `npm run dev`
2. Open `http://localhost:5000/api-docs`
3. Test endpoints directly from Swagger UI

### Using Postman/Thunder Client

Import the API endpoints and test:

1. **Register a user**:
   ```json
   POST /api/v1/auth/register
   {
     "email": "test@example.com",
     "password": "password123",
     "firstName": "John",
     "lastName": "Doe",
     "role": "HOST"
   }
   ```

2. **Login**:
   ```json
   POST /api/v1/auth/login
   {
     "email": "test@example.com",
     "password": "password123"
   }
   ```

3. **Create Event** (use Bearer token from login):
   ```json
   POST /api/v1/events
   Authorization: Bearer <your-token>
   {
     "title": "Summer Music Festival",
     "description": "Amazing summer event",
     "category": "Music",
     "location": "Central Park",
     "startDate": "2024-07-15T18:00:00Z",
     "endDate": "2024-07-15T23:00:00Z",
     "ticketTypes": [
       {
         "name": "General Admission",
         "price": 50,
         "quantity": 100
       }
     ]
   }
   ```

## 🗄️ Database Schema

The database includes:
- **Users** - Authentication and profiles
- **Events** - Event information
- **TicketTypes** - Different ticket tiers
- **Orders** - Purchase records
- **Tickets** - Individual tickets with QR codes
- **Payments** - Stripe payment records
- **CheckIns** - Ticket scanning logs

View schema: `server/prisma/schema.prisma`

## 🔐 Security Features

- ✅ JWT authentication with refresh tokens
- ✅ Password hashing with bcrypt
- ✅ Rate limiting
- ✅ Helmet.js security headers
- ✅ CORS configuration
- ✅ Input validation with Zod
- ✅ QR code signing/verification
- ✅ Role-based access control

## 📱 Mobile App (Next Steps)

The mobile app will include:
- **Customer Features**: Browse events, purchase tickets, view QR codes
- **Host Features**: Create events, scan tickets, view analytics
- **Shared**: Authentication, profile management

## 🎨 Admin Panel (Next Steps)

The admin dashboard will include:
- User management
- Event moderation
- Payment oversight
- Analytics and reports
- System monitoring

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
# Windows:
services.msc  # Look for postgresql service

# Test connection
psql -U latike_user -d latike
```

### Prisma Issues
```bash
# Reset database (WARNING: Deletes all data)
npm run prisma:migrate reset

# Regenerate client
npm run prisma:generate
```

### Port Already in Use
```bash
# Change PORT in .env
PORT=5001
```

## 📞 Support

For issues or questions:
1. Check the API documentation at `/api-docs`
2. Review error logs in `server/logs/`
3. Check database with Prisma Studio: `npm run prisma:studio`

## 🎯 Next Steps

1. ✅ Backend API - Complete
2. ⏳ Mobile App - Coming next
3. ⏳ Admin Panel - Coming next
4. ⏳ Deployment - Coming next

---

**Happy Coding! 🚀**
