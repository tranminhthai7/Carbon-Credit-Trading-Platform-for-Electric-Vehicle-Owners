import { apiClient } from './api';
import { Verification } from '../types';

export const verificationService = {
  // Get all pending verifications (for CVA)
  getPendingVerifications: async (): Promise<Verification[]> => {
    const response = await apiClient.get<Verification[]>('/api/verifications/pending');
    return response.data;
  },

  // Get all verifications by verifier
  getMyVerifications: async (): Promise<Verification[]> => {
    const response = await apiClient.get<Verification[]>('/api/verifications/verifier');
    return response.data;
  },

  // Approve a verification
  approveVerification: async (verificationId: string, comments?: string): Promise<Verification> => {
    const response = await apiClient.post<Verification>(`/api/verifications/${verificationId}/approve`, {
      comments,
    });
    return response.data;
  },

  // Reject a verification
  rejectVerification: async (verificationId: string, comments: string): Promise<Verification> => {
    const response = await apiClient.post<Verification>(`/api/verifications/${verificationId}/reject`, {
      comments,
    });
    return response.data;
  },

  // Get verification statistics
  getStats: async (): Promise<{ total: number; approved: number; rejected: number; pending: number }> => {
    const response = await apiClient.get('/api/verifications/stats');
    return response.data;
  },
};
