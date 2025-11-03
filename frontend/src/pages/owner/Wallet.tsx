import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';

type WalletRes = { carbon_balance: number; cash_balance: number };

export default function Wallet() {
  const { data } = useQuery({
    queryKey: ['wallet'],
    queryFn: async () => (await api.get<WalletRes>('/wallet')).data
  });

  return (
    <div>
      <h4>Ví</h4>
      <div>Carbon balance: {data?.carbon_balance ?? '...'}</div>
      <div>Cash balance: {data?.cash_balance ?? '...'}</div>
    </div>
  );
}


