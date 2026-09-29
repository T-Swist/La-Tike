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

## 🛠️ Useful Commands

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

### Database Commands:
```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U latike -d latike_db

# View all tables
\dt

# View database size
SELECT pg_size_pretty(pg_database_size('latike_db'));

# Backup database
docker-compose exec postgres pg_dump -U latike latike_db > backup.sql

# Restore database
docker-compose exec -T postgres psql -U latike latike_db < backup.sql
```

### Redis Commands:
```bash
# Connect to Redis
docker-compose exec redis redis-cli -a latike_redis_password

# Test connection
ping

# View all keys
KEYS *

# Clear cache
FLUSHALL
```

### Server Commands:
```bash
# Run migrations
docker-compose exec server npm run prisma:migrate

# Generate Prisma client
docker-compose exec server npm run prisma:generate

# Open Prisma Studio
docker-compose exec server npm run prisma:studio

# View server logs
docker-compose logs -f server

# Restart server
docker-compose restart server
```

## 🌐 Access Points

### Development:
- **API:** http://localhost:5000
- **API Docs:** http://localhost:5000/api/v1/docs
- **pgAdmin:** http://localhost:5051
- **Nginx Dev:** http://localhost:8080

### Production (with SSL):
- **API:** https://api.latike.com
- **Web App:** https://latike.com
- **Admin Panel:** https://admin.latike.com

## 🔒 Security Configuration

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

### Environment Security:
- Change all default passwords
- Use strong JWT secrets
- Update Stripe keys to production values
- Configure proper CORS origins

## 📊 Monitoring

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

### Logs Monitoring:
```bash
# Real-time logs
docker-compose logs -f

# Service-specific logs
docker-compose logs -f server
docker-compose logs -f postgres
docker-compose logs -f redis
docker-compose logs -f nginx
```

## 🐛 Troubleshooting

### Common Issues:

#### 1. Database Connection Failed:
```bash
# Check PostgreSQL status
docker-compose logs postgres

# Test connection
docker-compose exec postgres pg_isready -U latike

# Restart database
docker-compose restart postgres
```

#### 2. Server Won't Start:
```bash
# Check server logs
docker-compose logs server

# Check environment variables
docker-compose exec server env | grep -E "(DATABASE|REDIS|JWT)"

# Rebuild server
docker-compose build --no-cache server
```

#### 3. Redis Connection Issues:
```bash
# Check Redis logs
docker-compose logs redis

# Test connection
docker-compose exec redis redis-cli -a latike_redis_password ping
```

#### 4. Port Conflicts:
```bash
# Check what's using ports
netstat -tulpn | grep :5432
netstat -tulpn | grep :5000

# Kill processes using ports
sudo kill -9 <PID>
```

#### 5. Permission Issues:
```bash
# Fix file permissions
sudo chown -R $USER:$USER .
sudo chmod -R 755 .

# Reset Docker permissions
docker-compose down
sudo chown -R $USER:$USER .
docker-compose up -d
```

## 🚀 Production Deployment

### 1. Update Environment:
```bash
# Set production values
NODE_ENV=production
# Update all secrets and keys
# Configure proper SSL certificates
```

### 2. Optimize Build:
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy to production
docker-compose -f docker-compose.prod.yml up -d
```

### 3. Backup Strategy:
```bash
# Automated database backups
docker-compose exec postgres pg_dump -U latike latike_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore from backup
docker-compose exec -T postgres psql -U latike latike_db < backup_20240101_120000.sql
```

## 📝 Maintenance

### Regular Tasks:
1. **Daily:** Check logs and monitor performance
2. **Weekly:** Database backups, security updates
3. **Monthly:** SSL certificate renewal, dependency updates

### Cleanup Commands:
```bash
# Clean up unused Docker resources
docker system prune -f

# Remove old images
docker image prune -f

# Clean up volumes (WARNING: Deletes data!)
docker volume prune -f
```

## 📞 Support

If you encounter issues:
1. Check the logs: `docker-compose logs`
2. Verify all services are running: `docker-compose ps`
3. Check environment variables
4. Review this troubleshooting section

---

**🎉 Your La-Tike application is now running with Docker!**
