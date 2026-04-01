# Generate a Secure Password for Keystore
# This script generates a strong password you can use

$ErrorActionPreference = "Continue"

Write-Host "Password Generator for Keystore" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Generate a secure random password
$length = 24
$chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
$password = ""

for ($i = 0; $i -lt $length; $i++) {
    $randomIndex = Get-Random -Minimum 0 -Maximum $chars.Length
    $password += $chars[$randomIndex]
}

Write-Host "Generated Password (24 characters):" -ForegroundColor Green
Write-Host ""
Write-Host $password -ForegroundColor Yellow
Write-Host ""
Write-Host "IMPORTANT:" -ForegroundColor Red
Write-Host "1. Copy this password NOW" -ForegroundColor Yellow
Write-Host "2. Save it in a password manager" -ForegroundColor Yellow
Write-Host "3. Use it in your keystore-config.txt file" -ForegroundColor Yellow
Write-Host "4. You will need this password for ALL future app updates!" -ForegroundColor Yellow
Write-Host ""

# Offer to copy to clipboard
try {
    $password | Set-Clipboard
    Write-Host "Password copied to clipboard!" -ForegroundColor Green
} catch {
    Write-Host "Could not copy to clipboard - please copy manually" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Save this password securely (password manager)" -ForegroundColor White
Write-Host "2. Use it in keystore-config.txt:" -ForegroundColor White
Write-Host "   KEYSTORE_PASSWORD=$password" -ForegroundColor Gray
Write-Host "   KEY_PASSWORD=$password" -ForegroundColor Gray
Write-Host "3. Run: .\scripts\setup-signing-from-env.ps1" -ForegroundColor White
Write-Host ""

