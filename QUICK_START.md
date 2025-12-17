# 🚀 Quick Start: Deploy MysticFortune

> **Multiple deployment options available**

This is a **quick reference** guide. For detailed instructions, see the full guides below.

---

## 🎯 Choose Your Deployment Method

### Option 1: Deploy to dp1 VM (Podman) 🐳
**Best for:** Existing dp1 infrastructure with containerization

- **Guide**: [DEPLOY_TO_DP1_VM.md](./DEPLOY_TO_DP1_VM.md)
- **GitHub Actions**: [GITHUB_ACTIONS_DP1.md](./GITHUB_ACTIONS_DP1.md)
- **Uses**: Podman, nginx-proxy, existing dp1 services
- **Server**: 74.208.227.161 (cira@dp1)

### Option 2: Deploy to Generic Server (PM2) 🚀
**Best for:** New server or traditional Node.js hosting

- **Guide**: [DEPLOYMENT_SETUP.md](./DEPLOYMENT_SETUP.md)
- **GitHub Actions**: [GITHUB_ACTIONS_SETUP.md](./GITHUB_ACTIONS_SETUP.md)
- **Uses**: PM2, Nginx, standalone PostgreSQL

---

## 📚 Documentation Files

Your repository now includes these deployment guides:

| File | Purpose |
|------|---------|
| **[DEPLOYMENT_SETUP.md](./DEPLOYMENT_SETUP.md)** | Complete server setup guide (for admin) |
| **[GITHUB_ACTIONS_SETUP.md](./GITHUB_ACTIONS_SETUP.md)** | GitHub Actions configuration |
| **[DNS_SETUP.md](./DNS_SETUP.md)** | DNS and SSL certificate setup |
| **[.env.example](./.env.example)** | Environment variables template |
| **[.github/workflows/deploy-dev.yml](./.github/workflows/deploy-dev.yml)** | GitHub Actions workflow |

---

## ⚡ Quick Deployment Steps

### Step 1️⃣: Server Setup (30-60 minutes)

**Admin tasks on the server:**

```bash
# 1. Install software
sudo apt update && sudo apt install -y nodejs npm postgresql nginx certbot python3-certbot-nginx
sudo npm install -g pm2

# 2. Create database
sudo -u postgres psql -c "CREATE DATABASE mysticfortune_dev;"
sudo -u postgres psql -c "CREATE USER mysticfortune WITH PASSWORD 'your_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE mysticfortune_dev TO mysticfortune;"

# 3. Clone repository
sudo mkdir -p /var/www/dev.website.com
sudo chown -R $USER:$USER /var/www/dev.website.com
cd /var/www/dev.website.com
git clone <YOUR_REPO_URL> .
git checkout dev

# 4. Configure environment
cp .env.example .env
nano .env  # Fill in DATABASE_URL and SESSION_SECRET

# 5. Install and build
npm ci
npm run db:push
npm run build

# 6. Start with PM2
pm2 start dist/index.js --name mysticfortune-dev
pm2 save
pm2 startup  # Follow the command it outputs
```

**See [DEPLOYMENT_SETUP.md](./DEPLOYMENT_SETUP.md) for detailed instructions including Nginx and SSL setup.**

---

### Step 2️⃣: DNS Configuration (5-10 minutes)

**Admin tasks in DNS panel:**

1. Log in to your DNS provider (Cloudflare, Route53, etc.)
2. Add an **A record**:
   - Name: `dev`
   - Value: Your server IP address
   - TTL: `3600` or Auto

**Wait 5-30 minutes for DNS propagation.**

**See [DNS_SETUP.md](./DNS_SETUP.md) for provider-specific instructions.**

---

### Step 3️⃣: GitHub Actions Setup (10 minutes)

**Developer tasks in GitHub:**

1. Go to GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Add these secrets:

| Secret Name | Value |
|-------------|-------|
| `DEV_SERVER_HOST` | Your server IP or hostname |
| `DEV_SERVER_USER` | SSH username (e.g., `ubuntu`) |
| `DEV_SERVER_SSH_KEY` | SSH private key (entire key including headers) |

3. To generate SSH key:
```bash
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions_deploy
ssh-copy-id -i ~/.ssh/github_actions_deploy.pub user@dev.website.com
cat ~/.ssh/github_actions_deploy  # Copy this to GitHub secret
```

**See [GITHUB_ACTIONS_SETUP.md](./GITHUB_ACTIONS_SETUP.md) for detailed instructions.**

---

### Step 4️⃣: Deploy! (2 minutes)

**Trigger deployment:**

```bash
# Push to dev branch
git push origin dev

# Or trigger manually in GitHub:
# Actions → Deploy to Development Server → Run workflow
```

**Verify:**
- Visit https://dev.website.com
- Check deployment logs in GitHub Actions tab

---

## ✅ Verification Checklist

After deployment, verify everything works:

```bash
# 1. Check DNS resolves
nslookup dev.website.com

# 2. Check application is running
pm2 status

# 3. Check logs
pm2 logs mysticfortune-dev

# 4. Test the application
curl https://dev.website.com/api/health

# 5. Visit in browser
# Open: https://dev.website.com
```

---

## 🔑 Required Secrets & Credentials

### Environment Variables (.env on server)

**Required:**
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Random string (generate with `openssl rand -base64 32`)

**Optional:**
- `HUGGINGFACE_API_KEY` - For AI features
- `STRIPE_SECRET_KEY` - For payments
- `STRIPE_PUBLISHABLE_KEY` - For payments

### GitHub Secrets

**Required for CI/CD:**
- `DEV_SERVER_HOST`
- `DEV_SERVER_USER`
- `DEV_SERVER_SSH_KEY`

---

## 🛠️ Common Commands

### On the Server

```bash
# View logs
pm2 logs mysticfortune-dev

# Restart application
pm2 restart mysticfortune-dev

# Stop application
pm2 stop mysticfortune-dev

# Check status
pm2 status

# View Nginx logs
sudo tail -f /var/log/nginx/dev.website.com.error.log

# Reload Nginx
sudo systemctl reload nginx

# Renew SSL certificate
sudo certbot renew

# Manual deployment
cd /var/www/dev.website.com
git pull origin dev
npm ci
npm run db:push
npm run build
pm2 restart mysticfortune-dev
```

### Local Development

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your local settings

# Run database migrations
npm run db:push

# Start dev server
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

---

## 🆘 Troubleshooting

### Application won't start
```bash
pm2 logs mysticfortune-dev --err
```

### DNS not resolving
```bash
# Wait longer or check DNS propagation
# Visit: https://dnschecker.org
```

### SSL certificate issues
```bash
sudo certbot certificates
sudo certbot --nginx -d dev.website.com --force-renewal
```

### GitHub Actions deployment fails
- Check GitHub Actions logs in the **Actions** tab
- Verify SSH key is correct in GitHub Secrets
- Test SSH connection: `ssh -i ~/.ssh/github_actions_deploy user@dev.website.com`

---

## 📞 Support

**For detailed instructions, see:**
- Server setup → [DEPLOYMENT_SETUP.md](./DEPLOYMENT_SETUP.md)
- GitHub Actions → [GITHUB_ACTIONS_SETUP.md](./GITHUB_ACTIONS_SETUP.md)
- DNS setup → [DNS_SETUP.md](./DNS_SETUP.md)

**Check logs:**
- Application: `pm2 logs mysticfortune-dev`
- Nginx: `/var/log/nginx/dev.website.com.error.log`
- GitHub Actions: Repository → Actions tab

---

## 🎯 Next Steps After Deployment

1. **Test the application** thoroughly on dev.website.com
2. **Set up monitoring** (optional): Add error tracking with Sentry
3. **Configure backups**: Set up automated database backups
4. **Production deployment**: Repeat process for production.website.com
5. **CI/CD for production**: Create `.github/workflows/deploy-prod.yml`

---

**Happy deploying! 🚀✨**

_Built with ❤️ for MysticFortune_
