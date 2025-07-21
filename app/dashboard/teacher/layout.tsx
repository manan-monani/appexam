import { ReactNode } from 'react';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { redirect } from 'next/navigation';

// Teacher-specific dashboard layout
// Ensures only teachers access this section
// Reference: HackerRank Clone document, Section 5.1 (Role-based UI)

export default function TeacherLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  // Restrict to teachers
  if (!loading && (!user || user.role !== 'teacher')) {
    redirect('/login');
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Teacher Dashboard</h1>
      {children}
    </div>
  );
}