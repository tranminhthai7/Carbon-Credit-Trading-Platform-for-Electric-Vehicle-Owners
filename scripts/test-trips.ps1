$gateway = 'http://localhost:8000'
$stamp = Get-Date -Format 'yyyyMMddHHmmss'
$email = "trips-e2e+$stamp@example.com"
$pw = 'Testpass123!'
Write-Host "Registering user: $email"
try {
  Invoke-RestMethod -Method Post -Uri "$gateway/api/users/register" -Body (@{email=$email; password=$pw; role='ev_owner'; full_name='Trips E2E'; phone='+84900000003'} | ConvertTo-Json) -ContentType 'application/json' -ErrorAction Stop | Out-Null
} catch {
  Write-Host "Register may have failed/exists - continuing"
}
Start-Sleep -Seconds 1
Write-Host 'Trying to get verification token...'
try {
  $tokenResp = Invoke-RestMethod -Uri "$gateway/api/users/internal/last-verification-token" -UseBasicParsing -ErrorAction Stop
  $token = $tokenResp.data.token
  Write-Host "Token: $token"
  if ($token) {
    Invoke-RestMethod -Uri "$gateway/api/users/verify/$token" -UseBasicParsing -ErrorAction Stop | Out-Null
    Write-Host 'Verified token'
  }
} catch {
  Write-Host "Could not fetch/verify token: $($_.Exception.Message)"
}
Write-Host 'Logging in'
$login = Invoke-RestMethod -Method Post -Uri "$gateway/api/users/login" -Body (@{email=$email; password=$pw} | ConvertTo-Json) -ContentType 'application/json' -ErrorAction Stop
$token = $login.data.token
Write-Host "Got token: $token"
$headers = @{ Authorization = "Bearer $token" }
Write-Host 'Creating vehicle'
$vehiclePayload = @{ make='Tesla'; model='Model 3'; year=2022; battery_capacity=75; license_plate=('E2E' + (Get-Random -Minimum 1000 -Maximum 9999)); color='Blue' }
$vehicle = Invoke-RestMethod -Method Post -Uri "$gateway/api/vehicles" -Headers $headers -Body ($vehiclePayload | ConvertTo-Json) -ContentType 'application/json' -ErrorAction Stop
Write-Host "Vehicle created, id: $($vehicle.data._id)"
Write-Host 'Creating trip (POST /api/vehicles/trips)'
$tripPayload = @{ vehicleId = $vehicle.data._id; distance = 12.5; startTime = (Get-Date).AddHours(-1).ToString('o'); endTime = (Get-Date).ToString('o'); startLocation = 'Loc A'; endLocation = 'Loc B' }
try {
  $trip = Invoke-RestMethod -Method Post -Uri "$gateway/api/vehicles/trips" -Headers $headers -Body ($tripPayload | ConvertTo-Json) -ContentType 'application/json' -ErrorAction Stop
  Write-Host "Trip response:`n"; $trip | ConvertTo-Json -Depth 5
} catch {
  $resp = $_.Exception.Response
  if ($resp) {
    try { $body = (New-Object System.IO.StreamReader($resp.GetResponseStream())).ReadToEnd(); Write-Host "Trip creation failed. HttpStatus: $($resp.StatusCode.value__) Body: $body" } catch { Write-Host "Trip creation failed: $($_.Exception.Message)" }
  } else { Write-Host "Trip creation failed: $($_.Exception.Message)" }
}
