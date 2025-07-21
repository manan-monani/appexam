import Link from 'next/link';
import Button from '@/components/Button';
import { useAuth } from '@/features/authentication/hooks/useAuth';

// Admin dashboard page with options to manage users, exams, and reports
// Reference: HackerRank Clone document, Section 5.1 (Role-based UI)

export default function AdminDashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!user || user.role !== 'admin') {
    return null; // Layout handles redirection
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Welcome, {user.name}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/dashboard/admin/users">
          <Button variant="primary">Manage Users</Button>
        </Link>
        <Link href="/dashboard/admin/exams">
          <Button variant="primary">Manage Exams</Button>
        </Link>
        <Link href="/dashboard/admin/reports">
          <Button variant="primary">View Reports</Button>
        </Link>
      </div>
    </div>
  );
}