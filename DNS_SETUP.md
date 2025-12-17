# DNS and Domain Setup Guide

> Instructions for configuring dev.website.com subdomain

## 📋 Overview

This guide explains how to set up the DNS records for `dev.website.com` to point to your development server.

---

## 🔍 Prerequisites

Before starting, you need:
- Access to your domain's DNS management panel (usually with your domain registrar)
- Your development server's IP address
- Administrative access to add/modify DNS records

---

## 🌐 DNS Configuration

### Option 1: A Record (Recommended)

This is the most common approach - pointing the subdomain directly to your server's IP address.

#### Steps:

1. **Log in to your DNS provider** (Cloudflare, Route53, Namecheap, GoDaddy, etc.)

2. **Go to DNS management** for your domain `website.com`

3. **Add a new A record** with these settings:
   - **Type**: `A`
   - **Name**: `dev` (or `dev.website.com` depending on your provider)
   - **Value/Points to**: Your server IP address (e.g., `123.45.67.89`)
   - **TTL**: `3600` (1 hour) or `Auto`
   - **Proxy status** (if using Cloudflare): Start with **DNS only** (grey cloud)

4. **Save the record**

#### Example Configuration:

```
Type    Name    Value           TTL
A       dev     123.45.67.89    3600
```

### Option 2: CNAME Record (Alternative)

Use this if your server has a hostname instead of a static IP.

#### Steps:

1. **Add a new CNAME record**:
   - **Type**: `CNAME`
   - **Name**: `dev`
   - **Value/Points to**: Your server hostname (e.g., `server.example.com`)
   - **TTL**: `3600`

2. **Save the record**

#### Example Configuration:

```
Type     Name    Value                 TTL
CNAME    dev     server.example.com    3600
```

---

## 🕐 DNS Propagation

After adding the DNS record:
- **Propagation time**: Usually 5-30 minutes, but can take up to 48 hours
- **Check status**: Use online tools to verify DNS propagation

### Verify DNS Propagation:

```bash
# Check if DNS is resolving (Linux/Mac)
nslookup dev.website.com

# Or use dig
dig dev.website.com

# Windows PowerShell
Resolve-DnsName dev.website.com

# Check from different locations
# Visit: https://dnschecker.org
# Enter: dev.website.com
```

Expected output:
```
Server:  your-dns-server
Address: x.x.x.x

Name:    dev.website.com
Address: 123.45.67.89
```

---

## 🔒 SSL Certificate Setup

After DNS is configured, you need an SSL certificate for HTTPS.

### Using Let's Encrypt (Free & Automated)

This is handled automatically if you followed the server setup guide:

```bash
# SSH into your server
ssh user@dev.website.com

# Install Certbot (if not already installed)
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d dev.website.com

# Follow the prompts:
# - Enter email address
# - Agree to terms
# - Choose whether to redirect HTTP to HTTPS (recommended: Yes)

# Verify certificate
sudo certbot certificates

# Test automatic renewal
sudo certbot renew --dry-run
```

Let's Encrypt certificates auto-renew. Certbot sets up a cron job automatically.

### Using Custom SSL Certificate

If you have a custom SSL certificate:

```bash
# Copy certificate files to server
scp your-certificate.crt user@dev.website.com:/etc/ssl/certs/
scp your-private-key.key user@dev.website.com:/etc/ssl/private/

# Update Nginx configuration
sudo nano /etc/nginx/sites-available/dev.website.com
```

Update these lines:
```nginx
ssl_certificate /etc/ssl/certs/your-certificate.crt;
ssl_certificate_key /etc/ssl/private/your-private-key.key;
```

Reload Nginx:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## ☁️ Provider-Specific Instructions

### Cloudflare

1. Log in to Cloudflare dashboard
2. Select your domain `website.com`
3. Go to **DNS** tab
4. Click **Add record**
5. Configure:
   - Type: `A`
   - Name: `dev`
   - IPv4 address: Your server IP
   - Proxy status: **DNS only** (grey cloud) ⚠️ Important for first setup
   - TTL: `Auto`
6. Click **Save**

**Note:** You can enable Cloudflare proxy (orange cloud) after verifying the site works, but start with DNS only to troubleshoot easier.

### AWS Route 53

1. Open Route 53 console
2. Click **Hosted zones**
3. Select `website.com`
4. Click **Create record**
5. Configure:
   - Record name: `dev`
   - Record type: `A`
   - Value: Your server IP
   - TTL: `300`
   - Routing policy: `Simple routing`
6. Click **Create records**

### Namecheap

1. Log in to Namecheap
2. Go to **Domain List** → Select `website.com`
3. Click **Advanced DNS**
4. Click **Add New Record**
5. Configure:
   - Type: `A Record`
   - Host: `dev`
   - Value: Your server IP
   - TTL: `Automatic`
6. Click **Save**

### GoDaddy

1. Log in to GoDaddy
2. Go to **My Products** → **DNS**
3. Select `website.com`
4. Click **Add** under Records
5. Configure:
   - Type: `A`
   - Name: `dev`
   - Value: Your server IP
   - TTL: `1 Hour`
6. Click **Save**

---

## ✅ Verification Checklist

After DNS and SSL setup, verify everything works:

### 1. DNS Resolution
```bash
# Should return your server IP
nslookup dev.website.com
```

### 2. HTTP Access
```bash
# Should redirect to HTTPS or show the site
curl -I http://dev.website.com
```

### 3. HTTPS Access
```bash
# Should return 200 OK
curl -I https://dev.website.com
```

### 4. SSL Certificate
```bash
# Check certificate details
openssl s_client -connect dev.website.com:443 -servername dev.website.com
```

### 5. Application Health
```bash
# Check if application is responding
curl https://dev.website.com/api/health
```

### 6. Browser Test
Open in browser: https://dev.website.com
- ✅ Should load the MysticFortune homepage
- ✅ Should show a padlock icon (valid SSL)
- ✅ Should not show certificate warnings

---

## 🔧 Troubleshooting

### DNS not resolving

**Problem:** `nslookup dev.website.com` fails

**Solutions:**
1. Wait longer - DNS can take up to 48 hours
2. Check DNS record was saved correctly in your DNS panel
3. Clear your local DNS cache:
   ```bash
   # Windows
   ipconfig /flushdns
   
   # Mac
   sudo dscacheutil -flushcache
   
   # Linux
   sudo systemd-resolve --flush-caches
   ```

### Site not loading

**Problem:** DNS works but site doesn't load

**Solutions:**
1. Check if Nginx is running: `sudo systemctl status nginx`
2. Check if application is running: `pm2 status`
3. Check server firewall allows HTTP/HTTPS:
   ```bash
   sudo ufw status
   # Should show: 80/tcp ALLOW and 443/tcp ALLOW
   ```
4. Check Nginx error logs: `sudo tail -f /var/log/nginx/error.log`

### SSL Certificate errors

**Problem:** Browser shows "Not Secure" or certificate errors

**Solutions:**
1. Verify certificate is installed:
   ```bash
   sudo certbot certificates
   ```
2. Check Nginx SSL configuration:
   ```bash
   sudo nginx -t
   ```
3. Ensure DNS points to correct server (Let's Encrypt validates domain)
4. Try obtaining certificate again:
   ```bash
   sudo certbot --nginx -d dev.website.com --force-renewal
   ```

### Cloudflare SSL/TLS errors

**Problem:** Too many redirects or SSL errors with Cloudflare

**Solutions:**
1. Set SSL/TLS encryption mode to **Full** or **Full (strict)**
   - Go to Cloudflare dashboard → SSL/TLS
   - Select **Full (strict)** if you have Let's Encrypt cert
2. Disable Cloudflare proxy temporarily (grey cloud)
3. Clear browser cache and cookies

---

## 🎯 Quick Reference

### Common DNS Providers

| Provider | DNS Management URL |
|----------|-------------------|
| Cloudflare | https://dash.cloudflare.com |
| AWS Route 53 | https://console.aws.amazon.com/route53 |
| Namecheap | https://ap.www.namecheap.com/domains/list |
| GoDaddy | https://dcc.godaddy.com/manage/dns |
| Google Domains | https://domains.google.com/registrar |
| DigitalOcean | https://cloud.digitalocean.com/networking/domains |

### DNS Propagation Check Tools

- https://dnschecker.org
- https://www.whatsmydns.net
- https://dnspropagation.com

### SSL Test Tools

- https://www.ssllabs.com/ssltest/
- https://www.digicert.com/help/

---

## 📞 Need Help?

If you encounter issues:
1. Check DNS propagation: https://dnschecker.org
2. Verify server is accessible: `ping dev.website.com`
3. Check server logs: `sudo journalctl -u nginx -f`
4. Contact your DNS provider's support

---

**Once DNS and SSL are set up, proceed with the deployment using the GitHub Actions workflow or manual deployment steps in `DEPLOYMENT_SETUP.md`.**
