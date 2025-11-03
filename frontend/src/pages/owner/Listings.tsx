import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';

type Listing = { id: string; type: 'FIXED' | 'AUCTION'; unit_price: number; quantity_available: number };

export default function Listings() {
  const { data } = useQuery({
    queryKey: ['my-listings'],
    queryFn: async () => (await api.get<Listing[]>('/listings/mine')).data
  });

  return (
    <div>
      <h4>Listings của tôi</h4>
      <ul>
        {(data ?? []).map((l) => (
          <li key={l.id}>#{l.id} • {l.type} • {l.quantity_available} @ {l.unit_price}</li>
        ))}
      </ul>
    </div>
  );
}


