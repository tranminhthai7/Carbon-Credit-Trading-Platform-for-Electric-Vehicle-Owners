# Sample Trip Data Format

## CSV Format

```csv
date,time,distance_km,energy_consumed_kwh,start_location,end_location
2024-10-01,08:30:00,25.5,5.2,Home,Office
2024-10-01,17:45:00,25.8,5.3,Office,Home
2024-10-02,09:00:00,15.2,3.1,Home,Mall
2024-10-02,11:30:00,15.0,3.0,Mall,Home
2024-10-03,14:00:00,45.7,9.3,Home,Airport
2024-10-03,18:30:00,46.2,9.5,Airport,Home
2024-10-05,07:00:00,120.5,24.8,Home,City B
2024-10-05,19:00:00,118.3,24.2,City B,Home
```

## JSON Format

```json
{
  "vehicle_id": "uuid-here",
  "trips": [
    {
      "date": "2024-10-01",
      "start_time": "08:30:00",
      "end_time": "09:15:00",
      "distance_km": 25.5,
      "energy_consumed_kwh": 5.2,
      "start_location": {
        "lat": 10.762622,
        "lng": 106.660172,
        "address": "Home"
      },
      "end_location": {
        "lat": 10.782622,
        "lng": 106.680172,
        "address": "Office"
      },
      "average_speed_kmh": 35.5,
      "battery_start_percent": 85,
      "battery_end_percent": 70
    },
    {
      "date": "2024-10-01",
      "start_time": "17:45:00",
      "end_time": "18:30:00",
      "distance_km": 25.8,
      "energy_consumed_kwh": 5.3,
      "start_location": {
        "lat": 10.782622,
        "lng": 106.680172,
        "address": "Office"
      },
      "end_location": {
        "lat": 10.762622,
        "lng": 106.660172,
        "address": "Home"
      },
      "average_speed_kmh": 34.8,
      "battery_start_percent": 70,
      "battery_end_percent": 55
    }
  ]
}
```

## CO2 Calculation Formula

```
Gasoline Car Emission = 0.12 kg CO2/km
Electric Vehicle Emission = 0.02 kg CO2/km (using grid electricity)

CO2 Saved per Trip = (0.12 - 0.02) × distance_km
                    = 0.10 × distance_km

Example:
Trip distance = 25.5 km
CO2 Saved = 0.10 × 25.5 = 2.55 kg CO2

Carbon Credit Conversion:
1 Carbon Credit = 1 ton CO2 = 1000 kg CO2
Credits Earned = CO2_Saved_kg / 1000

For 2.55 kg CO2:
Credits = 2.55 / 1000 = 0.00255 credits
```

## Sample Data for Testing

### Monthly Data (100 km/month)
```csv
date,distance_km,energy_kwh,co2_saved_kg
2024-10-01,25.5,5.2,2.55
2024-10-03,18.3,3.7,1.83
2024-10-07,32.7,6.6,3.27
2024-10-10,15.8,3.2,1.58
2024-10-15,8.2,1.7,0.82
Total,100.5,20.4,10.05
```

**Credits Earned**: 10.05 / 1000 = **0.01005 credits**

### Yearly Data (10,000 km/year)
```
Average monthly: 833 km
CO2 Saved: 833 × 0.10 = 83.3 kg/month
Yearly CO2 Saved: 83.3 × 12 = 999.6 kg ≈ 1 ton
Credits Earned: 999.6 / 1000 ≈ 1.0 credits/year
```

### Real-world Example
Typical Vietnamese driver:
- Average: 15,000 km/year
- CO2 Saved: 15,000 × 0.10 = 1,500 kg = 1.5 tons
- **Credits Earned: 1.5 credits/year**

If credit price = 100,000 VND/credit:
- **Revenue: 150,000 VND/year**

## API Usage Example

```bash
# Upload trip data (CSV)
curl -X POST http://localhost:3002/api/v1/vehicles/{vehicle_id}/trips \
  -H "Authorization: Bearer <token>" \
  -F "file=@trips_october_2024.csv"

# Get CO2 savings
curl -X GET http://localhost:3002/api/v1/vehicles/{vehicle_id}/co2-savings \
  -H "Authorization: Bearer <token>"

# Response
{
  "success": true,
  "data": {
    "total_distance_km": 100.5,
    "total_energy_kwh": 20.4,
    "co2_saved_kg": 10.05,
    "credits_equivalent": 0.01005
  }
}

# Generate credits (request to CVA)
curl -X POST http://localhost:3003/api/v1/credits/request \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "vehicle_id": "uuid",
    "co2_saved_kg": 10.05,
    "verification_data": {
      "trips_file": "trips_october_2024.csv",
      "start_date": "2024-10-01",
      "end_date": "2024-10-31"
    }
  }'
```
