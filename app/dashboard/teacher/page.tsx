import Link from 'next/link';
import Button from '@/components/Button';
import { useAuth } from '@/features/authentication/hooks/useAuth';

// Teacher dashboard page with options to create exams and view reports
// Reference: HackerRank Clone document, Section 5.1 (Role-based UI)

export default function TeacherDashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!user || user.role !== 'teacher') {
    return null; // Layout handles redirection
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Welcome, {user.name}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/exams/create">
          <Button variant="primary">Create New Exam</Button>
        </Link>
        <Link href="/dashboard/teacher/reports">
          <Button variant="secondary">View Reports</Button>
        </Link>
      </div>
    </div>
  );
}