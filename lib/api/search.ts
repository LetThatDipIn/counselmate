/**
 * Search API endpoints
 */

import { apiClient } from './client';
import type { ProfileSearchParams, SearchResponse, TagsResponse } from './types';

export const searchAPI = {
  // General search
  search: async (params: ProfileSearchParams): Promise<SearchResponse> => {
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

    return apiClient.get<SearchResponse>(`/search?${queryParams.toString()}`);
  },

  // Get search suggestions
  getSuggestions: async (query: string): Promise<string[]> => {
    return apiClient.get<string[]>(`/search/suggestions?q=${encodeURIComponent(query)}`);
  },

  // Get available tags and filters
  getTags: async (): Promise<TagsResponse> => {
    return apiClient.get<TagsResponse>('/search/tags');
  },
};
