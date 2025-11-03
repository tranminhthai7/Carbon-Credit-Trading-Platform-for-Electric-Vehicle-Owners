import { useState } from 'react';
import { api } from '../../lib/api';

type TripFile = {
  distance_km: number;
  energy_kwh?: number;
  period_start?: string;
  period_end?: string;
  vehicle_vin?: string;
  region?: string;
};

export default function Trips() {
  const [fileName, setFileName] = useState<string>('');
  const [trip, setTrip] = useState<TripFile | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFileName(f.name);
    const text = await f.text();
    try {
      const data = JSON.parse(text) as TripFile;
      setTrip(data);
      setMessage(null);
    } catch {
      setTrip(null);
      setMessage('File không đúng định dạng JSON');
    }
  };

  const onUpload = async () => {
    if (!trip) return;
    try {
      setUploading(true);
      // Backend integration placeholder
      await api.post('/trips/upload', trip);
      setMessage('Tải lên thành công');
    } catch {
      setMessage('Không thể tải lên (mock nếu backend chưa chạy)');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ display: 'grid', gap: 12, maxWidth: 640 }}>
      <h4>Trips Upload</h4>
      <input type="file" accept="application/json" onChange={onFile} />
      {fileName && <div>File: {fileName}</div>}
      {trip && (
        <div style={{ border: '1px solid #eee', padding: 12 }}>
          <div>Distance: {trip.distance_km} km</div>
          {trip.energy_kwh != null && <div>Energy: {trip.energy_kwh} kWh</div>}
          {trip.region && <div>Region: {trip.region}</div>}
        </div>
      )}
      <button disabled={!trip || uploading} onClick={onUpload}>Tải lên</button>
      {message && <div style={{ color: '#555' }}>{message}</div>}
    </div>
  );
}


