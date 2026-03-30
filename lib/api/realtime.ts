import { apiClient } from './client'

export interface WSStoredMessage {
  id: string
  booking_id: string
  sender_id: string
  content: string
  created_at: string
}

export interface HandshakeAgreement {
  id: string
  booking_id: string
  requester_id: string
  responder_id: string
  requester_accepted: boolean
  responder_accepted: boolean
  terms_version: string
  status: 'PENDING' | 'ACTIVE' | 'REJECTED'
  created_at: string
  updated_at: string
}

export interface FeeRequest {
  id: string
  booking_id: string
  requested_by: string
  requested_to: string
  amount_rupees: number
  platform_fee_rupees: number
  consultant_payout_rupees: number
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
  notes?: string
  created_at: string
  updated_at: string
}

export const realtimeAPI = {
  async getMessages(bookingId: string, limit = 200): Promise<WSStoredMessage[]> {
    const res = await apiClient.get<{ messages: WSStoredMessage[] }>(`/ws/messages?booking=${encodeURIComponent(bookingId)}&limit=${limit}`)
    return res.messages || []
  },

  async getHandshakeStatus(bookingId: string): Promise<HandshakeAgreement | null> {
    try {
      const res = await apiClient.get<{ handshake: HandshakeAgreement }>(`/ws/handshake/status?booking_id=${encodeURIComponent(bookingId)}`)
      return res.handshake
    } catch {
      return null
    }
  },

  async requestHandshake(bookingId: string, termsVersion = 'v1'): Promise<HandshakeAgreement> {
    const res = await apiClient.post<{ handshake: HandshakeAgreement }>('/ws/handshake/request', {
      booking_id: bookingId,
      terms_version: termsVersion,
    })
    return res.handshake
  },

  async respondHandshake(bookingId: string, accept: boolean): Promise<HandshakeAgreement> {
    const res = await apiClient.post<{ handshake: HandshakeAgreement }>('/ws/handshake/respond', {
      booking_id: bookingId,
      accept,
    })
    return res.handshake
  },

  async getFeeRequests(bookingId: string): Promise<FeeRequest[]> {
    const res = await apiClient.get<{ requests: FeeRequest[] }>(`/ws/payment-requests?booking_id=${encodeURIComponent(bookingId)}`)
    return res.requests || []
  },

  async createFeeRequest(bookingId: string, amountRupees: number, notes?: string): Promise<FeeRequest> {
    const res = await apiClient.post<{ request: FeeRequest }>('/ws/payment-request', {
      booking_id: bookingId,
      amount_rupees: amountRupees,
      notes,
    })
    return res.request
  },

  async respondFeeRequest(requestId: string, accept: boolean): Promise<FeeRequest> {
    const res = await apiClient.put<{ request: FeeRequest }>(`/ws/payment-request/${requestId}/respond`, { accept })
    return res.request
  },
}
