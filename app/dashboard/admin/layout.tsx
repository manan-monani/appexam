import { ReactNode } from 'react';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { redirect } from 'next/navigation';

// Admin-specific dashboard layout
// Ensures only admins access this section
// Reference: HackerRank Clone document, Section 5.1 (Role-based UI)

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  // Restrict to admins
  if (!loading && (!user || user.role !== 'admin')) {
    redirect('/login');
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      {children}
    </div>
  );
}