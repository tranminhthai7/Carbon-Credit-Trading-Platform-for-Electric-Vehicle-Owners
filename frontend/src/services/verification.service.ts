import { apiClient } from './api';
import { Verification, Certificate } from '../types';
import { authService } from './auth.service';

export const verificationService = {
  // Get all pending verifications (for CVA)
  getPendingVerifications: async (): Promise<Verification[]> => {
    const response = await apiClient.get<Verification[]>('/api/verification/pending');
    return response.data;
  },

  // ✅ FIX: Get all verifications by current CVA
  getMyVerifications: async (): Promise<Verification[]> => {
    const user = authService.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // ✅ ĐÚNG endpoint: /api/verification/cva/:cvaId
    const response = await apiClient.get<Verification[]>(`/api/verification/cva/${user.id}`);
    return response.data;
  },

  // Approve a verification
  approveVerification: async (verificationId: string, comments?: string): Promise<Verification> => {
    const response = await apiClient.post<Verification>('/api/verification/approve', {
      verification_id: verificationId,
      cva_id: authService.getCurrentUser()?.id,
      notes: comments,
    });
    return response.data;
  },

  // Reject a verification
  rejectVerification: async (verificationId: string, comments: string): Promise<Verification> => {
    const response = await apiClient.post<Verification>('/api/verification/reject', {
      verification_id: verificationId,
      cva_id: authService.getCurrentUser()?.id,
      notes: comments,
    });
    return response.data;
  },

  // ✅ FIX: Get verification statistics - Đúng endpoint
  getStats: async (cvaId?: string): Promise<{ 
    total: number; 
    approved: number; 
    rejected: number; 
    pending: number;
    approval_rate?: string;
  }> => {
    // Nếu có cvaId thì get stats của CVA đó, không thì get global
    const endpoint = cvaId 
      ? `/api/verification/stats/cva/${cvaId}`
      : '/api/verification/stats';
    
    const response = await apiClient.get(endpoint);
    return response.data.data || response.data;
  },

  // ✅ FIX: Get user certificates - Đúng endpoint và query param
  getMyCertificates: async (): Promise<Certificate[]> => {
    const user = authService.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // ✅ ĐÚNG: Backend expects query param ?userId=xxx
    const response = await apiClient.get<Certificate[]>(`/api/verification/certificates?userId=${user.id}`);
    
    // ⚠️ Backend trả về array trực tiếp, KHÔNG wrap trong object
    return response.data;
  },
};