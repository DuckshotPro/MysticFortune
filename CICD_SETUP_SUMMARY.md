# CI/CD Setup Summary for fortunetellertarot.cards

## Overview
Your project now has a clean, separated CI/CD pipeline with **development** and **production** environments that deploy to different subdomains.

## Workflow Structure

### 1. **Production Workflow** (`.github/workflows/ci-cd.yml`)
**Triggers:** Push to `main` branch or manual trigger (`workflow_dispatch`)

**Deploys to:** `fortunetellertarot.cards` (production)

**Flow:**
1. Checkout code from `main` branch
2. Install Node.js 20 & dependencies
3. Build app with `NODE_ENV=production`
4. SSH into DP1 server (74.208.227.161)
5. Fetch, checkout, and pull latest `main` branch
6. Build Podman container image: `mysticfortune:latest`
7. Stop & remove old production container
8. Run new production container with:
   - Container name: `mysticfortune`
   - Network: `web-net`
   - Virtual hosts: `fortunetellertarot.cards`, `www.fortunetellertarot.cards`
   - Port mapping: 3000 (internal) → nginx-proxy handles external
   - Auto-restart: enabled
9. Verify site is accessible (HTTP status check)
10. Notify on success/failure

### 2. **Development Workflow** (`.github/workflows/deploy-dev.yml`)
**Triggers:** Push to `dev` or `develop` branch, or manual trigger

**Deploys to:** `dev.fortunetellertarot.cards` (development)

**Flow:**
1. Checkout code from `dev` branch
2. Install Node.js 20 & dependencies
3. Build app with `NODE_ENV=development`
4. SSH into DP1 server
5. Fetch, checkout, and pull latest `dev` branch
6. Build Podman container image: `mysticfortune:dev`
7. Stop & remove old dev container
8. Run new dev container with:
   - Container name: `mysticfortune-dev`
   - Network: `web-net`
   - Virtual host: `dev.fortunetellertarot.cards`
   - Port mapping: 3000 (internal)
   - Auto-restart: enabled
9. Verify site is accessible
10. Notify on success/failure

## Development Workflow

### Local Development:
```bash
# Clone/pull the dev branch
git clone https://github.com/DuckshotPro/MysticFortune.git
cd MysticFortune
git checkout dev

# Make changes
# ... edit code ...

# Commit and push to dev
git add .
git commit -m "your message"
git push origin dev
```

**GitHub Actions automatically:**
- Builds your code
- Tests it on the dev environment
- Deploys to `dev.fortunetellertarot.cards`

### Promote to Production:
```bash
# Create a pull request from dev → main
# Or merge directly (if approved)
git checkout main
git pull origin main
git merge dev
git push origin main
```

**GitHub Actions automatically:**
- Builds your code
- Tests it on the production environment
- Deploys to `fortunetellertarot.cards`

## Required GitHub Secrets

The following secrets must be configured in your GitHub repository settings:

1. **`DP1_SSH_PRIVATE_KEY`** - Your SSH private key for server access
   - User: `cira`
   - Host: `74.208.227.161`
   - Used for: Deploying containers via SSH

2. **`.env` file** - Must exist on the DP1 server at:
   - `/home/cira/fortunetellertarot.cards-MysticFortune/.env`
   - Contains database credentials, API keys, etc.

### To Add Secrets:
1. Go to GitHub repo → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `DP1_SSH_PRIVATE_KEY`
4. Value: Your SSH private key (contents of `ssh_dp1` file)

## Directory Structure on Server

```
/home/cira/
├── fortunetellertarot.cards-MysticFortune/  (your repo clone)
│   ├── .env
│   ├── Dockerfile
│   ├── package.json
│   └── ...
```

## Podman Container Management

**Production container:**
```bash
podman ps | grep mysticfortune          # List prod container
podman logs mysticfortune                # View prod logs
podman stop mysticfortune                # Stop prod
podman restart mysticfortune             # Restart prod
```

**Development container:**
```bash
podman ps | grep mysticfortune-dev       # List dev container
podman logs mysticfortune-dev            # View dev logs
podman stop mysticfortune-dev            # Stop dev
podman restart mysticfortune-dev         # Restart dev
```

## Verification

### Access your sites:
- **Production**: https://fortunetellertarot.cards
- **Development**: https://dev.fortunetellertarot.cards

### Check deployment logs:
1. Go to GitHub repo → Actions tab
2. Click on the workflow run
3. Expand job steps to see detailed logs

### Manual Deployment:
If you need to deploy without pushing code:
1. Go to Actions tab
2. Select the workflow (ci-cd or deploy-dev)
3. Click "Run workflow"
4. Select branch and click "Run workflow"

## Troubleshooting

**Deployment fails?**
- Check GitHub Actions logs in the Actions tab
- Verify SSH key is correct in secrets
- Ensure `.env` file exists on server
- Check if containers are running: `podman ps`

**Site not accessible?**
- Wait 15-20 seconds for container to start
- Check container logs: `podman logs mysticfortune`
- Verify nginx-proxy is running
- Check domain DNS/SSL certificate

**Need to manually deploy?**
```bash
ssh cira@74.208.227.161
cd /home/cira/fortunetellertarot.cards-MysticFortune
git fetch origin dev && git checkout dev && git pull
npm install
podman build -t mysticfortune:dev -f Dockerfile .
podman restart mysticfortune-dev
```

## Key Improvements

✅ **Separated workflows** - Dev and production have independent pipelines  
✅ **Branch-based triggers** - `dev` → dev site, `main` → prod site  
✅ **Clean configuration** - Removed merge conflicts, organized files  
✅ **Health checks** - Each deployment verifies site accessibility  
✅ **Automatic restarts** - Containers restart on server reboot  
✅ **Environment separation** - Different NODE_ENV for each deployment  
✅ **Easy promotion** - Merge from dev to main to push to production  

## Next Steps

1. Verify SSH key is configured as `DP1_SSH_PRIVATE_KEY` secret
2. Test a push to `dev` branch to trigger dev deployment
3. Verify `dev.fortunetellertarot.cards` is accessible
4. Test merging to `main` branch to trigger production deployment
5. Monitor GitHub Actions logs during deployments
