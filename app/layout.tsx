
import './globals.css';
import { AuthProvider } from '@/features/authentication/AuthProvider';
import Navbar from '@/components/Navbar';
import Notification from '@/components/Notification';

export const metadata = {
  title: 'Secure Exam Code Platform',
  description: 'A secure platform for coding exams',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 dark:bg-gray-900">
        <AuthProvider>
          <Navbar />
          <Notification />
          <main className="container mx-auto py-6">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
