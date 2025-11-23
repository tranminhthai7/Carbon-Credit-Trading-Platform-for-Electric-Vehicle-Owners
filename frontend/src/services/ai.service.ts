import { apiClient } from './api';

export interface PriceSuggestion {
  suggested_price_per_credit: number;
  estimated_total: number;
  confidence: number;
}

export const aiService = {
  suggestPrice: async (amount: number, region: string = 'global'): Promise<PriceSuggestion> => {
    const response = await apiClient.post<PriceSuggestion>('/api/ai/suggest-price', {
      amount,
      region,
    });
    return response.data;
  },
};