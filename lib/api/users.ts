/**
 * Users API endpoints
 */

import { apiClient } from './client';
import type { User, UpdateUserRequest, ChangePasswordRequest } from './types';

export const usersAPI = {
  // Get user by ID
  getUser: async (id: string): Promise<User> => {
    return apiClient.get<User>(`/users/${id}`);
  },

  // Update user
  updateUser: async (id: string, data: UpdateUserRequest): Promise<User> => {
    return apiClient.put<User>(`/users/${id}`, data);
  },

  // Change password
  changePassword: async (id: string, data: ChangePasswordRequest): Promise<{ message: string }> => {
    return apiClient.put(`/users/${id}/password`, data);
  },

  // List all users (admin only)
  listUsers: async (page = 1, limit = 20): Promise<{ users: User[]; total: number }> => {
    return apiClient.get(`/users?page=${page}&limit=${limit}`);
  },

  // Delete user (admin only)
  deleteUser: async (id: string): Promise<{ message: string }> => {
    return apiClient.delete(`/users/${id}`);
  },
};
