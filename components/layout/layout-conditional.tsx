'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/context/auth-context';
import AuthenticatedLayout from '@/components/layout/authenticated-layout';
import PublicLayout from '@/components/layout/public-layout';

export default function LayoutWithConditionalSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  // Landing page should always use public layout (no sidebar for authenticated users)
  const isLandingPage = pathname === '/';
  
  // If it's the landing page, always use public layout
  if (isLandingPage) {
    return <PublicLayout>{children}</PublicLayout>;
  }

  // For other pages, use authenticated layout if logged in, otherwise public
  if (isAuthenticated) {
    return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
  }

  return <PublicLayout>{children}</PublicLayout>;
}
