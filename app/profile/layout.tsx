import ProtectedRoute from '@/components/ProtectedRoute';

export const metadata = {
  title: 'Profile - CounselMate',
  description: 'Manage your CounselMate profile',
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
