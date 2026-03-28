/**
 * Subscription API endpoints
 */

import { apiClient } from './client';
import type { Subscription, UsageStats } from './types';

export const subscriptionAPI = {
  // Get subscription details
  getSubscription: async (): Promise<Subscription> => {
    return apiClient.get<Subscription>('/subscription');
  },

  // Get usage statistics
  getUsageStats: async (): Promise<UsageStats> => {
    return apiClient.get<UsageStats>('/subscription/usage');
  },

  // Upgrade to premium
  upgradeToPremium: async (): Promise<Subscription> => {
    return apiClient.post<Subscription>('/subscription/upgrade', {
      duration_days: 30
    });
  },

  // Downgrade to free
  downgradeToFree: async (): Promise<Subscription> => {
    return apiClient.post<Subscription>('/subscription/downgrade');
  },
};
