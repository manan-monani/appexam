import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabaseClient';
import { Problem } from './types';

// Hook for fetching problem data and handling submissions
// Reference: HackerRank Clone document, Section 5.3 (Problem UI)

export function useProblem(slug: string) {
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProblem = async () => {
      const supabase = createClient();
      const response = await fetch(`/api/problems/${slug}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to fetch problem');
        setLoading(false);
        return;
      }

      setProblem(data);
      setLoading(false);
    };

    fetchProblem();
  }, [slug]);

  return { problem, loading, error };
}