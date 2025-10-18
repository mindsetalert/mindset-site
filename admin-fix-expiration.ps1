# ========================================
# OUTIL 2: Corriger la date d'expiration d'une licence
# ========================================
# Utilisation: Quand une licence a expire trop tot (ex: 2 jours au lieu de 30)
#
# Le script va automatiquement recalculer la bonne date:
# - Plan mensuel: +30 jours depuis la date de creation
# - Plan annuel: +365 jours depuis la date de creation
# ========================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "CORRIGER DATE EXPIRATION LICENCE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Demander la cle de licence
$licenseKey = Read-Host "Entrez la cle de licence (ex: LIC-77KRO6OM-1760566518966)"

if (-not $licenseKey) {
    Write-Host "Erreur: Cle de licence requise!" -ForegroundColor Red
    exit 1
}

# Configuration
$adminSecret = "MindsetAdmin2025!SecurePass"
$url = "https://mindset-site.vercel.app/api/admin/fix-license-expiration"

$headers = @{
    "Content-Type" = "application/json"
    "x-admin-secret" = $adminSecret
}

$body = @{
    licenseKey = $licenseKey
} | ConvertTo-Json

Write-Host ""
Write-Host "Correction de la date d'expiration..." -ForegroundColor Yellow
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri $url -Method POST -Headers $headers -Body $body
    
    Write-Host "SUCCESS! Licence corrigee!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Details:" -ForegroundColor Cyan
    Write-Host "  Plan: $($response.license.plan)"
    Write-Host "  Ancienne expiration: $($response.license.old_expiration)"
    Write-Host "  Nouvelle expiration: $($response.license.new_expiration)"
    Write-Host "  Jours ajoutes: $($response.license.days_added)"
    Write-Host ""
    Write-Host "La licence est maintenant valide pour 30 ou 365 jours!"
    Write-Host ""
    
} catch {
    Write-Host "ERREUR lors de la correction:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    if ($_.ErrorDetails) {
        Write-Host $_.ErrorDetails.Message
    }
    Write-Host ""
}

Write-Host "Appuyez sur Entree pour fermer..."
Read-Host

