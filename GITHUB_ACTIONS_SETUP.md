# GitHub Actions Setup Guide

> Quick reference for setting up automated deployments

## 📦 What's Included

This repository includes a GitHub Actions workflow that automatically deploys your MysticFortune application to `dev.website.com` whenever you push to the `dev` branch.

**Workflow file location:** `.github/workflows/deploy-dev.yml`

---

## 🔑 Required GitHub Secrets

Before the workflow can run, you need to add these secrets to your GitHub repository:

### How to Add Secrets
1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each of the following secrets:

### Required Secrets

| Secret Name | What it is | How to get it |
|-------------|------------|---------------|
| `DEV_SERVER_HOST` | Server IP or domain | Your server's IP address or hostname (e.g., `123.45.67.89` or `server.example.com`) |
| `DEV_SERVER_USER` | SSH username | Username you use to SSH into server (e.g., `ubuntu`, `root`, or `deploy`) |
| `DEV_SERVER_SSH_KEY` | SSH private key | See instructions below |
| `DEV_SERVER_PORT` | SSH port (optional) | Usually `22` - only add if you use a custom SSH port |

---

## 🔐 Generating SSH Key for GitHub Actions

### On Your Local Machine

```bash
# 1. Generate a new SSH key pair
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions_mysticfortune

# Press Enter when asked for passphrase (no passphrase)

# 2. Copy the public key to your server
ssh-copy-id -i ~/.ssh/github_actions_mysticfortune.pub your-username@dev.website.com

# 3. Test the key works
ssh -i ~/.ssh/github_actions_mysticfortune your-username@dev.website.com

# 4. Display the private key to copy
cat ~/.ssh/github_actions_mysticfortune
```

### Adding Private Key to GitHub

1. Copy the **entire output** from the `cat` command, including:
   ```
   -----BEGIN OPENSSH PRIVATE KEY-----
   ... (all the content) ...
   -----END OPENSSH PRIVATE KEY-----
   ```

2. Go to GitHub → Settings → Secrets → New repository secret
3. Name: `DEV_SERVER_SSH_KEY`
4. Value: Paste the entire private key
5. Click **Add secret**

---

## 🚀 How to Deploy

### Automatic Deployments

The workflow triggers automatically when you:
- **Push to `dev` branch**: `git push origin dev`
- Any commit to the `dev` branch will trigger a deployment

### Manual Deployments

You can also trigger deployments manually:

1. Go to your GitHub repository
2. Click **Actions** tab
3. Select **Deploy to Development Server** workflow
4. Click **Run workflow** button
5. Select branch (usually `dev`)
6. Click **Run workflow**

---

## 📋 What the Workflow Does

When triggered, the GitHub Actions workflow:

1. ✅ Checks out your code
2. ✅ Sets up Node.js 18
3. ✅ Installs dependencies
4. ✅ Runs TypeScript type checks
5. ✅ Builds the application
6. ✅ Connects to your server via SSH
7. ✅ Pulls latest code on server
8. ✅ Installs dependencies on server
9. ✅ Runs database migrations
10. ✅ Builds application on server
11. ✅ Restarts the application with PM2
12. ✅ Verifies deployment is successful

---

## 🔍 Monitoring Deployments

### View Deployment Status

1. Go to **Actions** tab in GitHub
2. Click on the latest workflow run
3. Watch real-time deployment progress
4. Check for any errors in the logs

### Understanding Status Icons

- 🟡 **Yellow dot** = Deployment in progress
- ✅ **Green checkmark** = Deployment successful
- ❌ **Red X** = Deployment failed

### If Deployment Fails

1. Click on the failed workflow run
2. Expand the failed step to see error logs
3. Common issues:
   - SSH connection problems → Check SSH key in secrets
   - Database errors → Check DATABASE_URL on server
   - Build errors → Check code for TypeScript errors locally first

---

## 🔧 Customizing the Workflow

### Change Deployment Branch

Edit `.github/workflows/deploy-dev.yml`:

```yaml
on:
  push:
    branches:
      - dev        # Change this to your preferred branch
      - develop    # Or add more branches
```

### Change Application Directory on Server

Edit the `script` section in `.github/workflows/deploy-dev.yml`:

```yaml
script: |
  cd /var/www/dev.website.com  # Change this path
```

### Use Different Process Manager

If you're using a different process manager instead of PM2:

```yaml
# For systemd
sudo systemctl restart mysticfortune

# For Docker
docker-compose restart

# For direct node
pkill node && npm start &
```

---

## 🎯 Production Deployment Workflow

Want to deploy to production too? Create `.github/workflows/deploy-prod.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  deploy:
    name: Deploy to production.website.com
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install and test
        run: |
          npm ci
          npm run check

      - name: Build
        run: npm run build

      - name: Deploy to production
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.PROD_SERVER_HOST }}
          username: ${{ secrets.PROD_SERVER_USER }}
          key: ${{ secrets.PROD_SERVER_SSH_KEY }}
          port: ${{ secrets.PROD_SERVER_PORT || 22 }}
          script: |
            cd /var/www/production.website.com
            git pull origin main
            npm ci --production=false
            npm run db:push
            npm run build
            pm2 restart mysticfortune-prod
            pm2 save
```

Add these additional secrets for production:
- `PROD_SERVER_HOST`
- `PROD_SERVER_USER`
- `PROD_SERVER_SSH_KEY`

---

## 📞 Troubleshooting

### "Permission denied (publickey)" Error

**Problem:** SSH key not working

**Solutions:**
1. Make sure you copied the **entire** private key including header/footer
2. Verify the public key is in `~/.ssh/authorized_keys` on the server
3. Check file permissions on server:
   ```bash
   chmod 700 ~/.ssh
   chmod 600 ~/.ssh/authorized_keys
   ```

### "Host key verification failed" Error

**Problem:** Server's SSH fingerprint not recognized

**Solution:** Add this to your workflow before the SSH action:
```yaml
- name: Add server to known hosts
  run: ssh-keyscan -H ${{ secrets.DEV_SERVER_HOST }} >> ~/.ssh/known_hosts
```

### Workflow Not Triggering

**Problem:** Push to branch doesn't trigger workflow

**Solutions:**
1. Check branch name matches in workflow file
2. Ensure workflow file is in `main` or default branch
3. Check Actions tab for any disabled workflows

### Build Failing on Server

**Problem:** Build succeeds locally but fails on server

**Solutions:**
1. Check Node.js version on server: `node --version`
2. Ensure enough memory on server
3. Check environment variables are set on server
4. Review build logs in GitHub Actions

---

## ✅ Checklist for First Deployment

Before your first deployment, make sure:

- [ ] Server is set up (see `DEPLOYMENT_SETUP.md`)
- [ ] Database is created and running
- [ ] `.env` file is configured on server
- [ ] All GitHub secrets are added correctly
- [ ] SSH key authentication works
- [ ] PM2 is installed on server
- [ ] Nginx is configured and running
- [ ] SSL certificate is installed
- [ ] Application directory exists: `/var/www/dev.website.com`

---

## 🎉 Next Steps

1. **Test the workflow**: Make a small change and push to `dev` branch
2. **Monitor the deployment**: Watch the Actions tab
3. **Verify the site**: Visit https://dev.website.com
4. **Check logs** if needed: `pm2 logs mysticfortune-dev`

---

Happy deploying! 🚀✨
