# GitHub Actions Setup for dp1 VM Deployment

> Automated deployment to dp1 VM using Podman

## 📦 Workflow Files

Two GitHub Actions workflows are configured for your dp1 VM:

1. **[.github/workflows/deploy-dp1.yml](file:///c:/Users/420du/GitDuck/MysticFortune/.github/workflows/deploy-dp1.yml)**
   - Triggers on: Push to `main` or `master` branch
   - Deploys to: Production (`site-mysticfortune`)
   - URL: https://mysticfortune.yourdomain.com

2. **[.github/workflows/deploy-dp1-dev.yml](file:///c:/Users/420du/GitDuck/MysticFortune/.github/workflows/deploy-dp1-dev.yml)**
   - Triggers on: Push to `dev` or `develop` branch
   - Deploys to: Development (`site-mysticfortune-dev`)
   - URL: https://dev.mysticfortune.yourdomain.com

---

## 🔑 Required GitHub Secrets

Add these secrets to your GitHub repository for the workflows to work:

### How to Add Secrets

1. Go to GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret below

### Required Secrets for dp1 VM

| Secret Name | Value | Example |
|-------------|-------|---------|
| `DP1_SERVER_HOST` | dp1 VM IP address | `74.208.227.161` |
| `DP1_SERVER_USER` | SSH username | `cira` |
| `DP1_SERVER_SSH_KEY` | SSH private key | *(see below)* |
| `DP1_SERVER_PORT` | SSH port (optional) | `22` (default) |

---

## 🔐 Setting Up SSH Key

### Option 1: Use Existing Key (Recommended)

If you already have SSH access to dp1, use that key:

```bash
# On your local machine, display your private key
cat ~/.ssh/id_rsa
# or
cat ~/.ssh/id_ed25519

# Copy the ENTIRE output including headers
-----BEGIN OPENSSH PRIVATE KEY-----
...
-----END OPENSSH PRIVATE KEY-----
```

Add this as `DP1_SERVER_SSH_KEY` in GitHub secrets.

### Option 2: Create New Key for GitHub Actions

Create a dedicated key for CI/CD:

```bash
# Generate new SSH key
ssh-keygen -t ed25519 -C "github-actions-dp1" -f ~/.ssh/github_actions_dp1

# Copy public key to dp1 VM
ssh-copy-id -i ~/.ssh/github_actions_dp1.pub cira@74.208.227.161

# Test connection
ssh -i ~/.ssh/github_actions_dp1 cira@74.208.227.161

# Display private key to copy
cat ~/.ssh/github_actions_dp1
```

Copy the private key to GitHub as `DP1_SERVER_SSH_KEY`.

---

## 🚀 How Deployment Works

### Production Workflow (`main` branch)

```mermaid
graph LR
    A[Push to main] --> B[GitHub Actions]
    B --> C[Build & Test]
    C --> D[SSH to dp1]
    D --> E[Pull code]
    E --> F[Build Podman image]
    F --> G[Restart container]
    G --> H[Run migrations]
    H --> I[Verify deployment]
```

**Steps:**
1. Push to `main` branch triggers workflow
2. GitHub Actions builds and tests code
3. Connects to dp1 VM via SSH (as `cira`)
4. Pulls latest code to `/home/cira/MysticFortune`
5. Builds new Podman container
6. Stops old `site-mysticfortune` container
7. Starts new container with latest code
8. Runs database migrations
9. Verifies deployment

### Development Workflow (`dev` branch)

Same process but:
- Triggers on push to `dev` branch
- Deploys to `site-mysticfortune-dev` container
- Uses development database
- Different URL (dev.mysticfortune.yourdomain.com)

---

## 📋 Deployment Commands

### Automatic Deployment (Recommended)

```bash
# Production deployment
git add .
git commit -m "Update feature"
git push origin main  # Triggers automatic deployment

# Development deployment  
git add .
git commit -m "Test new feature"
git push origin dev  # Triggers dev deployment
```

### Manual Trigger

You can also trigger deployments manually in GitHub:

1. Go to **Actions** tab
2. Select workflow (Deploy to dp1 VM or Deploy to dp1 VM Dev)
3. Click **Run workflow**
4. Select branch
5. Click **Run workflow**

---

## 🔍 Monitoring Deployments

### View Deployment Status

1. Go to **Actions** tab in GitHub
2. Click on latest workflow run
3. Watch real-time deployment logs
4. Each step shows detailed output

### Workflow Status Icons

- 🟡 **Yellow dot** = Deployment in progress
- ✅ **Green checkmark** = Deployment successful
- ❌ **Red X** = Deployment failed

### Check Logs on dp1 VM

```bash
# SSH into dp1
ssh cira@74.208.227.161

# Check container status
podman-compose -f /home/cira/docker-compose.yml ps | grep mysticfortune

# View logs
podman-compose -f /home/cira/docker-compose.yml logs -f site-mysticfortune

# Or for dev
podman-compose -f /home/cira/docker-compose.yml logs -f site-mysticfortune-dev
```

---

## 🛠️ What the Workflow Does

### On Every Deployment:

1. ✅ Checks out latest code
2. ✅ Sets up Node.js 18
3. ✅ Installs dependencies (`npm ci`)
4. ✅ Runs TypeScript checks (`npm run check`)
5. ✅ Builds application (`npm run build`)
6. ✅ Connects to dp1 VM via SSH
7. ✅ Pulls latest code on server
8. ✅ Rebuilds Podman container
9. ✅ Stops old container
10. ✅ Starts new container
11. ✅ Runs database migrations
12. ✅ Verifies container is running
13. ✅ Tests HTTPS endpoint

---

## 🆘 Troubleshooting

### "Permission denied (publickey)" Error

**Problem:** SSH authentication failed

**Solutions:**
1. Verify `DP1_SERVER_SSH_KEY` contains entire private key with headers
2. Test SSH key locally:
   ```bash
   ssh -i ~/.ssh/your_key cira@74.208.227.161
   ```
3. Check public key is in `/home/cira/.ssh/authorized_keys` on dp1
4. Verify file permissions:
   ```bash
   chmod 700 ~/.ssh
   chmod 600 ~/.ssh/authorized_keys
   ```

### Build Fails on dp1

**Problem:** Container build fails on server

**Solutions:**
1. Check GitHub Actions logs for specific error
2. SSH into dp1 and manually test build:
   ```bash
   cd /home/cira/MysticFortune
   podman-compose -f /home/cira/docker-compose.yml build site-mysticfortune
   ```
3. Check disk space: `df -h`
4. Check Podman status: `podman ps -a`

### Container Won't Start

**Problem:** New container fails to start

**Solutions:**
1. Check logs in GitHub Actions
2. SSH into dp1 and check container logs:
   ```bash
   podman logs site-mysticfortune
   ```
3. Verify environment variables in compose file
4. Check database connectivity:
   ```bash
   podman exec site-mysticfortune npm run check
   ```

### Deployment Succeeds But Site Down

**Problem:** Workflow succeeds but site is inaccessible

**Solutions:**
1. Check nginx-proxy is routing correctly:
   ```bash
   podman logs nginx-proxy | grep mysticfortune
   ```
2. Verify VIRTUAL_HOST matches domain
3. Check DNS resolves: `nslookup mysticfortune.yourdomain.com`
4. Check Let's Encrypt certificate:
   ```bash
   podman logs letsencrypt | grep mysticfortune
   ```

---

## ✅ Pre-Deployment Checklist

Before first deployment, ensure:

- [ ] MysticFortune service added to `/home/cira/docker-compose.yml`
- [ ] Database created on dp1-db01
- [ ] DNS A records configured
- [ ] All GitHub secrets added correctly
- [ ] SSH key authentication works
- [ ] Test SSH connection from local machine
- [ ] `.env` file exists on dp1 (in `/home/cira/MysticFortune/`)

---

## 🎯 Deployment Workflow

### First Time Setup

1. **Admin prepares dp1 VM** (see [DEPLOY_TO_DP1_VM.md](file:///c:/Users/420du/GitDuck/MysticFortune/DEPLOY_TO_DP1_VM.md))
2. **Add GitHub secrets** (see above)
3. **Push to trigger deployment**:
   ```bash
   git push origin dev  # Test dev first
   git push origin main # Then production
   ```

### Ongoing Deployments

```bash
# Make changes
vim src/some-file.ts

# Commit and push
git add .
git commit -m "Add new feature"
git push origin dev  # Auto-deploys to dev

# After testing, merge to main
git checkout main
git merge dev
git push origin main  # Auto-deploys to production
```

---

## 🔄 Rollback Strategy

If deployment fails or introduces bugs:

### Option 1: Revert Commit

```bash
# Locally revert last commit
git revert HEAD

# Push to trigger redeployment
git push origin main
```

### Option 2: Manual Rollback on Server

```bash
# SSH into dp1
ssh cira@74.208.227.161

# Go to app directory
cd /home/cira/MysticFortune

# Reset to previous commit
git log --oneline  # Find previous commit hash
git reset --hard <commit-hash>

# Rebuild and restart
cd /home/cira
podman-compose -f docker-compose.yml build site-mysticfortune
podman-compose -f docker-compose.yml up -d site-mysticfortune
```

---

## 📊 Current Deployment Setup

After setup, your deployment architecture will be:

```
GitHub Repository
  ├─ main branch → dp1 VM → site-mysticfortune (Production)
  └─ dev branch  → dp1 VM → site-mysticfortune-dev (Development)

dp1 VM (74.208.227.161)
  ├─ /home/cira/MysticFortune (source code)
  ├─ /home/cira/docker-compose.yml (container definitions)
  ├─ nginx-proxy → Routes traffic
  ├─ letsencrypt → Manages SSL
  ├─ dp1-db01 → PostgreSQL databases
  └─ email-server → SMTP for emails
```

---

## 🎉 Next Steps

1. **Add GitHub secrets** (DP1_SERVER_HOST, DP1_SERVER_USER, DP1_SERVER_SSH_KEY)
2. **Test dev deployment**: Push to `dev` branch
3. **Monitor GitHub Actions**: Watch deployment in Actions tab
4. **Verify on dp1**: SSH in and check container status
5. **Test the site**: Visit https://dev.mysticfortune.yourdomain.com
6. **Deploy to production**: Merge to `main` branch

---

**Your dp1 VM deployments are now fully automated! 🚀✨**
