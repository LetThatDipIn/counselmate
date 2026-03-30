/**
 * Users API endpoints
 */

import { apiClient } from './client';
import type { User, UpdateUserRequest, ChangePasswordRequest } from './types';

export interface UpdateUserResponse {
  user: User;
  tokens?: {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  };
}

export const usersAPI = {
  // Get user by ID
  getUser: async (id: string): Promise<User> => {
    return apiClient.get<User>(`/users/${id}`);
  },

  // Update user
  updateUser: async (id: string, data: UpdateUserRequest): Promise<UpdateUserResponse> => {
    return apiClient.put<UpdateUserResponse>(`/users/${id}`, data);
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
