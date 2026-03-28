import ProtectedRoute from '@/components/ProtectedRoute';

export const metadata = {
  title: 'Booking - CounselMate',
  description: 'Book a consultation with a professional',
};

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
