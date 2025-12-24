# Script de build pour la production
# Exécuter depuis la racine du projet : .\scripts\build-production.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Build de Production - Sagesse d'Afrique" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Créer le dossier de distribution
$distDir = ".\dist-production"
if (Test-Path $distDir) {
    Remove-Item -Recurse -Force $distDir
}
New-Item -ItemType Directory -Path $distDir | Out-Null
New-Item -ItemType Directory -Path "$distDir\api" | Out-Null
New-Item -ItemType Directory -Path "$distDir\frontend" | Out-Null

# Build du Backend
Write-Host "[1/4] Build du Backend..." -ForegroundColor Yellow
Set-Location backend
npm install
npm run build
Set-Location ..

# Copier les fichiers backend
Write-Host "[2/4] Copie des fichiers Backend..." -ForegroundColor Yellow
Copy-Item -Path "backend\dist" -Destination "$distDir\api\dist" -Recurse
Copy-Item -Path "backend\prisma" -Destination "$distDir\api\prisma" -Recurse
Copy-Item -Path "backend\package.json" -Destination "$distDir\api\"
Copy-Item -Path "backend\package-lock.json" -Destination "$distDir\api\" -ErrorAction SilentlyContinue
Copy-Item -Path "backend\ecosystem.config.js" -Destination "$distDir\api\"

# Build du Frontend
Write-Host "[3/4] Build du Frontend..." -ForegroundColor Yellow
Set-Location frontend
npm install
npm run build
Set-Location ..

# Copier les fichiers frontend
Write-Host "[4/4] Copie des fichiers Frontend..." -ForegroundColor Yellow
# Force copy pour inclure les fichiers/dossiers cachés comme .next
Copy-Item -Path "frontend\.next" -Destination "$distDir\frontend\.next" -Recurse -Force
Copy-Item -Path "frontend\public" -Destination "$distDir\frontend\public" -Recurse
Copy-Item -Path "frontend\package.json" -Destination "$distDir\frontend\"
Copy-Item -Path "frontend\package-lock.json" -Destination "$distDir\frontend\" -ErrorAction SilentlyContinue
Copy-Item -Path "frontend\next.config.js" -Destination "$distDir\frontend\"
Copy-Item -Path "frontend\ecosystem.config.js" -Destination "$distDir\frontend\"

# Créer les fichiers .env templates
@"
DATABASE_URL="mysql://sagesse_user:VOTRE_MOT_DE_PASSE@localhost:3306/sagesse_db"
JWT_SECRET="CHANGEZ_CETTE_CLE_SECRETE"
PORT=3001
FRONTEND_URL="https://sagessedafrique.blog"
NODE_ENV=production
"@ | Out-File -FilePath "$distDir\api\.env.example" -Encoding UTF8

@"
NEXT_PUBLIC_API_URL=https://sagessedafrique.blog/api
"@ | Out-File -FilePath "$distDir\frontend\.env.local.example" -Encoding UTF8

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Build termine avec succes !" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Les fichiers sont prets dans : $distDir" -ForegroundColor Cyan
Write-Host ""
Write-Host "Prochaines etapes :" -ForegroundColor Yellow
Write-Host "1. Uploadez le contenu de '$distDir\api' vers /api sur le serveur"
Write-Host "2. Uploadez le contenu de '$distDir\frontend' vers /httpdocs sur le serveur"
Write-Host "3. Configurez les fichiers .env sur le serveur"
Write-Host "4. Executez 'npm install --production' dans chaque dossier"
Write-Host "5. Consultez DEPLOIEMENT.md pour les details"
Write-Host ""

