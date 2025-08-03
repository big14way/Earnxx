# 🐳 EarnX Docker Development Setup

## 📋 Overview
This Docker setup provides a complete development environment for the EarnX verification API with MongoDB database.

## 🔒 Security & Git

### **❌ Files NOT to commit:**
```
.env.docker         # Contains real API keys and passwords
.env               # Contains production credentials
```

### **✅ Files safe to commit:**
```
.env.docker.example # Template with placeholder values
docker-compose.yml  # Infrastructure configuration
Dockerfile         # Container definitions
docker-commands.sh  # Management scripts
```

## 🚀 Quick Start

### **1. Prerequisites**
- Docker Desktop installed and running
- Git repository cloned

### **2. Setup Environment**
```bash
# Copy the environment template
cp .env.docker.example .env.docker

# Edit .env.docker with your actual values:
# - Chainlink subscription IDs
# - Pinata API keys
# - Other sensitive credentials
```

### **3. Start Development Environment**
```bash
# Start all services
npm run docker:start

# Check status
npm run docker:status

# View logs
npm run docker:logs
```

### **4. Access Your Services**
- **API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health
- **MongoDB**: localhost:27017

## 📁 File Structure

```
earnx-verification-api/
├── Dockerfile              # Production container
├── Dockerfile.dev          # Development container (hot reload)
├── .env.docker             # Docker environment (KEEP PRIVATE)
├── .env.docker.example     # Template (safe to commit)
└── src/                    # Your API source code

docker/
├── init-mongo.js           # MongoDB initialization
└── (other docker configs)

docker-compose.yml          # Multi-service orchestration
docker-commands.sh          # Management helper script
```

## 🛠️ Development Commands

```bash
# Service Management
npm run docker:start        # Start all services
npm run docker:stop         # Stop all services
npm run docker:restart      # Restart all services
npm run docker:status       # Show service status

# Debugging & Monitoring
npm run docker:logs         # View API logs
./docker-commands.sh logs mongodb  # View MongoDB logs
npm run docker:shell        # Access API container shell
./docker-commands.sh mongo  # Access MongoDB shell

# Testing & Maintenance
npm run docker:test         # Run tests in container
./docker-commands.sh reset-db  # Reset database (WARNING: deletes data)
npm run docker:cleanup      # Stop and clean up everything
```

## 🔧 Environment Configuration

### **Key Differences: .env vs .env.docker**

| Setting | .env (Production) | .env.docker (Development) |
|---------|------------------|---------------------------|
| Database | MongoDB Atlas | Local Docker MongoDB |
| CORS | Production domains | localhost:3000,3001 |
| Rate Limits | Strict | Relaxed |
| Log Level | info | debug |
| API Key | Secure production key | dev-api-key-12345 |

### **Docker-specific Settings**
```bash
# Database connects to Docker container
MONGODB_URI=mongodb://earnx_admin:password@mongodb:27017/earnx_verification

# API accessible on host
PORT=3001
API_BASE_URL=http://localhost:3001

# Development-friendly settings
LOG_LEVEL=debug
RATE_LIMIT_MAX=1000  # Higher for development
```

## 🏥 Health Monitoring

The setup includes automatic health monitoring:

```bash
# Manual health check
curl http://localhost:3001/health

# Comprehensive monitoring
./docker-commands.sh health

# Monitor continuously
./docker-commands.sh logs earnx-monitor
```

## 🗄️ Database Management

### **Access MongoDB**
```bash
# MongoDB shell
./docker-commands.sh mongo

# View collections
db.verificationrecords.find().pretty()
db.invoicedatas.find().pretty()
```

### **Sample Data**
The setup includes pre-loaded test data:
- 2 sample verification records
- 2 sample invoice datasets
- Optimized indexes for performance

### **Reset Database**
```bash
# WARNING: This deletes all data!
./docker-commands.sh reset-db
```

## 🔄 Development Workflow

### **Hot Reload Development**
1. Start Docker environment: `npm run docker:start`
2. Edit code in `earnx-verification-api/src/`
3. Changes auto-reload in container
4. Test via: `curl http://localhost:3001/health`

### **Adding New Dependencies**
```bash
# Access container shell
npm run docker:shell

# Install package
npm install new-package

# Rebuild container to persist
npm run docker:restart
```

### **Debugging Issues**
```bash
# Check service status
npm run docker:status

# View detailed logs
npm run docker:logs

# Check specific service
./docker-commands.sh logs mongodb

# Access container for debugging
npm run docker:shell
```

## 🚀 Production Deployment

This Docker setup is for **development only**. For production:

1. Use the original `Dockerfile` (not `Dockerfile.dev`)
2. Use production environment variables
3. Use managed database (MongoDB Atlas)
4. Implement proper security measures

## ⚠️ Troubleshooting

### **Common Issues**

**Docker not starting:**
```bash
# Check if Docker Desktop is running
docker info

# If not running, start Docker Desktop application
```

**Port conflicts:**
```bash
# If port 3001 is busy, change in .env.docker:
PORT=3002

# Then restart:
npm run docker:restart
```

**Database connection issues:**
```bash
# Check MongoDB container
./docker-commands.sh logs mongodb

# Reset database if corrupted
./docker-commands.sh reset-db
```

**Permission issues:**
```bash
# Fix file permissions (macOS/Linux)
chmod +x docker-commands.sh

# If still having issues, run with sudo
sudo ./docker-commands.sh start
```

## 🎯 Next Steps

1. **Development**: Use this setup for backend development
2. **Testing**: Add more comprehensive tests
3. **Production**: Deploy using Render or similar platform
4. **Full Stack**: Later add frontend container to docker-compose.yml

---

🎉 **Happy Coding!** Your EarnX backend is now fully containerized and ready for development.