import { apiClient } from './api';
import { Wallet, CarbonCredit, Transaction } from '../types';

export const walletService = {
  // Get user's wallet
  getMyWallet: async (): Promise<Wallet> => {
    const response = await apiClient.get<Wallet>('/api/wallet');
    return response.data;
  },

  // Get wallet balance
  getBalance: async (): Promise<{ balance: number }> => {
    const response = await apiClient.get<{ balance: number }>('/api/wallet/balance');
    return response.data;
  },

  // Get wallet transactions
  getTransactions: async (): Promise<Transaction[]> => {
    const response = await apiClient.get<Transaction[]>('/api/wallet/transactions');
    return response.data;
  },

  // Get carbon credits
  getCredits: async (): Promise<CarbonCredit[]> => {
    const response = await apiClient.get<CarbonCredit[]>('/api/wallet/credits');
    return response.data;
  },
};
