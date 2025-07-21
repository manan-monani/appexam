import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabaseClient';
import { Submission } from '../types';

// Hook for fetching submission data and status
// Reference: HackerRank Clone document, Section 5.3 (Submission Feedback)

export function useSubmission(submissionId: string) {
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubmission = async () => {
      const supabase = createClient();
      const response = await fetch(`/api/submissions/${submissionId}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to fetch submission');
        setLoading(false);
        return;
      }

      setSubmission(data);
      setLoading(false);
    };

    fetchSubmission();
  }, [submissionId]);

  return { submission, loading, error };
}