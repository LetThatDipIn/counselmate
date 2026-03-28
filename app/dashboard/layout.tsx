import ProtectedRoute from '@/components/ProtectedRoute';

export const metadata = {
  title: 'Dashboard - CounselMate',
  description: 'Your CounselMate dashboard',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
