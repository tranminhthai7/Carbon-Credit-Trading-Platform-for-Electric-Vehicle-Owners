# Start Docker Compose, wait for frontend availability and open browser
# Usage: powershell -ExecutionPolicy Bypass -File scripts/start-and-open.ps1

param(
    [int]$TimeoutSec = 120,
    [int]$Port = 5173,
    [string]$Url = 'http://localhost:5173',
    [switch]$UseDev
)

Write-Host "Starting Docker Compose (build & detach)..."
cd $PSScriptRoot/.. ; # repo root

# Build frontend image for the stack (ensures latest frontend code is baked into the image)
try {
    Write-Host "Building frontend assets and Docker image for frontend..." -ForegroundColor Cyan
    Push-Location $PSScriptRoot/.. ; # repo root
    if (Test-Path -Path "frontend\package.json") {
        cd frontend
        npm ci --silent
        npm run build --silent
        docker build -t carbon-frontend:latest .
    }
    Pop-Location
} catch {
    Write-Host "Frontend build failed: $_" -ForegroundColor Yellow
}

# Start Docker Compose
if ($UseDev) {
    Write-Host "(dev) Using override file docker-compose.override.yml to start the stack for local development..." -ForegroundColor Cyan
    docker-compose -f docker-compose.yml -f docker-compose.override.yml up -d --build
} else {
    docker-compose up -d --build
}

# Wait for the frontend port to be ready
$start = Get-Date
$endTime = $start.AddSeconds($TimeoutSec)
$ready = $false

Write-Host "Waiting for $Url to become available (timeout $TimeoutSec seconds)..."

while ((Get-Date) -lt $endTime) {
    try {
        $resp = Invoke-WebRequest -Uri $Url -Method Head -TimeoutSec 5 -ErrorAction Stop
        if ($resp.StatusCode -ge 200 -and $resp.StatusCode -lt 400) {
            $ready = $true
            break
        }
    } catch {
        # not ready yet
    }
    Start-Sleep -Seconds 2
}

if ($ready) {
    Write-Host "Frontend is ready at $Url - opening in default browser..." -ForegroundColor Green
    # If dev mode, attempt to create/login dev user and open dev-login page
    if ($UseDev) {
        try {
            # Wait for API Gateway
            $gwReady = $false
            $gwStart = Get-Date
            while ((Get-Date) -lt $gwStart.AddSeconds(60)) {
                try {
                    $h = Invoke-WebRequest -Uri http://localhost:8000/health -Method Get -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
                    if ($h.StatusCode -eq 200) { $gwReady = $true; break }
                } catch { Start-Sleep -Seconds 1 }
            }

            if ($gwReady) {
                $devEmail = 'dev@local.test'
                $devPassword = 'Testpass123!'

                # Try login first
                $headers = @{ 'Content-Type' = 'application/json' }
                $loginBody = @{email=$devEmail; password=$devPassword} | ConvertTo-Json
                $loginResp = $null
                try {
                    $loginResp = Invoke-WebRequest -Uri http://localhost:8000/api/users/login -Method POST -Body $loginBody -Headers $headers -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
                } catch {
                    # ignore; will attempt register
                }

                if (-not $loginResp) {
                    # Create the dev user
                    $registerBody = @{email=$devEmail; password=$devPassword; role='ev_owner'; full_name='Dev User'; phone='+84987654321'} | ConvertTo-Json
                    try {
                        $regResp = Invoke-WebRequest -Uri http://localhost:8000/api/users/register -Method POST -Body $registerBody -Headers $headers -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
                        # Get last verification token and verify
                        $tokenResp = Invoke-WebRequest -Uri http://localhost:8000/api/users/internal/last-verification-token -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
                        $tokenJson = $tokenResp.Content | ConvertFrom-Json
                        if ($tokenJson.success -eq $true -and $tokenJson.data.token) {
                            Invoke-WebRequest -Uri ("http://localhost:8000/api/users/verify/" + $tokenJson.data.token) -Method Get -UseBasicParsing -TimeoutSec 5
                        }
                    } catch {
                        # ignore register errors
                    }

                    try {
                        $loginResp = Invoke-WebRequest -Uri http://localhost:8000/api/users/login -Method POST -Body $loginBody -Headers $headers -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
                    } catch {
                        # ignore
                    }
                }

                if ($loginResp) {
                    $json = $loginResp.Content | ConvertFrom-Json
                    $token = $json.data.token
                    $user = $json.data.user
                    $encUser = [System.Web.HttpUtility]::UrlEncode((ConvertTo-Json $user -Compress))
                    $devUrl = "http://localhost:$Port/dev-login?token=$token&user=$encUser"
                    # Run dev seeding script to populate sample data for demo (if present)
                    try {
                        Write-Host "Checking if seed data exists ..." -ForegroundColor Cyan
                        # Check seeded user exists by trying to login (seed-seller@example.com)
                        $seedSeller = $env:SEED_SELLER_EMAIL; if (-not $seedSeller) { $seedSeller = 'seed-seller@example.com' }
                        $seedPass = 'Testpass123!'
                        $loginBody2 = @{ email=$seedSeller; password=$seedPass } | ConvertTo-Json
                        $seedExists = $false
                        try {
                            $seedLoginResp = Invoke-WebRequest -Uri http://localhost:8000/api/users/login -Method POST -Body $loginBody2 -Headers @{ 'Content-Type' = 'application/json' } -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
                            if ($seedLoginResp -and $seedLoginResp.StatusCode -eq 200) { $seedExists = $true }
                        } catch {
                            $seedExists = $false
                        }
                        if ($seedExists) {
                            Write-Host "Seeded user exists; skipping seeding." -ForegroundColor Green
                        } else {
                            Write-Host "Seeded user does not exist; running dev seeding script ..." -ForegroundColor Cyan
                            Push-Location $PSScriptRoot/.. ; # repo root
                            if (Test-Path -Path "frontend\package.json") {
                                cd frontend
                                npm ci --silent
                                node ..\scripts\seed-dev.js
                            }
                            Pop-Location
                        }
                    } catch {
                        Write-Host "Dev seed check/seed failed: $_" -ForegroundColor Yellow
                    }
                    Start-Process $devUrl
                } else {
                    Start-Process $Url
                }
            } else {
                Start-Process $Url
            }
        } catch {
            Write-Host "Dev auto-login failed; opening frontend, please login manually" -ForegroundColor Yellow
            Start-Process $Url
        }
    } else {
        Start-Process $Url
    }
} else {
    Write-Host "Timed out waiting for $Url to be ready after $TimeoutSec seconds." -ForegroundColor Yellow
    Write-Host "You can open the frontend manually: $Url"
}

# Optional: tail user-service logs if desired
# Write-Host "Tailing user-service logs... (press CTRL+C to exit)"
# docker-compose logs -f user-service

Write-Host "Done."
