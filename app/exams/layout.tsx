import { ReactNode } from 'react';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { redirect } from 'next/navigation';
import ExamShell from '@/components/ExamShell';

// Exam layout with browser lockdown wrapper for secure exam environment
// Reference: HackerRank Clone document, Section 5.3 (Secure UI)

export default function ExamLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  // Restrict to authenticated users
  if (!loading && !user) {
    redirect('/login');
  }

  return (
    <ExamShell>
      {children}
    </ExamShell>
  );
}