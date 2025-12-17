# GitHub Repository Setup Script for MysticFortune
# This script sets up GitHub secrets for automated deployment to dp1 VM

Write-Host "🚀 MysticFortune - GitHub Repository Setup" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check if gh is available (refresh PATH)
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Test gh command
try {
    $ghVersion = & gh --version 2>&1
    Write-Host "✅ GitHub CLI detected: $($ghVersion[0])" -ForegroundColor Green
} catch {
    Write-Host "❌ GitHub CLI not found. Please restart PowerShell and try again." -ForegroundColor Red
    Write-Host "   Or install with: winget install --id GitHub.cli" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Check authentication status
Write-Host "🔐 Checking GitHub authentication..." -ForegroundColor Cyan
$authStatus = & gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  You need to authenticate with GitHub first." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Running 'gh auth login'..." -ForegroundColor Cyan
    & gh auth login
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Authentication failed. Please try again." -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ Authenticated with GitHub" -ForegroundColor Green
Write-Host ""

# Configuration for dp1 VM
Write-Host "📋 Repository Secrets Configuration" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

$secrets = @{
    "DP1_SERVER_HOST" = "74.208.227.161"
    "DP1_SERVER_USER" = "cira"
}

# Display configuration
Write-Host "The following secrets will be added to your repository:" -ForegroundColor Yellow
Write-Host ""
foreach ($key in $secrets.Keys) {
    Write-Host "  • $key = $($secrets[$key])" -ForegroundColor White
}
Write-Host "  • DP1_SERVER_SSH_KEY = (from your SSH key file)" -ForegroundColor White
Write-Host ""

# Prompt for confirmation
$confirm = Read-Host "Do you want to proceed? (y/n)"
if ($confirm -ne 'y') {
    Write-Host "❌ Cancelled by user." -ForegroundColor Red
    exit 0
}

Write-Host ""

# Set secrets
Write-Host "🔧 Adding secrets to repository..." -ForegroundColor Cyan

foreach ($key in $secrets.Keys) {
    Write-Host "  Adding $key..." -NoNewline
    $output = & gh secret set $key --body $secrets[$key] 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host " ✅" -ForegroundColor Green
    } else {
        Write-Host " ❌" -ForegroundColor Red
        Write-Host "Error: $output" -ForegroundColor Red
    }
}

# Handle SSH key
Write-Host ""
Write-Host "🔑 Setting up SSH key..." -ForegroundColor Cyan

# Check for common SSH key locations
$sshKeyPaths = @(
    "$env:USERPROFILE\.ssh\id_rsa",
    "$env:USERPROFILE\.ssh\id_ed25519",
    "$env:USERPROFILE\.ssh\github_actions_dp1"
)

$sshKeyPath = $null
foreach ($path in $sshKeyPaths) {
    if (Test-Path $path) {
        Write-Host "  Found SSH key: $path" -ForegroundColor Green
        $sshKeyPath = $path
        break
    }
}

if ($null -eq $sshKeyPath) {
    Write-Host "  ⚠️  No SSH key found in common locations." -ForegroundColor Yellow
    Write-Host ""
    $customPath = Read-Host "Enter path to your SSH private key (or press Enter to skip)"
    
    if ($customPath -and (Test-Path $customPath)) {
        $sshKeyPath = $customPath
    } else {
        Write-Host ""
        Write-Host "⚠️  Skipping SSH key setup. You'll need to add it manually:" -ForegroundColor Yellow
        Write-Host "   1. Go to GitHub repo → Settings → Secrets" -ForegroundColor White
        Write-Host "   2. Add secret: DP1_SERVER_SSH_KEY" -ForegroundColor White
        Write-Host "   3. Paste your SSH private key (entire file including headers)" -ForegroundColor White
        Write-Host ""
    }
}

if ($sshKeyPath) {
    Write-Host "  Adding DP1_SERVER_SSH_KEY from $sshKeyPath..." -NoNewline
    $sshKey = Get-Content $sshKeyPath -Raw
    $output = & gh secret set DP1_SERVER_SSH_KEY --body $sshKey 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host " ✅" -ForegroundColor Green
    } else {
        Write-Host " ❌" -ForegroundColor Red
        Write-Host "Error: $output" -ForegroundColor Red
    }
}

# List all secrets
Write-Host ""
Write-Host "📊 Current repository secrets:" -ForegroundColor Cyan
& gh secret list

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 Next steps:" -ForegroundColor Cyan
Write-Host "  1. Commit and push your code:" -ForegroundColor White
Write-Host "     git add ." -ForegroundColor Gray
Write-Host "     git commit -m 'Add deployment workflows'" -ForegroundColor Gray
Write-Host "     git push origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "  2. Check GitHub Actions:" -ForegroundColor White
Write-Host "     Go to your repo → Actions tab" -ForegroundColor Gray
Write-Host ""
Write-Host "  3. Deployment will trigger automatically on push!" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "  • DEPLOY_TO_DP1_VM.md - Server setup guide" -ForegroundColor White
Write-Host "  • GITHUB_ACTIONS_DP1.md - CI/CD documentation" -ForegroundColor White
Write-Host ""
