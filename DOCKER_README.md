# NEXIO Backend - Docker Setup Complete! 🐳

## ✅ Files Created

I've successfully created the following Docker configuration files:

1. **Dockerfile** - Multi-stage build optimized for production
2. **.dockerignore** - Excludes unnecessary files from builds
3. **docker-compose.yml** - Full stack orchestration (MongoDB + Backend)
4. **.env.example** - Environment variables template
5. **DOCKER_GUIDE.md** - Comprehensive deployment documentation

## 🚀 Quick Start Guide

### Step 1: Start Docker Desktop
Make sure Docker Desktop is running on your Windows machine.

### Step 2: Set Up Environment Variables
```bash
cp .env.example .env
```
Then edit `.env` with your actual configuration values.

### Step 3: Build and Run
```bash
# Start everything (MongoDB + Backend)
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop everything
docker-compose down
```

## 📋 What's Included

### Dockerfile Features:
- ✨ Multi-stage build (smaller final image)
- 🔧 Separate build and production stages
- 📦 Only production dependencies in final image
- 🏔️ Alpine Linux base (lightweight)
- ✅ TypeScript compilation in build stage
- 📁 Uploads directory support

### Docker Compose Features:
- 🗄️ MongoDB 7.0 with authentication
- 🔄 Automatic service dependency management
- ❤️ Health checks for both services
- 💾 Persistent volumes for database
- 🌐 Isolated Docker network
- 🔌 WebSocket support for Socket.IO
- 📊 Environment variable configuration

## 🎯 Common Commands

```bash
# Build only
docker build -t nexio-backend:latest .

# Run with compose (recommended)
docker-compose up -d

# Rebuild after code changes
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Fresh start (removes volumes)
docker-compose down -v

# Access MongoDB shell
docker exec -it nexio-mongodb mongosh -u admin -p password123

# Access backend container
docker exec -it nexio-backend sh
```

## 🔧 Environment Variables

Key variables you need to set in `.env`:

```env
# Required
MONGODB_URI=mongodb://admin:password123@mongodb:27017/nexio?authSource=admin
JWT_SECRET=your_secure_jwt_secret
SESSION_SECRET=your_secure_session_secret
CLIENT_URL=http://localhost:3000

# Optional (based on features used)
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
STRIPE_SECRET_KEY=...
EMAIL_USER=...
GOOGLE_CLIENT_ID=...
```

## 📡 Exposed Ports

- **Backend API:** http://localhost:5000
- **MongoDB:** localhost:27017 (for development only)
- **WebSocket/Socket.IO:** Same as backend (5000)

## 🏗️ Architecture

```
┌──────────────────────────────────────┐
│         Docker Network               │
│  ┌──────────────┐  ┌──────────────┐ │
│  │   Backend    │  │   MongoDB    │ │
│  │  Port: 5000  │◄─┤  Port: 27017 │ │
│  └──────────────┘  └──────────────┘ │
└────────┬─────────────────────────────┘
         │
         ▼
    Your Frontend
   (localhost:3000)
```

## 🔒 Security Notes

For production:
1. Remove MongoDB port exposure in `docker-compose.yml`
2. Use strong, unique secrets (JWT, session, database)
3. Enable HTTPS with reverse proxy (Nginx/Traefik)
4. Use Docker secrets or external secret management
5. Regular security updates of base images

## 🐛 Troubleshooting

### Docker Desktop not running
**Error:** `cannot find the file specified`
**Solution:** Start Docker Desktop application

### Port already in use
**Error:** `port is already allocated`
**Solution:** Change port in `docker-compose.yml` or stop conflicting service

### MongoDB connection failed
**Solution:** 
- Check MongoDB is healthy: `docker-compose ps`
- Verify `MONGODB_URI` in `.env`
- Check logs: `docker-compose logs mongodb`

### Build fails
**Solution:**
- Clear cache: `docker system prune -a`
- Ensure all dependencies in `package.json`
- Check TypeScript compilation: `npm run build`

## 📚 Next Steps

1. **Start Docker Desktop** on your Windows machine
2. **Configure .env** file with your credentials
3. **Run** `docker-compose up -d`
4. **Test** your API at http://localhost:5000
5. **Connect** your frontend

## 🎓 Production Deployment

For deploying to cloud platforms:

- **AWS ECS/Fargate:** Push to ECR, deploy to ECS
- **Google Cloud Run:** Build and deploy directly
- **Azure Container Instances:** Use Azure Container Registry
- **DigitalOcean App Platform:** Connect Git repository
- **Railway/Render:** Git-based deployment

See `DOCKER_GUIDE.md` for detailed production deployment strategies.

## 📖 Documentation

For complete documentation, see:
- `DOCKER_GUIDE.md` - Comprehensive Docker deployment guide
- `README_VIDEO_CALL.md` - Video call implementation details

---

**Need help?** Check the troubleshooting section or open an issue!
