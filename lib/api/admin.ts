import { apiClient } from './client'
import type { User, VerificationDocument } from './types'

export interface LandingContent {
  id: number
  hero_headline_line1: string
  hero_headline_em: string
  hero_headline_line3: string
  hero_deck: string
  hero_col1_paragraph1: string
  hero_col1_paragraph2: string
  hero_col2_paragraph1: string
  hero_col2_paragraph2: string
  services_intro: string
  how_it_works_intro: string
  why_us_intro: string
  content_map?: Record<string, string>
  updated_at: string
}

export interface AdminReviewRequest {
  status: 'APPROVED' | 'REJECTED'
  rejection_reason?: string
}

export const adminAPI = {
  listUsers: async (page = 1, pageSize = 20): Promise<{ users: User[]; total: number; page: number; page_size: number }> => {
    return apiClient.get(`/users?page=${page}&page_size=${pageSize}`)
  },

  deleteUser: async (id: string): Promise<{ message: string }> => {
    return apiClient.delete(`/users/${id}`)
  },

  listPendingVerifications: async (page = 1, pageSize = 20): Promise<{ documents: VerificationDocument[]; total: number; page: number; page_size: number }> => {
    return apiClient.get(`/admin/verification/pending?page=${page}&page_size=${pageSize}`)
  },

  listAllVerifications: async (page = 1, pageSize = 20): Promise<{ documents: VerificationDocument[]; total: number; page: number; page_size: number }> => {
    return apiClient.get(`/admin/verification/all?page=${page}&page_size=${pageSize}`)
  },

  reviewVerification: async (id: string, payload: AdminReviewRequest): Promise<{ message: string; document: VerificationDocument }> => {
    return apiClient.put(`/admin/verification/${id}/review`, payload)
  },

  getLandingContent: async (): Promise<{ content: LandingContent }> => {
    return apiClient.get('/admin/content/landing')
  },

  updateLandingContent: async (payload: Partial<LandingContent>): Promise<{ content: LandingContent }> => {
    return apiClient.put('/admin/content/landing', payload)
  },
}

export const contentAPI = {
  getLandingContent: async (): Promise<{ content: LandingContent }> => {
    return apiClient.get('/content/landing')
  },
}
