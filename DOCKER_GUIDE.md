# Docker Deployment Guide for NEXIO Backend

This guide will help you deploy the NEXIO backend using Docker.

## Prerequisites

- Docker installed (v20.10 or higher)
- Docker Compose installed (v2.0 or higher)

## Quick Start

### 1. Environment Setup

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` and fill in your actual values for:
- Database credentials
- JWT and session secrets
- AWS credentials (if using S3)
- Stripe keys (if using payments)
- Email configuration
- Google OAuth credentials

### 2. Build and Run with Docker Compose

**Start all services (MongoDB + Backend):**
```bash
docker-compose up -d
```

**View logs:**
```bash
docker-compose logs -f backend
```

**Stop services:**
```bash
docker-compose down
```

**Stop and remove volumes (fresh start):**
```bash
docker-compose down -v
```

### 3. Build Docker Image Only

If you only want to build the backend image:

```bash
docker build -t nexio-backend:latest .
```

### 4. Run Backend Container Only

If you have MongoDB running separately:

```bash
docker run -d \
  --name nexio-backend \
  -p 5000:5000 \
  --env-file .env \
  -v $(pwd)/uploads:/app/uploads \
  nexio-backend:latest
```

## Docker Compose Services

### MongoDB Service
- **Image:** mongo:7.0
- **Port:** 27017
- **Data Persistence:** Uses named volumes for data and config
- **Health Check:** Ensures database is ready before starting backend

### Backend Service
- **Build:** Multi-stage build with TypeScript compilation
- **Port:** 5000 (configurable via PORT env variable)
- **Volumes:** Uploads directory for file storage
- **Health Check:** Monitors application health

## Useful Commands

### Rebuild after code changes:
```bash
docker-compose up -d --build
```

### Access MongoDB shell:
```bash
docker exec -it nexio-mongodb mongosh -u admin -p password123
```

### View backend logs:
```bash
docker logs -f nexio-backend
```

### Inspect container:
```bash
docker exec -it nexio-backend sh
```

### Clean up everything:
```bash
docker-compose down -v --rmi all
```

## Production Deployment

### 1. Update Environment
Set `NODE_ENV=production` in your `.env` file.

### 2. Use Stronger Secrets
- Generate strong JWT and session secrets
- Use secure database credentials
- Never commit `.env` to version control

### 3. Consider Using Docker Swarm or Kubernetes
For production-grade orchestration:
- Docker Swarm for simpler deployments
- Kubernetes for complex, scalable deployments

### 4. Set Up Reverse Proxy
Use Nginx or Traefik as a reverse proxy:
- SSL/TLS termination
- Load balancing
- Better security

### 5. Monitor Your Containers
- Use Docker stats: `docker stats`
- Set up logging aggregation
- Use monitoring tools (Prometheus, Grafana)

## Troubleshooting

### Backend can't connect to MongoDB
- Ensure MongoDB is healthy: `docker-compose ps`
- Check MongoDB logs: `docker-compose logs mongodb`
- Verify MONGODB_URI in `.env`

### Port already in use
- Change the port mapping in `docker-compose.yml`
- Or stop the service using port 5000

### Build fails
- Clear Docker cache: `docker system prune -a`
- Check for syntax errors in code
- Ensure all dependencies are in `package.json`

### Volume permission issues
- On Linux, you may need to adjust permissions:
  ```bash
  sudo chown -R $USER:$USER uploads
  ```

## Architecture

```
┌─────────────────┐
│   Frontend      │
│  (Port 3000)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  NEXIO Backend  │
│  (Port 5000)    │
│  - Express API  │
│  - Socket.IO    │
│  - WebRTC       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    MongoDB      │
│  (Port 27017)   │
│  - User Data    │
│  - Classrooms   │
└─────────────────┘
```

## Security Notes

1. **Never expose MongoDB port in production** - Remove or comment out the ports mapping for MongoDB
2. **Use secrets management** - Consider using Docker secrets or vault services
3. **Regular updates** - Keep base images updated for security patches
4. **Network isolation** - Use Docker networks to isolate services

## Next Steps

- Set up CI/CD pipeline for automated builds
- Configure automated backups for MongoDB
- Implement log rotation
- Set up SSL certificates with Let's Encrypt
- Consider container orchestration for scaling

## Support

For issues or questions, please refer to the main README or create an issue in the repository.
