/**
 * Services API
 */

import { apiClient } from './client';
import type { Service, ServicesResponse } from './types';

export const servicesAPI = {
  /**
   * Get all available services
   */
  async getServices(): Promise<Service[]> {
    try {
      const response = await apiClient.get<ServicesResponse>('/services');
      return response.services || [];
    } catch (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
  },

  /**
   * Get a specific service by ID
   */
  async getService(serviceId: string): Promise<Service> {
    try {
      return await apiClient.get<Service>(`/services/${serviceId}`);
    } catch (error) {
      console.error(`Error fetching service ${serviceId}:`, error);
      throw error;
    }
  },
};
