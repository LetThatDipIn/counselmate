/**
 * Payments API
 */

import { apiClient } from './client';
import type {
  CreatePaymentOrderRequest,
  CreateConsultantRegistrationRequest,
  ConsultantRegistrationResponse,
  PaymentVerificationRequest,
} from './types';

export const paymentsAPI = {
  /**
   * Create a payment order for service booking
   */
  async createPaymentOrder(data: CreatePaymentOrderRequest) {
    try {
      return await apiClient.post('/payments/orders', data);
    } catch (error) {
      console.error('Error creating payment order:', error);
      throw error;
    }
  },

  /**
   * Create consultant registration order (₹1 fee)
   */
  async createConsultantRegistrationOrder(
    data: CreateConsultantRegistrationRequest
  ): Promise<ConsultantRegistrationResponse> {
    try {
      return await apiClient.post('/payments/consultant-registration', data);
    } catch (error) {
      console.error('Error creating consultant registration order:', error);
      throw error;
    }
  },

  /**
   * Verify payment after successful checkout
   */
  async verifyPayment(data: PaymentVerificationRequest) {
    try {
      return await apiClient.post('/payments/verify', data);
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  },

  /**
   * Get payment details
   */
  async getPaymentDetails(orderId: string) {
    try {
      return await apiClient.get(`/payments/${orderId}`);
    } catch (error) {
      console.error('Error fetching payment details:', error);
      throw error;
    }
  },
};
