# La-Tike — Consolidated Documentation

This file combines all Markdown documentation in the repository **except** `README.md`.

## Table of Contents

- [SETUP.md](#setupmd)
- [QUICKSTART.md](#quickstartmd)
- [IMPLEMENTATION_SUMMARY.md (Root)](#implementation_summarymd-root)
- [DOCKER_SETUP.md](#docker_setupmd)
- [QUICKSTART_DOCKER.md](#quickstart_dockermd)
- [mobile/BACKEND_INTEGRATION.md](#mobilebackend_integrationmd)
- [mobile/IMPLEMENTATION_SUMMARY.md](#mobileimplementation_summarymd)

---

## SETUP.md

<a id="setupmd"></a>

```markdown
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
- QR code scanner
- Stripe payment integration

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
```

---

## QUICKSTART.md

<a id="quickstartmd"></a>

```markdown
# ⚡ Quick Start Guide - La-Tike Backend

Get the backend API running in 5 minutes!

## Prerequisites

- Node.js 20+
- PostgreSQL 15+
- npm

## Step-by-Step Setup

### 1. Install Backend Dependencies

```bash
cd server
npm install
```

### 2. Setup PostgreSQL Database

```bash
# Create database (Windows - using psql)
psql -U postgres
CREATE DATABASE latike;
CREATE USER latike_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE latike TO latike_user;
\q
```

### 3. Configure Environment

```bash
# Copy environment template
cp .env.example .env
```

**Edit `server/.env`** with minimum required values:

```env
# Database
DATABASE_URL=postgresql://latike_user:your_password@localhost:5432/latike

# JWT (generate random 32+ character strings)
JWT_SECRET=your-super-secret-jwt-key-change-this-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-key-change-this-min-32-chars

# QR Code
QR_SECRET_KEY=your-qr-secret-key-change-this-min-32-chars

# Optional for now (can configure later)
STRIPE_SECRET_KEY=sk_test_placeholder
CLOUDINARY_CLOUD_NAME=placeholder
CLOUDINARY_API_KEY=placeholder
CLOUDINARY_API_SECRET=placeholder
EMAIL_USER=placeholder@gmail.com
EMAIL_PASSWORD=placeholder
```

### 4. Setup Database Schema

```bash
# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate
```

### 5. Start Development Server

```bash
npm run dev
```

## ✅ Verify Installation

You should see:
```
🚀 Server running on port 5000
📚 API Documentation: http://localhost:5000/api-docs
🏥 Health Check: http://localhost:5000/health
🌍 Environment: development
```

### Test the API

**1. Health Check**:
```bash
curl http://localhost:5000/health
```

**2. View API Documentation**:
Open browser: `http://localhost:5000/api-docs`

**3. Register a User**:
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "role": "HOST"
  }'
```

**4. Login**:
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 🎯 What's Next?

### Immediate Next Steps:
1. **Configure Stripe** (for payments):
   - Get test keys from [stripe.com](https://stripe.com)
   - Update `STRIPE_SECRET_KEY` in `.env`

2. **Configure Cloudinary** (for image uploads):
   - Get credentials from [cloudinary.com](https://cloudinary.com)
   - Update Cloudinary variables in `.env`

3. **Configure Email** (for ticket delivery):
   - Use Gmail with app password
   - Update `EMAIL_USER` and `EMAIL_PASSWORD` in `.env`

### Explore the API:
- Visit Swagger UI: `http://localhost:5000/api-docs`
- Test all endpoints
- Create events
- Purchase tickets

### Database Management:
```bash
# Open Prisma Studio (visual database editor)
npm run prisma:studio
```

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Check PostgreSQL is running
# Windows: services.msc → look for postgresql

# Test connection
psql -U latike_user -d latike
```

### Port Already in Use
```bash
# Change port in .env
PORT=5001
```

### Prisma Client Not Generated
```bash
npm run prisma:generate
```

## 📚 Full Documentation

- **Complete Setup**: See `SETUP.md`
- **Implementation Details**: See `IMPLEMENTATION_SUMMARY.md`
- **Project Overview**: See `README.md`

## 🎉 You're Ready!

The backend API is now running with:
- ✅ Express + TypeScript
- ✅ PostgreSQL + Prisma
- ✅ JWT Authentication
- ✅ Swagger Documentation
- ✅ Full CRUD operations

**Next**: Build the React Native mobile app or Next.js admin panel!
```

---

## IMPLEMENTATION_SUMMARY.md (Root)

<a id="implementation_summarymd-root"></a>

```markdown
# 🎉 La-Tike Implementation Summary

## ✅ What Has Been Completed

### 1. **Backend API (Express + TypeScript)** ✅

**Complete production-ready backend with:**

#### Configuration & Setup
- ✅ TypeScript configuration with path aliases
- ✅ Express.js application setup
- ✅ Environment variable management (.env.example)
- ✅ Logging with Winston
- ✅ Swagger/OpenAPI documentation
- ✅ Security (Helmet, CORS, Rate Limiting)

#### Database
- ✅ Prisma ORM configuration
- ✅ PostgreSQL schema with 7 models:
  - Users (with roles: CUSTOMER, HOST, ADMIN)
  - Events (with status tracking)
  - TicketTypes (pricing tiers)
  - Orders (purchase records)
  - Tickets (with QR codes)
  - Payments (Stripe integration)
  - CheckIns (validation logs)
- ✅ Relationships and indexes optimized

#### Authentication & Security
- ✅ JWT authentication with refresh tokens
- ✅ Password hashing with bcrypt
- ✅ Role-based access control middleware
- ✅ Token generation and verification utilities
- ✅ Protected routes

#### Services (Business Logic with DTOs)
- ✅ **AuthService**: Registration, login, token refresh, logout
- ✅ **EventService**: CRUD operations, image upload, filtering
- ✅ **TicketService**: Purchase flow, payment confirmation, QR scanning

#### Controllers
- ✅ **AuthController**: All auth endpoints
- ✅ **EventController**: Event management endpoints
- ✅ **TicketController**: Ticketing and scanning endpoints

#### Routes
- ✅ Auth routes (`/api/v1/auth/*`)
- ✅ Event routes (`/api/v1/events/*`)
- ✅ Ticket routes (`/api/v1/tickets/*`)
- ✅ Swagger documentation routes (`/api-docs`)

#### Middleware
- ✅ Authentication middleware
- ✅ Authorization (role-based)
- ✅ Error handling
- ✅ File upload (Multer)
- ✅ Request validation (Zod)

#### Utilities
- ✅ JWT token management
- ✅ QR code generation and verification
- ✅ Email sending (Nodemailer)
- ✅ API response helpers
- ✅ Cloudinary image upload

#### Integrations
- ✅ Stripe payment processing
- ✅ Cloudinary image storage
- ✅ Email notifications
- ✅ QR code generation with signing

### 2. **Shared Types Package** ✅

**TypeScript types shared across all projects:**

- ✅ User types and enums
- ✅ Event types and enums
- ✅ Ticket and order types
- ✅ Payment types
- ✅ API response types
- ✅ Constants (categories, status colors)

### 3. **Documentation** ✅

- ✅ Main README.md with project overview
- ✅ SETUP.md with detailed setup instructions
- ✅ Server README.md with API documentation
- ✅ Swagger/OpenAPI integration
- ✅ Environment variable templates

### 4. **Project Structure** ✅

```
La-Tike/
├── server/                    # ✅ Complete
│   ├── src/
│   │   ├── config/           # Database, logger, Stripe, Cloudinary, Swagger
│   │   ├── controllers/      # Auth, Event, Ticket controllers
│   │   ├── middleware/       # Auth, error handling, upload, validation
│   │   ├── routes/           # API routes with Swagger docs
│   │   ├── services/         # Business logic with DTOs
│   │   ├── types/            # TypeScript interfaces
│   │   ├── utils/            # JWT, QR, email, response helpers
│   │   ├── app.ts            # Express app configuration
│   │   └── index.ts          # Server entry point
│   ├── prisma/
│   │   └── schema.prisma     # Complete database schema
│   ├── package.json          # All dependencies configured
│   ├── tsconfig.json         # TypeScript config with path aliases
│   ├── .env.example          # Environment template
│   └── README.md             # Server documentation
│
├── shared/                    # ✅ Complete
│   ├── src/
│   │   ├── types/            # User, Event, Ticket, API types
│   │   ├── constants/        # Shared constants
│   │   └── index.ts          # Exports
│   ├── package.json
│   └── tsconfig.json
│
├── client/                    # ✅ Existing (React web)
├── mobile/                    # ⏳ Pending (React Native)
├── admin/                     # ⏳ Pending (Next.js)
├── README.md                  # ✅ Updated
└── SETUP.md                   # ✅ Complete
```

## 📋 API Endpoints Implemented

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout user
- `GET /api/v1/auth/profile` - Get user profile

### Events
- `GET /api/v1/events` - List events (with filters)
- `GET /api/v1/events/:id` - Get event details
- `POST /api/v1/events` - Create event (HOST only)
- `PUT /api/v1/events/:id` - Update event (HOST only)
- `DELETE /api/v1/events/:id` - Delete event (HOST only)
- `POST /api/v1/events/upload/image` - Upload event image

### Tickets
- `POST /api/v1/tickets/purchase` - Purchase tickets
- `POST /api/v1/tickets/confirm-payment` - Confirm Stripe payment
- `POST /api/v1/tickets/scan` - Scan QR code (HOST only)
- `GET /api/v1/tickets/my-tickets` - Get user's tickets

## 🔧 Technologies Used

| Category | Technology |
|----------|-----------|
| Runtime | Node.js 20+ |
| Language | TypeScript |
| Framework | Express.js |
| Database | PostgreSQL 15+ |
| ORM | Prisma |
| Authentication | JWT |
| Payments | Stripe |
| File Storage | Cloudinary |
| Email | Nodemailer |
| Validation | Zod |
| Documentation | Swagger/OpenAPI |
| Security | Helmet, bcrypt, rate-limit |
| Logging | Winston |
| ... | ... |

---

## DOCKER_SETUP.md

<a id="docker_setupmd"></a>

```markdown
# Docker Setup Guide for La-Tike

## Overview
This guide will help you set up the complete La-Tike application using Docker, including the database, Redis, server, and reverse proxy.

## 🐳 Services Overview

### Services Included:
1. **PostgreSQL** - Primary database
2. **Redis** - Caching and session storage
3. **pgAdmin** - Database management interface
4. **Server** - Node.js backend API
5. **Nginx** - Reverse proxy and load balancer

### Architecture:
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Mobile    │    │   Admin     │    │   Client    │
│   App       │    │   Panel     │    │   Web       │
└──────┬──────┘    └──────┬──────┘    └──────┬──────┘
        │                 │                 │
        └─────────────────┼─────────────────┘
                          │
                 ┌────────▼────────┐
                 │     Nginx       │
                 │  (Port 80/443)  │
                 └────────┬────────┘
                          │
                 ┌────────▼────────┐
                 │     Server      │
                 │  (Port 5000)    │
                 └────────┬────────┘
                          │
         ┌────────────────┼────────────────┐
         │                │                │
 ┌───────▼──────┐ ┌───────▼──────┐ ┌───────▼──────┐
 │  PostgreSQL   │ │    Redis     │ │   pgAdmin    │
 │ (Port 5432)   │ │ (Port 6380)  │ │ (Port 5051)  │
 └───────────────┘ └──────────────┘ └──────────────┘
```

## 🚀 Quick Start

### Prerequisites:
- Docker Desktop installed and running
- Git
- Node.js (for local development)

### 1. Clone and Setup:
```bash
git clone <your-repo-url>
cd La-Tike
```

### 2. Environment Setup:
```bash
# Copy environment files
cp server/.env.example server/.env
cp server/.env.docker server/.env.docker

# Update environment variables (see Environment Configuration below)
```

### 3. Start All Services:
```bash
# Start all services in detached mode
docker-compose up -d

# View logs
docker-compose logs -f
```

### 4. Initialize Database:
```bash
# Run database migrations
docker-compose exec server npm run prisma:migrate

# Generate Prisma client
docker-compose exec server npm run prisma:generate

# (Optional) Seed database with sample data
docker-compose exec server npm run seed
```

### 5. Verify Setup:
```bash
# Check all services are running
docker-compose ps

# Test API health
curl http://localhost:5000/api/v1/health

# Access pgAdmin
# URL: http://localhost:5051
# Email: admin@latike.local
# Password: admin
```

## 📋 Service Details

### PostgreSQL Database
- **Port:** 5432
- **Database:** latike_db
- **User:** latike
- **Password:** latike_password
- **Connection String:** `postgresql://latike:latike_password@localhost:5432/latike_db`

### Redis Cache
- **Port:** 6380
- **Password:** latike_redis_password
- **Connection String:** `redis://:latike_redis_password@localhost:6380`

### Server API
- **Port:** 5000
- **Health Endpoint:** `http://localhost:5000/api/v1/health`
- **API Documentation:** `http://localhost:5000/api/v1/docs`

### pgAdmin (Database Management)
- **Port:** 5051
- **URL:** http://localhost:5051
- **Email:** admin@latike.local
- **Password:** admin

### Nginx (Reverse Proxy)
- **HTTP Port:** 80
- **HTTPS Port:** 443
- **Development Port:** 8080

## 🔧 Environment Configuration

### Server Environment Variables:
Update `server/.env` with your actual values:

```bash
# Database
DATABASE_URL=postgresql://latike:latike_password@localhost:5432/latike_db

# Redis
REDIS_URL=redis://:latike_redis_password@localhost:6380

# JWT (Generate secure secrets!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production

# Stripe (Get from Stripe Dashboard)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Cloudinary (Get from Cloudinary Dashboard)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

## Useful Commands

### Docker Commands:
```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: Deletes all data!)
docker-compose down -v

# View logs for all services
docker-compose logs -f

# View logs for specific service
docker-compose logs -f server

# Restart specific service
docker-compose restart server

# Execute command in container
docker-compose exec server bash
docker-compose exec postgres psql -U latike -d latike_db

# Build and rebuild containers
docker-compose build
docker-compose build --no-cache server

# View resource usage
docker stats
```

## Access Points

### Development:
- **API:** http://localhost:5000
- **API Docs:** http://localhost:5000/api/v1/docs
- **pgAdmin:** http://localhost:5051
- **Nginx Dev:** http://localhost:8080

### Production (with SSL):
- **API:** https://api.latike.com
- **Web App:** https://latike.com
- **Admin Panel:** https://admin.latike.com

## Security Configuration

### SSL Certificates:
1. Create `nginx/ssl` directory
2. Add your SSL certificates:
    - `nginx/ssl/cert.pem`
    - `nginx/ssl/key.pem`

### For Development (Self-signed):
```bash
# Create SSL directory
mkdir -p nginx/ssl

# Generate self-signed certificate
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/key.pem \
  -out nginx/ssl/cert.pem \
  -subj "/C=PL/ST=State/L=City/O=La-Tike/CN=localhost"
```

## Monitoring

### Health Checks:
```bash
# Check all services
docker-compose ps

# Server health
curl http://localhost:5000/api/v1/health

# Database health
docker-compose exec postgres pg_isready -U latike

# Redis health
docker-compose exec redis redis-cli -a latike_redis_password ping
```

## Troubleshooting

### Database Connection Failed:
```bash
docker-compose logs postgres
docker-compose exec postgres pg_isready -U latike
docker-compose restart postgres
```

### Server Won't Start:
```bash
docker-compose logs server
docker-compose exec server env | grep -E "(DATABASE|REDIS|JWT)"
docker-compose build --no-cache server
```

---
**Your La-Tike application is now running with Docker!**

---

## QUICKSTART_DOCKER.md

# La-Tike Docker Quickstart

## Quick Setup (5 minutes)

### 1. Start Everything
```bash
# Clone and navigate to project
git clone <your-repo-url>
cd La-Tike

# Start all services
docker-compose up -d

# Wait for services to be ready (30 seconds)
docker-compose logs -f
```

### 2. Initialize Database
```bash
# Run database migrations
docker-compose exec server npm run prisma:migrate

# Seed database with sample data
docker-compose exec server npm run seed
```

### 3. Access Your Application
- **Mobile App API:** http://localhost:5000
- **Database Admin:** http://localhost:5051 (admin@latike.local / admin)
- **Prisma Studio:** http://localhost:5555
- **Nginx Dev:** http://localhost:8080

### 4. Test Accounts
- **Customer:** customer@latike.com / password123
- **Host:** host@latike.com / password123
- **Admin:** admin@latike.com / password123

---

## Common Commands

### Docker Management
```bash
# View all running services
docker-compose ps

# View logs
docker-compose logs -f

# Restart specific service
docker-compose restart server

# Stop all services
docker-compose down

# Stop and remove all data (WARNING!)
docker-compose down -v
```

### Database Operations
```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U latike -d latike_db

# View all tables
\dt

# Open Prisma Studio
docker-compose exec server npm run prisma:studio

# Reset database
docker-compose exec server npm run prisma:migrate reset
```

---
**Your La-Tike application is now running with Docker!**

---

## mobile/BACKEND_INTEGRATION.md

# Backend Integration Guide

## Overview
This document explains how to connect the La-Tike mobile app to your backend server.

## Configuration

### Environment Setup
The app uses environment-based configuration located in `src/config/env.ts`.

**Development:**
- API URL: `http://localhost:5000/api/v1`
- WebSocket URL: `ws://localhost:5000`

**Production:**
- API URL: `https://api.latike.com/api/v1` (update with your actual URL)
- WebSocket URL: `wss://api.latike.com` (update with your actual URL)

## API Endpoints

### Authentication
- **POST** `/auth/login` - User login
- **POST** `/auth/register` - User registration
- **POST** `/auth/refresh` - Refresh access token
- **GET** `/auth/profile` - Get user profile

### Customer Endpoints
- **GET** `/events` - Browse all events
- **GET** `/events/:id` - Get event details
- **POST** `/tickets/purchase` - Purchase tickets
- **GET** `/tickets/my-tickets` - Get user's tickets

### Host Endpoints
- **GET** `/host/events` - Get host's events
- **POST** `/host/events` - Create new event
- **PUT** `/host/events/:id` - Update event
- **DELETE** `/host/events/:id` - Delete event
- **GET** `/host/analytics` - Get analytics data
- **POST** `/host/scan-ticket` - Verify ticket

## Network Configuration

### Android Emulator
```typescript
DEV: {
  API_URL: 'http://10.0.2.2:5000/api/v1',
  WS_URL: 'ws://10.0.2.2:5000',
}
```

### Physical Device
```typescript
DEV: {
  API_URL: 'http://192.168.1.100:5000/api/v1',
  WS_URL: 'ws://192.168.1.100:5000',
}
```

---

## mobile/IMPLEMENTATION_SUMMARY.md

# La-Tike Mobile App - Implementation Summary

## Project Overview
La-Tike is a React Native mobile application for event ticketing in Poland, built with Expo, TypeScript, Redux Toolkit, and RTK Query.

---

## Completed Features

### 1. **Theme System** 
**Files Created:**
- `src/theme/colors.ts`
- `src/theme/ThemeContext.tsx`
- `src/theme/index.ts`

### 2. **Authentication Screens** 
**Files Updated:**
- `src/screens/auth/LoginScreen.tsx`
- `src/screens/auth/RegisterScreen.tsx`

### 3. **Onboarding Screens** 
**Files Created:**
- `src/screens/onboarding/InterestSelectionScreen.tsx`
- `src/screens/onboarding/LocationPermissionScreen.tsx`

### 4. **Customer Screens** 
- `CustomerHomeScreen.tsx`
- `CustomerTicketsScreen.tsx`
- `CustomerProfileScreen.tsx`
- `EventDetailScreen.tsx`

### 5. **Host Screens** 
- `HostEventsScreen.tsx`
- `HostScannerScreen.tsx`
- `HostAnalyticsScreen.tsx`

### 6. **Navigation** 
- `AppNavigator.tsx`
- `AuthNavigator.tsx`
- `CustomerNavigator.tsx`
- `HostNavigator.tsx`

### 7. **Backend Integration** 
- `src/config/env.ts`
- `src/store/api/baseApi.ts`

---
**Built with ** for La-Tike**
