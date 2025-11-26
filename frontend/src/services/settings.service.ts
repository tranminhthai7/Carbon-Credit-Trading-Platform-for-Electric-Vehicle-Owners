import { apiClient } from './api';

export interface SystemSettings {
  carbonCreditPricing: {
    basePrice: number;
    commissionRate: number;
  };
  verificationSettings: {
    autoApproveVerifiedTrips: boolean;
    minTripDistance: number;
    verificationTimeoutDays: number;
  };
  notificationSettings: {
    emailEnabled: boolean;
    pushEnabled: boolean;
    smsEnabled: boolean;
  };
}

export const settingsService = {
  // Get system settings
  async getSettings(): Promise<SystemSettings> {
    const response = await apiClient.get('/api/settings');
    return response.data;
  },

  // Update system settings
  async updateSettings(settings: Partial<SystemSettings>): Promise<SystemSettings> {
    const response = await apiClient.put('/api/settings', settings);
    return response.data;
  },
};