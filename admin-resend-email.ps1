# ========================================
# OUTIL 1: Renvoyer l'email de licence a un client
# ========================================
# Utilisation: Quand un client n'a pas recu son email
# 
# AVANT D'UTILISER:
# 1. Corrige l'email du client dans Supabase (table clients) si necessaire
# 2. Note la cle de licence (commence par LIC-...)
# 3. Execute ce script
# ========================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "RENVOYER EMAIL DE LICENCE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Demander la cle de licence
$licenseKey = Read-Host "Entrez la cle de licence (ex: LIC-YJLQ26R6-1760801033918)"

if (-not $licenseKey) {
    Write-Host "Erreur: Cle de licence requise!" -ForegroundColor Red
    exit 1
}

# Configuration
$adminSecret = "MindsetAdmin2025!SecurePass"
$url = "https://mindset-site.vercel.app/api/admin/resend-license-email"

$headers = @{
    "Content-Type" = "application/json"
    "x-admin-secret" = $adminSecret
}

$body = @{
    licenseKey = $licenseKey
} | ConvertTo-Json

Write-Host ""
Write-Host "Envoi de l'email..." -ForegroundColor Yellow
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri $url -Method POST -Headers $headers -Body $body
    
    Write-Host "SUCCESS! Email envoye!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Details:" -ForegroundColor Cyan
    Write-Host "  Envoye a: $($response.sentTo)"
    Write-Host "  Licence: $($response.licenseKey)"
    Write-Host ""
    Write-Host "Le client devrait recevoir l'email dans quelques secondes!"
    Write-Host ""
    
} catch {
    Write-Host "ERREUR lors de l'envoi:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    if ($_.ErrorDetails) {
        Write-Host $_.ErrorDetails.Message
    }
    Write-Host ""
}

Write-Host "Appuyez sur Entree pour fermer..."
Read-Host

