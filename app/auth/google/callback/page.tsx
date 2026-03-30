'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/context/auth-context';
import { authAPI, apiClient } from '@/lib/api';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const errorParam = searchParams.get('error');

      if (errorParam) {
        setError('Google authentication was cancelled or failed');
        toast.error('Authentication failed');
        setTimeout(() => router.push('/auth/login'), 2000);
        return;
      }

      if (!code) {
        setError('No authorization code received');
        toast.error('Authentication failed');
        setTimeout(() => router.push('/auth/login'), 2000);
        return;
      }

      try {
        // Exchange code for tokens
        console.log('[GoogleCallback] Calling googleCallback with code:', code?.substring(0, 20) + '...');
        const response = await authAPI.googleCallback({ code });
        
        console.log('[GoogleCallback] Full raw response:', response);
        console.log('[GoogleCallback] Response keys:', Object.keys(response));
        console.log('[GoogleCallback] Access token:', response.access_token?.substring(0, 20) + '...');
        console.log('[GoogleCallback] User:', response.user);
        console.log('[GoogleCallback] Refresh token:', response.refresh_token?.substring(0, 20) + '...');
        
        // Validate response structure
        if (!response.access_token) {
          throw new Error(`Missing access_token in response. Response keys: ${Object.keys(response).join(', ')}`);
        }
        if (!response.user) {
          throw new Error(`Missing user in response. Response keys: ${Object.keys(response).join(', ')}`);
        }
        if (!response.refresh_token) {
          throw new Error(`Missing refresh_token in response. Response keys: ${Object.keys(response).join(', ')}`);
        }
        
        console.debug('[GoogleCallback] Response structure is valid');
        
        // Store access token using apiClient (this also stores in localStorage)
        console.debug('[GoogleCallback] Calling apiClient.setToken()...');
        apiClient.setToken(response.access_token);
        console.debug('[GoogleCallback] Token stored via apiClient');
        
        // Verify token is in localStorage
        const storedToken = typeof window !== 'undefined' 
          ? localStorage.getItem('access_token')
          : null;
        console.log('[GoogleCallback] Token in localStorage after setToken:', storedToken?.substring(0, 20) + '...');
        
        // Store refresh token separately
        if (typeof window !== 'undefined') {
          localStorage.setItem('refresh_token', response.refresh_token);
          console.debug('[GoogleCallback] Refresh token stored');
        }

        // Always trust backend user role to avoid stale client-side role overrides.
        const user = response.user;
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('pendingProfessionType');
          sessionStorage.removeItem('pendingRole');
        }
        
        // Set user in context
        console.debug('[GoogleCallback] Calling setUser with:', user?.email);
        setUser(user);
        console.debug('[GoogleCallback] User set in context');
        
        toast.success('Successfully logged in with Google!');
        console.log('[GoogleCallback] ✅ All setup complete, redirecting to dashboard');
        router.push('/dashboard');
      } catch (err) {
        console.error('OAuth callback error:', err);
        setError(err instanceof Error ? err.message : 'Failed to complete Google login');
        toast.error('Failed to complete authentication');
        setTimeout(() => router.push('/auth/login'), 2000);
      }
    };

    handleCallback();
  }, [searchParams, router, setUser]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Failed</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <Loader2 className="w-16 h-16 mx-auto text-blue-600 animate-spin mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Completing Sign In...</h2>
        <p className="text-gray-600">Please wait while we log you in with Google</p>
      </div>
    </div>
  );
}
