import { parse } from 'fast-csv';

export async function parseTripsFromBuffer(buffer: Buffer): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const trips: any[] = [];
    let rowCount = 0;
    const stream = parse({ headers: true, ignoreEmpty: true, trim: true })
      .on('error', (error) => reject(error))
      .on('data', (row) => {
        rowCount++;
        console.log(`[CSV-PARSER] Row ${rowCount}:`, JSON.stringify(row));
        // Skip header row if it's the first row and contains expected header names
        if (rowCount === 1 && (row.start_time === 'start_time' || !row.start_time)) {
          console.log(`[CSV-PARSER] Skipping header row ${rowCount}`);
          return;
        }
        // normalize expected header names: start_time,end_time,distance_km,start_lat,start_long,end_lat,end_long,notes,energy_consumed
        const distance = Number(row.distance_km || row.distance || row.km || 0);
        console.log(`[CSV-PARSER] Distance for row ${rowCount}: ${distance} from ${row.distance_km}`);
        if (isNaN(distance) || distance < 0.1) {
          console.warn(`Skipping row ${rowCount}: invalid distance ${distance}`);
          return;
        }
        const energy = row.energy_consumed || row.energyConsumed || row.energy || row.kwh || row.energy_kwh || row.energyConsumedKwh || row['Energy Consumed'] || row['Energy (kWh)'] || row['Energy (kwh)'] || row['Energy_kWh'] || row['Energy_KWh'];
        const energyConsumed = energy ? Number(energy) : undefined;
        if (energyConsumed !== undefined && (isNaN(energyConsumed) || energyConsumed < 0)) {
          console.warn(`Skipping row ${rowCount}: invalid energy ${energyConsumed}`);
          return;
        }
        trips.push({
          start_time: row.start_time || row.start || row.startTime,
          end_time: row.end_time || row.end || row.endTime,
          distance_km: distance,
          energy_consumed: energyConsumed,
          start_location: row.start_location || (row.start_lat ? { latitude: Number(row.start_lat), longitude: Number(row.start_long) } : undefined),
          end_location: row.end_location || (row.end_lat ? { latitude: Number(row.end_lat), longitude: Number(row.end_long) } : undefined),
          notes: row.notes || row.comment || '',
        });
      })
      .on('end', (rowCount: number) => {
        console.log(`[CSV-PARSER] Finished parsing ${rowCount} rows, found ${trips.length} trips`);
        resolve(trips);
      });

    stream.write(buffer);
    stream.end();
  });
}

export default { parseTripsFromBuffer };
