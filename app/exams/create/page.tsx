'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import { createClient } from '@/lib/supabaseClient';

// Exam creation page for teachers
// Reference: HackerRank Clone document, Section 5.1 (Role-based UI)

export default function CreateExamPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    start_time: '',
    end_time: '',
    published: false,
    problemIds: [] as string[],
  });
  const [problems, setProblems] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fetchingProblems, setFetchingProblems] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'teacher')) {
      router.push('/login');
    }

    const fetchProblems = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('problems')
        .select('id, title')
        .eq('published', true);

      if (error) {
        setError('Failed to fetch problems');
      } else {
        setProblems(data || []);
      }
      setFetchingProblems(false);
    };

    fetchProblems();
  }, [authLoading, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const supabase = createClient();
    const response = await fetch('/api/exams/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.error || 'Failed to create exam');
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push('/dashboard/teacher'), 2000);
  };

  const handleProblemToggle = (problemId: string) => {
    setFormData((prev) => ({
      ...prev,
      problemIds: prev.problemIds.includes(problemId)
        ? prev.problemIds.filter((id) => id !== problemId)
        : [...prev.problemIds, problemId],
    }));
  };

  if (authLoading || fetchingProblems) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-4">Create New Exam</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Start Time</label>
          <input
            type="datetime-local"
            value={formData.start_time}
            onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">End Time</label>
          <input
            type="datetime-local"
            value={formData.end_time}
            onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Published</label>
          <input
            type="checkbox"
            checked={formData.published}
            onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
            className="h-4 w-4"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Problems</label>
          {problems.length === 0 ? (
            <p>No problems available.</p>
          ) : (
            <ul className="space-y-2">
              {problems.map((problem) => (
                <li key={problem.id}>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.problemIds.includes(problem.id)}
                      onChange={() => handleProblemToggle(problem.id)}
                      className="h-4 w-4 mr-2"
                    />
                    {problem.title}
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>
        <Button type="submit" variant="primary">
          Create Exam
        </Button>
      </form>
      <Modal isOpen={success} onClose={() => setSuccess(false)}>
        <p>Exam created successfully!</p>
      </Modal>
    </div>
  );
}