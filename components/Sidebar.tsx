'use client';

import Link from 'next/link';
import { useAuth } from '@/features/authentication/hooks/useAuth';

// Role-based sidebar navigation for dashboards
// Reference: HackerRank Clone document, Section 5.1 (Frontend Navigation)

export default function Sidebar() {
  const { user, loading } = useAuth();

  if (loading || !user) {
    return null;
  }

  const links = user.role === 'admin' ? [
    { href: '/dashboard/admin/users', label: 'Manage Users' },
    { href: '/dashboard/admin/exams', label: 'Manage Exams' },
    { href: '/dashboard/admin/reports', label: 'View Reports' },
  ] : user.role === 'teacher' ? [
    { href: '/dashboard/teacher', label: 'Dashboard' },
    { href: '/exams/create', label: 'Create Exam' },
    { href: '/dashboard/teacher/reports', label: 'View Reports' },
  ] : [
    { href: '/dashboard/student', label: 'Dashboard' },
    { href: '/dashboard/student/submissions', label: 'Submissions' },
  ];

  return (
    <aside className="w-64 bg-gray-200 dark:bg-gray-800 p-4">
      <h2 className="text-lg font-semibold mb-4">{user.role} Dashboard</h2>
      <ul className="space-y-2">
        {links.map(link => (
          <li key={link.href}>
            <Link href={link.href} className="block p-2 hover:bg-gray-300 dark:hover:bg-gray-700 rounded">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}