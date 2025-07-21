'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { createClient } from '@/lib/supabaseClient';

// Displays a user's submission history
// Reference: HackerRank Clone document, Section 5.3 (Submission Feedback)

export default function SubmissionHistory() {
  const { user, loading: authLoading } = useAuth();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchSubmissions = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('submissions')
        .select('id, problem:problems(title), status, result, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching submissions:', error);
      } else {
        setSubmissions(data || []);
      }
      setLoading(false);
    };

    fetchSubmissions();
  }, [user]);

  if (authLoading || loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="p-4">
      <h3 className="text-lg font-medium mb-2">Submission History</h3>
      {submissions.length === 0 ? (
        <p>No submissions found.</p>
      ) : (
        <ul className="space-y-2">
          {submissions.map(sub => (
            <li key={sub.id} className="p-2 bg-gray-200 dark:bg-gray-700 rounded-md">
              <p><strong>Problem:</strong> {sub.problem.title}</p>
              <p><strong>Status:</strong> {sub.status}</p>
              <p><strong>Score:</strong> {sub.result?.score || 0}</p>
              <p><strong>Submitted:</strong> {new Date(sub.created_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}