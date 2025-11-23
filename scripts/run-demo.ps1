<#
PowerShell demo runner for Carbon Credit Trading Platform
Usage (powershell):
    .\scripts\run-demo.ps1 [-NoSeed] [-NoCleanup] [-KeepAlive] [-E2E <marketplace|register|all>] [-DebugProxy]

Examples:
    # Run all: build stack, seed, run marketplace e2e, cleanup
    .\scripts\run-demo.ps1

    # Run without seeding (useful if DB already seeded)
    .\scripts\run-demo.ps1 -NoSeed

    # Run and keep containers running after script finishes
    .\scripts\run-demo.ps1 -KeepAlive

    # Run with proxy debug logs
    .\scripts\run-demo.ps1 -DebugProxy

#>
param(
  [switch]$NoSeed,
  [switch]$NoCleanup,
  [switch]$KeepAlive,
  [switch]$Prod,
  [ValidateSet('marketplace','register','all')][string]$E2E = 'marketplace',
  [switch]$DebugProxy
)

# Helper: write a timestamped line
function Write-Info([string]$text) { Write-Host "[INFO]  $(Get-Date -Format 'HH:mm:ss') - $text" -ForegroundColor Cyan }
function Write-Warn([string]$text) { Write-Host "[WARN]  $(Get-Date -Format 'HH:mm:ss') - $text" -ForegroundColor Yellow }
function Write-Err([string]$text) { Write-Host "[ERROR] $(Get-Date -Format 'HH:mm:ss') - $text" -ForegroundColor Red }

# Check Docker Compose availability
Write-Info "Checking docker compose..."
try {
  docker compose version > $null 2>&1
} catch {
  Write-Err "Docker compose not found. Please install Docker Desktop and ensure 'docker compose' is in PATH."; exit 2
}

# Set debug flags
if ($DebugProxy) { Write-Info 'Enabling DEBUG_PROXY for api-gateway'; $env:DEBUG_PROXY = 'true' }

# Ensure we run from repo root
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$orig = Get-Location
Set-Location $scriptDir
Set-Location ..
$repoRoot = Get-Location
Write-Info "Repo root: $repoRoot"

# Build & start stack
Write-Info 'Bringing up docker compose stack (build if needed)...'
if ($Prod) {
  Write-Info 'Production build requested. Building frontend production assets...'
  Push-Location .\frontend
  if (-not (Test-Path node_modules)) { Write-Info 'Installing frontend dependencies (npm ci)...'; npm ci }
  Write-Info 'Building frontend production bundle (npm run build)...'
  npm run build
  Pop-Location
}
docker compose up -d --build
if ($LASTEXITCODE -ne 0) { Write-Err 'docker compose up failed'; exit 3 }

# Wait for gateway health check
$healthUrl = 'http://localhost:8000/health'
Write-Info "Waiting for ${healthUrl} to be responsive (60s timeout)..."
$ready = $false
for ($i = 0; $i -lt 60; $i++) {
  try {
    $resp = Invoke-WebRequest -Uri $healthUrl -UseBasicParsing -ErrorAction Stop -TimeoutSec 5
    if ($resp.StatusCode -eq 200) { $ready = $true; break }
  } catch {
    Start-Sleep -Seconds 1
  }
}
if (-not $ready) { Write-Warn 'Gateway health endpoint did not respond in 60 seconds. Please check logs with: docker compose logs -f api-gateway'; }
else { Write-Info 'Gateway is up' }

# Optional seed
if (-not $NoSeed) {
  Write-Info 'Seeding DB using frontend seed script (force)'
  Push-Location .\frontend
  $env:NODE_PATH = '..\frontend\node_modules'
  # Ensure frontend dependencies are installed (so axios exists)
  if (-not (Test-Path node_modules)) {
    Write-Info 'Installing frontend dependencies (npm ci)...'
    npm ci
  }
  Write-Info 'Running frontend seed: npm run seed:dev:force'
  npm run seed:dev:force
  if ($LASTEXITCODE -ne 0) { Write-Warn 'Seed script exited with a non-zero code - continuing anyway' }
  Pop-Location
} else { Write-Info 'Skipping seed (NoSeed)' }

# Run E2E script(s)
Push-Location .\frontend
$env:NODE_PATH = '..\frontend\node_modules'

switch ($E2E) {
  'marketplace' {
    Write-Info 'Running marketplace e2e (frontend/e2e/marketplace-flow.cjs)...'
    npm run e2e:marketplace
    $e2eCode = $LASTEXITCODE
  }
  'register' {
    Write-Info 'Running register e2e (frontend/e2e/register-verify-login.cjs)...'
    npm run e2e:register
    $e2eCode = $LASTEXITCODE
  }
  'all' {
    Write-Info 'Running all e2e scripts...'
    npm run e2e:register
    $code1 = $LASTEXITCODE
    npm run e2e:marketplace
    $code2 = $LASTEXITCODE
    if ($code1 -eq 0 -and $code2 -eq 0) { $e2eCode = 0 } else { $e2eCode = 2 }
  }
}

Pop-Location

# Print e2e results
if ($e2eCode -eq 0) { Write-Info 'E2E run completed successfully' } else { Write-Warn "E2E run exited code $e2eCode" }

# Optionally keep containers running for debugging
if ($KeepAlive) {
  Write-Info 'Keeping containers running. Use: docker compose down -v to tear down manually.'
  # Open frontend in browser for convenience (if machine supports Start-Process)
  try { Start-Process 'http://localhost:5173' } catch { Write-Warn 'Could not open browser automatically.' }
  exit $e2eCode
}

# Teardown
if (-not $NoCleanup) {
  Write-Info 'Stopping and removing containers and volumes...'
  docker compose down -v
} else { Write-Info 'Skipping cleanup (NoCleanup) - containers remain running' }

Write-Info 'Done.'
Set-Location $orig
exit $e2eCode
