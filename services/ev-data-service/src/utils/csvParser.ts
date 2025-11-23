import { parse } from 'fast-csv';

export async function parseTripsFromBuffer(buffer: Buffer): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const trips: any[] = [];
    const stream = parse({ headers: true, ignoreEmpty: true, trim: true })
      .on('error', (error) => reject(error))
      .on('data', (row) => {
        // normalize expected header names: start_time,end_time,distance_km,start_lat,start_long,end_lat,end_long,notes
        const distance = Number(row.distance_km || row.distance || row.km || 0);
        trips.push({
          start_time: row.start_time || row.start || row.startTime,
          end_time: row.end_time || row.end || row.endTime,
          distance_km: distance,
          start_location: row.start_location || (row.start_lat ? { latitude: Number(row.start_lat), longitude: Number(row.start_long) } : undefined),
          end_location: row.end_location || (row.end_lat ? { latitude: Number(row.end_lat), longitude: Number(row.end_long) } : undefined),
          notes: row.notes || row.comment || '',
        });
      })
      .on('end', (rowCount: number) => resolve(trips));

    stream.write(buffer);
    stream.end();
  });
}

export default { parseTripsFromBuffer };
