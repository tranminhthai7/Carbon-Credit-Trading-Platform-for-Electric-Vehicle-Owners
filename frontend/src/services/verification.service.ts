import { apiClient } from './api';
import { Verification, Certificate } from '../types';

export const verificationService = {
  // Get all pending verifications (for CVA)
  getPendingVerifications: async (): Promise<Verification[]> => {
    const response = await apiClient.get('/api/verifications/pending');
    return response.data.data.verifications;
  },

  // Get all verifications by verifier
  getMyVerifications: async (): Promise<Verification[]> => {
    const response = await apiClient.get<Verification[]>('/api/verifications/verifier');
    return response.data;
  },

  // Approve a verification
  approveVerification: async (verificationId: string, cvaId: string, comments?: string): Promise<Verification> => {
    const response = await apiClient.post<Verification>('/api/verifications/approve', {
      verification_id: verificationId,
      cva_id: cvaId,
      notes: comments,
    });
    return response.data;
  },

  // Reject a verification
  rejectVerification: async (verificationId: string, cvaId: string, comments: string): Promise<Verification> => {
    const response = await apiClient.post<Verification>('/api/verifications/reject', {
      verification_id: verificationId,
      cva_id: cvaId,
      notes: comments,
    });
    return response.data;
  },

  // Get verification statistics
  getStats: async (): Promise<{ total: number; approved: number; rejected: number; pending: number }> => {
    const response = await apiClient.get('/api/verifications/stats');
    return response.data;
  },

  // Get recent verification activities
  getRecentActivities: async (): Promise<Verification[]> => {
    const response = await apiClient.get<Verification[]>('/api/verifications/recent');
    return response.data;
  },

  // Get user's certificates
  getMyCertificates: async (): Promise<Certificate[]> => {
    const response = await apiClient.get<Certificate[]>('/api/verifications/certificates');
    return response.data;
  },
};
