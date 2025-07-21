'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { createClient } from '@/lib/supabaseClient';
import Button from '@/components/Button';
import Spinner from '@/components/Spinner';

// Submission confirmation page showing submission status
// Reference: HackerRank Clone document, Section 5.3 (Submission Feedback)

export default function SubmissionPage({ params }: { params: { examId: string } }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const submissionId = searchParams.get('submissionId');
  const [submission, setSubmission] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }

    if (!submissionId) {
      router.push(`/exams/${params.examId}`);
      return;
    }

    const fetchSubmission = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('submissions')
        .select('id, status, result')
        .eq('id', submissionId)
        .single();

      if (error) {
        console.error('Error fetching submission:', error);
        setLoading(false);
        return;
      }

      setSubmission(data);
      setLoading(false);
    };

    fetchSubmission();
  }, [authLoading, user, submissionId, params.examId, router]);

  if (authLoading || loading) {
    return <div className="flex justify-center items-center min-h-screen"><Spinner /></div>;
  }

  if (!submission) {
    return <div className="flex justify-center items-center min-h-screen">Submission not found</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-2xl font-semibold mb-4">Submission Status</h2>
      <p className="text-lg mb-4">Status: {submission.status}</p>
      {submission.result && (
        <div className="mb-4">
          <h3 className="text-lg font-medium">Results</h3>
          <p>Score: {submission.result.score || 0}</p>
          <p>Passed: {submission.result.passedTests}/{submission.result.totalTests}</p>
        </div>
      )}
      <Button variant="primary" onClick={() => router.push(`/exams/${params.examId}`)}>
        Back to Exam
      </Button>
    </div>
  );
}