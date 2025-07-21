import { ReactNode } from 'react';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { redirect } from 'next/navigation';

// Student-specific dashboard layout
// Ensures only students access this section
// Reference: HackerRank Clone document, Section 5.1 (Role-based UI)

export default function StudentLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  // Restrict to students
  if (!loading && (!user || user.role !== 'student')) {
    redirect('/login');
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
      {children}
    </div>
  );
}