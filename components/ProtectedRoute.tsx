'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/auth-context';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Don't check auth while still loading
    if (loading) {
      console.debug('[ProtectedRoute] Still loading auth, waiting...');
      return;
    }

    // If not authenticated after loading is done, redirect to login
    if (!isAuthenticated) {
      console.debug('[ProtectedRoute] Not authenticated, redirecting to login');
      router.push('/auth/login');
    }
  }, [loading, isAuthenticated, router]);

  // Show loading spinner while auth is initializing
  if (loading) {
    console.debug('[ProtectedRoute] Rendering loading spinner');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Initializing authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render anything (redirect is in progress)
  if (!isAuthenticated) {
    console.debug('[ProtectedRoute] Not authenticated, not rendering');
    return null;
  }

  // User is authenticated and loading is done — render content
  console.debug('[ProtectedRoute] Authenticated, rendering children');
  return <>{children}</>;
}
