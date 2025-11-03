import { useState } from 'react';
import { api } from '../../lib/api';

export default function Issuance() {
  const [tripId, setTripId] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/issuances', { trip_id: tripId, notes });
      setMessage('Đã tạo yêu cầu phát hành (SUBMITTED)');
    } catch {
      setMessage('Không thể tạo yêu cầu (mock nếu backend chưa chạy)');
    }
  };

  return (
    <div style={{ maxWidth: 520 }}>
      <h4>Tạo yêu cầu phát hành tín chỉ</h4>
      <form onSubmit={submit} style={{ display: 'grid', gap: 12 }}>
        <input placeholder="Trip ID" value={tripId} onChange={(e) => setTripId(e.target.value)} />
        <textarea placeholder="Ghi chú cho CVA" value={notes} onChange={(e) => setNotes(e.target.value)} />
        <button type="submit" disabled={!tripId}>Gửi duyệt</button>
      </form>
      {message && <div style={{ marginTop: 12 }}>{message}</div>}
    </div>
  );
}


