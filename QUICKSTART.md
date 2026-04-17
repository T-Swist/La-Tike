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
