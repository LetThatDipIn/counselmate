/**
 * Profiles API endpoints
 */

import { apiClient } from './client';
import type {
  Profile,
  ProfileSearchParams,
  SearchResponse,
  UpdateProfileRequest,
  ContactProfileRequest,
} from './types';

export const profilesAPI = {
  // Get profile by ID
  getProfile: async (id: string): Promise<Profile> => {
    return apiClient.get<Profile>(`/profiles/${id}`);
  },

  // Get current user's profile
  getMyProfile: async (): Promise<Profile> => {
    return apiClient.get<Profile>('/profiles/me');
  },

  // Create profile
  createProfile: async (data: UpdateProfileRequest): Promise<Profile> => {
    return apiClient.post<Profile>('/profiles', data);
  },

  // Update profile
  updateProfile: async (data: UpdateProfileRequest): Promise<Profile> => {
    return apiClient.put<Profile>('/profiles', data);
  },

  // Delete profile
  deleteProfile: async (id: string): Promise<{ message: string }> => {
    return apiClient.delete(`/profiles/${id}`);
  },

  // Search profiles
  searchProfiles: async (params: ProfileSearchParams): Promise<SearchResponse> => {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => queryParams.append(key, v.toString()));
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });

    return apiClient.get<SearchResponse>(`/profiles/search?${queryParams.toString()}`);
  },

  // Contact profile
  contactProfile: async (id: string, data: ContactProfileRequest): Promise<{ message: string }> => {
    return apiClient.post(`/profiles/${id}/contact`, data);
  },
};
