'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { createClient } from '@/lib/supabaseClient';
import Button from '@/components/Button';

// Page for viewing individual reports (performance or plagiarism)
// Reference: HackerRank Clone document, Section 5.3 (Reporting)

export default function ReportPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { id } = useParams();
  const [report, setReport] = useState<any>(null);
  const [fetchingReport, setFetchingReport] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || !['admin', 'teacher'].includes(user.role))) {
      router.push('/login');
      return;
    }

    const fetchReport = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('reports')
        .select('id, type, data, exam:exams(title, created_by)')
        .eq('id', id)
        .single();

      if (error || !data) {
        setError('Report not found');
      } else if (user.role === 'teacher' && data.exam.created_by !== user.id) {
        setError('Unauthorized to view this report');
      } else {
        setReport(data);
      }
      setFetchingReport(false);
    };

    fetchReport();
  }, [authLoading, user, id, router]);

  if (authLoading || fetchingReport) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error || !report) {
    return <div className="flex justify-center items-center min-h-screen">{error || 'Report not found'}</div>;
  }

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-4">{report.type === 'performance' ? 'Performance Report' : 'Plagiarism Report'}</h1>
      <p className="mb-4"><strong>Exam:</strong> {report.exam.title}</p>
      {report.type === 'performance' ? (
        <div>
          <h2 className="text-lg font-medium mb-2">User Performance</h2>
          {report.data.users.length === 0 ? (
            <p>No user data available.</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700">
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Total Score</th>
                  <th className="p-2 text-left">Submissions</th>
                </tr>
              </thead>
              <tbody>
                {report.data.users.map((u: any) => (
                  <tr key={u.userId} className="border-b dark:border-gray-600">
                    <td className="p-2">{u.name}</td>
                    <td className="p-2">{u.totalScore}</td>
                    <td className="p-2">{u.submissions.length} submission(s)</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div>
          <h2 className="text-lg font-medium mb-2">Plagiarism Report</h2>
          <p><strong>MOSS Report URL:</strong> <a href={report.data.moss_url} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">{report.data.moss_url}</a></p>
        </div>
      )}
      <Button variant="secondary" onClick={() => router.push(`/dashboard/${user!.role.toLowerCase()}/reports`)} className="mt-4">
        Back to Reports
      </Button>
    </div>
  );
}