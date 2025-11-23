# Quick health and proxy test script (PowerShell)
# Usage: powershell -ExecutionPolicy Bypass -File scripts/test_services.ps1

$base = "http://localhost:8000"
$ev = "http://localhost:3002"

Write-Host "Checking API Gateway health..."
Invoke-RestMethod -Uri "$base/health" -Method GET | ConvertTo-Json -Depth 3 | Write-Host

Write-Host "Checking EV Data health..."
try { Invoke-RestMethod -Uri "$ev/health" -Method GET | ConvertTo-Json -Depth 3 | Write-Host } catch { Write-Host "EV service health failed:`n" $_ }

Write-Host "Checking Mongo container status and logs (last 50 lines)"
Write-Host (docker ps --filter "name=ev-mongodb" --format "{{.Names}}: {{.Status}}")
docker logs ev-mongodb --tail 50 | Write-Host

Write-Host "Checking EV Data logs (last 100 lines)"
docker logs ev-data-service --tail 100 | Write-Host

Write-Host "Testing gateway servlet to EV%: GET /api/vehicles (should be 401 or return list)"
try { Invoke-RestMethod -Uri "$base/api/vehicles" -Method GET -SkipHttpErrorCheck | ConvertTo-Json -Depth 3 | Write-Host } catch { Write-Host "Gateway->EV failed:`n" $_ }

Write-Host "Done."