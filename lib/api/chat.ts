/**
 * Chat/Messages API
 * Handles real-time and stored messages between users and consultants
 */

import { apiClient } from './client';

export interface Message {
  id: string;
  booking_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  sender?: {
    id: string;
    first_name: string;
    last_name: string;
    profile_picture?: string;
  };
}

export interface ChatThread {
  id: string;
  booking_id: string;
  participant_1_id: string;
  participant_2_id: string;
  last_message?: Message;
  unread_count: number;
  created_at: string;
  updated_at: string;
  other_participant?: {
    id: string;
    first_name: string;
    last_name: string;
    profile_picture?: string;
  };
}

export interface SendMessageRequest {
  booking_id: string;
  receiver_id: string;
  content: string;
}

export interface MessagesResponse {
  messages: Message[];
  total: number;
  page: number;
  limit: number;
}

export interface ChatThreadsResponse {
  threads: ChatThread[];
  total: number;
  unread_total: number;
}

export const chatAPI = {
  /**
   * Get all chat threads for the current user
   */
  async getChatThreads(page?: number, limit?: number): Promise<ChatThreadsResponse> {
    try {
      const params = new URLSearchParams();
      if (page) params.append('page', page.toString());
      if (limit) params.append('limit', limit.toString());
      const queryString = params.toString();
      return await apiClient.get(`/messages/threads${queryString ? `?${queryString}` : ''}`);
    } catch (error) {
      console.error('Error fetching chat threads:', error);
      throw error;
    }
  },

  /**
   * Get messages for a specific booking/chat
   */
  async getMessages(bookingId: string, page?: number, limit?: number): Promise<MessagesResponse> {
    try {
      const params = new URLSearchParams();
      if (page) params.append('page', page.toString());
      if (limit) params.append('limit', limit.toString());
      const queryString = params.toString();
      return await apiClient.get(`/messages/booking/${bookingId}${queryString ? `?${queryString}` : ''}`);
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  /**
   * Send a message
   */
  async sendMessage(data: SendMessageRequest): Promise<Message> {
    try {
      return await apiClient.post('/messages', data);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  /**
   * Mark message as read
   */
  async markMessageAsRead(messageId: string): Promise<Message> {
    try {
      return await apiClient.put(`/messages/${messageId}/read`, {});
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  },

  /**
   * Mark all messages in a thread as read
   */
  async markThreadAsRead(bookingId: string): Promise<void> {
    try {
      return await apiClient.put(`/messages/booking/${bookingId}/read-all`, {});
    } catch (error) {
      console.error('Error marking thread as read:', error);
      throw error;
    }
  },

  /**
   * Get unread message count
   */
  async getUnreadCount(): Promise<{ unread_count: number }> {
    try {
      return await apiClient.get('/messages/unread-count');
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  },

  /**
   * Delete a message
   */
  async deleteMessage(messageId: string): Promise<void> {
    try {
      return await apiClient.delete(`/messages/${messageId}`);
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  },
};
