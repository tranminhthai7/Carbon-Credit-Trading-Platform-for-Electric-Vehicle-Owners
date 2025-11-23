import { apiClient } from './api';
import { Wallet, CarbonCredit, Transaction } from '../types';

export const walletService = {
  // Get user's wallet
  getMyWallet: async (): Promise<Wallet> => {
    // Wallet endpoints on the backend are per-user: /wallet/:userId
    const raw = localStorage.getItem('user') || '{}';
    const user = JSON.parse(raw);
    const userId = user?.id;
    if (!userId) throw new Error('User not available (not logged in)');
    const response = await apiClient.get<Wallet>(`/api/wallet/${userId}`);
    return response.data;
  },

  // Get wallet balance
  getBalance: async (): Promise<{ balance: number }> => {
    const raw = localStorage.getItem('user') || '{}';
    const user = JSON.parse(raw);
    const userId = user?.id;
    if (!userId) return { balance: 0 };

    const response = await apiClient.get<any>(`/api/wallet/${userId}`);
    const wallet = response.data;
    return { balance: wallet?.balance ?? 0 };
  },

  // Get wallet transactions
  getTransactions: async (): Promise<Transaction[]> => {
    // The carbon-credit service exposes /wallet/:userId — the wallet record may
    // include related transactions depending on server configuration. Fetch the
    // wallet and map any incoming/outgoing transactions to the frontend shape.
    const raw = localStorage.getItem('user') || '{}';
    const user = JSON.parse(raw);
    const userId = user?.id;
    if (!userId) return [];

    const response = await apiClient.get<any>(`/api/wallet/${userId}`);
    const wallet = response.data;
    const txs: any[] = [];
    if (Array.isArray(wallet?.incoming)) txs.push(...wallet.incoming.map((t: any) => ({
      id: t.id,
      walletId: wallet.id,
      type: t.type === 'MINT' ? 'EARN' : t.type === 'BURN' ? 'SPEND' : 'TRANSFER',
      amount: t.amount,
      description: t.type === 'MINT' ? 'Minted credits' : (t.type === 'BURN' ? 'Burn' : 'Received transfer'),
      createdAt: t.createdAt,
    })));
    if (Array.isArray(wallet?.outgoing)) txs.push(...wallet.outgoing.map((t: any) => ({
      id: t.id,
      walletId: wallet.id,
      type: t.type === 'TRANSFER' ? 'TRANSFER' : (t.type === 'BURN' ? 'SPEND' : 'SPEND'),
      amount: t.amount,
      description: t.type === 'TRANSFER' ? 'Sent transfer' : 'Spent',
      createdAt: t.createdAt,
    })));

    // Normalize date strings
    return txs.map((t) => ({ ...t, createdAt: typeof t.createdAt === 'string' ? t.createdAt : new Date(t.createdAt).toISOString() }));
  },

  // Get carbon credits
  getCredits: async (): Promise<CarbonCredit[]> => {
    const response = await apiClient.get<CarbonCredit[]>('/api/wallet/credits');
    return response.data;
  },
};
