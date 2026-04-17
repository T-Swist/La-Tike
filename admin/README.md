# La-Tike Admin Dashboard

Modern admin dashboard for managing the La-Tike event ticketing platform.

## Features

- 📊 **Dashboard Overview** - Real-time statistics and analytics
- 🎫 **Event Management** - View and manage all events
- 👥 **User Management** - Manage users and roles
- 🎟️ **Ticket Management** - Track all tickets and scans
- 💳 **Payment Management** - Monitor transactions and revenue
- 🔐 **Secure Authentication** - Admin-only access with JWT
- 🎨 **Modern UI** - Built with Next.js 14, TailwindCSS, and shadcn/ui
- 📱 **Responsive Design** - Works on all devices

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- Running La-Tike backend API

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update .env with your API URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

### Development

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
admin/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── dashboard/          # Dashboard pages
│   │   │   ├── events/         # Events management
│   │   │   ├── users/          # Users management
│   │   │   ├── tickets/        # Tickets management
│   │   │   ├── payments/       # Payments management
│   │   │   └── page.tsx        # Main dashboard
│   │   ├── login/              # Login page
│   │   ├── layout.tsx          # Root layout
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   └── layout/             # Layout components
│   ├── lib/
│   │   ├── api.ts              # Axios instance
│   │   ├── store.ts            # Zustand store
│   │   └── utils.ts            # Utility functions
│   └── types/                  # TypeScript types
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.mjs
```

## Pages

### Dashboard (`/dashboard`)
- Overview statistics (users, events, tickets, revenue)
- Recent activity
- Platform metrics

### Events (`/dashboard/events`)
- List all events
- View event details
- Filter by status
- See ticket sales

### Users (`/dashboard/users`)
- List all users
- View user roles (CUSTOMER, HOST, ADMIN)
- Check verification status
- User registration dates

### Tickets (`/dashboard/tickets`)
- View all tickets
- Check ticket status
- See scan history
- Track ticket holders

### Payments (`/dashboard/payments`)
- Monitor all transactions
- View payment status
- Track revenue
- Payment method details

## Authentication

The admin dashboard requires admin-level access:

1. Navigate to `/login`
2. Enter admin credentials
3. Only users with `ADMIN` role can access the dashboard
4. JWT tokens are stored securely
5. Auto-refresh on token expiration

## API Integration

The dashboard connects to the La-Tike backend API:

- **Base URL**: Configured in `.env` as `NEXT_PUBLIC_API_URL`
- **Authentication**: Bearer token (JWT)
- **Auto-retry**: Failed requests are retried with refresh token
- **Error Handling**: Centralized error handling with user-friendly messages

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_APP_NAME=La-Tike Admin
```

## Features in Detail

### Real-time Statistics
- Total users count
- Active events count
- Tickets sold
- Total revenue

### Data Tables
- Sortable columns
- Pagination support
- Status badges
- Responsive design

### Security
- Protected routes
- Role-based access control
- Secure token storage
- Auto-logout on token expiration

## Development

### Adding New Pages

1. Create page in `src/app/dashboard/[page-name]/page.tsx`
2. Add route to sidebar in `src/components/layout/sidebar.tsx`
3. Implement data fetching with React Query
4. Style with TailwindCSS and shadcn/ui components

### Adding New Components

```bash
# shadcn/ui components are in src/components/ui/
# Custom components go in src/components/
```

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

## Troubleshooting

### API Connection Issues
- Check `NEXT_PUBLIC_API_URL` in `.env`
- Ensure backend API is running
- Verify CORS settings on backend

### Authentication Issues
- Clear browser localStorage
- Check admin user role in database
- Verify JWT secret matches backend

### Build Errors
- Run `npm install` to ensure all dependencies are installed
- Check TypeScript errors with `npm run type-check`
- Clear `.next` folder and rebuild

## Contributing

This is part of the La-Tike platform. See main project README for contribution guidelines.

## License

ISC

---

**Built with ❤️ for La-Tike Event Ticketing Platform**
