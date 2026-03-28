/**
 * Bookings API
 * Handles booking-related API calls
 */

import { apiClient } from './client';

export interface Booking {
  id: string;
  user_id: string;
  consultant_id: string;
  service_id: string;
  payment_id: string;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  scheduled_at: string;
  created_at: string;
  updated_at: string;
  consultant?: {
    id: string;
    first_name: string;
    last_name: string;
    profile_picture?: string;
  };
  service?: {
    id: string;
    name: string;
    description: string;
    base_price: number;
  };
}

export interface CreateBookingRequest {
  consultant_id: string;
  service_id: string;
  scheduled_at: string;
  notes?: string;
}

export interface BookingHistory {
  bookings: Booking[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export const bookingsAPI = {
  /**
   * Create a new booking after payment verification
   */
  async createBooking(data: CreateBookingRequest): Promise<Booking> {
    try {
      return await apiClient.post('/bookings', data);
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  /**
   * Get all bookings for the current user
   */
  async getMyBookings(page?: number, limit?: number): Promise<BookingHistory> {
    try {
      const params = new URLSearchParams();
      if (page) params.append('page', page.toString());
      if (limit) params.append('limit', limit.toString());
      const queryString = params.toString();
      return await apiClient.get(`/bookings${queryString ? `?${queryString}` : ''}`);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  },

  /**
   * Get booking details by ID
   */
  async getBooking(bookingId: string): Promise<Booking> {
    try {
      return await apiClient.get(`/bookings/${bookingId}`);
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  },

  /**
   * Update booking status
   */
  async updateBookingStatus(bookingId: string, status: Booking['status']): Promise<Booking> {
    try {
      return await apiClient.put(`/bookings/${bookingId}`, { status });
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  },

  /**
   * Cancel a booking
   */
  async cancelBooking(bookingId: string, reason?: string): Promise<Booking> {
    try {
      return await apiClient.post(`/bookings/${bookingId}/cancel`, { reason });
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  },

  /**
   * Get bookings for a professional (consultant)
   */
  async getConsultantBookings(page?: number, limit?: number): Promise<BookingHistory> {
    try {
      const params = new URLSearchParams();
      if (page) params.append('page', page.toString());
      if (limit) params.append('limit', limit.toString());
      const queryString = params.toString();
      return await apiClient.get(`/bookings/consultant/all${queryString ? `?${queryString}` : ''}`);
    } catch (error) {
      console.error('Error fetching consultant bookings:', error);
      throw error;
    }
  },
};
