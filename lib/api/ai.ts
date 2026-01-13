/**
 * AI API endpoints
 */

import { apiClient } from './client';
import type { AITagSuggestionRequest, AITagSuggestionResponse } from './types';

export const aiAPI = {
  // Get AI-powered tag suggestions
  suggestTags: async (data: AITagSuggestionRequest): Promise<AITagSuggestionResponse> => {
    return apiClient.post<AITagSuggestionResponse>('/ai/suggest-tags', data);
  },
};
