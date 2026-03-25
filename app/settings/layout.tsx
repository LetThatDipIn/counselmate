import ProtectedRoute from '@/components/ProtectedRoute';

export const metadata = {
  title: 'Settings - CounselMate',
  description: 'Manage your account settings',
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
