import { apiClient } from './api';
import { User } from '../types';

export const adminService = {
  // Get all users
  getUsers: async (): Promise<User[]> => {
    const response = await apiClient.get<User[]>('/api/admin/users');
    return response.data;
  },

  // Update user
  updateUser: async (userId: string, userData: Partial<User>): Promise<User> => {
    const response = await apiClient.put<User>(`/api/admin/users/${userId}`, userData);
    return response.data;
  },

  // Ban user
  banUser: async (userId: string): Promise<void> => {
    await apiClient.post(`/api/admin/users/${userId}/ban`);
  },

  // Unban user
  unbanUser: async (userId: string): Promise<void> => {
    await apiClient.post(`/api/admin/users/${userId}/unban`);
  },
};

export default adminService;
