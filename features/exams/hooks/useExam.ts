import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabaseClient';
import { Exam } from './types';

// Hook for fetching exam data and associated problems
// Reference: HackerRank Clone document, Section 5.3 (Exam UI)

export function useExam(examId: string) {
  const [exam, setExam] = useState<Exam | null>(null);
  const [problems, setProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExam = async () => {
      const supabase = createClient();
      const response = await fetch(`/api/exams/${examId}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to fetch exam');
        setLoading(false);
        return;
      }

      setExam({
        id: data.id,
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        published: data.published,
        createdBy: data.createdBy,
      });
      setProblems(data.problems || []);
      setLoading(false);
    };

    fetchExam();
  }, [examId]);

  return { exam, problems, loading, error };
}