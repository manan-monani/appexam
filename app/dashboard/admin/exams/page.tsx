'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { createClient } from '@/lib/supabaseClient';
import Button from '@/components/Button';
import Link from 'next/link';

// Admin page for managing exams
// Reference: HackerRank Clone document, Section 5.1 (Role-based UI)

export default function ManageExamsPage() {
  const { user, loading: authLoading } = useAuth();
  const [exams, setExams] = useState<any[]>([]);
  const [fetchingExams, setFetchingExams] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      return;
    }

    const fetchExams = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('exams')
        .select('id, title, start_time, end_time, published');

      if (error) {
        setError('Failed to fetch exams');
      } else {
        setExams(data || []);
      }
      setFetchingExams(false);
    };

    fetchExams();
  }, [authLoading, user]);

  const handleTogglePublish = async (examId: string, published: boolean) => {
    const supabase = createClient();
    const { error } = await supabase
      .from('exams')
      .update({ published: !published })
      .eq('id', examId);

    if (error) {
      setError('Failed to update exam');
    } else {
      setExams((prev) =>
        prev.map((exam) =>
          exam.id === examId ? { ...exam, published: !published } : exam
        )
      );
    }
  };

  if (authLoading || fetchingExams) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-4">Manage Exams</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {exams.length === 0 ? (
        <p>No exams found.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700">
              <th className="p-2 text-left">Title</th>
              <th className="p-2 text-left">Start Time</th>
              <th className="p-2 text-left">End Time</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {exams.map((exam) => (
              <tr key={exam.id} className="border-b dark:border-gray-600">
                <td className="p-2">
                  <Link href={`/exams/${exam.id}`} className="text-blue-600 hover:underline">
                    {exam.title}
                  </Link>
                </td>
                <td className="p-2">{new Date(exam.start_time).toLocaleString()}</td>
                <td className="p-2">{new Date(exam.end_time).toLocaleString()}</td>
                <td className="p-2">{exam.published ? 'Published' : 'Draft'}</td>
                <td className="p-2">
                  <Button
                    variant="secondary"
                    onClick={() => handleTogglePublish(exam.id, exam.published)}
                  >
                    {exam.published ? 'Unpublish' : 'Publish'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}