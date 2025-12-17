# MysticFortune Deployment Setup Guide

> Complete guide for server admin to set up dev.website.com

## 📋 Prerequisites

### Server Requirements
- Ubuntu 20.04+ or similar Linux distribution
- Node.js 18.x or higher
- PostgreSQL 14+ database
- Nginx web server
- PM2 process manager
- Git
- SSL certificate (Let's Encrypt recommended)

### Access Requirements
- SSH access to the server
- sudo privileges
- GitHub repository access

---

## 🔧 Server Setup Instructions

### Step 1: Install Required Software

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Nginx
sudo apt install -y nginx

# Install PM2 globally
sudo npm install -g pm2

# Install Git (if not already installed)
sudo apt install -y git

# Install Certbot for SSL
sudo apt install -y certbot python3-certbot-nginx
```

### Step 2: Create Database

```bash
# Switch to postgres user
sudo -u postgres psql

# In PostgreSQL prompt, run:
CREATE DATABASE mysticfortune_dev;
CREATE USER mysticfortune WITH ENCRYPTED PASSWORD 'your_secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE mysticfortune_dev TO mysticfortune;

# Grant additional permissions (PostgreSQL 15+)
\c mysticfortune_dev
GRANT ALL ON SCHEMA public TO mysticfortune;

# Exit PostgreSQL
\q
```

### Step 3: Set Up Application Directory

```bash
# Create application directory
sudo mkdir -p /var/www/dev.website.com
sudo chown -R $USER:$USER /var/www/dev.website.com

# Navigate to directory
cd /var/www/dev.website.com

# Clone repository (replace with your actual repo URL)
git clone https://github.com/yourusername/MysticFortune.git .

# Checkout development branch
git checkout dev

# Install dependencies
npm ci
```

### Step 4: Configure Environment Variables

```bash
# Create .env file
nano /var/www/dev.website.com/.env
```

Add the following content (customize values):

```env
# Database Configuration
DATABASE_URL=postgresql://mysticfortune:your_secure_password_here@localhost:5432/mysticfortune_dev

# Session Configuration
SESSION_SECRET=generate_a_random_string_here_use_openssl_rand_base64_32

# Application Configuration
NODE_ENV=production
PORT=5000
APP_URL=https://dev.website.com

# Optional: AI Features
HUGGINGFACE_API_KEY=your_huggingface_api_key_if_using_ai

# Optional: Payment Integration (if using Stripe)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

**To generate SESSION_SECRET:**
```bash
openssl rand -base64 32
```

### Step 5: Initialize Database

```bash
# Run database migrations
npm run db:push

# Optional: Seed initial data if available
npm run db:seed
```

### Step 6: Build Application

```bash
# Build frontend and backend
npm run build
```

### Step 7: Configure Nginx

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/dev.website.com
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name dev.website.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name dev.website.com;

    # SSL Configuration (will be added by Certbot)
    ssl_certificate /etc/letsencrypt/live/dev.website.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/dev.website.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Proxy settings
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket support
    location /ws {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }

    # Client max body size for uploads
    client_max_body_size 10M;

    # Logging
    access_log /var/log/nginx/dev.website.com.access.log;
    error_log /var/log/nginx/dev.website.com.error.log;
}
```

Enable the site:

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/dev.website.com /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### Step 8: Set Up SSL Certificate

```bash
# Obtain SSL certificate from Let's Encrypt
sudo certbot --nginx -d dev.website.com

# Follow the prompts to complete SSL setup

# Test automatic renewal
sudo certbot renew --dry-run
```

### Step 9: Start Application with PM2

```bash
# Navigate to application directory
cd /var/www/dev.website.com

# Start application with PM2
pm2 start dist/index.js --name mysticfortune-dev

# Save PM2 configuration
pm2 save

# Set PM2 to start on system boot
pm2 startup
# Follow the command that PM2 outputs

# Check application status
pm2 status
pm2 logs mysticfortune-dev
```

### Step 10: Configure Firewall

```bash
# Allow SSH, HTTP, and HTTPS
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable

# Check firewall status
sudo ufw status
```

---

## 🔐 GitHub Actions Secrets Setup

For the GitHub Actions workflow to work, add the following secrets to your GitHub repository:

1. Go to: `Settings` → `Secrets and variables` → `Actions`
2. Add the following repository secrets:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `DEV_SERVER_HOST` | Server IP or hostname | `123.45.67.89` or `server.example.com` |
| `DEV_SERVER_USER` | SSH username | `ubuntu` or `deploy` |
| `DEV_SERVER_SSH_KEY` | Private SSH key | Content of `~/.ssh/id_rsa` |
| `DEV_SERVER_PORT` | SSH port (optional) | `22` (default) |

### Generating SSH Key for GitHub Actions

On your local machine or the server:

```bash
# Generate SSH key pair
ssh-keygen -t ed25519 -C "github-actions@mysticfortune" -f ~/.ssh/github_actions_deploy

# Copy public key to server
ssh-copy-id -i ~/.ssh/github_actions_deploy.pub user@dev.website.com

# Display private key to add to GitHub Secrets
cat ~/.ssh/github_actions_deploy
```

Copy the **entire private key** (including `-----BEGIN` and `-----END` lines) and add it as `DEV_SERVER_SSH_KEY` secret in GitHub.

---

## 🚀 Deployment Process

### Automatic Deployment
Once GitHub Actions is configured, deployments happen automatically:

1. **Push to dev branch** → Triggers automatic deployment
2. **Manual deployment** → Go to `Actions` tab → Select `Deploy to Development Server` → Click `Run workflow`

### Manual Deployment
If you need to deploy manually without GitHub Actions:

```bash
# SSH into server
ssh user@dev.website.com

# Navigate to app directory
cd /var/www/dev.website.com

# Pull latest changes
git pull origin dev

# Install dependencies
npm ci

# Run database migrations
npm run db:push

# Build application
npm run build

# Restart PM2 process
pm2 restart mysticfortune-dev

# Check logs
pm2 logs mysticfortune-dev
```

---

## 🔍 Verification Steps

After deployment, verify everything is working:

```bash
# Check if PM2 process is running
pm2 status

# View application logs
pm2 logs mysticfortune-dev --lines 50

# Check Nginx status
sudo systemctl status nginx

# Test application endpoint
curl https://dev.website.com/api/health

# Check database connection
cd /var/www/dev.website.com
npm run check
```

Access the application:
- **URL**: https://dev.website.com

---

## 📊 Monitoring & Maintenance

### View Logs
```bash
# PM2 logs (application)
pm2 logs mysticfortune-dev

# Nginx access logs
sudo tail -f /var/log/nginx/dev.website.com.access.log

# Nginx error logs
sudo tail -f /var/log/nginx/dev.website.com.error.log
```

### Common PM2 Commands
```bash
pm2 status                    # Check status
pm2 restart mysticfortune-dev # Restart app
pm2 stop mysticfortune-dev    # Stop app
pm2 start mysticfortune-dev   # Start app
pm2 delete mysticfortune-dev  # Remove app from PM2
pm2 monit                     # Monitor resources
```

### Database Backup
```bash
# Backup database
pg_dump -U mysticfortune -h localhost mysticfortune_dev > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore database
psql -U mysticfortune -h localhost mysticfortune_dev < backup_20240101_120000.sql
```

---

## 🆘 Troubleshooting

### Application won't start
```bash
# Check PM2 logs
pm2 logs mysticfortune-dev --err

# Check if port 5000 is in use
sudo lsof -i :5000

# Verify environment variables
cat /var/www/dev.website.com/.env

# Test database connection
psql $DATABASE_URL
```

### Nginx errors
```bash
# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### SSL certificate issues
```bash
# Renew certificate manually
sudo certbot renew

# Check certificate expiry
sudo certbot certificates
```

### Database connection errors
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Restart PostgreSQL
sudo systemctl restart postgresql

# Check PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

---

## 📞 Support

For deployment issues, check:
1. Application logs: `pm2 logs mysticfortune-dev`
2. Nginx logs: `/var/log/nginx/dev.website.com.error.log`
3. PostgreSQL logs: `/var/log/postgresql/`
4. GitHub Actions logs (in repository Actions tab)

---

## 🔄 Updating the Application

The GitHub Actions workflow handles updates automatically, but for manual updates:

```bash
cd /var/www/dev.website.com
git pull origin dev
npm ci
npm run db:push
npm run build
pm2 restart mysticfortune-dev
```

---

**Need help?** Contact the development team or refer to the main project documentation.
