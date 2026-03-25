/**
 * Verification API endpoints
 */

import { apiClient } from './client';
import type {
  VerificationDocument,
  AdminReviewData,
} from './types';

export const verificationAPI = {
  // Submit document for verification
  submitDocument: async (data: FormData): Promise<VerificationDocument> => {
    return apiClient.post<VerificationDocument>('/verification/documents', data);
  },

  // Get my verification documents
  getMyDocuments: async (): Promise<VerificationDocument[]> => {
    return apiClient.get<VerificationDocument[]>('/verification/documents');
  },

  // Get specific verification document
  getDocument: async (id: string): Promise<VerificationDocument> => {
    return apiClient.get<VerificationDocument>(`/verification/documents/${id}`);
  },

  // Admin: Get all verifications
  adminListAll: async (): Promise<VerificationDocument[]> => {
    return apiClient.get<VerificationDocument[]>('/admin/verification/all');
  },

  // Admin: Get pending verifications
  adminListPending: async (): Promise<VerificationDocument[]> => {
    return apiClient.get<VerificationDocument[]>('/admin/verification/pending');
  },

  // Admin: Review and approve/reject document
  adminReview: async (id: string, data: AdminReviewData): Promise<VerificationDocument> => {
    return apiClient.put<VerificationDocument>(
      `/admin/verification/${id}/review`,
      data
    );
  },
};
