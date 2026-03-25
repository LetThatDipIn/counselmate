import ProtectedRoute from '@/components/ProtectedRoute';

export const metadata = {
  title: 'Messages - CounselMate',
  description: 'Your messages',
};

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
