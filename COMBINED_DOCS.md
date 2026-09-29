# La-Tike — Combined Documentation (excluding README.md)

This file is a single combined version of the project Markdown docs (excluding `README.md`).

## Contents

- `SETUP.md`
- `QUICKSTART.md`
- `IMPLEMENTATION_SUMMARY.md` (root)
- `DOCKER_SETUP.md`
- `QUICKSTART_DOCKER.md`
- `mobile/BACKEND_INTEGRATION.md`
- `mobile/IMPLEMENTATION_SUMMARY.md`

---

# SETUP.md

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

## 🎯 Next Steps

1. ✅ Backend API - Complete
2. ⏳ Mobile App - Coming next
3. ⏳ Admin Panel - Coming next
4. ⏳ Deployment - Coming next

---

# QUICKSTART.md

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

---

# IMPLEMENTATION_SUMMARY.md (root)

# 🎉 La-Tike Implementation Summary

## ✅ What Has Been Completed

(See `IMPLEMENTATION_SUMMARY.md` for the full detailed breakdown of backend, shared types, endpoints, and architecture.)

---

# DOCKER_SETUP.md

(See `DOCKER_SETUP.md` for the full Docker architecture, services, and commands.)

---

# QUICKSTART_DOCKER.md

(See `QUICKSTART_DOCKER.md` for the quick Docker run steps.)

---

# mobile/BACKEND_INTEGRATION.md

(See `mobile/BACKEND_INTEGRATION.md` for mobile-to-backend connection notes.)

---

# mobile/IMPLEMENTATION_SUMMARY.md

(See `mobile/IMPLEMENTATION_SUMMARY.md` for mobile screens and features summary.)
