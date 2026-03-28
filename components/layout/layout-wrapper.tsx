'use client';

import { useAuth } from '@/lib/context/auth-context';
import SidebarLayout from '@/components/layout/sidebar-layout';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <SidebarLayout>{children}</SidebarLayout>;
  }

  return <>{children}</>;
}
