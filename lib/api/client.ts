/**
 * API Client for CounselMate Backend
 */

// Get API base URL at runtime, not at build time
function getAPIBaseURL(): string {
  if (typeof window !== 'undefined') {
    // Client-side: use environment variable or default to localhost
    return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
  }
  // Server-side: use a default (though this shouldn't be used in practice)
  return 'http://localhost:8080/api';
}

class APIClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL?: string) {
    this.baseURL = baseURL || getAPIBaseURL();
    
    // Load token from localStorage on client side
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('access_token');
      console.debug('[APIClient] Initialized with baseURL:', this.baseURL);
      console.debug('[APIClient] Token loaded from localStorage:', !!this.token);
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('access_token', token);
      } else {
        localStorage.removeItem('access_token');
      }
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Always re-read from localStorage as source of truth
    // This ensures we have the latest token even if it was updated elsewhere
    const currentToken = this.token || (typeof window !== 'undefined' 
      ? localStorage.getItem('access_token') 
      : null);

    console.debug('[APIClient.request] Current token from memory:', !!this.token);
    console.debug('[APIClient.request] Current token from localStorage:', !!currentToken);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (currentToken) {
      headers['Authorization'] = `Bearer ${currentToken}`;
      console.debug('[APIClient.request] Authorization header set with token:', currentToken.substring(0, 20) + '...');
    } else {
      console.debug('[APIClient.request] No token available, request will be unauthenticated');
    }

    console.debug('[APIClient.request] Calling:', this.baseURL + endpoint);
    
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers,
    });

    console.debug('[APIClient.request] Response status:', response.status, 'for endpoint:', endpoint);

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: response.statusText,
      }));
      
      // Create error with status code embedded
      const errorMessage = error.message || `HTTP error! status: ${response.status}`;
      const customError = new Error(errorMessage) as any;
      customError.status = response.status;
      customError.message = `[${response.status}] ${errorMessage}`;
      
      console.error('[APIClient.request] Error thrown:', customError.message, { status: response.status });
      throw customError;
    }

    return response.json();
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new APIClient();

