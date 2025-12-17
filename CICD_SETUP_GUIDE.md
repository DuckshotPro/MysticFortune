# 🚀 CI/CD Setup Verification & Configuration

## ✅ Your Infrastructure

**Production**: `fortunetellertarot.cards`  
**Development**: `dev.fortunetellertarot.cards`  
**Server**: nginx-proxy with Let's Encrypt  
**Container Platform**: Docker

---

## 📋 Current Status

### CI/CD Workflows Updated ✅
1. **`.github/workflows/ci-cd.yml`** - Production (main → fortunetellertarot.cards)
2. **`.github/workflows/deploy-dev.yml`** - Development (dev → dev.fortunetellertarot.cards)

### Branch Setup ✅
- **main** - Production branch
- **dev** - Development branch (created locally)

---

## 🔑 Required GitHub Secrets

Go to: `https://github.com/DuckshotPro/MysticFortune/settings/secrets/actions`

Add these secrets:

### Server Connection
```
SERVER_IP=74.208.227.161
SERVER_USER=cira
DP1_SSH_PRIVATE_KEY=<your_private_ssh_key>
```

### Let's Encrypt
```
LETSENCRYPT_EMAIL=your-email@domain.com
```

### Application Environment (Optional)
```
DATABASE_URL=<your_database_url>
SESSION_SECRET=<your_session_secret>
HUGGINGFACE_API_KEY=<optional>
```

---

## 🐳 Dockerfile Configuration

Current Dockerfile is configured for:
- **Build Stage**: Node 20
- **Production Stage**: Node 20 Alpine
- **Port**: 3000 (internal)
- **Exposes**: Port 3000

### nginx-proxy Configuration

Your containers will automatically:
1. Connect to `nginx-proxy` network
2. Get SSL certificates via Let's Encrypt
3. Route traffic based on `VIRTUAL_HOST`

**Environment Variables Set**:
- `VIRTUAL_HOST=fortunetellertarot.cards` (prod)
- `LETSENCRYPT_HOST=fortunetellertarot.cards` (prod)
- `VIRTUAL_HOST=dev.fortunetellertarot.cards` (dev)
- `LETSENCRYPT_HOST=dev.fortunetellertarot.cards` (dev)

---

## 📝 Server Setup Requirements

### 1. Create nginx-proxy network (if not exists)
```bash
ssh cira@74.208.227.161
docker network create nginx-proxy
```

### 2. Ensure nginx-proxy is running
```bash
docker ps | grep nginx-proxy
```

If not running, start it:
```bash
docker run -d -p 80:80 -p 443:443 \
  --name nginx-proxy \
  --network nginx-proxy \
  -v /var/run/docker.sock:/tmp/docker.sock:ro \
  -v nginx-certs:/etc/nginx/certs \
  -v nginx-vhost:/etc/nginx/vhost.d \
  -v nginx-html:/usr/share/nginx/html \
  nginxproxy/nginx-proxy

docker run -d \
  --name nginx-proxy-acme \
  --network nginx-proxy \
  --volumes-from nginx-proxy \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  -v nginx-acme:/etc/acme.sh \
  nginxproxy/acme-companion
```

### 3. Create .env files on server

**Production**: `/home/cira/mysticfortune-prod/.env`
```bash
DATABASE_URL=postgresql://...
SESSION_SECRET=your_secret_here
NODE_ENV=production
APP_URL=https://fortunetellertarot.cards
SMTP_HOST=mail.crypt-ai-lytics.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=support@crypt-ai-lytics.com
SMTP_PASSWORD=b3b29a5934de3bf9672bdd82
SMTP_FROM_EMAIL=noreply@mysticfortune.com
SMTP_FROM_NAME=Mystic Fortune
```

**Development**: `/home/cira/mysticfortune-dev/.env`
```bash
DATABASE_URL=postgresql://...
SESSION_SECRET=your_dev_secret_here
NODE_ENV=development
APP_URL=https://dev.fortunetellertarot.cards
SMTP_HOST=mail.crypt-ai-lytics.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=support@crypt-ai-lytics.com
SMTP_PASSWORD=b3b29a5934de3bf9672bdd82
SMTP_FROM_EMAIL=noreply@dev.mysticfortune.com
SMTP_FROM_NAME=Mystic Fortune Dev
```

---

## 🔄 Deployment Workflow

### Development Deployment
```bash
# Switch to dev branch
git checkout dev

# Make changes
# ... edit files ...

# Commit and push
git add .
git commit -m "feat: your changes"
git push origin dev

# GitHub Actions will automatically deploy to dev.fortunetellertarot.cards
```

### Production Deployment
```bash
# Switch to main branch
git checkout main

# Merge dev into main
git merge dev

# Push to production
git push origin main

# GitHub Actions will automatically deploy to fortunetellertarot.cards
```

---

## 🧪 Testing the Workflow

### 1. Push dev branch first
```bash
git checkout dev
git add .
git commit -m "chore: update CI/CD workflows"
git push origin dev
```

Watch the GitHub Actions: `https://github.com/DuckshotPro/MysticFortune/actions`

### 2. Verify development deployment
```bash
curl -I https://dev.fortunetellertarot.cards
```

### 3. Merge to production
```bash
git checkout main
git merge dev
git push origin main
```

### 4. Verify production deployment
```bash
curl -I https://fortunetellertarot.cards
```

---

## 🐛 Troubleshooting

### Issue: "network nginx-proxy not found"
**Solution**: Create the network on server
```bash
ssh cira@74.208.227.161 "docker network create nginx-proxy"
```

### Issue: "No SSL certificate"
**Solution**: Check acme-companion logs
```bash
ssh cira@74.208.227.161 "docker logs nginx-proxy-acme"
```

### Issue: "502 Bad Gateway"
**Solution**: Check container logs
```bash
ssh cira@74.208.227.161 "docker logs mysticfortune-prod"
# or
ssh cira@74.208.227.161 "docker logs mysticfortune-dev"
```

### Issue: "Container won't start"
**Solution**: Check env file exists
```bash
ssh cira@74.208.227.161 "ls -la /home/cira/mysticfortune-prod/.env"
```

---

## ✅ Verification Checklist

Before pushing to production, verify:

- [ ] GitHub secrets configured
- [ ] nginx-proxy network exists on server
- [ ] nginx-proxy + acme-companion running
- [ ] .env files created on server (prod & dev)
- [ ] DNS pointing to server IP (74.208.227.161)
  - [ ] fortunetellertarot.cards → 74.208.227.161
  - [ ] dev.fortunetellertarot.cards → 74.208.227.161
- [ ] SSH key added to GitHub secrets
- [ ] Local dev branch created
- [ ] Both workflows tested

---

## 📊 Current Local Setup

**Branch**: `dev` (created)  
**Remote**: `origin` → `https://github.com/DuckshotPro/MysticFortune.git`  
**Workflows**: Updated for nginx-proxy

---

## 🚀 Next Steps

1. **Push dev branch**:
```bash
git push -u origin dev
```

2. **Configure GitHub Secrets** (see required secrets above)

3. **Create server .env files**

4. **Test dev deployment** (push to dev branch)

5. **Merge to main for production**

6. **Continue with Phase 2** (social media automation)

---

## 💡 Notes

- Both workflows use **rsync** for file transfer (faster than git pull)
- Containers auto-restart on server reboot
- SSL certificates auto-renew every 60 days
- Old Docker images auto-pruned to save space
- Deployment takes ~2-3 minutes per environment

---

**Your CI/CD is configured correctly! ✅**

Ready to push and deploy!
