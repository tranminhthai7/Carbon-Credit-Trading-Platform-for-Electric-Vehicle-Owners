import { apiClient } from './api';
import { Certificate } from '../types';

export const certificateService = {
  // Get certificates for current user
  getCertificates: async (): Promise<Certificate[]> => {
    const response = await apiClient.get<Certificate[]>('/api/certificates');
    return response.data;
  },

  // Download certificate PDF (returns blob)
  downloadPdf: async (certificateId: string): Promise<Blob> => {
    const response = await apiClient.get(`/api/certificates/${certificateId}/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Create share link for certificate
  createShareLink: async (certificateId: string): Promise<{ shareUrl: string }> => {
    const response = await apiClient.post<{ shareUrl: string }>(`/api/certificates/${certificateId}/share`);
    return response.data;
  },
};

export default certificateService;
