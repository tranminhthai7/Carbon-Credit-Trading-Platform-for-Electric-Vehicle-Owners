import { apiClient } from './api';
import { PersonalStats, PlatformStats } from '../types';

export const reportService = {
  // Get personal statistics
  getPersonalStats: async (userId: string): Promise<PersonalStats> => {
    const response = await apiClient.get<PersonalStats>(`/api/reports/personal/${userId}`);
    return response.data;
  },

  // Get CO2 savings report
  getCO2Savings: async (userId: string, startDate?: string, endDate?: string): Promise<any> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await apiClient.get(`/api/reports/co2-savings/${userId}?${params}`);
    return response.data;
  },

  // Get revenue report
  getRevenue: async (userId: string, startDate?: string, endDate?: string): Promise<any> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await apiClient.get(`/api/reports/revenue/${userId}?${params}`);
    return response.data;
  },

  // Get platform-wide statistics (Admin only)
  getPlatformStats: async (): Promise<PlatformStats> => {
    const response = await apiClient.get<PlatformStats>('/api/reports/platform');
    return response.data;
  },
};
