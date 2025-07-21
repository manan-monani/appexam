'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { createClient } from '@/lib/supabaseClient';
import Button from '@/components/Button';
import Link from 'next/link';

// Teacher page for viewing reports of their exams
// Reference: HackerRank Clone document, Section 5.1 (Role-based UI)

export default function TeacherReportsPage() {
  const { user, loading: authLoading } = useAuth();
  const [reports, setReports] = useState<any[]>([]);
  const [fetchingReports, setFetchingReports] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'teacher')) {
      return;
    }

    const fetchReports = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('reports')
        .select('id, exam:exams(title), type, created_at')
        .eq('exam.created_by', user!.id);

      if (error) {
        setError('Failed to fetch reports');
      } else {
        setReports(data || []);
      }
      setFetchingReports(false);
    };

    fetchReports();
  }, [authLoading, user]);

  if (authLoading || fetchingReports) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-4">My Reports</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {reports.length === 0 ? (
        <p>No reports found.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700">
              <th className="p-2 text-left">Exam</th>
              <th className="p-2 text-left">Type</th>
              <th className="p-2 text-left">Created At</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id} className="border-b dark:border-gray-600">
                <td className="p-2">{report.exam.title}</td>
                <td className="p-2">{report.type}</td>
                <td className="p-2">{new Date(report.created_at).toLocaleString()}</td>
                <td className="p-2">
                  <Link href={`/reports/${report.id}`}>
                    <Button variant="secondary">View</Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}