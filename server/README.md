# La-Tike Backend API

Event ticketing platform backend built with Express, TypeScript, Prisma, and PostgreSQL.

## Features

- 🔐 JWT Authentication with refresh tokens
- 🎫 Event management and ticketing
- 💳 Stripe payment integration
- 📧 Email notifications
- 🔒 QR code generation and validation
- ☁️ Cloudinary image uploads
- 📚 Swagger API documentation
- 🛡️ Security with Helmet and rate limiting
- ✅ Input validation with Zod

## Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT
- **Payment**: Stripe
- **File Upload**: Cloudinary
- **Email**: Nodemailer
- **Documentation**: Swagger/OpenAPI

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Configure your `.env` file with your credentials

4. Generate Prisma client:
```bash
npm run prisma:generate
```

5. Run database migrations:
```bash
npm run prisma:migrate
```

### Development

```bash
npm run dev
```

Server will start on `http://localhost:5000`

### API Documentation

Visit `http://localhost:5000/api-docs` for Swagger documentation

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── middleware/      # Express middleware
├── routes/          # API routes
├── services/        # Business logic (DTOs)
├── types/           # TypeScript types
├── utils/           # Utility functions
├── validators/      # Request validators
├── app.ts           # Express app setup
└── index.ts         # Server entry point
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - Logout user
- `GET /api/v1/auth/profile` - Get user profile

### Events
- `GET /api/v1/events` - Get all events
- `GET /api/v1/events/:id` - Get event by ID
- `POST /api/v1/events` - Create event (HOST)
- `PUT /api/v1/events/:id` - Update event (HOST)
- `DELETE /api/v1/events/:id` - Delete event (HOST)
- `POST /api/v1/events/upload/image` - Upload image

### Tickets
- `POST /api/v1/tickets/purchase` - Purchase tickets
- `POST /api/v1/tickets/confirm-payment` - Confirm payment
- `POST /api/v1/tickets/scan` - Scan QR code (HOST)
- `GET /api/v1/tickets/my-tickets` - Get user tickets

## Database Schema

See `prisma/schema.prisma` for the complete database schema.

## Environment Variables

See `.env.example` for all required environment variables.

## License

ISC
