# 🚀 La-Tike Docker Quickstart

## ⚡ Quick Setup (5 minutes)

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
- **🌐 Mobile App API:** http://localhost:5000
- **🗄️ Database Admin:** http://localhost:5051 (admin@latike.local / admin)
- **📊 Prisma Studio:** http://localhost:5555
- **🔧 Nginx Dev:** http://localhost:8080

### 4. Test Accounts
- **Customer:** customer@latike.com / password123
- **Host:** host@latike.com / password123
- **Admin:** admin@latike.com / password123

---

## 🛠️ Common Commands

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

### Server Operations
```bash
# Restart server
docker-compose restart server

# View server logs
docker-compose logs -f server

# Rebuild server
docker-compose build --no-cache server

# Seed database
docker-compose exec server npm run seed
```

---

## 🔧 Development Workflow

### 1. Make Changes to Server Code
```bash
# Rebuild and restart server
docker-compose build server
docker-compose up -d server

# Check logs
docker-compose logs -f server
```

### 2. Database Schema Changes
```bash
# Create new migration
docker-compose exec server npm run prisma:migrate

# Update Prisma client
docker-compose exec server npm run prisma:generate

# Re-seed if needed
docker-compose exec server npm run seed
```

### 3. View Database
```bash
# Using pgAdmin (Web UI)
# URL: http://localhost:5051
# Email: admin@latike.local
# Password: admin

# Using Prisma Studio
docker-compose exec server npm run prisma:studio
```

---

## 📱 Mobile App Setup

### Update Mobile App Configuration
```bash
# Edit mobile/src/config/env.ts
# Ensure API_URL points to: http://localhost:5000/api/v1

# Start mobile app
cd mobile
npm start
```

### Test API Connection
```bash
# Test health endpoint
curl http://localhost:5000/api/v1/health

# Test authentication
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"customer@latike.com","password":"password123"}'
```

---

## 🐛 Troubleshooting

### Port Already in Use?
```bash
# Check what's using port 5432
netstat -tulpn | grep :5432

# Kill process
sudo kill -9 <PID>

# Or change port in docker-compose.yml
ports:
  - '5433:5432'  # Use 5433 instead
```

### Database Connection Failed?
```bash
# Check PostgreSQL status
docker-compose logs postgres

# Test connection
docker-compose exec postgres pg_isready -U latike

# Restart database
docker-compose restart postgres
```

### Server Won't Start?
```bash
# Check server logs
docker-compose logs server

# Check environment variables
docker-compose exec server env | grep -E "(DATABASE|REDIS|JWT)"

# Rebuild server
docker-compose build --no-cache server
```

### Permission Issues?
```bash
# Fix Docker permissions
sudo chown -R $USER:$USER .

# Reset Docker
docker-compose down
docker system prune -f
docker-compose up -d
```

---

## 📊 Monitoring

### Check Service Health
```bash
# All services status
docker-compose ps

# Individual service health
curl http://localhost:5000/api/v1/health
curl http://localhost:5051
```

### Resource Usage
```bash
# Docker stats
docker stats

# Disk usage
docker system df

# Clean up unused resources
docker system prune -f
```

---

## 🔄 Reset Everything

### Complete Reset
```bash
# Stop and remove everything
docker-compose down -v

# Remove all Docker data
docker system prune -af

# Rebuild from scratch
docker-compose build --no-cache
docker-compose up -d

# Re-initialize database
docker-compose exec server npm run prisma:migrate
docker-compose exec server npm run seed
```

---

## 🎯 Production Tips

### Environment Variables
```bash
# Copy production env file
cp server/.env.docker server/.env.production

# Update with production values:
# - Change JWT secrets
# - Update Stripe keys
# - Set production database URL
# - Configure SSL certificates
```

### SSL Setup
```bash
# Create SSL directory
mkdir -p nginx/ssl

# Add your certificates
# nginx/ssl/cert.pem
# nginx/ssl/key.pem

# Use production compose file
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📞 Support

### Quick Commands Reference
```bash
# Start: docker-compose up -d
# Stop: docker-compose down
# Logs: docker-compose logs -f
# Status: docker-compose ps
# Rebuild: docker-compose build
# Database: docker-compose exec postgres psql -U latike -d latike_db
```

### Common Issues
1. **Port conflicts** → Change ports in docker-compose.yml
2. **Permission denied** → Run `sudo chown -R $USER:$USER .`
3. **Database not ready** → Wait 30 seconds after `docker-compose up -d`
4. **Server crashes** → Check `docker-compose logs server`

---

**🎉 Your La-Tike application is now running with Docker!**

For detailed documentation, see `DOCKER_SETUP.md`
