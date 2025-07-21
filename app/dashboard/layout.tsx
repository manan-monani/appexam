import { ReactNode } from 'react';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { redirect } from 'next/navigation';

// Shared layout for role-based dashboards (teacher, student, admin)
// Includes sidebar navigation and ensures authenticated access
// Reference: HackerRank Clone document, Section 5.1 (Frontend Structure)

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  // Redirect unauthenticated users to login
  if (!loading && !user) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}