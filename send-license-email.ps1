# Script pour envoyer l'email de licence manuellement
$licenseKey = "LIC-YJLQ26R6-1760801033918"
$customerEmail = "produitautoexpress@gmail.com"
$siteUrl = "https://mindset-site.vercel.app"

Write-Host "Envoi de l'email de licence..." -ForegroundColor Yellow
Write-Host "Licence: $licenseKey"
Write-Host "Email: $customerEmail"
Write-Host ""

# Étape 1: Trouver l'ID de la licence dans Supabase
Write-Host "NOTE: Vous devez d'abord trouver l'ID de la licence dans Supabase"
Write-Host ""
$licenseId = Read-Host "Entrez l'ID de la licence (numero dans la colonne 'id' de Supabase)"

if (-not $licenseId) {
    Write-Host "Erreur: ID de licence requis" -ForegroundColor Red
    exit 1
}

# Étape 2: Créer un token de téléchargement
Write-Host ""
Write-Host "Creation du token de telechargement..." -ForegroundColor Cyan

try {
    $tokenResponse = Invoke-RestMethod -Uri "$siteUrl/api/token/create" -Method POST -Headers @{
        "Content-Type" = "application/json"
    } -Body (@{
        payload = @{
            licenseId = [int]$licenseId
        }
    } | ConvertTo-Json)
    
    $token = $tokenResponse.token
    Write-Host "Token cree: $token" -ForegroundColor Green
    
} catch {
    Write-Host "Erreur creation token:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    if ($_.ErrorDetails) {
        Write-Host $_.ErrorDetails.Message
    }
    exit 1
}

Write-Host ""
Write-Host "IMPORTANT: Vous devez maintenant envoyer manuellement cet email au client:"
Write-Host ""
Write-Host "------- EMAIL A ENVOYER -------" -ForegroundColor Cyan
Write-Host "A: $customerEmail"
Write-Host "Sujet: Votre licence et telechargement Mindset - Alert Strategy"
Write-Host ""
Write-Host "Corps du message:"
Write-Host "Bonjour,"
Write-Host ""
Write-Host "Merci pour votre achat !"
Write-Host ""
Write-Host "Votre cle de licence: $licenseKey"
Write-Host ""
Write-Host "Lien de telechargement (valide 6 mois):"
Write-Host "$siteUrl/api/download?token=$token"
Write-Host ""
Write-Host "Instructions:"
Write-Host "1. Telechargez et installez le programme"
Write-Host "2. Lancez le programme"  
Write-Host "3. Entrez votre cle de licence: $licenseKey"
Write-Host ""
Write-Host "Support: mindsetalertstrategy@gmail.com"
Write-Host "------- FIN EMAIL -------" -ForegroundColor Cyan
Write-Host ""

