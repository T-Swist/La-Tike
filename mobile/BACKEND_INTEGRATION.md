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

### Updating Backend URL
1. Open `src/config/env.ts`
2. Update the `PROD.API_URL` and `PROD.WS_URL` with your production backend URLs
3. For local development, ensure your backend is running on `http://localhost:5000`

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

## Request/Response Format

### Standard Response Format
```json
{
  "success": true,
  "data": { ... },
  "message": "Success message"
}
```

### Error Response Format
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## Authentication Flow

### Login
```typescript
const { data, error } = await login({ email, password });
// Response: { user, accessToken, refreshToken }
```

### Register
```typescript
const { data, error } = await register({
  email,
  password,
  firstName,
  lastName,
  role: 'CUSTOMER' | 'HOST'
});
// Response: { user, accessToken, refreshToken }
```

### Token Refresh
The app automatically refreshes tokens when they expire using the refresh token.

## Mock Data vs Real API

Currently, the app uses mock data for development. To switch to real API:

### Customer Screens
1. **CustomerHomeScreen.tsx**
   - Uncomment: `const { data: events, isLoading } = useGetEventsQuery();`
   - Remove: `const events = MOCK_EVENTS;`

2. **CustomerTicketsScreen.tsx**
   - Uncomment: `const { data: tickets, isLoading } = useGetMyTicketsQuery();`
   - Remove: `const allTickets = MOCK_TICKETS;`

### Host Screens
1. **HostEventsScreen.tsx**
   - Uncomment: `const { data: events, isLoading } = useGetMyEventsQuery();`
   - Remove: `const allEvents = MOCK_EVENTS;`

2. **HostAnalyticsScreen.tsx**
   - Add API call for analytics data
   - Replace mock data with real data

## Testing Backend Connection

### 1. Start Your Backend Server
```bash
cd ../server
npm run dev
```

### 2. Test API Endpoints
Use a tool like Postman or curl to test:
```bash
curl http://localhost:5000/api/v1/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 3. Run Mobile App
```bash
npm start
# or
npx expo start
```

### 4. Check Network Requests
- Open React Native Debugger
- Monitor network tab for API calls
- Check for errors in console

## Common Issues

### CORS Errors
If you see CORS errors, ensure your backend allows requests from:
- `http://localhost:19000` (Expo dev server)
- `http://localhost:19006` (Expo web)

### Connection Refused
- Ensure backend is running
- Check firewall settings
- For Android emulator, use `10.0.2.2` instead of `localhost`
- For iOS simulator, `localhost` should work

### 401 Unauthorized
- Check if token is being sent in headers
- Verify token format: `Bearer <token>`
- Check token expiration

## Network Configuration

### Android Emulator
Update `src/config/env.ts` for Android emulator:
```typescript
DEV: {
  API_URL: 'http://10.0.2.2:5000/api/v1',
  WS_URL: 'ws://10.0.2.2:5000',
}
```

### Physical Device
Use your computer's local IP address:
```typescript
DEV: {
  API_URL: 'http://192.168.1.100:5000/api/v1',
  WS_URL: 'ws://192.168.1.100:5000',
}
```

## Next Steps

1. ✅ Backend server is running
2. ✅ API endpoints are implemented
3. ✅ Update `src/config/env.ts` with correct URLs
4. ✅ Remove mock data from screens
5. ✅ Test all API integrations
6. ✅ Handle loading and error states
7. ✅ Deploy backend to production
8. ✅ Update production URLs in config

## Support

For backend API documentation, refer to:
- Swagger/OpenAPI docs (if available)
- Backend repository README
- API documentation in `/docs` folder
