# Deploying MysticFortune to dp1 VM

> **Server**: dp1 VM (74.208.227.161)  
> **Container Runtime**: Podman + podman-compose  
> **User**: cira  
> **Compose File**: `/home/cira/docker-compose.yml`

This guide explains how to deploy MysticFortune to your existing dp1 VM infrastructure that uses Podman containerization.

---

## 📋 Prerequisites

### DNS Configuration

Before deploying, ensure the following DNS A records are configured in your DNS provider, all pointing to **74.208.227.161**:

- `@` (root domain)
- `api`
- `control`
- `dev`
- `inference`
- `mail`
- `www`

For MysticFortune specifically, ensure you have:
- `mysticfortune.yourdomain.com` (or your chosen subdomain)
- `dev.mysticfortune.yourdomain.com` (for development)

---

## 🔧 Step 1: Prepare Environment File

Create a `.env` file in the MysticFortune project root with the following configuration:

```env
# Database Configuration
DATABASE_URL=postgresql://mysticfortune:password@dp1-db01:5432/mysticfortune

# Session Configuration
SESSION_SECRET=generate_random_string_here

# Application Configuration
NODE_ENV=production
PORT=5000
APP_URL=https://mysticfortune.yourdomain.com

# SMTP Configuration for Postfix on same VM
SMTP_HOST=localhost
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=noreply@yourdomain.com
SMTP_PASS=your_password_here
EMAIL_FROM=Mystic Fortune <noreply@yourdomain.com>

# Optional: AI Features
HUGGINGFACE_API_KEY=your_huggingface_api_key

# Optional: Payment Integration
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Virtual Host Configuration (for nginx-proxy)
VIRTUAL_HOST=mysticfortune.yourdomain.com
LETSENCRYPT_HOST=mysticfortune.yourdomain.com
LETSENCRYPT_EMAIL=admin@yourdomain.com
```

---

## 🐳 Step 2: Create Podman Compose Configuration

Create the file `deploy/podman/ADD_THIS_TO_COMPOSE.yml` in the MysticFortune project:

```yaml
# MysticFortune Service Configuration
# Add this to /home/cira/docker-compose.yml

services:
  site-mysticfortune:
    build:
      context: /path/to/MysticFortune
      dockerfile: Dockerfile
    image: mysticfortune:latest
    container_name: site-mysticfortune
    restart: unless-stopped
    
    environment:
      # Database
      - DATABASE_URL=${DATABASE_URL}
      
      # Session
      - SESSION_SECRET=${SESSION_SECRET}
      
      # Application
      - NODE_ENV=production
      - PORT=5000
      - APP_URL=${APP_URL}
      
      # SMTP
      - SMTP_HOST=${SMTP_HOST}
      - SMTP_PORT=${SMTP_PORT}
      - SMTP_SECURE=${SMTP_SECURE}
      - SMTP_USER=${SMTP_USER}
      - SMTP_PASS=${SMTP_PASS}
      - EMAIL_FROM=${EMAIL_FROM}
      
      # AI Features (optional)
      - HUGGINGFACE_API_KEY=${HUGGINGFACE_API_KEY}
      
      # Payments (optional)
      - STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
      - STRIPE_PUBLISHABLE_KEY=${STRIPE_PUBLISHABLE_KEY}
      
      # Virtual Host for nginx-proxy
      - VIRTUAL_HOST=${VIRTUAL_HOST}
      - LETSENCRYPT_HOST=${LETSENCRYPT_HOST}
      - LETSENCRYPT_EMAIL=${LETSENCRYPT_EMAIL}
    
    volumes:
      - mysticfortune-uploads:/app/uploads
      - mysticfortune-cache:/app/.cache
    
    depends_on:
      - dp1-db01
      - dp1-redis01
      - nginx-proxy
    
    networks:
      - default
    
    labels:
      - "com.centurylinklabs.watchtower.enable=true"

  # Development version (optional)
  site-mysticfortune-dev:
    build:
      context: /path/to/MysticFortune
      dockerfile: Dockerfile
    image: mysticfortune:dev
    container_name: site-mysticfortune-dev
    restart: unless-stopped
    
    environment:
      - DATABASE_URL=postgresql://mysticfortune:password@dp1-db01:5432/mysticfortune_dev
      - SESSION_SECRET=${SESSION_SECRET}
      - NODE_ENV=development
      - PORT=5000
      - APP_URL=https://dev.mysticfortune.yourdomain.com
      - SMTP_HOST=${SMTP_HOST}
      - SMTP_PORT=${SMTP_PORT}
      - SMTP_SECURE=${SMTP_SECURE}
      - SMTP_USER=${SMTP_USER}
      - SMTP_PASS=${SMTP_PASS}
      - EMAIL_FROM=${EMAIL_FROM}
      - VIRTUAL_HOST=dev.mysticfortune.yourdomain.com
      - LETSENCRYPT_HOST=dev.mysticfortune.yourdomain.com
      - LETSENCRYPT_EMAIL=${LETSENCRYPT_EMAIL}
    
    volumes:
      - mysticfortune-dev-uploads:/app/uploads
      - mysticfortune-dev-cache:/app/.cache
    
    depends_on:
      - dp1-db01
      - dp1-redis01
      - nginx-proxy
    
    networks:
      - default

volumes:
  mysticfortune-uploads:
  mysticfortune-cache:
  mysticfortune-dev-uploads:
  mysticfortune-dev-cache:
```

---

## 📝 Step 3: Add to Main Compose File

SSH into the dp1 VM and add the service definition:

```bash
# SSH into the server
ssh cira@74.208.227.161

# Navigate to compose directory
cd /home/cira

# Backup existing compose file
cp docker-compose.yml docker-compose.yml.backup

# Edit the main compose file
nano docker-compose.yml

# Copy the service definition from deploy/podman/ADD_THIS_TO_COMPOSE.yml
# Paste it into the main docker-compose.yml
```

**Important Configuration Points to Verify:**
- `VIRTUAL_HOST` matches your domain
- `LETSENCRYPT_HOST` matches your domain
- `DATABASE_URL` points to correct database
- Environment variables are complete
- Volume names don't conflict with existing services

---

## 🗄️ Step 4: Set Up Database

Create the database on the dp1-db01 PostgreSQL container:

```bash
# Connect to PostgreSQL container
podman exec -it dp1-db01 psql -U postgres

# In PostgreSQL prompt:
CREATE DATABASE mysticfortune;
CREATE DATABASE mysticfortune_dev;
CREATE USER mysticfortune WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE mysticfortune TO mysticfortune;
GRANT ALL PRIVILEGES ON DATABASE mysticfortune_dev TO mysticfortune;

# Exit PostgreSQL
\q
```

---

## 🚀 Step 5: Build and Start Services

```bash
# Navigate to compose directory
cd /home/cira

# Build the MysticFortune image
podman-compose -f /home/cira/docker-compose.yml build site-mysticfortune

# Start the service
podman-compose -f /home/cira/docker-compose.yml up -d site-mysticfortune

# For development version:
podman-compose -f /home/cira/docker-compose.yml build site-mysticfortune-dev
podman-compose -f /home/cira/docker-compose.yml up -d site-mysticfortune-dev
```

---

## 🔄 Managing Services

### Start/Restart Services
```bash
# Start all services
podman-compose -f /home/cira/docker-compose.yml up -d

# Start specific service
podman-compose -f /home/cira/docker-compose.yml up -d site-mysticfortune

# Restart service
podman-compose -f /home/cira/docker-compose.yml restart site-mysticfortune
```

### Stop Services
```bash
# Stop all services
podman-compose -f /home/cira/docker-compose.yml down

# Stop specific service
podman-compose -f /home/cira/docker-compose.yml stop site-mysticfortune
```

### Check Status
```bash
# View all running containers
podman-compose -f /home/cira/docker-compose.yml ps

# View logs
podman-compose -f /home/cira/docker-compose.yml logs site-mysticfortune

# Follow logs in real-time
podman-compose -f /home/cira/docker-compose.yml logs -f site-mysticfortune
```

---

## 🔍 Verification

After deployment, verify the application is working:

```bash
# 1. Check container is running
podman-compose -f /home/cira/docker-compose.yml ps | grep mysticfortune

# 2. Check logs for errors
podman-compose -f /home/cira/docker-compose.yml logs site-mysticfortune

# 3. Test database connection
podman exec -it site-mysticfortune npm run check

# 4. Test HTTP endpoint
curl http://localhost:5000/api/health

# 5. Test HTTPS endpoint (via nginx-proxy)
curl https://mysticfortune.yourdomain.com/api/health
```

**Browser Test:**
- Visit https://mysticfortune.yourdomain.com
- Should show MysticFortune homepage
- SSL certificate should be valid (Let's Encrypt via nginx-proxy)

---

## 🔄 Database Migrations

Run database migrations after first deployment:

```bash
# Execute migration inside container
podman exec -it site-mysticfortune npm run db:push

# Optional: Seed database
podman exec -it site-mysticfortune npm run db:seed
```

---

## 📦 Updating the Application

### Method 1: Rebuild Container

```bash
# Navigate to compose directory
cd /home/cira

# Pull latest code (if using git in the build context)
# Rebuild the container
podman-compose -f /home/cira/docker-compose.yml build site-mysticfortune

# Recreate and restart
podman-compose -f /home/cira/docker-compose.yml up -d site-mysticfortune
```

### Method 2: Manual Update Inside Container

```bash
# Enter container
podman exec -it site-mysticfortune bash

# Inside container:
git pull origin main
npm ci
npm run build
npm run db:push  # Run migrations

# Exit and restart container
exit
podman-compose -f /home/cira/docker-compose.yml restart site-mysticfortune
```

---

## 🛠️ Existing Infrastructure Integration

Your dp1 VM already has these services running that MysticFortune can leverage:

### Available Services

| Service | Container Name | Purpose |
|---------|---------------|---------|
| PostgreSQL | `dp1-db01` | Database server |
| Redis | `dp1-redis01` | Caching/session store |
| Nginx Proxy | `nginx-proxy` | Reverse proxy with SSL |
| Let's Encrypt | `letsencrypt` | Automatic SSL certificates |
| Email Server | `email-server` | SMTP server (Postfix) |

### Using Redis for Sessions (Optional)

To use Redis for session storage, update your `.env`:

```env
# Add Redis session store
REDIS_URL=redis://dp1-redis01:6379
SESSION_STORE=redis
```

And update the compose service to depend on Redis:

```yaml
depends_on:
  - dp1-db01
  - dp1-redis01
  - nginx-proxy
```

---

## 🗂️ Current Services on dp1

Your VM currently runs these services:

```
dp1-dash01                    # Dashboard
site-duckshotanalytics-dev    # DuckShot Analytics Dev
site-duckshotanalytics        # DuckShot Analytics Prod
ducksnap-worker               # Worker service
dp1-orch01                    # Orchestrator
site-greenvoice               # GreenVoice
site-fortuneteller            # Fortune Teller
site-customstripe-dev         # Custom Stripe Dev
site-customstripe             # Custom Stripe Prod
site-crypt-ai-lytics          # Crypt AI Lytics
letsencrypt                   # SSL certificates
nginx-proxy                   # Reverse proxy
email-server                  # SMTP server
dp1-redis01                   # Redis cache
dp1-db01                      # PostgreSQL database
```

MysticFortune will be added to this stack as `site-mysticfortune` (and optionally `site-mysticfortune-dev`).

---

## 🆘 Troubleshooting

### Container won't start

```bash
# Check logs
podman-compose -f /home/cira/docker-compose.yml logs site-mysticfortune

# Check container status
podman ps -a | grep mysticfortune

# Inspect container
podman inspect site-mysticfortune
```

### Database connection errors

```bash
# Verify database exists
podman exec -it dp1-db01 psql -U postgres -l

# Test connection
podman exec -it dp1-db01 psql -U mysticfortune -d mysticfortune

# Check connection string in container
podman exec -it site-mysticfortune env | grep DATABASE_URL
```

### nginx-proxy not routing

```bash
# Check VIRTUAL_HOST is set correctly
podman inspect site-mysticfortune | grep VIRTUAL_HOST

# Check nginx-proxy logs
podman logs nginx-proxy

# Verify DNS resolves
nslookup mysticfortune.yourdomain.com
```

### SSL certificate issues

```bash
# Check Let's Encrypt logs
podman logs letsencrypt

# Manually trigger certificate generation
podman exec -it letsencrypt /app/signal_le_service
```

---

## 📝 Deployment Checklist

Before deploying MysticFortune to dp1:

- [ ] DNS A record configured for domain
- [ ] `.env` file created with all variables
- [ ] `deploy/podman/ADD_THIS_TO_COMPOSE.yml` created
- [ ] Service definition added to `/home/cira/docker-compose.yml`
- [ ] Environment variables verified (VIRTUAL_HOST, DATABASE_URL, etc.)
- [ ] Database created on dp1-db01
- [ ] Container built successfully
- [ ] Container started and running
- [ ] Logs show no errors
- [ ] Database migrations completed
- [ ] Health check endpoint responds
- [ ] HTTPS accessible via nginx-proxy
- [ ] SSL certificate valid

---

## 🎯 Quick Reference Commands

```bash
# Build
podman-compose -f /home/cira/docker-compose.yml build site-mysticfortune

# Start
podman-compose -f /home/cira/docker-compose.yml up -d site-mysticfortune

# Stop
podman-compose -f /home/cira/docker-compose.yml stop site-mysticfortune

# Restart
podman-compose -f /home/cira/docker-compose.yml restart site-mysticfortune

# Logs
podman-compose -f /home/cira/docker-compose.yml logs -f site-mysticfortune

# Status
podman-compose -f /home/cira/docker-compose.yml ps

# Execute command in container
podman exec -it site-mysticfortune <command>

# Database migrations
podman exec -it site-mysticfortune npm run db:push

# Enter container shell
podman exec -it site-mysticfortune bash
```

---

## 🔐 Security Notes

- Use strong passwords in `.env` file
- Never commit `.env` to version control
- Rotate `SESSION_SECRET` periodically
- Use separate databases for dev and prod
- Keep Podman and containers updated
- Monitor logs for security issues

---

**Your MysticFortune application will integrate seamlessly with the existing dp1 VM infrastructure using the same nginx-proxy, Let's Encrypt, database, and email services! 🎉**
