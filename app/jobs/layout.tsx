import ProtectedRoute from '@/components/ProtectedRoute';

export const metadata = {
  title: 'Jobs - CounselMate',
  description: 'Job board for professionals',
};

export default function JobsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
