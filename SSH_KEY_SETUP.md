# SSH Key Setup for dp1 VM - MysticFortune

## ✅ SSH Key Generated!

Your new SSH key has been created:
- **Private Key**: `C:\Users\420du\.ssh\github_actions_dp1_mysticfortune`
- **Public Key**: `C:\Users\420du\.ssh\github_actions_dp1_mysticfortune.pub`

---

## 📋 Step-by-Step Setup

### Step 1: Add Public Key to dp1 VM

You need to add the **public key** to the dp1 VM so GitHub Actions can connect.

**Copy this public key:**
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOXhRb6y4WT097zpXN0LPtcYQv+mawKUq3M8TIRuA08M github-actions-dp1-mysticfortune
```

**Add it to dp1 VM:**

Option A - Using ssh-copy-id (if you have current access):
```bash
# From PowerShell or terminal where you have access to dp1
ssh-copy-id -i C:\Users\420du\.ssh\github_actions_dp1_mysticfortune.pub cira@74.208.227.161
```

Option B - Manually (ask your server admin):
1. SSH into dp1 VM: `ssh cira@74.208.227.161`
2. Edit authorized_keys: `nano ~/.ssh/authorized_keys`
3. Add the public key above to a new line
4. Save and exit
5. Set permissions: `chmod 600 ~/.ssh/authorized_keys`

---

### Step 2: Test SSH Connection

Test that the key works:
```powershell
ssh -i C:\Users\420du\.ssh\github_actions_dp1_mysticfortune cira@74.208.227.161
```

If this connects successfully, you're good! ✅

---

### Step 3: Add Private Key to GitHub Secrets

**Option A - Using GitHub CLI (Recommended)**

1. **Restart PowerShell** (so `gh` command works)
2. Run this command:
```powershell
$key = Get-Content "C:\Users\420du\.ssh\github_actions_dp1_mysticfortune" -Raw
gh secret set DP1_SERVER_SSH_KEY --body $key
```

**Option B - Using Web Interface**

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `DP1_SERVER_SSH_KEY`
5. Value: Copy the **entire content** of `C:\Users\420du\.ssh\github_actions_dp1_mysticfortune`
   ```powershell
   # View the private key:
   Get-Content C:\Users\420du\.ssh\github_actions_dp1_mysticfortune
   ```
6. Click **Add secret**

---

### Step 4: Verify All Secrets

After restarting PowerShell, check all secrets are set:
```powershell
gh secret list
```

You should see:
- ✅ DP1_SERVER_HOST
- ✅ DP1_SERVER_USER
- ✅ DP1_SERVER_SSH_KEY

---

## 🚀 Quick Commands Reference

```powershell
# View public key (to add to dp1)
Get-Content C:\Users\420du\.ssh\github_actions_dp1_mysticfortune.pub

# View private key (to add to GitHub)
Get-Content C:\Users\420du\.ssh\github_actions_dp1_mysticfortune

# Test SSH connection
ssh -i C:\Users\420du\.ssh\github_actions_dp1_mysticfortune cira@74.208.227.161

# After restarting PowerShell, set GitHub secret:
$key = Get-Content "C:\Users\420du\.ssh\github_actions_dp1_mysticfortune" -Raw
gh secret set DP1_SERVER_SSH_KEY --body $key

# Check all secrets
gh secret list
```

---

## ✅ Checklist

- [ ] Public key added to dp1 VM (`~/.ssh/authorized_keys`)
- [ ] SSH connection tested successfully
- [ ] PowerShell restarted (for `gh` command)
- [ ] Private key added to GitHub secret `DP1_SERVER_SSH_KEY`
- [ ] All secrets verified with `gh secret list`

---

**Once complete, push your code and GitHub Actions will automatically deploy to dp1!** 🎉
